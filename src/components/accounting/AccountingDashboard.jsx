import React, { useMemo } from "react";
import { TrendingUp, TrendingDown, Clock, DollarSign, ArrowRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const MONTHS = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];

const MODULES = [
  { id:"journal",        label:"Journal comptable",  sub:"Saisie des écritures",    icon:"📒", color:"from-indigo-50 to-blue-50",    border:"border-indigo-100",  ic:"text-indigo-500",  bg:"bg-indigo-100" },
  { id:"grandlivre",     label:"Grand Livre",        sub:"Par compte",              icon:"📋", color:"from-purple-50 to-violet-50",  border:"border-purple-100",  ic:"text-purple-500",  bg:"bg-purple-100" },
  { id:"balance",        label:"Balance",            sub:"Débit / Crédit",          icon:"⚖️", color:"from-cyan-50 to-sky-50",       border:"border-cyan-100",    ic:"text-cyan-600",    bg:"bg-cyan-100" },
  { id:"plan",           label:"Plan comptable",     sub:"Gestion des comptes",     icon:"📚", color:"from-teal-50 to-green-50",     border:"border-teal-100",    ic:"text-teal-600",    bg:"bg-teal-100" },
  { id:"transactions",   label:"Transactions",       sub:"Flux financiers",         icon:"↔️", color:"from-blue-50 to-indigo-50",    border:"border-blue-100",    ic:"text-blue-500",    bg:"bg-blue-100" },
  { id:"rapports",       label:"Rapports",           sub:"Bilan / Résultat",        icon:"📊", color:"from-green-50 to-emerald-50",  border:"border-green-100",   ic:"text-emerald-600", bg:"bg-emerald-100" },
  { id:"rapprochement",  label:"Rapprochement",      sub:"Bancaire",                icon:"🔄", color:"from-amber-50 to-yellow-50",   border:"border-amber-100",   ic:"text-amber-600",   bg:"bg-amber-100" },
  { id:"immobilisations",label:"Immobilisations",    sub:"Actifs & amortissements", icon:"🏢", color:"from-orange-50 to-amber-50",   border:"border-orange-100",  ic:"text-orange-500",  bg:"bg-orange-100" },
  { id:"cheques",        label:"Gestion chèques",    sub:"Émis & reçus",            icon:"🪙", color:"from-red-50 to-pink-50",       border:"border-red-100",     ic:"text-red-500",     bg:"bg-red-100" },
];

