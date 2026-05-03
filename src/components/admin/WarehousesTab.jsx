import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import EntityTable from "./EntityTable";
import EntityForm from "./EntityForm";

const FIELDS = [
  { key: "name", label: "Nom de l'entrepôt", required: true },
  { key: "code", label: "Code" },
  { key: "address", label: "Adresse" },
  { key: "city", label: "Ville" },
  { key: "manager", label: "Responsable" },
  { key: "capacity", label: "Capacité (m³)", type: "number" },
  { key: "is_active", label: "Actif", type: "checkbox", checkLabel: "Entrepôt actif" },
];

const COLUMNS = [
  { key: "name", label: "Entrepôt", render: (v, r) => <div><p className="font-heading text-xs font-semibold text-obsidian">{v}</p><span className="text-[10px] text-obsidian/35 font-body">{r.code || ""}</span></div> },
  { key: "city", label: "Ville", render: v => <span className="text-xs text-obsidian/60 font-body">{v || "—"}</span> },
  { key: "manager", label: "Responsable", render: v => <span className="text-xs text-obsidian/60 font-body">{v || "—"}</span> },
  { key: "capacity", label: "Capacité m³", align: "right", render: v => v ? <span className="text-xs font-body text-obsidian/60">{Number(v).toLocaleString()}</span> : <span className="text-obsidian/25">—</span> },
  { key: "is_active", label: "Statut", align: "center", render: v => <span className={`text-[10px] px-2 py-0.5 rounded-full font-body ${v !== false ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"}`}>{v !== false ? "Actif" : "Inactif"}</span> },
];

const EMPTY = { name: "", code: "", address: "", city: "", manager: "", capacity: 0, is_active: true };

export default function WarehousesTab({ warehouses, setWarehouses }) {
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const openAdd = () => { setEditing(null); setForm({...EMPTY}); };
  const openEdit = r => { setEditing(r); setForm({...r}); };
  const onChange = (k, v) => setForm(f => ({...f, [k]: v}));

  const save = async () => {
    if (!form?.name) return;
    setSaving(true);
    const d = {...form, capacity: +form.capacity||0};
    if (editing) {
      await base44.entities.Warehouse.update(editing.id, d);
      setWarehouses(prev => prev.map(w => w.id === editing.id ? {...w, ...d} : w));
    } else {
      const r = await base44.entities.Warehouse.create(d);
      setWarehouses(prev => [...prev, r]);
    }
    setSaving(false); setForm(null); setEditing(null);
  };

  const del = async r => {
    if (!confirm(`Supprimer ${r.name} ?`)) return;
    await base44.entities.Warehouse.delete(r.id);
    setWarehouses(prev => prev.filter(w => w.id !== r.id));
  };

  return (
    <>
      <EntityTable title="Entrepôts" subtitle={`${warehouses.length} entrepôts`} columns={COLUMNS} rows={warehouses} onAdd={openAdd} onEdit={openEdit} onDelete={del} addLabel="Nouvel entrepôt" />
      {form && <EntityForm title="Entrepôt" fields={FIELDS} data={form} onChange={onChange} onSave={save} onClose={() => { setForm(null); setEditing(null); }} saving={saving} isEdit={!!editing} />}
    </>
  );
}