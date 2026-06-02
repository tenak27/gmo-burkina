import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Plus, X, CheckCircle2, Clock, AlertCircle, Loader2, Package, Send } from "lucide-react";

const PRODUITS_CIGARETTES = ["Hamilton", "Excellence", "Dunhill", "Peter Stuyvesant", "Marlboro", "Autre"];

const STATUS_CONFIG = {
  en_attente_validation: { label: "En attente validation", color: "text-amber-600 bg-amber-50 border-amber-200", icon: Clock },
  valide: { label: "Validé", color: "text-green-700 bg-green-50 border-green-200", icon: CheckCircle2 },
  epuise: { label: "Épuisé", color: "text-gray-500 bg-gray-50 border-gray-200", icon: Package },
};

function AssignStockModal({ vendeurs, onClose, onSaved }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    vendeur_id: "", produit_nom: "Hamilton",
    cartouches_assignees: 0, paquets_assignes: 0,
    notes: ""
  });
  const [loading, setLoading] = useState(false);

  const vendeur = vendeurs.find(v => v.id === form.vendeur_id);

  const handleSave = async () => {
    if (!form.vendeur_id || !form.produit_nom) return;
    setLoading(true);
    const now = new Date().toISOString();
    const data = await base44.entities.StockVendeur.create({
      ...form,
      cartouches_assignees: Number(form.cartouches_assignees),
      paquets_assignes: Number(form.paquets_assignes),
      cartouches_disponibles: Number(form.cartouches_assignees),
      paquets_disponibles: Number(form.paquets_assignes),
      vendeur_nom: vendeur ? `${vendeur.prenom} ${vendeur.nom}` : "",
      status: "en_attente_validation",
      assignee_par: user?.id || "",
      assignee_par_nom: user?.full_name || "",
      date_assignation: now,
      rappel_envoye: false,
    });
    onSaved(data);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-gmo-red" />
            <h3 className="font-heading text-base font-bold text-obsidian">Assigner du stock</h3>
          </div>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Vendeur *</label>
            <select value={form.vendeur_id} onChange={e => setForm(p => ({ ...p, vendeur_id: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none focus:border-gmo-red">
              <option value="">-- Sélectionner --</option>
              {vendeurs.filter(v => v.is_active).map(v => (
                <option key={v.id} value={v.id}>{v.prenom} {v.nom} — {v.zone || "Sans zone"}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Produit *</label>
            <select value={form.produit_nom} onChange={e => setForm(p => ({ ...p, produit_nom: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none focus:border-gmo-red">
              {PRODUITS_CIGARETTES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Cartouches (×10 paquets)</label>
              <input type="number" min="0" value={form.cartouches_assignees}
                onChange={e => setForm(p => ({ ...p, cartouches_assignees: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none focus:border-gmo-red" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Paquets sup.</label>
              <input type="number" min="0" value={form.paquets_assignes}
                onChange={e => setForm(p => ({ ...p, paquets_assignes: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none focus:border-gmo-red" />
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700 font-body">
            📦 Total paquets : <strong>{(Number(form.cartouches_assignees) * 10) + Number(form.paquets_assignes)}</strong> paquets
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
              rows={2} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none focus:border-gmo-red resize-none" />
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-5">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-sm font-heading py-2.5 rounded-xl">Annuler</button>
          <button onClick={handleSave} disabled={loading || !form.vendeur_id}
            className="flex-1 bg-gmo-red text-white text-sm font-heading font-bold py-2.5 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {loading ? "Envoi…" : "Assigner"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StockVendeursTab({ stocks, setStocks, vendeurs }) {
  const { user } = useAuth();
  const [showAssign, setShowAssign] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  const handleSaved = (s) => setStocks(prev => [s, ...prev]);

  const handleValiderMagasinier = async (stock) => {
    const updated = await base44.entities.StockVendeur.update(stock.id, {
      valide_par_magasinier: user?.full_name || user?.id,
      date_validation_magasinier: new Date().toISOString(),
    });
    setStocks(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  const filtered = stocks.filter(s => filterStatus === "all" || s.status === filterStatus);

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="font-heading text-lg font-bold text-obsidian">Stocks assignés ({stocks.length})</h2>
        <div className="flex items-center gap-2">
          {/* Filter */}
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-xs font-body focus:outline-none focus:border-gmo-red">
            <option value="all">Tous les statuts</option>
            <option value="en_attente_validation">En attente</option>
            <option value="valide">Validés</option>
            <option value="epuise">Épuisés</option>
          </select>
          {(user?.role === "commercial" || user?.role === "pdg" || user?.role === "admin") && (
            <button onClick={() => setShowAssign(true)}
              className="flex items-center gap-2 bg-gmo-red text-white text-xs font-heading font-bold px-4 py-2.5 rounded-xl">
              <Plus className="w-4 h-4" /> Assigner stock
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(s => {
          const cfg = STATUS_CONFIG[s.status] || STATUS_CONFIG.en_attente_validation;
          const Icon = cfg.icon;
          const totalPaquets = (s.cartouches_disponibles || 0) * 10 + (s.paquets_disponibles || 0);
          const totalAssignes = (s.cartouches_assignees || 0) * 10 + (s.paquets_assignes || 0);
          const pct = totalAssignes > 0 ? Math.round((totalPaquets / totalAssignes) * 100) : 0;
          return (
            <div key={s.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                <div>
                  <p className="font-heading text-sm font-bold text-obsidian">{s.vendeur_nom || "Vendeur inconnu"}</p>
                  <p className="text-xs text-obsidian/50 font-body">{s.produit_nom} · Assigné par {s.assignee_par_nom || "—"}</p>
                  <p className="text-[11px] text-obsidian/35 font-body mt-0.5">
                    {s.date_assignation ? new Date(s.date_assignation).toLocaleString("fr-FR") : "—"}
                  </p>
                </div>
                <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${cfg.color}`}>
                  <Icon className="w-3 h-3" />{cfg.label}
                </span>
              </div>

              {/* Stock details */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                  <p className="font-heading text-lg font-black text-gmo-red">{s.cartouches_disponibles ?? 0}</p>
                  <p className="text-[9px] text-obsidian/40 font-body">Cartouches restantes</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                  <p className="font-heading text-lg font-black text-amber-500">{s.paquets_disponibles ?? 0}</p>
                  <p className="text-[9px] text-obsidian/40 font-body">Paquets sup.</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                  <p className="font-heading text-lg font-black text-blue-600">{totalPaquets}</p>
                  <p className="text-[9px] text-obsidian/40 font-body">Total paquets</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1 text-[10px] text-obsidian/40 font-body">
                  <span>Stock restant</span><span>{pct}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${pct > 50 ? "bg-gmo-green" : pct > 20 ? "bg-amber-400" : "bg-gmo-red"}`}
                    style={{ width: `${pct}%` }} />
                </div>
              </div>

              {/* Validation magasinier */}
              {s.status === "en_attente_validation" && (user?.role === "magasinier" || user?.role === "pdg" || user?.role === "admin") && !s.valide_par_magasinier && (
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-[11px] text-amber-600 font-body mb-2 flex items-center gap-1.5">
                    <AlertCircle className="w-3 h-3" /> En attente de validation magasinier
                  </p>
                  <button onClick={() => handleValiderMagasinier(s)}
                    className="flex items-center gap-2 bg-gmo-green text-white text-xs font-heading font-bold px-4 py-2 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Valider (Magasinier)
                  </button>
                </div>
              )}
              {s.valide_par_magasinier && !s.valide_par_vendeur && s.status === "en_attente_validation" && (
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-[11px] text-blue-600 font-body flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-gmo-green" /> Validé magasinier · En attente confirmation vendeur
                  </p>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
            <Package className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="font-heading text-sm text-obsidian/40">Aucun stock trouvé</p>
          </div>
        )}
      </div>

      {showAssign && <AssignStockModal vendeurs={vendeurs} onClose={() => setShowAssign(false)} onSaved={handleSaved} />}
    </div>
  );
}