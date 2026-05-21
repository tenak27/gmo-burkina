import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import EntityTable from "./EntityTable";
import EntityForm from "./EntityForm";

const FIELDS = [
  { key: "name", label: "Nom du produit", required: true },
  { key: "category", label: "Catégorie", type: "select", options: ["alimentaire","hygiene","boisson","cereale","autre"] },
  { key: "description", label: "Description", type: "textarea" },
  { key: "unit_price", label: "Prix unitaire (FCFA)", type: "number" },
  { key: "wholesale_price", label: "Prix grossiste (FCFA)", type: "number" },
  { key: "stock_quantity", label: "Quantité en stock", type: "number" },
  { key: "stock_alert", label: "Seuil d'alerte", type: "number" },
  { key: "unit", label: "Unité (carton, sac, bouteille...)" },
  { key: "is_active", label: "Actif", type: "checkbox", checkLabel: "Produit actif" },
];

const COLUMNS = [
  { key: "name", label: "Produit", render: (v, r) => <div><p className="font-heading text-sm font-bold text-obsidian">{v}</p><span className="text-xs text-obsidian/50 font-body capitalize mt-0.5">{r.category || "—"}</span></div> },
  { key: "unit", label: "Unité", render: v => <span className="text-sm text-obsidian/60 font-body">{v || "—"}</span> },
  { key: "unit_price", label: "Prix U.", align: "right", render: v => v ? <span className="text-sm font-heading font-bold text-obsidian">{Number(v).toLocaleString()} FCFA</span> : <span className="text-obsidian/25">—</span> },
  { key: "wholesale_price", label: "Prix Gros", align: "right", render: v => v ? <span className="text-sm font-heading font-bold text-gmo-green">{Number(v).toLocaleString()} FCFA</span> : <span className="text-obsidian/25">—</span> },
  { key: "stock_quantity", label: "Stock", align: "right", render: (v, r) => {
    const low = v <= (r.stock_alert || 10);
    return <span className={`font-heading text-base font-bold ${v === 0 ? "text-red-500" : low ? "text-amber-500" : "text-obsidian"}`}>{v ?? "—"}</span>;
  }},
  { key: "is_active", label: "Actif", align: "center", render: v => <span className={`text-xs px-3 py-1 rounded-full font-semibold font-body ${v !== false ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"}`}>{v !== false ? "Oui" : "Non"}</span> },
];

const EMPTY = { name: "", category: "alimentaire", description: "", unit_price: 0, wholesale_price: 0, stock_quantity: 0, stock_alert: 10, unit: "carton", is_active: true };

export default function ProductsTab({ products, setProducts }) {
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const openAdd = () => { setEditing(null); setForm({...EMPTY}); };
  const openEdit = r => { setEditing(r); setForm({...r}); };
  const onChange = (k, v) => setForm(f => ({...f, [k]: v}));

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
      {form && <EntityForm title="Produit" fields={FIELDS} data={form} onChange={onChange} onSave={save} onClose={() => { setForm(null); setEditing(null); }} saving={saving} isEdit={!!editing} />}
    </>
  );
}