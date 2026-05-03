import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import EntityTable from "./EntityTable";
import EntityForm from "./EntityForm";

const FIELDS = [
  { key: "name", label: "Nom de la catégorie", required: true },
  { key: "code", label: "Code" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "is_active", label: "Actif", type: "checkbox", checkLabel: "Catégorie active" },
];

const COLUMNS = [
  { key: "name", label: "Catégorie", render: (v, r) => <div><p className="font-heading text-xs font-semibold text-obsidian">{v}</p><span className="text-[10px] text-obsidian/35 font-body">{r.code || ""}</span></div> },
  { key: "description", label: "Description", render: v => <span className="text-xs text-obsidian/50 font-body truncate max-w-xs">{v || "—"}</span> },
  { key: "is_active", label: "Statut", align: "center", render: v => <span className={`text-[10px] px-2 py-0.5 rounded-full font-body ${v !== false ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"}`}>{v !== false ? "Active" : "Inactive"}</span> },
];

const EMPTY = { name: "", code: "", description: "", is_active: true };

export default function CategoriesTab({ categories, setCategories }) {
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const openAdd = () => { setEditing(null); setForm({...EMPTY}); };
  const openEdit = r => { setEditing(r); setForm({...r}); };
  const onChange = (k, v) => setForm(f => ({...f, [k]: v}));

  const save = async () => {
    if (!form?.name) return;
    setSaving(true);
    if (editing) {
      await base44.entities.Category.update(editing.id, form);
      setCategories(prev => prev.map(c => c.id === editing.id ? {...c, ...form} : c));
    } else {
      const r = await base44.entities.Category.create(form);
      setCategories(prev => [...prev, r]);
    }
    setSaving(false); setForm(null); setEditing(null);
  };

  const del = async r => {
    if (!confirm(`Supprimer ${r.name} ?`)) return;
    await base44.entities.Category.delete(r.id);
    setCategories(prev => prev.filter(c => c.id !== r.id));
  };

  return (
    <>
      <EntityTable title="Catégories" subtitle={`${categories.length} catégories`} columns={COLUMNS} rows={categories} onAdd={openAdd} onEdit={openEdit} onDelete={del} addLabel="Nouvelle catégorie" />
      {form && <EntityForm title="Catégorie" fields={FIELDS} data={form} onChange={onChange} onSave={save} onClose={() => { setForm(null); setEditing(null); }} saving={saving} isEdit={!!editing} />}
    </>
  );
}