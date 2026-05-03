import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import EntityTable from "./EntityTable";
import EntityForm from "./EntityForm";

const FIELDS = [
  { key: "name", label: "Nom / Raison sociale", required: true },
  { key: "type", label: "Type", type: "select", options: ["particulier","entreprise"] },
  { key: "email", label: "Email", type: "email" },
  { key: "phone", label: "Téléphone" },
  { key: "tax_id", label: "NIF / RCCM" },
  { key: "address", label: "Adresse" },
  { key: "city", label: "Ville" },
  { key: "country", label: "Pays" },
  { key: "credit_limit", label: "Plafond crédit (FCFA)", type: "number" },
  { key: "notes", label: "Notes", type: "textarea" },
  { key: "is_active", label: "Actif", type: "checkbox", checkLabel: "Client actif" },
];

const COLUMNS = [
  { key: "name", label: "Nom", render: (v, r) => <p className="font-heading text-xs font-semibold text-obsidian">{v}</p> },
  { key: "type", label: "Type", render: v => <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-obsidian/50 font-body capitalize">{v || "—"}</span> },
  { key: "phone", label: "Téléphone", render: v => <span className="text-xs text-obsidian/60 font-body">{v || "—"}</span> },
  { key: "city", label: "Ville", render: v => <span className="text-xs text-obsidian/50 font-body">{v || "—"}</span> },
  { key: "credit_limit", label: "Plafond", align: "right", render: v => v ? <span className="text-xs font-heading font-bold text-obsidian">{Number(v).toLocaleString()} FCFA</span> : <span className="text-obsidian/25">—</span> },
  { key: "is_active", label: "Statut", align: "center", render: v => <span className={`text-[10px] px-2 py-0.5 rounded-full font-body ${v !== false ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"}`}>{v !== false ? "Actif" : "Inactif"}</span> },
];

const EMPTY = { name: "", type: "entreprise", email: "", phone: "", tax_id: "", address: "", city: "", country: "Burkina Faso", credit_limit: 0, notes: "", is_active: true };

export default function ClientsTab({ clients, setClients }) {
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const openAdd = () => { setEditing(null); setForm({...EMPTY}); };
  const openEdit = (r) => { setEditing(r); setForm({...r}); };
  const onChange = (k, v) => setForm(f => ({...f, [k]: v}));

  const save = async () => {
    if (!form?.name) return;
    setSaving(true);
    if (editing) {
      await base44.entities.Client.update(editing.id, form);
      setClients(prev => prev.map(c => c.id === editing.id ? {...c, ...form} : c));
    } else {
      const r = await base44.entities.Client.create(form);
      setClients(prev => [r, ...prev]);
    }
    setSaving(false);
    setForm(null);
    setEditing(null);
  };

  const del = async (r) => {
    if (!confirm(`Supprimer ${r.name} ?`)) return;
    await base44.entities.Client.delete(r.id);
    setClients(prev => prev.filter(c => c.id !== r.id));
  };

  return (
    <>
      <EntityTable
        title="Clients"
        subtitle={`${clients.length} clients enregistrés`}
        columns={COLUMNS}
        rows={clients}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={del}
        addLabel="Nouveau client"
      />
      {form && (
        <EntityForm
          title="Client"
          fields={FIELDS}
          data={form}
          onChange={onChange}
          onSave={save}
          onClose={() => { setForm(null); setEditing(null); }}
          saving={saving}
          isEdit={!!editing}
        />
      )}
    </>
  );
}