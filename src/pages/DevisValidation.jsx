/**
 * DevisValidation — Page accessible via le lien email du détaillant
 * URL: /devis-validation?devis_id=xxx&order_id=yyy
 */
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { CheckCircle2, FileText, Clock, Loader2, AlertCircle, ArrowRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DevisValidation() {
  const params = new URLSearchParams(window.location.search);
  const devisId = params.get('devis_id');
  const orderId = params.get('order_id');

  const [devis, setDevis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState('view'); // 'view' | 'confirm' | 'done' | 'error'
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!devisId) { setStep('error'); setLoading(false); return; }
    base44.entities.Invoice.filter({ id: devisId }).then(arr => {
      const d = arr?.[0];
      if (!d) { setStep('error'); }
      else setDevis(d);
      setLoading(false);
    });
  }, [devisId]);

  const handleValidate = async () => {
    setProcessing(true);
    const res = await base44.functions.invoke('validateDevisAndCreateDocs', {
      devis_id: devisId,
      order_id: orderId,
      payment_confirmed: false,
    });
    setProcessing(false);
    if (res.data?.success) setStep('awaiting_payment');
    else setStep('error');
  };

  const handleConfirmPayment = async () => {
    setProcessing(true);
    const res = await base44.functions.invoke('validateDevisAndCreateDocs', {
      devis_id: devisId,
      order_id: orderId,
      payment_confirmed: true,
    });
    setProcessing(false);
    if (res.data?.success) {
      setResult(res.data);
      setStep('done');
    } else {
      setStep('error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileText className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">GMO Burkina</h1>
        <p className="text-sm text-gray-500 mt-1">Validation de devis</p>
      </div>

      {step === 'error' && (
        <div className="w-full max-w-lg bg-white rounded-2xl border border-red-200 shadow-sm p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-gray-900 mb-2">Devis introuvable</h2>
          <p className="text-sm text-gray-500 mb-6">Le lien est invalide ou a expiré. Contactez GMO Burkina.</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-green-600 text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-green-700 transition-colors">
            <Home className="w-4 h-4" /> Retour au site
          </Link>
        </div>
      )}

      {step === 'view' && devis && (
        <div className="w-full max-w-lg bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Devis header */}
          <div className="bg-green-600 px-6 py-5 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-green-200 uppercase tracking-widest mb-1">Devis</p>
                <p className="text-xl font-bold">{devis.number}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-green-200">Client</p>
                <p className="font-semibold">{devis.client_name}</p>
              </div>
            </div>
          </div>
          <div className="bg-red-600 h-1" />

          <div className="p-6">
            {/* Items */}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Articles</p>
            <div className="space-y-2 mb-5">
              {(devis.items || []).map((it, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{it.name}</p>
                    <p className="text-xs text-gray-400">{it.qty} × {Number(it.unit_price).toLocaleString('fr-FR')} FCFA</p>
                  </div>
                  <p className="text-sm font-bold text-green-700">{Number((it.qty || 1) * (it.unit_price || 0)).toLocaleString('fr-FR')} FCFA</p>
                </div>
              ))}
            </div>

            {/* Totaux */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-1.5">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Sous-total HT</span>
                <span className="font-semibold text-gray-700">{Number(devis.subtotal || 0).toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>TVA ({devis.tax_rate || 18}%)</span>
                <span className="font-semibold text-gray-700">{Number(devis.tax_amount || 0).toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="flex justify-between text-base font-bold text-green-700 pt-1 border-t border-gray-200">
                <span>TOTAL TTC</span>
                <span className="text-xl">{Number(devis.total || 0).toLocaleString('fr-FR')} FCFA</span>
              </div>
            </div>

            {devis.notes && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 text-sm text-amber-800">{devis.notes}</div>
            )}

            <button onClick={handleValidate} disabled={processing}
              className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm py-4 rounded-xl transition-colors cursor-pointer disabled:opacity-60">
              {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              {processing ? 'Validation…' : 'Valider ce devis'}
            </button>
            <p className="text-xs text-gray-400 text-center mt-2">En validant, vous acceptez les conditions de vente GMO Burkina.</p>
          </div>
        </div>
      )}

      {step === 'awaiting_payment' && (
        <div className="w-full max-w-lg bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
          <Clock className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-gray-900 mb-2">Devis validé — En attente de paiement</h2>
          <p className="text-sm text-gray-500 mb-6">
            Votre devis a été validé. Procédez au paiement par <strong>Mobile Money, virement ou espèces</strong> au bureau GMO Burkina.
            Une fois le paiement effectué, cliquez ci-dessous.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm font-semibold text-green-800 mb-2">Modalités de paiement GMO</p>
            <ul className="text-xs text-green-700 space-y-1">
              <li>📱 Mobile Money : Orange Money / Moov Money — <strong>+226 76 21 16 33</strong></li>
              <li>🏦 Virement bancaire — contacter notre service commercial</li>
              <li>💵 Espèces — Quartier Dapoya, Ouagadougou</li>
            </ul>
          </div>
          <button onClick={handleConfirmPayment} disabled={processing}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold text-sm py-4 rounded-xl transition-colors cursor-pointer disabled:opacity-60">
            {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            {processing ? 'Traitement…' : 'Confirmer le paiement effectué'}
          </button>
          <p className="text-xs text-gray-400 text-center mt-2">Notre équipe vérifiera votre paiement et vous enverra vos documents.</p>
        </div>
      )}

      {step === 'done' && (
        <div className="w-full max-w-lg bg-white rounded-2xl border border-green-200 shadow-sm p-8 text-center">
          <CheckCircle2 className="w-14 h-14 text-green-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Commande confirmée !</h2>
          <p className="text-sm text-gray-500 mb-6">Vos documents ont été générés et envoyés à votre adresse email.</p>

          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-3">
            {result?.facture_number && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"><FileText className="w-4 h-4 text-green-600" /></div>
                <div>
                  <p className="text-xs text-gray-400">Facture</p>
                  <p className="text-sm font-bold text-gray-800">{result.facture_number}</p>
                </div>
              </div>
            )}
            {result?.bon_number && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"><FileText className="w-4 h-4 text-blue-600" /></div>
                <div>
                  <p className="text-xs text-gray-400">{result.bon_type === 'bon_enlevement' ? "Bon d'enlèvement" : 'Bon de livraison'}</p>
                  <p className="text-sm font-bold text-gray-800">{result.bon_number}</p>
                </div>
              </div>
            )}
          </div>

          <Link to="/detaillant"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors">
            Mon espace détaillant <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      <p className="mt-8 text-xs text-gray-400">© GMO Burkina · Groupe Madina Oumarou</p>
    </div>
  );
}