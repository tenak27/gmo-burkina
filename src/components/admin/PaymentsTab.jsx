import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import EntityTable from "./EntityTable";
import EntityForm from "./EntityForm";
import { DollarSign, CreditCard, Smartphone, Banknote, Clock, CheckCircle2, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const METHOD_CONFIG = {
  especes: { label: "Espèces", icon: "💵", color: "bg-green-50 text-green-700 border border-green-200" },
  cheque: { label: "Chèque", icon: "📄", color: "bg-blue-50 text-blue-600 border border-blue-200" },
  mobile_money: { label: "Mobile Money", icon: "📱", color: "bg-purple-50 text-purple-600 border border-purple-200" },
  virement: { label: "Virement", icon: "🏦", color: "bg-cyan-50 text-cyan-600 border border-cyan-200" },
  credit: { label: "Crédit", icon: "💳", color: "bg-amber-50 text-amber-600 border border-amber-200" },
  partiel: { label: "Partiel", icon: "⚡", color: "bg-orange-50 text-orange-600 border border-orange-200" },
};

const STATUS_STYLE = {
  en_attente: "bg-amber-50 text-amber-600 border border-amber-200",
  valide: "bg-green-50 text-green-700 border border-green-200",
  rejete: "bg-red-50 text-red-600 border border-red-200",
  rembourse: "bg-gray-100 text-obsidian/50",
};

const FIELDS = [
  { key: "reference", label: "Référence" },
  { key: "client_name", label: "Client", required: true },
  { key: "invoice_number", label: "N° Facture liée" },
  { key: "amount", label: "Montant (FCFA)", type: "number", required: true },
  { key: "payment_method", label: "Mode de paiement", type: "select", required: true, options: Object.entries(METHOD_CONFIG).map(([v,c]) => ({value:v,label:c.label})) },
  { key: "date", label: "Date", type: "date" },
  { key: "due_date", label: "Date d'échéance", type: "date" },
  { key: "cheque_number", label: "N° Chèque" },
  { key: "mobile_number", label: "N° Mobile Money" },
  { key: "status", label: "Statut", type: "select", options: [{value:"en_attente",label:"En attente"},{value:"valide",label:"Validé"},{value:"rejete",label:"Rejeté"},{value:"rembourse",label:"Remboursé"}] },
  { key: "notes", label: "Notes", type: "textarea" },
];

const COLUMNS = [
  { key: "reference", label: "Réf.", render: (v, r) => (
    <div>
      <p className="font-heading text-xs font-bold text-obsidian">{v || `PAY-${r.id?.slice(-6)}`}</p>
      {r.invoice_number && <p className="text-[10px] text-obsidian/35 font-body">{r.invoice_number}</p>}
    </div>
  )},
  { key: "client_name", label: "Client", render: v => <span className="text-xs text-obsidian/70 font-body">{v||"—"}</span> },
  { key: "payment_method", label: "Mode", render: v => {
    const m = METHOD_CONFIG[v];
    return <span className={`text-[10px] px-2 py-0.5 rounded-full font-body ${m?.color||""}`}>{m?.icon} {m?.label||v}</span>;
  }},
  { key: "amount", label: "Montant", align: "right", render: v => <span className="font-heading text-xs font-bold text-obsidian">{Number(v||0).toLocaleString()} FCFA</span> },
  { key: "date", label: "Date", render: v => <span className="text-xs text-obsidian/50 font-body">{v ? new Date(v).toLocaleDateString("fr-FR") : "—"}</span> },
  { key: "status", label: "Statut", align: "center", render: v => (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-body ${STATUS_STYLE[v]||""}`}>
      {({en_attente:"En attente",valide:"Validé",rejete:"Rejeté",rembourse:"Remboursé"})[v]||v}
    </span>
  )},
];

const EMPTY = { reference:"", client_name:"", invoice_number:"", amount:0, payment_method:"especes", date: new Date().toISOString().split("T")[0], due_date:"", cheque_number:"", mobile_number:"", status:"en_attente", notes:"" };

export default function PaymentsTab({ payments, setPayments }) {
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const openAdd = () => {
    setEditing(null);
    setForm({...EMPTY, reference: `PAY-${Date.now().toString().slice(-6)}`});
  };
  const openEdit = r => { setEditing(r); setForm({...r}); };
  const onChange = (k, v) => setForm(f => ({...f, [k]: v}));

  const save = async () => {
    if (!form?.client_name || !form?.amount) return;
    setSaving(true);
    const d = {...form, amount: +form.amount||0};
    if (editing) {
      await base44.entities.Payment.update(editing.id, d);
      setPayments(prev => prev.map(p => p.id === editing.id ? {...p, ...d} : p));
    } else {
      const r = await base44.entities.Payment.create(d);
      setPayments(prev => [r, ...prev]);
    }
    setSaving(false); setForm(null); setEditing(null);
  };

  const del = async r => {
    if (!confirm("Supprimer ce paiement ?")) return;
    await base44.entities.Payment.delete(r.id);
    setPayments(prev => prev.filter(p => p.id !== r.id));
  };

  const totalValid = payments.filter(p => p.status === "valide").reduce((s,p) => s+(p.amount||0), 0);
  const totalPending = payments.filter(p => p.status === "en_attente").reduce((s,p) => s+(p.amount||0), 0);

  const methodStats = useMemo(() => Object.entries(METHOD_CONFIG).map(([k, c]) => ({
    name: c.label,
    total: payments.filter(p => p.payment_method === k && p.status === "valide").reduce((s,p) => s+(p.amount||0), 0),
  })).filter(m => m.total > 0), [payments]);

  return (
    <div className="space-y-4 animate-fade-up">
      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Encaissé", value: `${(totalValid/1000).toFixed(0)}k`, unit:"FCFA", color:"text-green-600", bg:"from-green-50 to-green-50/20", border:"border-green-100" },
          { label: "En attente", value: `${(totalPending/1000).toFixed(0)}k`, unit:"FCFA", color:"text-amber-500", bg:"from-amber-50 to-amber-50/20", border:"border-amber-100" },
          { label: "Paiements validés", value: payments.filter(p=>p.status==="valide").length, unit:"", color:"text-blue-600", bg:"from-blue-50 to-blue-50/20", border:"border-blue-100" },
          { label: "Total paiements", value: payments.length, unit:"", color:"text-obsidian/60", bg:"from-gray-50 to-gray-50/20", border:"border-gray-100" },
        ].map(k => (
          <div key={k.label} className={`bg-gradient-to-br ${k.bg} border ${k.border} rounded-2xl p-4`}>
            <p className={`font-heading text-2xl font-bold ${k.color}`}>{k.value} <span className="text-sm">{k.unit}</span></p>
            <p className="text-[11px] text-obsidian/40 font-body mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Method chart */}
      {methodStats.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-heading text-sm font-bold text-obsidian mb-4">Encaissements par mode de paiement</h3>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={methodStats} margin={{top:0,right:5,left:-10,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{fontSize:10, fill:"#9ca3af"}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize:9, fill:"#9ca3af"}} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{fontSize:10, borderRadius:10}} formatter={v=>`${Number(v).toLocaleString()} FCFA`} />
              <Bar dataKey="total" fill="#1A7A2E" fillOpacity={0.8} name="Encaissé" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <EntityTable
        title="Historique des paiements"
        subtitle={`${payments.length} paiements`}
        columns={COLUMNS} rows={payments}
        onAdd={openAdd} onEdit={openEdit} onDelete={del}
        addLabel="Enregistrer un paiement"
      />
      {form && (
        <EntityForm
          title="Paiement" fields={FIELDS} data={form} onChange={onChange}
          onSave={save} onClose={() => { setForm(null); setEditing(null); }}
          saving={saving} isEdit={!!editing}
        />
      )}
    </div>
  );
}