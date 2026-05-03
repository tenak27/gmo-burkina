import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import EntityTable from "./EntityTable";
import EntityForm from "./EntityForm";
import { Users, UserCheck, UserX } from "lucide-react";

const FIELDS = [
  { key: "first_name", label: "Prénom", required: true },
  { key: "last_name", label: "Nom", required: true },
  { key: "email", label: "Email professionnel", type: "email" },
  { key: "phone", label: "Téléphone" },
  { key: "position", label: "Poste / Fonction" },
  { key: "department", label: "Département / Service" },
  { key: "contract_type", label: "Type de contrat", type: "select", options: ["CDI","CDD","Stage","Consultant"] },
  { key: "hire_date", label: "Date d'embauche", type: "date" },
  { key: "salary", label: "Salaire mensuel (FCFA)", type: "number" },
  { key: "status", label: "Statut", type: "select", options: [{value:"actif",label:"Actif"},{value:"conge",label:"En congé"},{value:"inactif",label:"Inactif"}] },
  { key: "cnss_number", label: "N° CNSS" },
  { key: "address", label: "Adresse" },
  { key: "emergency_contact", label: "Contact d'urgence" },
];

const COLUMNS = [
  { key: "last_name", label: "Employé", render: (v, r) => <div><p className="font-heading text-xs font-semibold text-obsidian">{r.first_name} {v}</p><span className="text-[10px] text-obsidian/40 font-body">{r.position || "—"}</span></div> },
  { key: "department", label: "Département", render: v => <span className="text-xs text-obsidian/60 font-body">{v || "—"}</span> },
  { key: "contract_type", label: "Contrat", render: v => <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-obsidian/50 font-body">{v || "—"}</span> },
  { key: "salary", label: "Salaire", align: "right", render: v => v ? <span className="font-heading text-xs font-bold text-obsidian">{Number(v).toLocaleString()} FCFA</span> : <span className="text-obsidian/25">—</span> },
  { key: "hire_date", label: "Embauche", render: v => <span className="text-xs text-obsidian/50 font-body">{v ? new Date(v).toLocaleDateString("fr-FR") : "—"}</span> },
  { key: "status", label: "Statut", align: "center", render: v => <span className={`text-[10px] px-2 py-0.5 rounded-full font-body border ${{actif:"bg-green-50 text-green-700 border-green-200",conge:"bg-amber-50 text-amber-600 border-amber-200",inactif:"bg-gray-100 text-obsidian/40 border-gray-200"}[v]||""}`}>{{actif:"Actif",conge:"En congé",inactif:"Inactif"}[v]||v}</span> },
];

const EMPTY = { first_name: "", last_name: "", email: "", phone: "", position: "", department: "", contract_type: "CDI", hire_date: "", salary: 0, status: "actif", cnss_number: "", address: "", emergency_contact: "" };

export default function HRTab({ employees, setEmployees }) {
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const openAdd = () => { setEditing(null); setForm({...EMPTY}); };
  const openEdit = r => { setEditing(r); setForm({...r}); };
  const onChange = (k, v) => setForm(f => ({...f, [k]: v}));

  const save = async () => {
    if (!form?.first_name || !form?.last_name) return;
    setSaving(true);
    const d = {...form, salary: +form.salary||0};
    if (editing) {
      await base44.entities.Employee.update(editing.id, d);
      setEmployees(prev => prev.map(e => e.id === editing.id ? {...e, ...d} : e));
    } else {
      const r = await base44.entities.Employee.create(d);
      setEmployees(prev => [...prev, r]);
    }
    setSaving(false); setForm(null); setEditing(null);
  };

  const del = async r => {
    if (!confirm(`Supprimer ${r.first_name} ${r.last_name} ?`)) return;
    await base44.entities.Employee.delete(r.id);
    setEmployees(prev => prev.filter(e => e.id !== r.id));
  };

  const actif = employees.filter(e => e.status === "actif").length;
  const totalSalaires = employees.filter(e => e.status === "actif").reduce((s,e) => s+(e.salary||0), 0);

  return (
    <>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-1"><UserCheck className="w-4 h-4 text-green-600" /></div>
          <p className="font-heading text-lg font-bold text-obsidian">{actif}</p>
          <p className="text-[10px] text-obsidian/40 font-body">Employés actifs</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-1"><Users className="w-4 h-4 text-obsidian/50" /></div>
          <p className="font-heading text-lg font-bold text-obsidian">{employees.length}</p>
          <p className="text-[10px] text-obsidian/40 font-body">Total personnel</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-1"><UserX className="w-4 h-4 text-amber-500" /></div>
          <p className="font-heading text-lg font-bold text-obsidian">{totalSalaires.toLocaleString()} FCFA</p>
          <p className="text-[10px] text-obsidian/40 font-body">Masse salariale</p>
        </div>
      </div>
      <EntityTable title="Ressources Humaines" subtitle={`${employees.length} employés`} columns={COLUMNS} rows={employees} onAdd={openAdd} onEdit={openEdit} onDelete={del} addLabel="Nouvel employé" />
      {form && <EntityForm title="Employé" fields={FIELDS} data={form} onChange={onChange} onSave={save} onClose={() => { setForm(null); setEditing(null); }} saving={saving} isEdit={!!editing} />}
    </>
  );
}