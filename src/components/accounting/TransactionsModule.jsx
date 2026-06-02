import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Search, ArrowUpRight, ArrowDownLeft, RefreshCw, X } from "lucide-react";

const TYPE_CFG = {
  recette:  { label:"Recette",  color:"text-green-600",  bg:"bg-green-50",  border:"border-green-200" },
  depense:  { label:"Dépense",  color:"text-red-500",    bg:"bg-red-50",    border:"border-red-200" },
  virement: { label:"Virement", color:"text-blue-600",   bg:"bg-blue-50",   border:"border-blue-200" },
};

const PAY_METHODS = ["cash","virement","cheque","mobile_money"];

export default function TransactionsModule() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type:"recette", description:"", amount:0, date:new Date().toISOString().split("T")[0], category:"", payment_method:"virement", reference:"" });
  const [saving, setSaving] = useState(false);

  useEffect(()=>{
    base44.entities.AccountEntry.list("-date",200).then(r=>{setEntries(r||[]);setLoading(false);});
  },[]);

  const s = k=>v=>setForm(f=>({...f,[k]:v}));

  const save = async()=>{
    setSaving(true);
    const r = await base44.entities.AccountEntry.create({...form,amount:+form.amount,status:"valide"});
    setEntries(p=>[r,...p]);
    setShowForm(false); setSaving(false);
    setForm({type:"recette",description:"",amount:0,date:new Date().toISOString().split("T")[0],category:"",payment_method:"virement",reference:""});
  };

  const filtered = entries.filter(e=>!search||e.description?.toLowerCase().includes(search.toLowerCase())||e.reference?.includes(search));
  const totalRecettes = entries.filter(e=>e.type==="recette"&&e.status==="valide").reduce((s,e)=>s+(e.amount||0),0);
  const totalDepenses = entries.filter(e=>e.type==="depense"&&e.status==="valide").reduce((s,e)=>s+(e.amount||0),0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="font-heading text-base font-bold text-obsidian">Transactions — Flux financiers</h3>
          <p className="text-xs text-obsidian/40 font-body mt-0.5">Recettes, dépenses et virements</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher…"
              className="pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-gmo-green w-44" />
          </div>
          <button onClick={()=>setShowForm(true)}
            className="flex items-center gap-2 bg-gmo-green text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-gmo-green/90 cursor-pointer">
            <Plus className="w-3.5 h-3.5" /> Nouvelle transaction
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          {label:"Total recettes", val:totalRecettes, color:"text-green-600", bg:"bg-green-50"},
          {label:"Total dépenses", val:totalDepenses, color:"text-red-500", bg:"bg-red-50"},
          {label:"Solde net", val:totalRecettes-totalDepenses, color:(totalRecettes-totalDepenses)>=0?"text-gmo-green":"text-red-500", bg:"bg-blue-50"},
        ].map(k=>(
          <div key={k.label} className={`${k.bg} rounded-xl p-4 border border-gray-100`}>
            <p className="text-[10px] text-obsidian/40 uppercase tracking-wider font-body mb-1">{k.label}</p>
            <p className={`font-heading text-lg font-bold ${k.color}`}>{k.val.toLocaleString("fr-FR")} FCFA</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead><tr className="bg-gray-50 border-b border-gray-100">
              {["Date","Type","Description","Référence","Méthode","Montant","Statut"].map(h=>(
                <th key={h} className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length===0 ? (
                <tr><td colSpan={7} className="py-10 text-center text-sm text-obsidian/30">Aucune transaction</td></tr>
              ) : filtered.map(e=>{
                const cfg = TYPE_CFG[e.type]||TYPE_CFG.recette;
                return (
                  <tr key={e.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 text-xs text-obsidian/60 font-body">{e.date?new Date(e.date).toLocaleDateString("fr-FR"):"—"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${cfg.color} ${cfg.bg} ${cfg.border}`}>{cfg.label}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-obsidian/80 max-w-[180px] truncate">{e.description||"—"}</td>
                    <td className="px-4 py-3 text-[11px] text-obsidian/40 font-mono">{e.reference||"—"}</td>
                    <td className="px-4 py-3 text-xs text-obsidian/50 capitalize">{e.payment_method||"—"}</td>
                    <td className={`px-4 py-3 font-heading text-sm font-bold ${e.type==="depense"?"text-red-500":"text-green-600"}`}>
                      {e.type==="depense"?"-":"+"}{ (e.amount||0).toLocaleString("fr-FR")}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-body ${{valide:"bg-green-50 text-green-700",en_attente:"bg-amber-50 text-amber-700",annule:"bg-gray-100 text-gray-500"}[e.status]||""}`}>
                        {({valide:"Validé",en_attente:"Attente",annule:"Annulé"})[e.status]||e.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-heading text-base font-bold text-obsidian">Nouvelle transaction</h3>
              <button onClick={()=>setShowForm(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Type</label>
                <div className="flex gap-2">
                  {Object.entries(TYPE_CFG).map(([k,v])=>(
                    <button key={k} onClick={()=>s("type")(k)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${form.type===k?`${v.bg} ${v.color} ${v.border}`:"bg-gray-50 text-gray-500 border-gray-200"}`}>
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
              {[["Description","description","text"],["Référence","reference","text"],["Catégorie","category","text"]].map(([l,k,t])=>(
                <div key={k}>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{l}</label>
                  <input type={t} value={form[k]||""} onChange={e=>s(k)(e.target.value)} placeholder={l}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gmo-green" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Montant (FCFA)</label>
                  <input type="number" value={form.amount||""} onChange={e=>s("amount")(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gmo-green" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Date</label>
                  <input type="date" value={form.date} onChange={e=>s("date")(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gmo-green" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Méthode de paiement</label>
                <select value={form.payment_method} onChange={e=>s("payment_method")(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gmo-green">
                  {PAY_METHODS.map(m=><option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={()=>setShowForm(false)} className="flex-1 border border-gray-200 text-sm font-semibold text-gray-600 py-2.5 rounded-xl cursor-pointer">Annuler</button>
              <button onClick={save} disabled={saving||!form.description||!form.amount}
                className="flex-1 bg-gmo-green text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-gmo-green/90 cursor-pointer disabled:opacity-50">
                {saving?"…":"Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}