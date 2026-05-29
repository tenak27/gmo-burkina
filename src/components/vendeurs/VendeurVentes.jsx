import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { ShoppingBag, Plus, X, Loader2, CheckCircle2, TrendingUp, Package } from "lucide-react";

function VenteForm({ vendeur, stocks, points, onClose, onSaved }) {
  const [form, setForm] = useState({
    point_de_vente_id: "",
    stock_vendeur_id: "",
    cartouches_vendues: 0,
    paquets_vendus: 0,
    prix_cartouche: 0,
    prix_paquet: 0,
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const stockSelectionne = stocks.find(s => s.id === form.stock_vendeur_id);
  const pointSelectionne = points.find(p => p.id === form.point_de_vente_id);

  const totalCartouches = Number(form.cartouches_vendues);
  const totalPaquets = Number(form.paquets_vendus);
  const montantTotal = (totalCartouches * Number(form.prix_cartouche)) + (totalPaquets * Number(form.prix_paquet));

  // Vérification stock disponible
  const cartouchesDispos = stockSelectionne?.cartouches_disponibles || 0;
  const paquetsDispos = stockSelectionne?.paquets_disponibles || 0;
  const stockInsuffisant = totalCartouches > cartouchesDispos || totalPaquets > paquetsDispos;

  const handleSave = async () => {
    if (!form.point_de_vente_id || !form.stock_vendeur_id) {
      return setError("Sélectionnez un point de vente et un stock.");
    }
    if (stockInsuffisant) return setError("Stock insuffisant !");
    if (totalCartouches === 0 && totalPaquets === 0) return setError("Saisissez une quantité.");
    setLoading(true);
    setError("");
    const today = new Date().toISOString().slice(0, 10);

    // Créer la vente
    const vente = await base44.entities.VenteVendeur.create({
      vendeur_id: vendeur.id,
      vendeur_nom: `${vendeur.prenom} ${vendeur.nom}`,
      point_de_vente_id: form.point_de_vente_id,
      point_de_vente_nom: pointSelectionne?.nom_client || "",
      stock_vendeur_id: form.stock_vendeur_id,
      produit_nom: stockSelectionne?.produit_nom || "",
      cartouches_vendues: totalCartouches,
      paquets_vendus: totalPaquets,
      prix_cartouche: Number(form.prix_cartouche),
      prix_paquet: Number(form.prix_paquet),
      montant_total: montantTotal,
      date_vente: today,
      notes: form.notes,
    });

    // Déduire du stock
    const newCartouches = cartouchesDispos - totalCartouches;
    const newPaquets = paquetsDispos - totalPaquets;
    await base44.entities.StockVendeur.update(form.stock_vendeur_id, {
      cartouches_disponibles: newCartouches,
      paquets_disponibles: newPaquets,
      status: (newCartouches <= 0 && newPaquets <= 0) ? "epuise" : "valide",
    });

    onSaved(vente);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-heading text-base font-bold text-obsidian">Enregistrer une vente</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="px-5 py-4 space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Point de vente *</label>
            <select value={form.point_de_vente_id} onChange={e => setForm(p => ({ ...p, point_de_vente_id: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none focus:border-gmo-red">
              <option value="">-- Sélectionner --</option>
              {points.map(p => <option key={p.id} value={p.id}>{p.nom_client}{p.quartier ? ` — ${p.quartier}` : ""}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Produit / Stock *</label>
            <select value={form.stock_vendeur_id} onChange={e => setForm(p => ({ ...p, stock_vendeur_id: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none focus:border-gmo-red">
              <option value="">-- Sélectionner --</option>
              {stocks.filter(s => s.status === "valide").map(s => (
                <option key={s.id} value={s.id}>{s.produit_nom} — {s.cartouches_disponibles} carton(s), {s.paquets_disponibles} paquet(s)</option>
              ))}
            </select>
          </div>

          {stockSelectionne && (
            <div className="bg-gray-50 rounded-xl p-3 text-xs text-obsidian/60 font-body">
              Dispo : <strong className="text-gmo-red">{cartouchesDispos} cartouches</strong> · <strong className="text-amber-500">{paquetsDispos} paquets</strong>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Cartouches vendues</label>
              <input type="number" min="0" max={cartouchesDispos} value={form.cartouches_vendues}
                onChange={e => setForm(p => ({ ...p, cartouches_vendues: e.target.value }))}
                className={`w-full border rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none ${Number(form.cartouches_vendues) > cartouchesDispos ? "border-red-400" : "border-gray-200 focus:border-gmo-red"}`} />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Prix cartouche (FCFA)</label>
              <input type="number" min="0" value={form.prix_cartouche}
                onChange={e => setForm(p => ({ ...p, prix_cartouche: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none focus:border-gmo-red" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Paquets vendus</label>
              <input type="number" min="0" max={paquetsDispos} value={form.paquets_vendus}
                onChange={e => setForm(p => ({ ...p, paquets_vendus: e.target.value }))}
                className={`w-full border rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none ${Number(form.paquets_vendus) > paquetsDispos ? "border-red-400" : "border-gray-200 focus:border-gmo-red"}`} />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Prix paquet (FCFA)</label>
              <input type="number" min="0" value={form.prix_paquet}
                onChange={e => setForm(p => ({ ...p, prix_paquet: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none focus:border-gmo-red" />
            </div>
          </div>

          {/* Récap montant */}
          <div className="bg-gmo-red/5 border border-gmo-red/20 rounded-xl p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-body text-obsidian/60">Montant total estimé</span>
              <span className="font-heading text-lg font-black text-gmo-red">{montantTotal.toLocaleString()} FCFA</span>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
              rows={2} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none focus:border-gmo-red resize-none" />
          </div>

          {error && <p className="text-xs text-red-500 font-body">{error}</p>}
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-sm font-heading py-2.5 rounded-xl">Annuler</button>
          <button onClick={handleSave} disabled={loading}
            className="flex-1 bg-gmo-red text-white text-sm font-heading font-bold py-2.5 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            {loading ? "Enregistrement…" : "Confirmer la vente"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VendeurVentes({ vendeur, stocks, setStocks, ventes, setVentes }) {
  const [points, setPoints] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (vendeur?.id) {
      base44.entities.PointDeVente.filter({ vendeur_id: vendeur.id }, "-created_date", 100).then(d => setPoints(d || []));
    }
  }, [vendeur]);

  const handleVenteSaved = (vente) => {
    setVentes(prev => [vente, ...prev]);
    // Mettre à jour le stock local
    setStocks(prev => prev.map(s => {
      if (s.id === vente.stock_vendeur_id) {
        const newCart = (s.cartouches_disponibles || 0) - vente.cartouches_vendues;
        const newPaq = (s.paquets_disponibles || 0) - vente.paquets_vendus;
        return { ...s, cartouches_disponibles: newCart, paquets_disponibles: newPaq, status: newCart <= 0 && newPaq <= 0 ? "epuise" : "valide" };
      }
      return s;
    }));
  };

  const ventesDuJour = ventes.filter(v => v.date_vente === new Date().toISOString().slice(0, 10));
  const caTotal = ventes.reduce((s, v) => s + (v.montant_total || 0), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-lg font-bold text-obsidian">Mes ventes</h2>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-gmo-red text-white text-xs font-heading font-bold px-4 py-2.5 rounded-xl">
          <Plus className="w-4 h-4" /> Enregistrer
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 text-center">
          <ShoppingBag className="w-4 h-4 text-gmo-red mx-auto mb-1" />
          <p className="font-heading text-xl font-black text-gmo-red">{ventesDuJour.length}</p>
          <p className="text-[9px] text-obsidian/40 font-body">Auj.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 text-center">
          <Package className="w-4 h-4 text-amber-500 mx-auto mb-1" />
          <p className="font-heading text-xl font-black text-obsidian">{ventes.length}</p>
          <p className="text-[9px] text-obsidian/40 font-body">Total</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 text-center">
          <TrendingUp className="w-4 h-4 text-gmo-green mx-auto mb-1" />
          <p className="font-heading text-base font-black text-gmo-green">{caTotal > 0 ? `${(caTotal/1000).toFixed(0)}k` : "0"}</p>
          <p className="text-[9px] text-obsidian/40 font-body">FCFA</p>
        </div>
      </div>

      {/* Liste des ventes */}
      <div className="space-y-3">
        {ventes.slice(0, 30).map(v => (
          <div key={v.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div>
                <p className="font-heading text-sm font-bold text-obsidian">{v.point_de_vente_nom || "—"}</p>
                <p className="text-[11px] text-obsidian/40 font-body">{v.produit_nom} · {new Date(v.date_vente).toLocaleDateString("fr-FR")}</p>
              </div>
              <p className="font-heading text-base font-black text-gmo-red whitespace-nowrap">{(v.montant_total || 0).toLocaleString()} FCFA</p>
            </div>
            <div className="flex gap-3 text-[11px] text-obsidian/50 font-body">
              {v.cartouches_vendues > 0 && <span>📦 {v.cartouches_vendues} cartouche(s)</span>}
              {v.paquets_vendus > 0 && <span>🚬 {v.paquets_vendus} paquet(s)</span>}
            </div>
          </div>
        ))}
        {ventes.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 py-14 text-center">
            <ShoppingBag className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="font-heading text-sm text-obsidian/40">Aucune vente enregistrée</p>
          </div>
        )}
      </div>

      {showForm && (
        <VenteForm vendeur={vendeur} stocks={stocks} points={points} onClose={() => setShowForm(false)} onSaved={handleVenteSaved} />
      )}
    </div>
  );
}