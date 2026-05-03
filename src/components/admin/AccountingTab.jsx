import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import EntityTable from "./EntityTable";
import EntityForm from "./EntityForm";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

const TYPE_STYLE = {
  recette: "bg-green-50 text-green-700 border border-green-200",
  depense: "bg-red-50 text-red-600 border border-red-200",
  virement: "bg-blue-50 text-blue-600 border border-blue-200",
};

const FIELDS = [
  { key: "type", label: "Type", type: "select", required: true, options: [{value:"recette",label:"Recette"},{value:"depense",label:"Dépense"},{value:"virement",label:"Virement"}] },
  { key: "date", label: "Date", type: "date", required: true },
  { key: "description", label: "Description", required: true },
  { key: "amount", label: "Montant (FCFA)", type: "number", required: true },
  { key: "category", label: "Catégorie comptable" },
  { key: "account", label: "Compte" },
  { key: "payment_method", label: "Mode de paiement", type: "select", options: [{value:"cash",label:"Cash"},{value:"virement",label:"Virement bancaire"},{value:"cheque",label:"Chèque"},{value:"mobile_money",label:"Mobile Money"}] },
  { key: "reference", label: "Référence / N° pièce" },
  { key: "status", label: "Statut", type: "select", options: [{value:"valide",label:"Validé"},{value:"en_attente",label:"En attente"},{value:"annule",label:"Annulé"}] },
];

const COLUMNS = [
  { key: "date", label: "Date", render: v => <span className="text-xs font-body text-obsidian/60">{v ? new Date(v).toLocaleDateString("fr-FR") : "—"}</span> },
  { key: "type", label: "Type", render: v => <span className={`text-[10px] px-2 py-0.5 rounded-full font-body ${TYPE_STYLE[v]||""}`}>{{recette:"Recette",depense:"Dépense",virement:"Virement"}[v]||v}</span> },
  { key: "description", label: "Description", render: v => <span className="text-xs text-obsidian/70 font-body">{v || "—"}</span> },
  { key: "category", label: "Catégorie", render: v => <span className="text-[11px] text-obsidian/40 font-body">{v || "—"}</span> },
  { key: "amount", label: "Montant", align: "right", render: (v, r) => <span className={`font-heading text-sm font-bold ${r.type === "recette" ? "text-green-600" : r.type === "depense" ? "text-red-500" : "text-blue-600"}`}>{r.type === "depense" ? "-" : "+"}{Number(v||0).toLocaleString()} FCFA</span> },
  { key: "payment_method", label: "Mode", render: v => <span className="text-[10px] text-obsidian/40 font-body">{({cash:"Cash",virement:"Virement",cheque:"Chèque",mobile_money:"Mobile Money"})[v]||v||"—"}</span> },
  { key: "status", label: "Statut", align: "center", render: v => <span className={`text-[10px] px-2 py-0.5 rounded-full font-body ${{valide:"bg-green-50 text-green-700 border border-green-200",en_attente:"bg-amber-50 text-amber-600 border border-amber-200",annule:"bg-red-50 text-red-600 border border-red-200"}[v]||""}`}>{({valide:"Validé",en_attente:"En attente",annule:"Annulé"})[v]||v}</span> },
];

const EMPTY = { type: "recette", date: new Date().toISOString().split("T")[0], description: "", amount: 0, category: "", account: "", payment_method: "virement", reference: "", status: "valide" };

export default function AccountingTab({ entries, setEntries }) {
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const openAdd = () => { setEditing(null); setForm({...EMPTY}); };
  const openEdit = r => { setEditing(r); setForm({...r}); };
  const onChange = (k, v) => setForm(f => ({...f, [k]: v}));

  const save = async () => {
    if (!form?.description || !form?.amount) return;
    setSaving(true);
    const d = {...form, amount: +form.amount||0};
    if (editing) {
      await base44.entities.AccountEntry.update(editing.id, d);
      setEntries(prev => prev.map(e => e.id === editing.id ? {...e, ...d} : e));
    } else {
      const r = await base44.entities.AccountEntry.create(d);
      setEntries(prev => [r, ...prev]);
    }
    setSaving(false); setForm(null); setEditing(null);
  };

  const del = async r => {
    if (!confirm("Supprimer cette écriture ?")) return;
    await base44.entities.AccountEntry.delete(r.id);
    setEntries(prev => prev.filter(e => e.id !== r.id));
  };

  const totalRecettes = entries.filter(e => e.type === "recette" && e.status === "valide").reduce((s,e) => s+(e.amount||0), 0);
  const totalDepenses = entries.filter(e => e.type === "depense" && e.status === "valide").reduce((s,e) => s+(e.amount||0), 0);
  const solde = totalRecettes - totalDepenses;

  return (
    <>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-1"><TrendingUp className="w-4 h-4 text-green-600" /><span className="text-[10px] text-obsidian/40 font-body uppercase tracking-widest">Recettes</span></div>
          <p className="font-heading text-lg font-bold text-green-600">+{totalRecettes.toLocaleString()} FCFA</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-1"><TrendingDown className="w-4 h-4 text-red-500" /><span className="text-[10px] text-obsidian/40 font-body uppercase tracking-widest">Dépenses</span></div>
          <p className="font-heading text-lg font-bold text-red-500">-{totalDepenses.toLocaleString()} FCFA</p>
        </div>
        <div className={`bg-white rounded-xl p-4 border shadow-sm ${solde >= 0 ? "border-green-200" : "border-red-200"}`}>
          <div className="flex items-center gap-2 mb-1"><DollarSign className="w-4 h-4 text-obsidian/60" /><span className="text-[10px] text-obsidian/40 font-body uppercase tracking-widest">Solde</span></div>
          <p className={`font-heading text-lg font-bold ${solde >= 0 ? "text-green-600" : "text-red-500"}`}>{solde >= 0 ? "+" : ""}{solde.toLocaleString()} FCFA</p>
        </div>
      </div>
      <EntityTable title="Écritures comptables" subtitle={`${entries.length} écritures`} columns={COLUMNS} rows={entries} onAdd={openAdd} onEdit={openEdit} onDelete={del} addLabel="Nouvelle écriture" />
      {form && <EntityForm title="Écriture comptable" fields={FIELDS} data={form} onChange={onChange} onSave={save} onClose={() => { setForm(null); setEditing(null); }} saving={saving} isEdit={!!editing} />}
    </>
  );
}