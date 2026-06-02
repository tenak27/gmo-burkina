/**
 * VerifyDocument — Page publique de vérification d'authenticité des documents
 * URL: /verify?ref=GMO-VERIFY:id:number:total:timestamp
 */
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Shield, CheckCircle2, XCircle, Loader2, Search, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function VerifyDocument() {
  const params = new URLSearchParams(window.location.search);
  const refParam = params.get('ref') || '';

  const [query, setQuery] = useState(refParam || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (refParam) handleVerify(refParam);
  }, []);

  const parseRef = (ref) => {
    // Format: GMO-VERIFY:invoiceId:number:total:timestamp
    if (ref.startsWith('GMO-VERIFY:')) {
      const parts = ref.split(':');
      return { id: parts[1], number: parts[2], total: parts[3] };
    }
    return null;
  };

  const handleVerify = async (ref) => {
    const trimmed = (ref || query).trim();
    if (!trimmed) { setError('Saisissez une référence ou scannez le QR code.'); return; }
    setLoading(true);
    setError('');
    setResult(null);

    const parsed = parseRef(trimmed);
    let found = null;

    if (parsed?.id) {
      const arr = await base44.entities.Invoice.filter({ id: parsed.id });
      found = arr?.[0];
      if (!found) {
        // Try delivery note
        const arr2 = await base44.entities.DeliveryNote.filter({ id: parsed.id });
        found = arr2?.[0];
        if (found) found._docType = 'bon';
      } else {
        found._docType = 'invoice';
      }
    } else {
      // Search by number in invoices
      const invArr = await base44.entities.Invoice.list('-created_date', 200);
      found = invArr?.find(i => i.number === trimmed || i.id === trimmed);
      if (found) {
        found._docType = 'invoice';
      } else {
        const bonArr = await base44.entities.DeliveryNote.list('-created_date', 200);
        found = bonArr?.find(b => b.number === trimmed || b.id === trimmed);
        if (found) found._docType = 'bon';
      }
    }

    setLoading(false);
    if (found) {
      setResult(found);
    } else {
      setError('Aucun document trouvé avec cette référence.');
    }
  };

  const typeLabel = (doc) => {
    if (doc._docType === 'invoice') {
      return { facture: 'Facture', proforma: 'Proforma', devis: 'Devis' }[doc.type] || 'Document';
    }
    return { bon_livraison: 'Bon de livraison', bon_enlevement: "Bon d'enlèvement", bon_commande: 'Bon de commande' }[doc.type] || 'Bon';
  };

  const isAuthentic = !!result;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-200">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Vérification de document</h1>
        <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
          Vérifiez l'authenticité d'un document officiel GMO Burkina en scannant le QR code ou en saisissant la référence.
        </p>
      </div>

      {/* Search */}
      <div className="w-full max-w-lg bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 block">
          Référence du document
        </label>
        <div className="flex gap-3">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleVerify(query)}
            placeholder="N° facture, devis ou bon (ex: FAC-12345678)"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors"
          />
          <button onClick={() => handleVerify(query)} disabled={loading}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold text-sm px-5 py-3 rounded-xl transition-colors cursor-pointer disabled:opacity-60">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Vérifier
          </button>
        </div>
        {error && (
          <div className="mt-3 flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <XCircle className="w-4 h-4 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Result */}
      {result && (
        <div className="w-full max-w-lg">
          {/* Authenticity banner */}
          <div className={`rounded-2xl border-2 p-5 mb-4 ${isAuthentic ? "bg-green-50 border-green-400" : "bg-red-50 border-red-400"}`}>
            <div className="flex items-center gap-3">
              {isAuthentic
                ? <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0" />
                : <XCircle className="w-8 h-8 text-red-500 flex-shrink-0" />
              }
              <div>
                <p className="font-bold text-base text-gray-900">
                  {isAuthentic ? '✅ Document authentique' : '❌ Document non reconnu'}
                </p>
                <p className="text-sm text-gray-600">
                  {isAuthentic
                    ? 'Ce document est enregistré et certifié dans le système GMO Burkina.'
                    : 'Ce document n\'existe pas dans notre base de données.'}
                </p>
              </div>
            </div>
          </div>

          {/* Document details */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-green-600 px-6 py-4">
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="text-xs text-green-200 uppercase tracking-widest">{typeLabel(result)}</p>
                  <p className="text-xl font-bold">{result.number || result.id?.slice(-10)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-green-200">Statut</p>
                  <p className="text-sm font-semibold capitalize">{result.status || '—'}</p>
                </div>
              </div>
            </div>
            <div className="bg-red-600 h-1" />
            <div className="p-6 space-y-3">
              {[
                ['Client / Destinataire', result.client_name || result.supplier_name || '—'],
                ['Date', result.date ? new Date(result.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'],
                result.total && ['Montant total TTC', `${Number(result.total).toLocaleString('fr-FR')} FCFA`],
                result.total_amount && ['Montant total', `${Number(result.total_amount).toLocaleString('fr-FR')} FCFA`],
                ['Enregistré le', new Date(result.created_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })],
              ].filter(Boolean).map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-4 py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm text-gray-500 flex-shrink-0">{label}</span>
                  <span className="text-sm font-semibold text-gray-800 text-right">{value}</span>
                </div>
              ))}

              <div className="pt-2 flex items-center gap-2 text-xs text-gray-400">
                <Shield className="w-3.5 h-3.5 text-green-500" />
                <span>Vérifié via le système GMO ERP · IAM Technology</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 flex items-center gap-4 text-sm">
        <Link to="/" className="flex items-center gap-1.5 text-gray-400 hover:text-green-600 transition-colors">
          <Home className="w-4 h-4" /> Retour au site
        </Link>
        <span className="text-gray-200">·</span>
        <span className="text-gray-400">© GMO Burkina</span>
      </div>
    </div>
  );
}