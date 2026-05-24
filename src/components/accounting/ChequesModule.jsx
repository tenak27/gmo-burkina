import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, X, CreditCard, AlertTriangle } from "lucide-react";

const TYPE_CFG = {
  emis:  { label:"Émis",  color:"text-red-500",   bg:"bg-red-50",   border:"border-red-200" },
  recu:  { label:"Reçu",  color:"text-green-600", bg:"bg-green-50", border:"border-green-200" },
};

export default function ChequesModule({ invoices = [] }) {
  const [cheques, setCheques] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type:"emis", cheque_number:"", amount:0, date:"", beneficiaire:"", banque:"", notes:"", status:"en_attente" });
  const [saving, setSaving] = useState(false);
  const s = k=>v=>setForm(f=>({...f,[k]:v}));

  useEffect(()=>{
    // Load payments with cheque method
    base44.entities.Payment.filter({payment_method:"cheque"}).then(r=>setCheques(r||[]));
  },[]);

  const save = async()=>{
    setSaving(true);
    const r = await base44.entities.Payment.create({
      client_name: form.beneficiaire, amount:+form.amount, payment_method:"cheque",
      date: form.date, cheque_number: form.cheque_number, notes: form.notes, status: form.status,
    });
    setCheques(p=>[r,...p]); setShowForm(false); setSaving(false);
  };

  const totalEmis = cheques.filter(c=>c.status!=="rejete").reduce((s,c)=>s+(c.amount||0),0);
  const enAttente = cheques.filter(c=>c.status==="en_attente").length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="font-heading text-base font-bold text-obsidian">Gestion des chèques</h3>
          <p className="text-xs text-obsidian/40 font-body mt-0.5">Chèques émis & reçus</p>
        </div>
        <button onClick={()=>setShowForm(true)}
          className="flex items-center gap-2 bg-gmo-green text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-gmo-green/90 cursor-pointer">
          <Plus className="w-3.5 h-3.5" /> Enregistrer un chèque
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          {l:"Total chèques",v:cheques.length,c:"text-obsidian"},
          {l:"En attente",v:enAttente,c:"text-amber-600"},
          {l:"Montant total",v:totalEmis,c:"text-gmo-green",fcfa:true},
        ].map(k=>(
          <div key={k.l} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <p className="text-[10px] text-obsidian/40 uppercase tracking-wider font-body mb-1">{k.l}</p>
            <p className={`font-heading text-lg font-bold ${k.c}`}>{k.fcfa?k.v.toLocaleString("fr-FR")+" FCFA":k.v}</p>
          </div>
        ))}
      </div>

      {enAttente > 0 && (
        <div className="flex items-center gap-3 px-5 py-3 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-700 font-semibold">{enAttente} chèque(s) en attente d'encaissement</p>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead><tr className="bg-gray-50 border-b border-gray-100">
            {["Date","N° Chèque","Bénéficiaire/Émetteur","Montant","Statut"].map(h=>(
              <th key={h} className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
            ))}
          </tr></thead>
          <tbody className="divide-y divide-gray-50">
            {cheques.length===0 ? (
              <tr><td colSpan={5} className="py-10 text-center text-sm text-obsidian/30">Aucun chèque enregistré</td></tr>
            ) : cheques.map(c=>(
              <tr key={c.id} className="hover:bg-gray-50/50">
                <td className="px-4 py-3 text-xs text-obsidian/60">{c.date?new Date(c.date).toLocaleDateString("fr-FR"):"—"}</td>
                <td className="px-4 py-3 font-mono text-xs font-bold text-obsidian">{c.cheque_number||"—"}</td>
                <td className="px-4 py-3 text-xs text-obsidian/80">{c.client_name||"—"}</td>
                <td className="px-4 py-3 font-heading text-sm font-bold text-obsidian">{(c.amount||0).toLocaleString("fr-FR")} FCFA</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-body ${{en_attente:"bg-amber-50 text-amber-700",valide:"bg-green-50 text-green-700",rejete:"bg-red-50 text-red-600",rembourse:"bg-purple-50 text-purple-600"}[c.status]||""}`}>
                    {({en_attente:"En attente",valide:"Validé",rejete:"Rejeté",rembourse:"Remboursé"})[c.status]||c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-heading text-base font-bold text-obsidian">Enregistrer un chèque</h3>
              <button onClick={()=>setShowForm(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              {[["N° Chèque","cheque_number","text"],["Bénéficiaire / Émetteur","beneficiaire","text"],["Banque","banque","text"],["Notes","notes","text"]].map(([l,k,t])=>(
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
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={()=>setShowForm(false)} className="flex-1 border border-gray-200 text-sm font-semibold text-gray-600 py-2.5 rounded-xl cursor-pointer">Annuler</button>
              <button onClick={save} disabled={saving||!form.beneficiaire||!form.amount}
                className="flex-1 bg-gmo-green text-white text-sm font-semibold py-2.5 rounded-xl cursor-pointer disabled:opacity-50">
                {saving?"…":"Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}