export default function AccountingDashboard({ entries, invoices, setActiveModule, openYear }) {
  const totalEncaisse = (invoices||[]).filter(i=>i.status==="paye").reduce((s,i)=>s+(i.total||0),0);
  const totalDepenses = (entries||[]).filter(e=>e.account_code?.startsWith("6")&&e.status==="valide").reduce((s,e)=>s+(e.debit||0),0);
  const creancesImpayees = (invoices||[]).filter(i=>i.status==="envoye"||i.status==="partiel").reduce((s,i)=>s+(i.total||0),0);
  const creancesCount = (invoices||[]).filter(i=>i.status==="envoye"||i.status==="partiel").length;
  const totalVentes = (entries||[]).filter(e=>e.account_code?.startsWith("7")&&e.status==="valide").reduce((s,e)=>s+(e.credit||0),0);
  const resultatNet = totalVentes - totalDepenses;

  // Monthly cash-in
  const monthlyData = useMemo(()=>{
    const now = new Date();
    return Array.from({length:6},(_,i)=>{
      const d = new Date(now.getFullYear(), now.getMonth()-5+i, 1);
      const m = d.getMonth(); const y = d.getFullYear();
      const v = (entries||[]).filter(e=>e.account_code?.startsWith("5")&&new Date(e.date).getMonth()===m&&new Date(e.date).getFullYear()===y).reduce((s,e)=>s+(e.debit||0),0);
      const encaisse = (invoices||[]).filter(inv=>inv.status==="paye"&&new Date(inv.date||inv.created_date).getMonth()===m&&new Date(inv.date||inv.created_date).getFullYear()===y).reduce((s,inv)=>s+(inv.total||0),0);
      return { month: MONTHS[m], value: encaisse };
    });
  },[entries,invoices]);

  // Last entries
  const lastEntries = [...(entries||[])].sort((a,b)=>new Date(b.created_date)-new Date(a.created_date)).slice(0,5);

  const kpis = [
    { label:"Revenus encaissés", val:totalEncaisse, icon:TrendingUp, color:"text-gmo-green", bg:"bg-green-50", border:"border-green-100" },
    { label:"Dépenses", val:totalDepenses, icon:TrendingDown, color:"text-red-500", bg:"bg-red-50", border:"border-red-100" },
    { label:"Créances impayées", val:creancesImpayees, icon:Clock, color:"text-amber-600", bg:"bg-amber-50", border:"border-amber-100", sub:`${creancesCount} facture(s)` },
    { label:"Résultat net", val:resultatNet, icon:DollarSign, color:resultatNet>=0?"text-gmo-green":"text-red-500", bg:"bg-blue-50", border:"border-blue-100" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading text-xl font-bold text-obsidian">Comptabilité</h2>
        <p className="text-xs text-obsidian/40 font-body mt-0.5">
          Vue d'ensemble financière et comptable
          {openYear && <span className="ml-2 text-gmo-green font-semibold">• {openYear.label}</span>}
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k=>{
          const Icon = k.icon;
          return (
            <div key={k.label} className={`bg-white rounded-2xl border ${k.border} shadow-sm p-5`}>
              <div className={`w-9 h-9 rounded-xl ${k.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-4 h-4 ${k.color}`} />
              </div>
              <p className={`font-heading text-xl font-bold ${k.color}`}>{k.val.toLocaleString("fr-FR")} FCFA</p>
              <p className="text-xs text-obsidian/50 font-body mt-0.5">{k.label}</p>
              {k.sub && <p className="text-[11px] text-obsidian/30 font-body">{k.sub}</p>}
            </div>
          );
        })}
      </div>

      {/* Chart + Last entries */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-heading text-sm font-bold text-obsidian mb-4">Encaissements — 6 derniers mois</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={monthlyData} margin={{left:-20}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{fontSize:11,fill:"#9ca3af"}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize:10,fill:"#9ca3af"}} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{fontSize:11,borderRadius:10}} formatter={v=>`${Number(v).toLocaleString()} FCFA`} />
              <Bar dataKey="value" fill="#6366f1" radius={[4,4,0,0]} name="Encaissements" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-sm font-bold text-obsidian">Dernières écritures</h3>
            <button onClick={()=>setActiveModule("journal")} className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer">
              Journal <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          {lastEntries.length===0 ? (
            <div className="py-6 text-center text-sm text-obsidian/30">Aucune écriture</div>
          ) : (
            <div className="space-y-3">
              {lastEntries.map(e=>(
                <div key={e.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-obsidian truncate">{e.libelle}</p>
                    <p className="text-[10px] text-obsidian/40 font-body">{e.account_code} / {e.journal_code || "OD"}</p>
                  </div>
                  <p className={`text-sm font-bold font-heading whitespace-nowrap ${e.debit>0?"text-indigo-600":"text-gmo-green"}`}>
                    {(e.debit||e.credit||0).toLocaleString("fr-FR")} FCFA
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Module grid */}
      <div>
        <h3 className="font-heading text-sm font-bold text-obsidian mb-4">Modules comptables</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {MODULES.map(mod=>(
            <button key={mod.id} onClick={()=>setActiveModule(mod.id)}
              className={`bg-gradient-to-br ${mod.color} border ${mod.border} rounded-2xl p-4 text-left hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group`}>
              <div className={`w-9 h-9 rounded-xl ${mod.bg} flex items-center justify-center mb-3 text-lg`}>
                {mod.icon}
              </div>
              <p className={`text-sm font-bold text-obsidian group-hover:${mod.ic} transition-colors`}>{mod.label}</p>
              <p className="text-[11px] text-obsidian/40 font-body mt-0.5">{mod.sub}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}