import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import EntityTable from "./EntityTable";
import EntityForm from "./EntityForm";
import { TrendingUp, TrendingDown, DollarSign, BarChart2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const MONTHS = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];

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
  { key: "amount", label: "Montant", align: "right", render: (v, r) => (
    <span className={`font-heading text-sm font-bold ${r.type === "recette" ? "text-green-600" : r.type === "depense" ? "text-red-500" : "text-blue-600"}`}>
      {r.type === "depense" ? "−" : "+"}{Number(v||0).toLocaleString()} FCFA
    </span>
  )},
  { key: "payment_method", label: "Mode", render: v => <span className="text-[10px] text-obsidian/40 font-body">{({cash:"Cash",virement:"Virement",cheque:"Chèque",mobile_money:"Mobile Money"})[v]||v||"—"}</span> },
  { key: "status", label: "Statut", align: "center", render: v => (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-body ${{valide:"bg-green-50 text-green-700 border border-green-200",en_attente:"bg-amber-50 text-amber-600 border border-amber-200",annule:"bg-red-50 text-red-600 border border-red-200"}[v]||""}`}>
      {({valide:"Validé",en_attente:"En attente",annule:"Annulé"})[v]||v}
    </span>
  )},
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

  // Monthly chart data (last 6 months)
  const monthlyData = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      const m = d.getMonth(); const y = d.getFullYear();
      const rec = entries.filter(e => e.type === "recette" && e.status === "valide" && new Date(e.date || e.created_date).getMonth() === m && new Date(e.date || e.created_date).getFullYear() === y).reduce((s,e) => s+(e.amount||0), 0);
      const dep = entries.filter(e => e.type === "depense" && e.status === "valide" && new Date(e.date || e.created_date).getMonth() === m && new Date(e.date || e.created_date).getFullYear() === y).reduce((s,e) => s+(e.amount||0), 0);
      return { month: MONTHS[m], recettes: rec, depenses: dep };
    });
  }, [entries]);

  return (
    <div className="space-y-4 animate-fade-up">
      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-green-50 to-green-50/30 rounded-2xl p-4 border border-green-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-[10px] text-green-700/60 font-body uppercase tracking-widest">Recettes</span>
          </div>
          <p className="font-heading text-xl font-bold text-green-600">+{(totalRecettes/1000).toFixed(0)}k FCFA</p>
          <p className="text-[10px] text-green-700/40 font-body mt-0.5">{entries.filter(e=>e.type==="recette").length} écritures</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-50/30 rounded-2xl p-4 border border-red-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <TrendingDown className="w-4 h-4 text-red-500" />
            </div>
            <span className="text-[10px] text-red-600/60 font-body uppercase tracking-widest">Dépenses</span>
          </div>
          <p className="font-heading text-xl font-bold text-red-500">−{(totalDepenses/1000).toFixed(0)}k FCFA</p>
          <p className="text-[10px] text-red-600/40 font-body mt-0.5">{entries.filter(e=>e.type==="depense").length} écritures</p>
        </div>
        <div className={`bg-gradient-to-br ${solde >= 0 ? "from-gmo-green/8 to-gmo-green/3 border-gmo-green/15" : "from-red-50 to-red-50/30 border-red-100"} rounded-2xl p-4 border shadow-sm`}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <DollarSign className="w-4 h-4 text-obsidian/60" />
            </div>
            <span className="text-[10px] text-obsidian/40 font-body uppercase tracking-widest">Solde net</span>
          </div>
          <p className={`font-heading text-xl font-bold ${solde >= 0 ? "text-gmo-green" : "text-red-500"}`}>
            {solde >= 0 ? "+" : "−"}{(Math.abs(solde)/1000).toFixed(0)}k FCFA
          </p>
          <p className="text-[10px] text-obsidian/30 font-body mt-0.5">Recettes − Dépenses</p>
        </div>
      </div>

      {/* Monthly chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 className="w-4 h-4 text-obsidian/30" />
          <h3 className="font-heading text-sm font-bold text-obsidian">Flux mensuels</h3>
          <span className="text-[10px] text-obsidian/30 font-body">— 6 derniers mois</span>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={monthlyData} margin={{ top: 0, right: 5, left: -10, bottom: 0 }} barGap={3}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ fontSize: 10, borderRadius: 10, border: "1px solid #e5e7eb" }}
              formatter={v => `${Number(v).toLocaleString()} FCFA`}
            />
            <Bar dataKey="recettes" fill="#1A7A2E" fillOpacity={0.85} name="Recettes" radius={[4,4,0,0]} />
            <Bar dataKey="depenses" fill="#EF4444" fillOpacity={0.75} name="Dépenses" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <EntityTable
        title="Écritures comptables"
        subtitle={`${entries.length} écritures`}
        columns={COLUMNS} rows={entries}
        onAdd={openAdd} onEdit={openEdit} onDelete={del}
        addLabel="Nouvelle écriture"
      />
      {form && (
        <EntityForm
          title="Écriture comptable" fields={FIELDS} data={form} onChange={onChange}
          onSave={save} onClose={() => { setForm(null); setEditing(null); }}
          saving={saving} isEdit={!!editing}
        />
      )}
    </div>
  );
}