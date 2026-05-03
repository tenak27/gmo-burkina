import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import EntityTable from "./EntityTable";
import EntityForm from "./EntityForm";

const TYPE_STYLE = {
  entree: "bg-green-50 text-green-700 border border-green-200",
  sortie: "bg-red-50 text-red-600 border border-red-200",
  transfert: "bg-blue-50 text-blue-600 border border-blue-200",
  ajustement: "bg-amber-50 text-amber-600 border border-amber-200",
};

const FIELDS = [
  { key: "type", label: "Type de mouvement", type: "select", required: true, options: [{value:"entree",label:"Entrée de stock"},{value:"sortie",label:"Sortie de stock"},{value:"transfert",label:"Transfert"},{value:"ajustement",label:"Ajustement"}] },
  { key: "product_name", label: "Produit", required: true },
  { key: "warehouse_name", label: "Entrepôt" },
  { key: "quantity", label: "Quantité", type: "number", required: true },
  { key: "unit_cost", label: "Coût unitaire (FCFA)", type: "number" },
  { key: "date", label: "Date", type: "date" },
  { key: "reference", label: "Référence" },
  { key: "reason", label: "Motif / Raison", type: "textarea" },
];

const COLUMNS = [
  { key: "date", label: "Date", render: v => <span className="text-xs font-body text-obsidian/60">{v ? new Date(v).toLocaleDateString("fr-FR") : "—"}</span> },
  { key: "type", label: "Type", render: v => <span className={`text-[10px] px-2 py-0.5 rounded-full font-body ${TYPE_STYLE[v] || ""}`}>{{entree:"Entrée",sortie:"Sortie",transfert:"Transfert",ajustement:"Ajustement"}[v]||v}</span> },
  { key: "product_name", label: "Produit", render: v => <span className="text-xs font-heading font-semibold text-obsidian">{v || "—"}</span> },
  { key: "warehouse_name", label: "Entrepôt", render: v => <span className="text-xs text-obsidian/50 font-body">{v || "—"}</span> },
  { key: "quantity", label: "Qté", align: "right", render: (v, r) => <span className={`font-heading text-sm font-bold ${r.type === "sortie" ? "text-red-500" : "text-green-600"}`}>{r.type === "sortie" ? "-" : "+"}{v}</span> },
  { key: "unit_cost", label: "Coût U.", align: "right", render: v => v ? <span className="text-xs font-body text-obsidian/60">{Number(v).toLocaleString()}</span> : <span className="text-obsidian/25">—</span> },
  { key: "reference", label: "Réf.", render: v => <span className="text-[11px] text-obsidian/40 font-body">{v || "—"}</span> },
];

const EMPTY = { type: "entree", product_name: "", warehouse_name: "", quantity: 0, unit_cost: 0, date: new Date().toISOString().split("T")[0], reference: "", reason: "" };

export default function StockTab({ movements, setMovements }) {
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const openAdd = () => { setEditing(null); setForm({...EMPTY}); };
  const openEdit = r => { setEditing(r); setForm({...r}); };
  const onChange = (k, v) => setForm(f => ({...f, [k]: v}));

  const save = async () => {
    if (!form?.product_name || !form?.quantity) return;
    setSaving(true);
    const d = {...form, quantity: +form.quantity||0, unit_cost: +form.unit_cost||0};
    if (editing) {
      await base44.entities.StockMovement.update(editing.id, d);
      setMovements(prev => prev.map(m => m.id === editing.id ? {...m, ...d} : m));
    } else {
      const r = await base44.entities.StockMovement.create(d);
      setMovements(prev => [r, ...prev]);
    }
    setSaving(false); setForm(null); setEditing(null);
  };

  const del = async r => {
    if (!confirm("Supprimer ce mouvement ?")) return;
    await base44.entities.StockMovement.delete(r.id);
    setMovements(prev => prev.filter(m => m.id !== r.id));
  };

  const totalIn = movements.filter(m => m.type === "entree").reduce((s, m) => s + (m.quantity || 0), 0);
  const totalOut = movements.filter(m => m.type === "sortie").reduce((s, m) => s + (m.quantity || 0), 0);

  return (
    <>
      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: "Total Entrées", value: `+${totalIn}`, color: "text-green-600" },
          { label: "Total Sorties", value: `-${totalOut}`, color: "text-red-500" },
          { label: "Mouvements", value: movements.length, color: "text-obsidian" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm text-center">
            <p className={`font-heading text-lg font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-obsidian/40 font-body">{s.label}</p>
          </div>
        ))}
      </div>
      <EntityTable title="Mouvements de stock" subtitle={`${movements.length} mouvements enregistrés`} columns={COLUMNS} rows={movements} onAdd={openAdd} onEdit={openEdit} onDelete={del} addLabel="Nouveau mouvement" />
      {form && <EntityForm title="Mouvement de stock" fields={FIELDS} data={form} onChange={onChange} onSave={save} onClose={() => { setForm(null); setEditing(null); }} saving={saving} isEdit={!!editing} />}
    </>
  );
}