import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Edit2, X, CheckCircle2, MapPin, Phone, Package, TrendingUp, Loader2, Users } from "lucide-react";

function VendeurForm({ vendeur, onClose, onSaved }) {
  const [form, setForm] = useState(vendeur || { nom: "", prenom: "", phone: "", email: "", zone: "", is_active: true });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    if (vendeur?.id) {
      const updated = await base44.entities.Vendeur.update(vendeur.id, form);
      onSaved(updated, "update");
    } else {
      const created = await base44.entities.Vendeur.create(form);
      onSaved(created, "create");
    }
    setLoading(false);
    onClose();
  };

  const fields = [
    { key: "nom", label: "Nom *", type: "text" },
    { key: "prenom", label: "Prénom *", type: "text" },
    { key: "phone", label: "Téléphone *", type: "text" },
    { key: "email", label: "Email", type: "email" },
    { key: "zone", label: "Zone couverte", type: "text" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-heading text-base font-bold text-obsidian">{vendeur ? "Modifier vendeur" : "Nouveau vendeur"}</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="px-6 py-5 space-y-3">
          {fields.map(f => (
            <div key={f.key}>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{f.label}</label>
              <input
                type={f.type}
                value={form[f.key] || ""}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none focus:border-gmo-red"
              />
            </div>
          ))}
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_active} onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))} className="rounded" />
            <span className="text-sm font-body text-obsidian/70">Vendeur actif</span>
          </label>
        </div>
        <div className="flex gap-3 px-6 pb-5">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-sm font-heading py-2.5 rounded-xl">Annuler</button>
          <button onClick={handleSave} disabled={loading || !form.nom || !form.phone}
            className="flex-1 bg-gmo-red text-white text-sm font-heading font-bold py-2.5 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            {loading ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VendeursListTab({ vendeurs, setVendeurs, stocks, ventes }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleSaved = (v, type) => {
    setVendeurs(prev => type === "create" ? [v, ...prev] : prev.map(x => x.id === v.id ? v : x));
  };

  const getStockVendeur = (vendeurId) => stocks.filter(s => s.vendeur_id === vendeurId && s.status === "valide");
  const getVentesVendeur = (vendeurId) => ventes.filter(v => v.vendeur_id === vendeurId);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-lg font-bold text-obsidian">Liste des vendeurs ({vendeurs.length})</h2>
        <button onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-gmo-red text-white text-xs font-heading font-bold px-4 py-2.5 rounded-xl">
          <Plus className="w-4 h-4" /> Nouveau vendeur
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {vendeurs.map(v => {
          const stockActifs = getStockVendeur(v.id);
          const ventesTotal = getVentesVendeur(v.id).reduce((s, x) => s + (x.montant_total || 0), 0);
          const cartouchesDispos = stockActifs.reduce((s, st) => s + (st.cartouches_disponibles || 0), 0);
          return (
            <div key={v.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold font-heading text-sm ${v.is_active ? "bg-gmo-red" : "bg-gray-300"}`}>
                    {v.nom?.charAt(0)}{v.prenom?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-heading text-sm font-bold text-obsidian">{v.prenom} {v.nom}</p>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${v.is_active ? "bg-gmo-green" : "bg-gray-300"}`} />
                      <span className="text-[10px] text-obsidian/40 font-body">{v.is_active ? "Actif" : "Inactif"}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => { setEditing(v); setShowForm(true); }}
                  className="p-1.5 rounded-lg border border-gray-200 hover:border-gmo-red hover:text-gmo-red transition-colors">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-1.5 mb-3">
                {v.phone && <div className="flex items-center gap-2 text-xs text-obsidian/55 font-body"><Phone className="w-3 h-3" />{v.phone}</div>}
                {v.zone && <div className="flex items-center gap-2 text-xs text-obsidian/55 font-body"><MapPin className="w-3 h-3" />{v.zone}</div>}
              </div>
              <div className="grid grid-cols-2 gap-2 border-t border-gray-100 pt-3">
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <Package className="w-3.5 h-3.5 text-gmo-red mx-auto mb-0.5" />
                  <p className="font-heading text-sm font-bold text-obsidian">{cartouchesDispos}</p>
                  <p className="text-[9px] text-obsidian/40 font-body">Cartouches</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <TrendingUp className="w-3.5 h-3.5 text-gmo-green mx-auto mb-0.5" />
                  <p className="font-heading text-sm font-bold text-obsidian">{ventesTotal > 0 ? `${(ventesTotal/1000).toFixed(0)}k` : "0"}</p>
                  <p className="text-[9px] text-obsidian/40 font-body">CA FCFA</p>
                </div>
              </div>
            </div>
          );
        })}
        {vendeurs.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl border border-gray-100 py-16 text-center">
            <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="font-heading text-sm text-obsidian/40">Aucun vendeur enregistré</p>
          </div>
        )}
      </div>

      {showForm && <VendeurForm vendeur={editing} onClose={() => setShowForm(false)} onSaved={handleSaved} />}
    </div>
  );
}