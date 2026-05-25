import React, { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import EntityTable from "./EntityTable";
import SectionHeader from "./SectionHeader";
import { Upload, X, Loader2, Package, Save } from "lucide-react";
import { motion } from "framer-motion";

const inputCls = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body text-obsidian focus:outline-none focus:border-gmo-green transition-colors";

const COLUMNS = [
  { key: "image_url", label: "", render: (v, r) => v
    ? <img src={v} alt={r.name} className="w-10 h-10 object-cover rounded-lg border border-gray-100" onError={e => e.target.style.display="none"} />
    : <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center"><Package className="w-4 h-4 text-gray-300" /></div>
  },
  { key: "name", label: "Produit", render: (v, r) => {
    const CAT_LABELS = { tabac: "Tabac", alimentaire: "Alimentaire", hygiene: "Hygiène", elevage: "Elevage" };
    return <div><p className="font-heading text-sm font-bold text-obsidian">{v}</p><span className="text-xs text-obsidian/50 font-body">{CAT_LABELS[r.category] || r.category || "—"}</span></div>;
  }},
  { key: "unit", label: "Unité", render: v => <span className="text-sm text-obsidian/60 font-body">{v || "—"}</span> },
  { key: "unit_price", label: "Prix U.", align: "right", render: v => v ? <span className="text-sm font-heading font-bold text-obsidian">{Number(v).toLocaleString()} FCFA</span> : <span className="text-obsidian/25">—</span> },
  { key: "wholesale_price", label: "Prix Gros", align: "right", render: v => v ? <span className="text-sm font-heading font-bold text-gmo-green">{Number(v).toLocaleString()} FCFA</span> : <span className="text-obsidian/25">—</span> },
  { key: "stock_quantity", label: "Stock", align: "right", render: (v, r) => {
    const low = v <= (r.stock_alert || 10);
    return <span className={`font-heading text-base font-bold ${v === 0 ? "text-red-500" : low ? "text-amber-500" : "text-obsidian"}`}>{v ?? "—"}</span>;
  }},
  { key: "is_active", label: "Actif", align: "center", render: v => <span className={`text-xs px-3 py-1 rounded-full font-semibold font-body ${v !== false ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"}`}>{v !== false ? "Oui" : "Non"}</span> },
];

const EMPTY = { name: "", category: "alimentaire", description: "", unit_price: 0, wholesale_price: 0, stock_quantity: 0, stock_alert: 10, unit: "carton", is_active: true, image_url: "" };

function ProductForm({ form, setForm, onSave, onClose, saving, isEdit }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    set("image_url", file_url);
    setUploading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 28, stiffness: 350 }}
        className="bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0 bg-gradient-to-r from-[#1E3A5F] to-[#2D4A6F]">
          <div>
            <h4 className="font-heading text-lg font-bold text-white tracking-tight">{isEdit ? "Modifier le produit" : "Nouveau produit"}</h4>
            <p className="text-[10px] text-white/50 font-body mt-0.5 uppercase tracking-wider">Gestion de stock</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

          {/* Photo upload */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Photo du produit</label>
            <div className="flex items-start gap-3">
              {/* Preview */}
              <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 flex-shrink-0 overflow-hidden bg-gray-50 flex items-center justify-center">
                {form.image_url
                  ? <img src={form.image_url} alt="preview" className="w-full h-full object-cover" onError={e => e.target.style.display="none"} />
                  : <Package className="w-6 h-6 text-gray-300" />
                }
              </div>
              <div className="flex-1 space-y-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-2.5 text-xs font-body text-gray-400 hover:border-gmo-green hover:text-gmo-green transition-all cursor-pointer disabled:opacity-50"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploading ? "Upload en cours…" : "Choisir une image"}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                <input
                  value={form.image_url || ""}
                  onChange={e => set("image_url", e.target.value)}
                  placeholder="ou coller une URL image…"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs font-body text-obsidian focus:outline-none focus:border-gmo-green transition-colors"
                />
                {form.image_url && (
                  <button type="button" onClick={() => set("image_url", "")} className="text-[10px] text-red-400 hover:text-red-600 cursor-pointer flex items-center gap-1">
                    <X className="w-3 h-3" /> Supprimer la photo
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Fields */}
          {[
            { key: "name", label: "Nom du produit *", placeholder: "Ex: Huile SAVOR 5L" },
            { key: "unit", label: "Unité", placeholder: "carton, sac, bouteille…" },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{f.label}</label>
              <input value={form[f.key] || ""} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} className={inputCls} />
            </div>
          ))}

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Catégorie</label>
            <select value={form.category || "alimentaire"} onChange={e => set("category", e.target.value)} className={inputCls}>
              <option value="tabac">Tabac</option>
              <option value="alimentaire">Alimentaire</option>
              <option value="hygiene">Hygiène</option>
              <option value="elevage">Elevage</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Description</label>
            <textarea value={form.description || ""} onChange={e => set("description", e.target.value)} rows={3} className={`${inputCls} resize-none`} placeholder="Description courte…" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { key: "unit_price", label: "Prix unitaire (FCFA)" },
              { key: "wholesale_price", label: "Prix grossiste (FCFA)" },
              { key: "stock_quantity", label: "Quantité en stock" },
              { key: "stock_alert", label: "Seuil d'alerte" },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{f.label}</label>
                <input type="number" value={form[f.key] ?? 0} onChange={e => set(f.key, e.target.value)} className={inputCls} />
              </div>
            ))}
          </div>

          <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-xl">
            <input type="checkbox" checked={form.is_active !== false} onChange={e => set("is_active", e.target.checked)} className="w-4 h-4 accent-gmo-green" />
            <span className="text-sm font-body text-obsidian/70">Produit actif</span>
          </label>
        </div>

        <div className="flex gap-3 px-6 py-5 border-t border-gray-100 flex-shrink-0 bg-white">
          <button onClick={onClose} className="px-6 py-3 border border-gray-200 rounded-xl text-sm font-body text-obsidian/60 hover:border-gray-300 hover:text-obsidian hover:bg-gray-50 transition-all cursor-pointer font-medium">Annuler</button>
          <button onClick={onSave} disabled={saving || !form.name}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-gmo-green to-emerald-600 text-white font-heading font-bold text-sm py-3.5 rounded-xl hover:shadow-lg hover:shadow-gmo-green/25 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Enregistrement…" : (isEdit ? "Enregistrer" : "Créer")}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function ProductsTab({ products, setProducts }) {
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const openAdd = () => { setEditing(null); setForm({...EMPTY}); };
  const openEdit = r => { setEditing(r); setForm({...r}); };

  const save = async () => {
    if (!form?.name) return;
    setSaving(true);
    const d = {...form, unit_price: +form.unit_price||0, wholesale_price: +form.wholesale_price||0, stock_quantity: +form.stock_quantity||0, stock_alert: +form.stock_alert||10};
    if (editing) {
      await base44.entities.Product.update(editing.id, d);
      setProducts(prev => prev.map(p => p.id === editing.id ? {...p, ...d} : p));
    } else {
      const r = await base44.entities.Product.create(d);
      setProducts(prev => [...prev, r]);
    }
    setSaving(false); setForm(null); setEditing(null);
  };

  const del = async r => {
    if (!confirm(`Supprimer ${r.name} ?`)) return;
    await base44.entities.Product.delete(r.id);
    setProducts(prev => prev.filter(p => p.id !== r.id));
  };

  return (
    <>
      <EntityTable title="Catalogue Produits" subtitle={`${products.length} références`} columns={COLUMNS} rows={products} onAdd={openAdd} onEdit={openEdit} onDelete={del} addLabel="Nouveau produit" />
      {form && <ProductForm form={form} setForm={setForm} onSave={save} onClose={() => { setForm(null); setEditing(null); }} saving={saving} isEdit={!!editing} />}
    </>
  );
}