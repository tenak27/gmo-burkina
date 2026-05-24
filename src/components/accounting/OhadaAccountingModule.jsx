import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import {
  BookOpen, CalendarRange, List, BarChart2, Scale, Loader2,
  TrendingUp, TrendingDown, DollarSign, RefreshCw
} from "lucide-react";
import FiscalYearManager from "./FiscalYearManager";
import JournalTab from "./JournalTab";
import GrandLivre from "./GrandLivre";
import BalanceSheet from "./BalanceSheet";
import OhadaPlanComptes from "./OhadaPlanComptes";
import OhadaAgentPanel from "./OhadaAgentPanel";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from "recharts";

const TABS = [
  { id: "tableau", label: "Tableau de bord", icon: BarChart2 },
  { id: "exercices", label: "Exercices", icon: CalendarRange },
  { id: "journal", label: "Journal", icon: List },
  { id: "grandlivre", label: "Grand Livre", icon: BookOpen },
  { id: "etats", label: "États financiers", icon: Scale },
  { id: "plan", label: "Plan comptable", icon: BookOpen },
];

const MONTHS = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];

export default function OhadaAccountingModule({ invoices = [], entries: propEntries = [], setEntries: setPropEntries }) {
  const [activeTab, setActiveTab] = useState("tableau");
  const [fiscalYears, setFiscalYears] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [years, jEntries] = await Promise.all([
      base44.entities.FiscalYear.list("-year", 20),
      base44.entities.JournalEntry.list("-date", 500),
    ]);
    setFiscalYears(years || []);
    setJournalEntries(jEntries || []);
    setLoading(false);
  };

  const openYear = fiscalYears.find(y => y.status === "ouvert");

  // KPIs from journal entries
  const totalVentes = journalEntries.filter(e => e.account_code?.startsWith("7") && e.status === "valide").reduce((s, e) => s + (e.credit || 0), 0);
  const totalCharges = journalEntries.filter(e => e.account_code?.startsWith("6") && e.status === "valide").reduce((s, e) => s + (e.debit || 0), 0);
  const totalClients = journalEntries.filter(e => e.account_code === "411").reduce((s, e) => s + (e.debit || 0) - (e.credit || 0), 0);
  const totalTresorerie = journalEntries.filter(e => (e.account_code === "521" || e.account_code === "531" || e.account_code === "541")).reduce((s, e) => s + (e.debit || 0) - (e.credit || 0), 0);
  const resultat = totalVentes - totalCharges;
  const totalDebit = journalEntries.reduce((s, e) => s + (e.debit || 0), 0);
  const totalCredit = journalEntries.reduce((s, e) => s + (e.credit || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 1;

  // Monthly chart
  const monthlyData = React.useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      const m = d.getMonth(); const y = d.getFullYear();
      const ventes = journalEntries.filter(e => e.account_code?.startsWith("7") && e.status === "valide" && new Date(e.date).getMonth() === m && new Date(e.date).getFullYear() === y).reduce((s, e) => s + (e.credit || 0), 0);
      const charges = journalEntries.filter(e => e.account_code?.startsWith("6") && e.status === "valide" && new Date(e.date).getMonth() === m && new Date(e.date).getFullYear() === y).reduce((s, e) => s + (e.debit || 0), 0);
      return { month: MONTHS[m], ventes, charges, resultat: ventes - charges };
    });
  }, [journalEntries]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-gmo-green animate-spin" />
        <span className="ml-3 text-sm text-obsidian/50 font-body">Chargement du module comptable…</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-heading text-xl font-bold text-obsidian">Comptabilité OHADA</h2>
          <p className="text-xs text-obsidian/40 font-body mt-0.5">
            SYSCOHADA révisé — {openYear ? <span className="text-gmo-green font-semibold">{openYear.label} ouvert</span> : <span className="text-amber-600 font-semibold">Aucun exercice ouvert</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isBalanced && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
              ⚠️ Balance déséquilibrée
            </div>
          )}
          <button onClick={loadData} className="flex items-center gap-1.5 border border-gray-200 rounded-xl px-3 py-2 text-xs text-obsidian/50 hover:border-gmo-green hover:text-gmo-green transition-colors cursor-pointer">
            <RefreshCw className="w-3.5 h-3.5" /> Actualiser
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap bg-gray-100/60 rounded-2xl p-1">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === tab.id ? "bg-white text-obsidian shadow-sm" : "text-obsidian/50 hover:text-obsidian/80"}`}>
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TABLEAU DE BORD */}
      {activeTab === "tableau" && (
        <div className="space-y-4 animate-fade-up">
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Chiffre d'affaires", val: totalVentes, icon: TrendingUp, color: "text-gmo-green", bg: "from-green-50", desc: `${invoices.filter(i=>i.status==="paye").length} factures payées` },
              { label: "Total Charges", val: totalCharges, icon: TrendingDown, color: "text-red-500", bg: "from-red-50", desc: "Charges d'exploitation" },
              { label: "Résultat Net", val: resultat, icon: DollarSign, color: resultat >= 0 ? "text-gmo-green" : "text-red-500", bg: resultat >= 0 ? "from-green-50" : "from-red-50", desc: resultat >= 0 ? "Bénéfice" : "Perte" },
              { label: "Trésorerie", val: totalTresorerie, icon: DollarSign, color: totalTresorerie >= 0 ? "text-blue-600" : "text-red-500", bg: "from-blue-50", desc: "Banque + Caisse + Mobile" },
            ].map(kpi => {
              const Icon = kpi.icon;
              return (
                <div key={kpi.label} className={`bg-gradient-to-br ${kpi.bg} to-white rounded-2xl border border-gray-100 p-4 shadow-sm`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <Icon className={`w-4 h-4 ${kpi.color}`} />
                    </div>
                    <span className="text-[10px] text-obsidian/40 font-body uppercase tracking-wider">{kpi.label}</span>
                  </div>
                  <p className={`font-heading text-xl font-bold ${kpi.color}`}>{kpi.val.toLocaleString()}</p>
                  <p className="text-[10px] text-obsidian/30 font-body mt-0.5">{kpi.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Balance status */}
          <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl border ${isBalanced ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isBalanced ? "bg-green-100" : "bg-red-100"}`}>
              <Scale className={`w-4 h-4 ${isBalanced ? "text-green-600" : "text-red-500"}`} />
            </div>
            <div>
              <p className={`text-sm font-semibold ${isBalanced ? "text-green-700" : "text-red-600"}`}>
                {isBalanced ? "✓ Balance comptable équilibrée" : "⚠️ Balance déséquilibrée — Vérification requise"}
              </p>
              <p className="text-xs text-obsidian/40 font-body">
                Débit total : {totalDebit.toLocaleString()} FCFA &nbsp;|&nbsp; Crédit total : {totalCredit.toLocaleString()} FCFA
                &nbsp;|&nbsp; Écart : {Math.abs(totalDebit - totalCredit).toLocaleString()} FCFA
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-heading text-sm font-bold text-obsidian mb-4">CA vs Charges (6 mois)</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={monthlyData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ fontSize: 10, borderRadius: 10 }} formatter={v => `${Number(v).toLocaleString()} FCFA`} />
                  <Bar dataKey="ventes" fill="#1A7A2E" fillOpacity={0.85} name="CA" radius={[4,4,0,0]} />
                  <Bar dataKey="charges" fill="#EF4444" fillOpacity={0.75} name="Charges" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-heading text-sm font-bold text-obsidian mb-4">Résultat mensuel</h3>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ fontSize: 10, borderRadius: 10 }} formatter={v => `${Number(v).toLocaleString()} FCFA`} />
                  <Line dataKey="resultat" stroke="#1A7A2E" strokeWidth={2} dot={{ r: 4, fill: "#1A7A2E" }} name="Résultat" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Clients summary */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-heading text-sm font-bold text-obsidian mb-3">Indicateurs clés OHADA</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Créances clients (411)", val: totalClients, unit: "FCFA" },
                { label: "TVA collectée (442)", val: journalEntries.filter(e=>e.account_code==="442").reduce((s,e)=>s+(e.credit||0),0), unit: "FCFA" },
                { label: "Écritures validées", val: journalEntries.filter(e=>e.status==="valide").length, unit: "" },
                { label: "Taux marge brute", val: totalVentes > 0 ? ((resultat/totalVentes)*100).toFixed(1) : 0, unit: "%" },
              ].map(ind => (
                <div key={ind.label} className="border border-gray-100 rounded-xl p-3">
                  <p className="text-[10px] text-obsidian/40 font-body uppercase tracking-wider mb-1">{ind.label}</p>
                  <p className="font-heading text-lg font-bold text-obsidian">{typeof ind.val === "number" ? ind.val.toLocaleString() : ind.val} <span className="text-xs font-normal text-obsidian/40">{ind.unit}</span></p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "exercices" && (
        <div className="animate-fade-up">
          <FiscalYearManager years={fiscalYears} setYears={setFiscalYears} />
        </div>
      )}

      {activeTab === "journal" && (
        <div className="animate-fade-up">
          <JournalTab entries={journalEntries} setEntries={setJournalEntries} fiscalYears={fiscalYears} invoices={invoices} />
        </div>
      )}

      {activeTab === "grandlivre" && (
        <div className="animate-fade-up">
          <GrandLivre entries={journalEntries} />
        </div>
      )}

      {activeTab === "etats" && (
        <div className="animate-fade-up">
          <BalanceSheet entries={journalEntries} invoices={invoices} fiscalYear={openYear} />
        </div>
      )}

      {activeTab === "plan" && (
        <div className="animate-fade-up">
          <OhadaPlanComptes />
        </div>
      )}

      {/* Floating AI agent */}
      <OhadaAgentPanel entries={journalEntries} invoices={invoices} fiscalYears={fiscalYears} />
    </div>
  );
}