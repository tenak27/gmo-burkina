import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import EntityTable from "./EntityTable";
import EntityForm from "./EntityForm";
import { AlertTriangle, CheckCircle2, Clock, TrendingUp } from "lucide-react";

const STATUS_STYLE = {
  en_cours: "bg-blue-50 text-blue-600 border border-blue-200",
  en_retard: "bg-red-50 text-red-600 border border-red-200",
  soldee: "bg-green-50 text-green-700 border border-green-200",
  contentieux: "bg-gray-100 text-obsidian/50",
};

const FIELDS = [
  { key: "client_name", label: "Client", type: "client_select", required: true },
  { key: "invoice_number", label: "N° Facture" },
  { key: "original_amount", label: "Montant original (FCFA)", type: "number", required: true },
  { key: "paid_amount", label: "Montant payé (FCFA)", type: "number" },
  { key: "remaining_amount", label: "Reste à payer (FCFA)", type: "number" },
  { key: "due_date", label: "Date d'échéance", type: "date" },
  { key: "status", label: "Statut", type: "select", options: [
    {value:"en_cours",label:"En cours"},{value:"en_retard",label:"En retard"},
    {value:"soldee",label:"Soldée"},{value:"contentieux",label:"Contentieux"}
  ]},
  { key: "notes", label: "Notes", type: "textarea" },
];

const COLUMNS = [
  { key: "client_name", label: "Client", render: v => <span className="font-heading text-xs font-bold text-obsidian">{v||"—"}</span> },
  { key: "invoice_number", label: "Facture", render: v => <span className="text-xs text-obsidian/50 font-body">{v||"—"}</span> },
  { key: "original_amount", label: "Montant", align:"right", render: v => <span className="font-heading text-xs font-bold text-obsidian">{Number(v||0).toLocaleString()} FCFA</span> },
  { key: "paid_amount", label: "Payé", align:"right", render: v => <span className="text-xs text-green-600 font-heading font-bold">{Number(v||0).toLocaleString()}</span> },
  { key: "remaining_amount", label: "Reste", align:"right", render: (v, r) => {
    const reste = v || ((r.original_amount||0) - (r.paid_amount||0));
    return <span className={`font-heading text-xs font-bold ${reste > 0 ? "text-gmo-red" : "text-green-600"}`}>{Number(reste).toLocaleString()} FCFA</span>;
  }},
  { key: "due_date", label: "Échéance", render: v => {
    if (!v) return <span className="text-obsidian/20">—</span>;
    const isLate = new Date(v) < new Date();
    return <span className={`text-xs font-body ${isLate ? "text-red-500 font-semibold" : "text-obsidian/50"}`}>{new Date(v).toLocaleDateString("fr-FR")}{isLate ? " ⚠️" : ""}</span>;
  }},
  { key: "status", label: "Statut", align:"center", render: v => (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-body ${STATUS_STYLE[v]||""}`}>
      {({en_cours:"En cours",en_retard:"En retard",soldee:"Soldée",contentieux:"Contentieux"})[v]||v}
    </span>
  )},
];

const EMPTY = { client_name:"", invoice_number:"", original_amount:0, paid_amount:0, remaining_amount:0, due_date:"", status:"en_cours", notes:"" };

export default function ReceivablesTab({ receivables, setReceivables, clients = [] }) {
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const openAdd = () => { setEditing(null); setForm({...EMPTY}); };
  const openEdit = r => { setEditing(r); setForm({...r}); };
  const onChange = (k, v) => setForm(f => {
    const nf = {...f, [k]: v};
    if (k === "paid_amount" || k === "original_amount") {
      nf.remaining_amount = Math.max(0, (parseFloat(nf.original_amount)||0) - (parseFloat(nf.paid_amount)||0));
      if (nf.remaining_amount === 0) nf.status = "soldee";
    }
    return nf;
  });

  const save = async () => {
    if (!form?.client_name) return;
    setSaving(true);
    const d = {...form, original_amount:+form.original_amount||0, paid_amount:+form.paid_amount||0, remaining_amount:+form.remaining_amount||0};
    if (editing) {
      await base44.entities.Receivable.update(editing.id, d);
      setReceivables(prev => prev.map(r => r.id === editing.id ? {...r, ...d} : r));
    } else {
      const r = await base44.entities.Receivable.create(d);
      setReceivables(prev => [r, ...prev]);
    }
    setSaving(false); setForm(null); setEditing(null);
  };

  const del = async r => {
    if (!confirm("Supprimer cette créance ?")) return;
    await base44.entities.Receivable.delete(r.id);
    setReceivables(prev => prev.filter(rc => rc.id !== r.id));
  };

  const totalCreances = receivables.filter(r => r.status !== "soldee").reduce((s,r) => s+(r.remaining_amount||0), 0);
  const enRetard = receivables.filter(r => r.status === "en_retard").length;
  const soldees = receivables.filter(r => r.status === "soldee").length;

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Créances actives", value: `${(totalCreances/1000).toFixed(0)}k FCFA`, grad:"from-red-500 to-rose-600" },
          { label: "En retard", value: enRetard, grad:"from-orange-400 to-amber-500" },
          { label: "Soldées", value: soldees, grad:"from-green-500 to-emerald-600" },
        ].map(k => (
          <div key={k.label} className={`bg-gradient-to-br ${k.grad} rounded-2xl p-4 shadow-md relative overflow-hidden`}>
            <div className="absolute top-1 right-2 text-white/20 text-3xl select-none pointer-events-none">○</div>
            <p className="font-heading text-2xl font-bold text-white">{k.value}</p>
            <p className="text-[11px] text-white/70 font-body mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>
      <EntityTable
        title="Gestion des créances"
        subtitle={`${receivables.length} créances · ${enRetard} en retard`}
        columns={COLUMNS} rows={receivables}
        onAdd={openAdd} onEdit={openEdit} onDelete={del}
        addLabel="Nouvelle créance"
      />
      {form && (
        <EntityForm
          title="Créance client" fields={FIELDS} data={form} onChange={onChange}
          onSave={save} onClose={() => { setForm(null); setEditing(null); }}
          saving={saving} isEdit={!!editing} clients={clients}
        />
      )}
    </div>
  );
}