import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Bike, Plus, Edit2, X, Trash2, UserCheck, AlertCircle } from "lucide-react";

const ETAT_CONFIG = {
  disponible: { label: "Disponible", color: "text-green-600 bg-green-50 border-green-200" },
  assignee:   { label: "Assignée",   color: "text-blue-600 bg-blue-50 border-blue-200" },
  en_panne:   { label: "En panne",   color: "text-red-600 bg-red-50 border-red-200" },
  retiree:    { label: "Retirée",    color: "text-gray-500 bg-gray-50 border-gray-200" },
};

function MotoForm({ moto, vendeurs, onSave, onClose }) {
  const [form, setForm] = useState({
    immatriculation: moto?.immatriculation || "",
    marque: moto?.marque || "",
    couleur: moto?.couleur || "",
    vendeur_id: moto?.vendeur_id || "",
    date_assignation: moto?.date_assignation || "",
    etat: moto?.etat || "disponible",
    notes: moto?.notes || "",
  });
  const [saving, setSaving] = useState(false);

  const handleVendeurChange = (vendeur_id) => {
    const v = vendeurs.find(v => v.id === vendeur_id);
    setForm(f => ({
      ...f,
      vendeur_id,
      vendeur_nom: v ? `${v.prenom} ${v.nom}` : "",
      etat: vendeur_id ? "assignee" : "disponible",
      date_assignation: vendeur_id ? new Date().toISOString().slice(0, 10) : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    if (moto?.id) {
      await base44.entities.MotoVendeur.update(moto.id, form);
    } else {
      await base44.entities.MotoVendeur.create(form);
    }
    setSaving(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-heading font-bold text-obsidian">{moto ? "Modifier la moto" : "Ajouter une moto"}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-obsidian/60 uppercase tracking-wider">Immatriculation *</label>
              <input required value={form.immatriculation} onChange={e => setForm(f => ({...f, immatriculation: e.target.value}))}
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gmo-green" />
            </div>
            <div>
              <label className="text-xs font-semibold text-obsidian/60 uppercase tracking-wider">Marque / Modèle</label>
              <input value={form.marque} onChange={e => setForm(f => ({...f, marque: e.target.value}))}
                placeholder="Ex: Yamaha DT"
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gmo-green" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-obsidian/60 uppercase tracking-wider">Couleur</label>
              <input value={form.couleur} onChange={e => setForm(f => ({...f, couleur: e.target.value}))}
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gmo-green" />
            </div>
            <div>
              <label className="text-xs font-semibold text-obsidian/60 uppercase tracking-wider">État</label>
              <select value={form.etat} onChange={e => setForm(f => ({...f, etat: e.target.value}))}
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gmo-green">
                {Object.entries(ETAT_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-obsidian/60 uppercase tracking-wider">Assigner à un vendeur</label>
            <select value={form.vendeur_id} onChange={e => handleVendeurChange(e.target.value)}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gmo-green">
              <option value="">— Aucun (disponible) —</option>
              {vendeurs.filter(v => v.is_active).map(v => (
                <option key={v.id} value={v.id}>{v.prenom} {v.nom} — {v.zone || "N/A"}</option>
              ))}
            </select>
          </div>
          {form.vendeur_id && (
            <div>
              <label className="text-xs font-semibold text-obsidian/60 uppercase tracking-wider">Date d'assignation</label>
              <input type="date" value={form.date_assignation} onChange={e => setForm(f => ({...f, date_assignation: e.target.value}))}
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gmo-green" />
            </div>
          )}
          <div>
            <label className="text-xs font-semibold text-obsidian/60 uppercase tracking-wider">Notes</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} rows={2}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gmo-green resize-none" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-obsidian/60 hover:bg-gray-50">Annuler</button>
            <button type="submit" disabled={saving}
              className="px-5 py-2 bg-gmo-red text-white rounded-lg text-sm font-semibold hover:bg-gmo-red/80 disabled:opacity-50">
              {saving ? "Enregistrement..." : moto ? "Modifier" : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MotosVendeursTab({ vendeurs }) {
  const [motos, setMotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editMoto, setEditMoto] = useState(null);
  const [filterEtat, setFilterEtat] = useState("all");

  useEffect(() => {
    loadMotos();
  }, []);

  const loadMotos = async () => {
    setLoading(true);
    const data = await base44.entities.MotoVendeur.list("-created_date", 200);
    setMotos(data || []);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cette moto ?")) return;
    await base44.entities.MotoVendeur.delete(id);
    setMotos(prev => prev.filter(m => m.id !== id));
  };

  const handleSave = () => {
    setShowForm(false);
    setEditMoto(null);
    loadMotos();
  };

  const filtered = filterEtat === "all" ? motos : motos.filter(m => m.etat === filterEtat);

  const kpis = [
    { label: "Total motos", value: motos.length, color: "text-obsidian" },
    { label: "Disponibles", value: motos.filter(m => m.etat === "disponible").length, color: "text-green-600" },
    { label: "Assignées", value: motos.filter(m => m.etat === "assignee").length, color: "text-blue-600" },
    { label: "En panne", value: motos.filter(m => m.etat === "en_panne").length, color: "text-red-600" },
  ];

  return (
    <div>
      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {kpis.map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-100 p-4">
            <p className={`font-heading text-2xl font-black ${k.color}`}>{k.value}</p>
            <p className="text-[11px] text-obsidian/45 font-body mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Header actions */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
          {["all", ...Object.keys(ETAT_CONFIG)].map(e => (
            <button key={e} onClick={() => setFilterEtat(e)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterEtat === e ? "bg-gmo-red text-white" : "bg-white border border-gray-200 text-obsidian/60 hover:border-gmo-red hover:text-gmo-red"
              }`}>
              {e === "all" ? "Toutes" : ETAT_CONFIG[e].label}
            </button>
          ))}
        </div>
        <button onClick={() => { setEditMoto(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-gmo-red text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gmo-red/80">
          <Plus className="w-4 h-4" /> Ajouter une moto
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-gmo-red/30 border-t-gmo-red rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
          <Bike className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-sm text-obsidian/40 font-body">Aucune moto trouvée</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Immatriculation", "Marque", "Couleur", "État", "Vendeur assigné", "Date assignation", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-obsidian/40 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(moto => {
                const etatCfg = ETAT_CONFIG[moto.etat] || ETAT_CONFIG.disponible;
                return (
                  <tr key={moto.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-heading font-bold text-obsidian">{moto.immatriculation}</td>
                    <td className="px-4 py-3 text-obsidian/70">{moto.marque || "—"}</td>
                    <td className="px-4 py-3 text-obsidian/70">{moto.couleur || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-semibold ${etatCfg.color}`}>
                        {etatCfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {moto.vendeur_nom ? (
                        <span className="flex items-center gap-1.5 text-blue-600 text-xs font-semibold">
                          <UserCheck className="w-3.5 h-3.5" />{moto.vendeur_nom}
                        </span>
                      ) : <span className="text-obsidian/30 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-3 text-obsidian/50 text-xs">
                      {moto.date_assignation ? new Date(moto.date_assignation).toLocaleDateString("fr-FR") : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => { setEditMoto(moto); setShowForm(true); }}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(moto.id)}
                          className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <MotoForm moto={editMoto} vendeurs={vendeurs} onSave={handleSave} onClose={() => { setShowForm(false); setEditMoto(null); }} />
      )}
    </div>
  );
}