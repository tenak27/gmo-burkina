import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import EntityTable from "./EntityTable";
import EntityForm from "./EntityForm";

const FIELDS = [
  { key: "name", label: "Nom / Raison sociale", required: true },
  { key: "contact_name", label: "Nom du contact" },
  { key: "email", label: "Email", type: "email" },
  { key: "phone", label: "Téléphone" },
  { key: "tax_id", label: "NIF / RCCM" },
  { key: "address", label: "Adresse" },
  { key: "city", label: "Ville" },
  { key: "country", label: "Pays" },
  { key: "payment_terms", label: "Conditions de paiement" },
  { key: "notes", label: "Notes", type: "textarea" },
  { key: "is_active", label: "Actif", type: "checkbox", checkLabel: "Fournisseur actif" },
];

const COLUMNS = [
  { key: "name", label: "Raison sociale", render: v => <p className="font-heading text-xs font-semibold text-obsidian">{v}</p> },
  { key: "contact_name", label: "Contact", render: v => <span className="text-xs text-obsidian/60 font-body">{v || "—"}</span> },
  { key: "phone", label: "Téléphone", render: v => <span className="text-xs text-obsidian/60 font-body">{v || "—"}</span> },
  { key: "city", label: "Ville", render: v => <span className="text-xs text-obsidian/50 font-body">{v || "—"}</span> },
  { key: "payment_terms", label: "Conditions", render: v => <span className="text-[11px] text-obsidian/50 font-body">{v || "—"}</span> },
  { key: "is_active", label: "Statut", align: "center", render: v => <span className={`text-[10px] px-2 py-0.5 rounded-full font-body ${v !== false ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"}`}>{v !== false ? "Actif" : "Inactif"}</span> },
];

const EMPTY = { name: "", contact_name: "", email: "", phone: "", tax_id: "", address: "", city: "", country: "Burkina Faso", payment_terms: "30 jours", notes: "", is_active: true };

export default function SuppliersTab({ suppliers, setSuppliers }) {
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
      await base44.entities.Supplier.update(editing.id, form);
      setSuppliers(prev => prev.map(s => s.id === editing.id ? {...s, ...form} : s));
    } else {
      const r = await base44.entities.Supplier.create(form);
      setSuppliers(prev => [r, ...prev]);
    }
    setSaving(false); setForm(null); setEditing(null);
  };

  const del = async r => {
    if (!confirm(`Supprimer ${r.name} ?`)) return;
    await base44.entities.Supplier.delete(r.id);
    setSuppliers(prev => prev.filter(s => s.id !== r.id));
  };

  return (
    <>
      <EntityTable title="Fournisseurs" subtitle={`${suppliers.length} fournisseurs`} columns={COLUMNS} rows={suppliers} onAdd={openAdd} onEdit={openEdit} onDelete={del} addLabel="Nouveau fournisseur" />
      {form && <EntityForm title="Fournisseur" fields={FIELDS} data={form} onChange={onChange} onSave={save} onClose={() => { setForm(null); setEditing(null); }} saving={saving} isEdit={!!editing} />}
    </>
  );
}