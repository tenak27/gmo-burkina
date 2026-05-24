import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import {
  Image, Briefcase, Package, Users, Newspaper, Trophy,
  Plus, Trash2, Edit2, X, Save, Loader2, Eye, CheckCircle2, Upload
} from "lucide-react";

const TABS = [
  { id: "galerie",    label: "Galerie",         icon: Image,     color: "from-violet-500 to-purple-600" },
  { id: "offres",     label: "Offres d'emploi", icon: Briefcase, color: "from-blue-500 to-indigo-600" },
  { id: "produits",   label: "Produits vitrine",icon: Package,   color: "from-teal-500 to-green-600" },
  { id: "partenaires",label: "Partenaires",     icon: Users,     color: "from-amber-500 to-orange-500" },
  { id: "news",       label: "Dernières nouvelles", icon: Newspaper, color: "from-pink-500 to-rose-600" },
  { id: "fasofoot",   label: "Faso Foot",       icon: Trophy,    color: "from-green-500 to-emerald-600" },
];

// ─── Galerie ───────────────────────────────────────────────────────────────
function GalerieManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);
  const load = async () => {
    setLoading(true);
    // Use Product entity filtered by category "galerie" as a workaround
    const data = await base44.entities.Category.list("name", 100);
    setItems(data.filter(d => d.description?.startsWith("GALERIE:")) || []);
    setLoading(false);
  };

  const save = async () => {
    if (!form?.name) return;
    setSaving(true);
    const payload = { name: form.name, description: `GALERIE:${form.url || ""}`, code: form.code || "galerie" };
    if (form.id) {
      await base44.entities.Category.update(form.id, payload);
      setItems(prev => prev.map(i => i.id === form.id ? { ...i, ...payload } : i));
    } else {
      const r = await base44.entities.Category.create(payload);
      setItems(prev => [r, ...prev]);
    }
    setSaving(false);
    setForm(null);
  };

  const del = async (id) => {
    if (!confirm("Supprimer ?")) return;
    await base44.entities.Category.delete(id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-bold text-obsidian">Galerie photos ({items.length})</h3>
        <button onClick={() => setForm({ name: "", url: "", code: "galerie" })}
          className="flex items-center gap-2 bg-violet-600 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-violet-700 cursor-pointer">
          <Plus className="w-3.5 h-3.5" /> Ajouter photo
        </button>
      </div>
      {loading ? <div className="py-10 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto text-violet-500" /></div> : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map(item => {
            const url = item.description?.replace("GALERIE:", "");
            return (
              <div key={item.id} className="group relative bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                {url ? (
                  <img src={url} alt={item.name} className="w-full h-28 object-cover" onError={e => e.target.style.display="none"} />
                ) : (
                  <div className="w-full h-28 bg-gray-100 flex items-center justify-center"><Image className="w-6 h-6 text-gray-300" /></div>
                )}
                <div className="p-2">
                  <p className="text-xs font-semibold text-obsidian truncate">{item.name}</p>
                </div>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setForm({ ...item, url: item.description?.replace("GALERIE:", "") })}
                    className="w-6 h-6 bg-white rounded-lg shadow flex items-center justify-center cursor-pointer"><Edit2 className="w-3 h-3 text-gray-600" /></button>
                  <button onClick={() => del(item.id)}
                    className="w-6 h-6 bg-red-50 rounded-lg shadow flex items-center justify-center cursor-pointer"><Trash2 className="w-3 h-3 text-red-500" /></button>
                </div>
              </div>
            );
          })}
          {items.length === 0 && <div className="col-span-4 py-8 text-center text-sm text-obsidian/30">Aucune photo. Ajoutez-en une.</div>}
        </div>
      )}
      {form && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-heading font-bold text-obsidian">{form.id ? "Modifier" : "Ajouter"} photo</h4>
              <button onClick={() => setForm(null)} className="text-gray-400 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Titre</label>
                <input value={form.name || ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">URL de l'image</label>
                <input value={form.url || ""} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500" />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setForm(null)} className="flex-1 border border-gray-200 text-sm font-semibold py-2.5 rounded-xl cursor-pointer">Annuler</button>
              <button onClick={save} disabled={saving}
                className="flex-1 bg-violet-600 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-violet-700 cursor-pointer disabled:opacity-60">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Generic list manager ────────────────────────────────────────────────────
function GenericListManager({ storagePrefix, color, fields, addLabel, entityType = "Category" }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const entity = base44.entities[entityType];

  useEffect(() => { load(); }, []);
  const load = async () => {
    setLoading(true);
    const data = await entity.list("-created_date", 200);
    setItems(data.filter(d => d.code === storagePrefix) || []);
    setLoading(false);
  };

  const save = async () => {
    if (!form?.[fields[0].key]) return;
    setSaving(true);
    const payload = { ...form, code: storagePrefix, is_active: true };
    if (form.id) {
      await entity.update(form.id, payload);
      setItems(prev => prev.map(i => i.id === form.id ? { ...i, ...payload } : i));
    } else {
      const r = await entity.create(payload);
      setItems(prev => [r, ...prev]);
    }
    setSaving(false);
    setForm(null);
  };

  const del = async (id) => {
    if (!confirm("Supprimer ?")) return;
    await entity.delete(id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const emptyForm = { ...fields.reduce((acc, f) => ({ ...acc, [f.key]: "" }), {}), code: storagePrefix };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-bold text-obsidian">{addLabel} ({items.length})</h3>
        <button onClick={() => setForm(emptyForm)}
          className={`flex items-center gap-2 bg-gradient-to-r ${color} text-white text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer`}>
          <Plus className="w-3.5 h-3.5" /> Ajouter
        </button>
      </div>
      {loading ? <div className="py-10 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto text-gray-400" /></div> : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {fields.map(f => <th key={f.key} className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{f.label}</th>)}
                <th className="px-4 py-2.5 text-right text-[10px] font-bold text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.length === 0 ? (
                <tr><td colSpan={fields.length + 1} className="py-10 text-center text-sm text-obsidian/30">Aucun élément</td></tr>
              ) : items.map(item => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  {fields.map(f => (
                    <td key={f.key} className="px-4 py-3 text-sm text-obsidian/80 max-w-[200px] truncate">
                      {f.type === "image" && item[f.key] ? (
                        <img src={item[f.key]} alt="" className="h-8 w-12 object-cover rounded" onError={e => e.target.style.display="none"} />
                      ) : item[f.key] || "—"}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => setForm({ ...item })}
                        className="p-1.5 hover:bg-gray-100 rounded-lg cursor-pointer"><Edit2 className="w-3.5 h-3.5 text-gray-400" /></button>
                      <button onClick={() => del(item.id)}
                        className="p-1.5 hover:bg-red-50 rounded-lg cursor-pointer"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {form && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-heading font-bold text-obsidian">{form.id ? "Modifier" : "Ajouter"}</h4>
              <button onClick={() => setForm(null)} className="text-gray-400 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              {fields.map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{f.label}</label>
                  {f.textarea ? (
                    <textarea value={form[f.key] || ""} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gmo-green resize-none" />
                  ) : (
                    <input type={f.type === "date" ? "date" : "text"} value={form[f.key] || ""}
                      onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} placeholder={f.placeholder || ""}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gmo-green" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setForm(null)} className="flex-1 border border-gray-200 text-sm font-semibold py-2.5 rounded-xl cursor-pointer">Annuler</button>
              <button onClick={save} disabled={saving}
                className={`flex-1 bg-gradient-to-r ${color} text-white text-sm font-semibold py-2.5 rounded-xl cursor-pointer disabled:opacity-60`}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function SiteVitrineTab() {
  const [activeTab, setActiveTab] = useState("galerie");

  const offresFields = [
    { key: "name", label: "Titre du poste" },
    { key: "description", label: "Description / Profil recherché", textarea: true },
    { key: "parent_id", label: "Localisation / Département" },
  ];

  const produitFields = [
    { key: "name", label: "Nom du produit" },
    { key: "description", label: "Description", textarea: true },
    { key: "parent_id", label: "URL image", placeholder: "https://..." },
  ];

  const partenaireFields = [
    { key: "name", label: "Nom partenaire" },
    { key: "parent_id", label: "URL logo", placeholder: "https://..." },
    { key: "description", label: "Site web / Description" },
  ];

  const newsFields = [
    { key: "name", label: "Titre" },
    { key: "description", label: "Contenu", textarea: true },
    { key: "parent_id", label: "URL image / Date de publication" },
  ];

  const fasofootFields = [
    { key: "name", label: "Titre" },
    { key: "description", label: "Description", textarea: true },
    { key: "parent_id", label: "URL image / lien vidéo" },
  ];

  const currentTab = TABS.find(t => t.id === activeTab);

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
          <Eye className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-heading text-xl font-bold text-obsidian">Site Vitrine</h1>
          <p className="text-xs text-obsidian/40 font-body mt-0.5">Gérez le contenu affiché sur le site public GMO Burkina</p>
        </div>
      </div>

      {/* Module cards */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`rounded-xl p-3 text-center cursor-pointer transition-all ${activeTab === t.id
                ? `bg-gradient-to-br ${t.color} text-white shadow-lg -translate-y-0.5`
                : "bg-white border border-gray-100 shadow-sm text-obsidian hover:shadow-md hover:-translate-y-0.5"}`}>
              <Icon className={`w-5 h-5 mx-auto mb-1.5 ${activeTab === t.id ? "text-white" : "text-obsidian/50"}`} />
              <p className={`text-[10px] font-semibold leading-tight ${activeTab === t.id ? "text-white" : "text-obsidian/60"}`}>{t.label}</p>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r ${currentTab?.color} text-white text-xs font-bold mb-4`}>
          {currentTab && <currentTab.icon className="w-3.5 h-3.5" />}
          {currentTab?.label}
        </div>

        {activeTab === "galerie" && <GalerieManager />}
        {activeTab === "offres" && (
          <GenericListManager storagePrefix="offre_emploi" color="from-blue-500 to-indigo-600"
            fields={offresFields} addLabel="Offres d'emploi" />
        )}
        {activeTab === "produits" && (
          <GenericListManager storagePrefix="vitrine_produit" color="from-teal-500 to-green-600"
            fields={produitFields} addLabel="Produits vitrine" />
        )}
        {activeTab === "partenaires" && (
          <GenericListManager storagePrefix="partenaire" color="from-amber-500 to-orange-500"
            fields={partenaireFields} addLabel="Partenaires" />
        )}
        {activeTab === "news" && (
          <GenericListManager storagePrefix="actualite" color="from-pink-500 to-rose-600"
            fields={newsFields} addLabel="Actualités" />
        )}
        {activeTab === "fasofoot" && (
          <GenericListManager storagePrefix="faso_foot" color="from-green-500 to-emerald-600"
            fields={fasofootFields} addLabel="Faso Foot" />
        )}
      </div>
    </div>
  );
}