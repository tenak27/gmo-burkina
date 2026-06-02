import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, Loader2 } from "lucide-react";
import AccountingDashboard from "./AccountingDashboard";
import JournalTab from "./JournalTab";
import GrandLivre from "./GrandLivre";
import BalanceSheet from "./BalanceSheet";
import OhadaPlanComptes from "./OhadaPlanComptes";
import OhadaAgentPanel from "./OhadaAgentPanel";
import TransactionsModule from "./TransactionsModule";
import RapprochementModule from "./RapprochementModule";
import ImmobilisationsModule from "./ImmobilisationsModule";
import ChequesModule from "./ChequesModule";

const MODULE_LABELS = {
  dashboard: "Vue d'ensemble",
  journal: "Journal comptable",
  grandlivre: "Grand Livre",
  balance: "Balance",
  plan: "Plan comptable",
  transactions: "Transactions",
  rapports: "États financiers",
  rapprochement: "Rapprochement bancaire",
  immobilisations: "Immobilisations",
  cheques: "Gestion chèques",
};

// Simple balance view
function BalanceModule({ entries }) {
  const byAccount = useMemo(()=>{
    const map={};
    for (const e of entries) {
      const c=e.account_code||"???";
      if(!map[c]) map[c]={code:c,label:e.account_label||"",debit:0,credit:0};
      map[c].debit+=e.debit||0; map[c].credit+=e.credit||0;
    }
    return Object.values(map).sort((a,b)=>a.code.localeCompare(b.code));
  },[entries]);
  const totalD=byAccount.reduce((s,a)=>s+a.debit,0);
  const totalC=byAccount.reduce((s,a)=>s+a.credit,0);
  const isBalanced=Math.abs(totalD-totalC)<1;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="font-heading text-base font-bold text-obsidian">Balance générale</h3>
          <p className="text-xs text-obsidian/40 font-body mt-0.5">Solde débit/crédit par compte SYSCOHADA</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold ${isBalanced?"bg-green-50 border-green-200 text-green-700":"bg-red-50 border-red-200 text-red-600"}`}>
          {isBalanced?"✓ Balance équilibrée":`⚠ Écart : ${Math.abs(totalD-totalC).toLocaleString()} FCFA`}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead><tr className="bg-gray-50 border-b border-gray-100">
              {["Compte","Libellé","Débit","Crédit","Solde débiteur","Solde créditeur"].map(h=>(
                <th key={h} className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {byAccount.length===0?(
                <tr><td colSpan={6} className="py-10 text-center text-sm text-obsidian/30">Aucune donnée</td></tr>
              ):byAccount.map(a=>{
                const solde=a.debit-a.credit;
                return (
                  <tr key={a.code} className="hover:bg-gray-50/50">
                    <td className="px-4 py-2.5 font-mono text-sm font-bold text-obsidian">{a.code}</td>
                    <td className="px-4 py-2.5 text-xs text-obsidian/70">{a.label}</td>
                    <td className="px-4 py-2.5 text-sm font-bold text-blue-600 text-right">{a.debit.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-sm font-bold text-red-500 text-right">{a.credit.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-sm font-bold text-obsidian text-right">{solde>0?solde.toLocaleString():"—"}</td>
                    <td className="px-4 py-2.5 text-sm font-bold text-obsidian text-right">{solde<0?Math.abs(solde).toLocaleString():"—"}</td>
                  </tr>
                );
              })}
            </tbody>
            {byAccount.length>0&&(
              <tfoot>
                <tr className="bg-obsidian/5 border-t-2 border-gray-200">
                  <td colSpan={2} className="px-4 py-2.5 text-xs font-bold text-obsidian">TOTAUX</td>
                  <td className="px-4 py-2.5 text-sm font-bold text-blue-600 text-right">{totalD.toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-sm font-bold text-red-500 text-right">{totalC.toLocaleString()}</td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}

export default function OhadaAccountingModule({ invoices = [], entries: propEntries = [], setEntries: setPropEntries }) {
  const [activeModule, setActiveModule] = useState("dashboard");
  const [fiscalYears, setFiscalYears] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    loadData();
  },[]);

  const loadData = async()=>{
    setLoading(true);
    const [years, jEntries] = await Promise.all([
      base44.entities.FiscalYear.list("-year",20),
      base44.entities.JournalEntry.list("-date",500),
    ]);
    setFiscalYears(years||[]);
    setJournalEntries(jEntries||[]);
    setLoading(false);
  };

  const openYear = fiscalYears.find(y=>y.status==="ouvert");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-gmo-green animate-spin" />
        <span className="ml-3 text-sm text-obsidian/50 font-body">Chargement…</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      {activeModule !== "dashboard" && (
        <div className="flex items-center gap-2">
          <button onClick={()=>setActiveModule("dashboard")}
            className="flex items-center gap-1.5 text-xs text-obsidian/50 hover:text-gmo-green transition-colors cursor-pointer font-body">
            <ArrowLeft className="w-3.5 h-3.5" /> Comptabilité
          </button>
          <span className="text-obsidian/20">/</span>
          <span className="text-xs font-semibold text-obsidian">{MODULE_LABELS[activeModule]}</span>
        </div>
      )}

      {/* Modules */}
      {activeModule==="dashboard" && (
        <AccountingDashboard
          entries={journalEntries}
          invoices={invoices}
          setActiveModule={setActiveModule}
          openYear={openYear}
        />
      )}
      {activeModule==="journal" && (
        <JournalTab entries={journalEntries} setEntries={setJournalEntries} fiscalYears={fiscalYears} invoices={invoices} />
      )}
      {activeModule==="grandlivre" && <GrandLivre entries={journalEntries} />}
      {activeModule==="balance" && <BalanceModule entries={journalEntries} />}
      {activeModule==="plan" && <OhadaPlanComptes />}
      {activeModule==="transactions" && <TransactionsModule />}
      {activeModule==="rapports" && (
        <BalanceSheet entries={journalEntries} invoices={invoices} fiscalYear={openYear} />
      )}
      {activeModule==="rapprochement" && <RapprochementModule entries={journalEntries} invoices={invoices} />}
      {activeModule==="immobilisations" && <ImmobilisationsModule />}
      {activeModule==="cheques" && <ChequesModule invoices={invoices} />}

      {/* Floating AI */}
      <OhadaAgentPanel entries={journalEntries} invoices={invoices} fiscalYears={fiscalYears} />
    </div>
  );
}