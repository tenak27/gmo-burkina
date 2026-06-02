import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, X, Building2 } from "lucide-react";

const CATEGORIES = ["Terrain","Bâtiment","Matériel & outillage","Matériel informatique","Matériel de transport","Mobilier","Autre"];
const METHODS = ["Linéaire","Dégressif"];

function calcAmortissement(valeur, taux, methode, annees) {
  const rows = [];
  let vnc = valeur;
  for (let i = 1; i <= Math.min(annees, 10); i++) {
    const dotation = methode === "Linéaire" ? valeur * (taux / 100) : vnc * (taux * 2 / 100);
    const cumul = (rows[i-2]?.cumul||0) + dotation;
    vnc = valeur - cumul;
    rows.push({ annee: i, dotation: Math.round(dotation), cumul: Math.round(cumul), vnc: Math.round(Math.max(0,vnc)) });
  }
  return rows;
}

export default function ImmobilisationsModule() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ label:"", category:"Matériel & outillage", date_acquisition:"", valeur:0, taux:20, methode:"Linéaire", compte:"232" });
  const [saving, setSaving] = useState(false);
  const s = k=>v=>setForm(f=>({...f,[k]:v}));

  // Use JournalEntry with account starting with "2" as immobilisations proxy
  useEffect(()=>{
    base44.entities.JournalEntry.filter({journal_code:"OD"}).then(r=>{
      const immo = (r||[]).filter(e=>e.account_code?.startsWith("2"));
      setItems(immo);
    });
  },[]);

  const totalValeur = items.reduce((s,e)=>s+(e.debit||0),0);

  const save = async()=>{
    setSaving(true);
    const r = await base44.entities.JournalEntry.create({
      journal_code:"OD", date:form.date_acquisition||new Date().toISOString().split("T")[0],
      libelle: form.label, account_code: form.compte, account_label: form.category,
      debit: +form.valeur, credit:0, status:"valide",
      piece_ref: `IMMO-${Date.now()}`,
    });
    setItems(p=>[r,...p]);
    setShowForm(false); setSaving(false);
  };

  const rows = selected ? calcAmortissement(selected.debit||0, 20, "Linéaire", 5) : [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="font-heading text-base font-bold text-obsidian">Immobilisations</h3>
          <p className="text-xs text-obsidian/40 font-body mt-0.5">Actifs & plan d'amortissement OHADA (Classe 2)</p>
        </div>
        <button onClick={()=>setShowForm(true)}
          className="flex items-center gap-2 bg-gmo-green text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-gmo-green/90 cursor-pointer">
          <Plus className="w-3.5 h-3.5" /> Nouvelle immobilisation
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
          <p className="text-[10px] text-obsidian/40 uppercase tracking-wider font-body mb-1">Valeur brute totale</p>
          <p className="font-heading text-xl font-bold text-orange-600">{totalValeur.toLocaleString("fr-FR")} FCFA</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-[10px] text-obsidian/40 uppercase tracking-wider font-body mb-1">Nombre d'actifs</p>
          <p className="font-heading text-xl font-bold text-blue-600">{items.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead><tr className="bg-gray-50 border-b border-gray-100">
            {["Compte","Désignation","Date","Valeur brute","Actions"].map(h=>(
              <th key={h} className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
            ))}
          </tr></thead>
          <tbody className="divide-y divide-gray-50">
            {items.length===0 ? (
              <tr><td colSpan={5} className="py-10 text-center text-sm text-obsidian/30">Aucune immobilisation enregistrée</td></tr>
            ) : items.map(e=>(
              <tr key={e.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 font-mono text-sm font-bold text-obsidian">{e.account_code}</td>
                <td className="px-4 py-3 text-xs text-obsidian/80">{e.libelle}</td>
                <td className="px-4 py-3 text-xs text-obsidian/50">{e.date?new Date(e.date).toLocaleDateString("fr-FR"):"—"}</td>
                <td className="px-4 py-3 font-heading text-sm font-bold text-orange-600">{(e.debit||0).toLocaleString("fr-FR")} FCFA</td>
                <td className="px-4 py-3">
                  <button onClick={()=>setSelected(selected?.id===e.id?null:e)}
                    className="text-xs text-blue-600 hover:underline cursor-pointer">
                    {selected?.id===e.id?"Masquer":"Amortissement"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && rows.length > 0 && (
        <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 bg-blue-50 border-b border-blue-100">
            <p className="text-xs font-bold text-blue-700">Plan d'amortissement — {selected.libelle} (Méthode linéaire 20%)</p>
          </div>
          <table className="w-full">
            <thead><tr className="bg-gray-50">
              {["Année","Dotation","Amort. cumulé","VNC"].map(h=>(
                <th key={h} className="text-left px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {rows.map(r=>(
                <tr key={r.annee} className="hover:bg-gray-50/50">
                  <td className="px-4 py-2.5 text-xs text-obsidian font-semibold">N+{r.annee}</td>
                  <td className="px-4 py-2.5 text-xs font-bold text-red-500">{r.dotation.toLocaleString("fr-FR")}</td>
                  <td className="px-4 py-2.5 text-xs font-bold text-amber-600">{r.cumul.toLocaleString("fr-FR")}</td>
                  <td className="px-4 py-2.5 text-xs font-bold text-gmo-green">{r.vnc.toLocaleString("fr-FR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-heading text-base font-bold text-obsidian">Nouvelle immobilisation</h3>
              <button onClick={()=>setShowForm(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              {[["Désignation","label","text"],["Compte OHADA","compte","text"]].map(([l,k,t])=>(
                <div key={k}>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{l}</label>
                  <input type={t} value={form[k]||""} onChange={e=>s(k)(e.target.value)} placeholder={l}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gmo-green" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Catégorie</label>
                <select value={form.category} onChange={e=>s("category")(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gmo-green">
                  {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Valeur (FCFA)</label>
                  <input type="number" value={form.valeur||""} onChange={e=>s("valeur")(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gmo-green" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Date acquisition</label>
                  <input type="date" value={form.date_acquisition} onChange={e=>s("date_acquisition")(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gmo-green" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={()=>setShowForm(false)} className="flex-1 border border-gray-200 text-sm font-semibold text-gray-600 py-2.5 rounded-xl cursor-pointer">Annuler</button>
              <button onClick={save} disabled={saving||!form.label||!form.valeur}
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