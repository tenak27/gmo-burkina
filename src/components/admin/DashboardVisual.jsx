import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Chart from "react-apexcharts";
import {
  Users, Package, ShoppingCart, AlertTriangle, FileText, Truck,
  DollarSign, CreditCard, AlertCircle, TrendingDown, TrendingUp,
  RefreshCw, ArrowUpRight, Plus, Settings, BarChart2, Clock,
  CheckCircle2, Sun, Cloud, Zap
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

const MONTHS = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];

function useCurrentTime() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  return now;
}

function buildMonthlyCA(invoices) {
  const n = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(n.getFullYear(), n.getMonth() - 5 + i, 1);
    const m = d.getMonth(); const y = d.getFullYear();
    const facture = (invoices||[]).filter(inv => {
      const dt = new Date(inv.date || inv.created_date);
      return dt.getMonth()===m && dt.getFullYear()===y && inv.type==="facture";
    }).reduce((s,i)=>s+(i.total||0),0);
    const encaisse = (invoices||[]).filter(inv => {
      const dt = new Date(inv.date || inv.created_date);
      return dt.getMonth()===m && dt.getFullYear()===y && inv.status==="paye";
    }).reduce((s,i)=>s+(i.total||0),0);
    return { month: MONTHS[m], facture, encaisse };
  });
}

function buildProjection(monthly) {
  const real = monthly.map(m=>m.facture);
  const avg = real.filter(v=>v>0).reduce((s,v,_,a)=>s+v/a.length, 0);
  const growth = 0.15;
  const n = new Date();
  const proj = Array.from({length:3}, (_,i) => {
    const d = new Date(n.getFullYear(), n.getMonth()+i+1, 1);
    return { month: MONTHS[d.getMonth()]+" (proj.)", value: Math.round(avg*(1+growth*(i+1))), proj: true };
  });
  return [...monthly.map(m=>({month:m.month, value:m.facture, proj:false})), ...proj];
}

// Weather widget (static for Ouagadougou season)
function WeatherWidget() {
  return (
    <div className="flex items-center gap-3 text-white/80">
      <Sun className="w-6 h-6 text-yellow-300" />
      <div>
        <p className="text-lg font-bold text-white leading-none">28°C</p>
        <p className="text-[11px] text-white/60">Ensoleillé</p>
      </div>
      <div className="text-[11px] text-white/50 ml-1">
        <div>💧 52%</div>
        <div>🌬 11 km/h</div>
      </div>
    </div>
  );
}

function HealthScore({ score, invoices, products }) {
  const lowStock = (products||[]).filter(p=>p.stock_quantity<=(p.stock_alert||10)).length;
  const overdue = (invoices||[]).filter(i=>i.status==="envoye"||i.status==="partiel").length;
  const totalCA = (invoices||[]).filter(i=>i.status==="paye").reduce((s,i)=>s+(i.total||0),0);
  const totalFacture = (invoices||[]).reduce((s,i)=>s+(i.total||0),0);
  const recouvrement = totalFacture>0 ? Math.round((totalCA/totalFacture)*100) : 0;
  const health = Math.max(0, Math.min(100, 100 - overdue*2 - lowStock*5));
  const color = health >= 70 ? "#22c55e" : health >= 40 ? "#f59e0b" : "#ef4444";
  const label = health >= 70 ? "Bon" : health >= 40 ? "Moyen" : "Critique";
  const labelColor = health >= 70 ? "text-green-400" : health >= 40 ? "text-amber-400" : "text-red-400";
  return (
    <div className="text-right min-w-[200px]">
      <div className="flex items-center justify-end gap-2 mb-1">
        <p className="text-[10px] text-white/50 uppercase tracking-wider">Santé entreprise</p>
        <span className={`text-[10px] font-bold ${labelColor}`}>— {label}</span>
      </div>
      <p className="text-xs font-bold text-white/80 mb-1.5">Score global</p>
      <div className="w-48 h-2 bg-white/10 rounded-full ml-auto mb-1">
        <div className="h-2 rounded-full transition-all" style={{ width:`${health}%`, background: color }} />
      </div>
      <p className="text-[10px] text-white/40">{health}/100</p>
      <div className="mt-2 space-y-0.5 text-right">
        <p className="text-[11px] text-green-400">↑ Recouvrement : {recouvrement}%</p>
        {overdue > 0 && <p className="text-[11px] text-amber-400">⏰ {overdue} en retard</p>}
        {lowStock > 0 && <p className="text-[11px] text-red-400">▲ {lowStock} alertes stock</p>}
      </div>
    </div>
  );
}

export default function DashboardVisual({ data, setTab }) {
  const { users, products, orders, clients, suppliers, invoices, employees, entries, drivers, payments, receivables } = data;
  const now = useCurrentTime();
  const { user } = useAuth();

  const totalFacture = (invoices||[]).filter(i=>i.type==="facture").reduce((s,i)=>s+(i.total||0),0);
  const totalEncaisse = (invoices||[]).filter(i=>i.status==="paye").reduce((s,i)=>s+(i.total||0),0);
  const resteEncaisser = totalFacture - totalEncaisse;
  const tauxRecouvrement = totalFacture>0 ? Math.round((totalEncaisse/totalFacture)*100) : 0;

  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const caThisMois = (invoices||[]).filter(i=>i.type==="facture"&&new Date(i.date||i.created_date).getMonth()===thisMonth&&new Date(i.date||i.created_date).getFullYear()===thisYear).reduce((s,i)=>s+(i.total||0),0);
  const encaisseThisMois = (invoices||[]).filter(i=>i.status==="paye"&&new Date(i.date||i.created_date).getMonth()===thisMonth&&new Date(i.date||i.created_date).getFullYear()===thisYear).reduce((s,i)=>s+(i.total||0),0);
  const facturesImpayees = (invoices||[]).filter(i=>i.status==="envoye"||i.status==="partiel");
  const devisActifs = (invoices||[]).filter(i=>i.type==="devis"&&i.status!=="annule");
  const pipelineDevis = devisActifs.reduce((s,i)=>s+(i.total||0),0);
  const lowStock = (products||[]).filter(p=>p.stock_quantity<=(p.stock_alert||10));

  const monthly = useMemo(()=>buildMonthlyCA(invoices), [invoices]);
  const projection = useMemo(()=>buildProjection(monthly), [monthly]);

  const dernièresFactures = [...(invoices||[])].sort((a,b)=>new Date(b.created_date)-new Date(a.created_date)).slice(0,5);

  const days = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
  const months = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
  const dateLabel = `${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  const hh = now.getHours().toString().padStart(2,"0");
  const mm = now.getMinutes().toString().padStart(2,"0");
  const ss = now.getSeconds().toString().padStart(2,"0");

  const projectionNext3 = projection.filter(p=>p.proj).slice(0,3);
  const trendPct = monthly[4]?.facture>0 ? ((monthly[5]?.facture-monthly[4]?.facture)/monthly[4]?.facture*100).toFixed(1) : null;

  return (
    <div className="space-y-5 pb-10">
      {/* Hero bar */}
      <div className="rounded-2xl overflow-hidden" style={{background:"linear-gradient(135deg,#0f0f1a 0%,#1a1a2e 50%,#16213e 100%)"}}>
        <div className="px-6 py-5 flex items-center justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-8">
            <div>
              <p className="text-[13px] text-white/40 font-body mb-1">{dateLabel}</p>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-heading font-bold text-white tracking-tight">{hh}:{mm}</span>
                <span className="text-2xl text-white/40 font-heading mb-1">:{ss}</span>
              </div>
            </div>
            <WeatherWidget />
          </div>
          <HealthScore score={80} invoices={invoices} products={products} />
        </div>
      </div>

      {/* Title row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-obsidian">Tableau de bord — Direction</h1>
          <p className="text-sm text-obsidian/40 font-body">{dateLabel.toLowerCase()}</p>
        </div>
        <button onClick={()=>window.location.reload()} className="flex items-center gap-2 border border-gray-200 text-sm text-obsidian/50 px-4 py-2 rounded-xl hover:border-gmo-green hover:text-gmo-green transition-colors cursor-pointer bg-white">
          <RefreshCw className="w-4 h-4" /> Actualiser
        </button>
      </div>

      {/* Financial consolidated band */}
      <div className="rounded-2xl overflow-hidden" style={{background:"linear-gradient(135deg,#3b0764 0%,#4c1d95 40%,#5b21b6 100%)"}}>
        <div className="px-6 pt-4 pb-2 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-300 animate-pulse" />
            <span className="text-[11px] text-purple-200/70 uppercase tracking-widest font-body">Vue financière consolidée</span>
          </div>
          <span className="text-[11px] text-purple-200/50 font-body">{now.getDate()} {months[now.getMonth()]} {now.getFullYear()}</span>
        </div>
        <div className="px-6 pb-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "CA total facturé", val: totalFacture, color: "text-white" },
              { label: "Encaissé total", val: totalEncaisse, color: "text-green-300" },
              { label: "Reste à encaisser", val: resteEncaisser, color: "text-amber-300" },
              { label: "Taux recouvrement", val: `${tauxRecouvrement}%`, color: "text-purple-200", noFormat: true },
            ].map(item => (
              <div key={item.label}>
                <p className="text-[10px] text-purple-200/60 uppercase tracking-wider font-body mb-1">{item.label}</p>
                <p className={`font-heading text-xl font-bold ${item.color} leading-tight`}>
                  {item.noFormat ? item.val : `${item.val.toLocaleString("fr-FR")} FCFA`}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-[10px] text-purple-200/50 font-body mb-1">
              <span>{tauxRecouvrement}%</span>
              <span>Objectif 100%</span>
            </div>
            <div className="h-1.5 bg-purple-900/50 rounded-full">
              <div className="h-1.5 rounded-full bg-gradient-to-r from-green-400 to-green-500 transition-all" style={{width:`${Math.min(100,tauxRecouvrement)}%`}} />
            </div>
          </div>
        </div>
      </div>

      {/* 4 colored KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:"CA Facturé", sub:`CA Facturé — ${months[thisMonth]} ${thisYear}`, val:caThisMois, icon:"📄", grad:"from-violet-600 to-purple-700", tab:"invoices" },
          { label:"Encaissé ce mois", sub:`Recouvrement global : ${tauxRecouvrement}%`, val:encaisseThisMois, icon:"$", grad:"from-green-500 to-emerald-600", tab:"payments" },
          { label:`${facturesImpayees.length} facture(s)`, sub:`${facturesImpayees.length} facture(s) impayées\n${resteEncaisser.toLocaleString("fr-FR")} FCFA`, val:null, icon:"⏰", grad:"from-amber-500 to-orange-600", tab:"invoices", noVal:true },
          { label:"Pipeline devis", sub:`${devisActifs.length} actif(s)`, val:pipelineDevis, icon:"📈", grad:"from-pink-500 to-rose-600", tab:"invoices" },
        ].map(card => (
          <button key={card.label} onClick={()=>setTab(card.tab)}
            className={`bg-gradient-to-br ${card.grad} rounded-2xl p-5 text-left relative overflow-hidden cursor-pointer hover:opacity-90 transition-opacity group`}>
            <div className="absolute top-3 right-3 text-white/30 text-4xl pointer-events-none select-none">○</div>
            <div className="absolute top-2 right-2">
              <ArrowUpRight className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
            </div>
            <div className="text-2xl mb-2">{card.icon}</div>
            {card.noVal ? (
              <p className="font-heading text-xl font-bold text-white">{card.label}</p>
            ) : (
              <p className="font-heading text-lg font-bold text-white leading-tight">
                {card.val?.toLocaleString("fr-FR")} FCFA
              </p>
            )}
            <p className="text-[11px] text-white/70 font-body mt-1 whitespace-pre-line">{card.sub}</p>
          </button>
        ))}
      </div>

      {/* Small stat chips */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon:"👥", label:"Clients", val:(clients||[]).filter(c=>c.is_active!==false).length, tab:"clients" },
          { icon:"📦", label:"Produits", val:(products||[]).filter(p=>p.is_active!==false).length, tab:"products" },
          { icon:"🚚", label:"BL en cours", val:(orders||[]).filter(o=>o.status==="en_livraison").length, tab:"delivery" },
          { icon:"🛒", label:"Devis actifs", val:devisActifs.length, tab:"invoices" },
        ].map(chip => (
          <button key={chip.label} onClick={()=>setTab(chip.tab)}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer text-left">
            <span className="text-xl">{chip.icon}</span>
            <div>
              <p className="font-heading text-xl font-bold text-obsidian">{chip.val}</p>
              <p className="text-xs text-obsidian/40 font-body">{chip.label}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Alert band */}
      {facturesImpayees.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <p className="text-sm font-semibold text-amber-800">Solde à recouvrir ({facturesImpayees.length} facture(s) impayée(s))</p>
            </div>
            <p className="font-heading text-2xl font-bold text-amber-700 mt-1">{resteEncaisser.toLocaleString("fr-FR")} FCFA</p>
          </div>
          <button onClick={()=>setTab("invoices")} className="text-sm text-amber-700 font-semibold hover:underline cursor-pointer">Voir →</button>
        </div>
      )}

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading text-sm font-bold text-obsidian">Évolution du Chiffre d'Affaires</h3>
              <p className="text-[11px] text-obsidian/40 font-body mt-0.5">6 derniers mois — CA Facturé vs Encaissé</p>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-green-600 font-semibold">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live
            </div>
          </div>
          <CAChart data={monthly} />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="font-heading text-sm font-bold text-obsidian">Alertes Stock</p>
            <span className="text-[10px] text-obsidian/30 font-body">Temps réel</span>
          </div>
          {lowStock.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />
              <p className="text-sm text-green-600 font-semibold">Stocks OK</p>
            </div>
          ) : (
            <div className="space-y-2">
              {lowStock.slice(0,6).map(p => (
                <div key={p.id} className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-xl border border-red-100">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-red-800 truncate">{p.name}</p>
                    <p className="text-[10px] text-red-600/60 font-body">Stock: {p.stock_quantity} / min: {p.stock_alert||10}</p>
                  </div>
                  <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                </div>
              ))}
              <button onClick={()=>setTab("stock")}
                className="w-full mt-2 bg-gmo-red text-white text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer">
                📋 Générer Expression de Besoin
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Predictive analysis */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
            <span className="text-purple-600 text-xs font-bold">ꟻ</span>
          </div>
          <h3 className="font-heading text-sm font-bold text-obsidian">Analyse prédictive</h3>
        </div>
        <p className="text-[11px] text-obsidian/40 font-body mb-4">Basée sur l'historique des 6 derniers mois</p>
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <div className="flex items-end gap-4 mb-3">
              <div>
                <p className="text-[10px] text-obsidian/40 font-body uppercase tracking-wider">Prévision CA — 3 prochains mois</p>
                <div className="flex items-center gap-3">
                  <p className="font-heading text-2xl font-bold text-obsidian">{projectionNext3.reduce((s,p)=>s+p.value,0).toLocaleString("fr-FR")} FCFA</p>
                  {trendPct && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${Number(trendPct)>=0?"bg-green-100 text-green-700":"bg-red-100 text-red-600"}`}>
                      {Number(trendPct)>=0?"+":""}{trendPct}%
                    </span>
                  )}
                </div>
              </div>
            </div>
            <ProjectionChart data={projection} />
          </div>
          <div className="space-y-3">
            <p className="text-[10px] text-obsidian/40 uppercase tracking-wider font-body mb-2">Prochain mois estimé</p>
            {projectionNext3.map(p => (
              <div key={p.month} className="border border-gray-100 rounded-xl p-3">
                <p className="text-[11px] text-obsidian/40 font-body">{p.month}</p>
                <p className="font-heading text-base font-bold text-amber-600">{p.value.toLocaleString("fr-FR")} FCFA</p>
                <p className="text-[10px] text-obsidian/30 font-body">estimé</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Projection band */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="font-heading text-sm font-bold text-obsidian flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-gmo-green" /> Projection CA — 3 prochains mois
        </p>
        <span className="text-xs text-gmo-green font-semibold flex items-center gap-1">
          <TrendingUp className="w-3 h-3" /> Tendance hausse
        </span>
      </div>

      {/* Quick actions */}
      <div>
        <p className="text-[10px] text-obsidian/40 uppercase tracking-widest font-body mb-3">Actions rapides</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label:"+ Nouvelle facture", tab:"invoices", grad:"from-blue-600 to-indigo-700" },
            { label:"👥 Nouveau client", tab:"clients", grad:"from-purple-600 to-violet-700" },
            { label:"⚙️ Gestion stock", tab:"stock", grad:"from-teal-500 to-green-600" },
            { label:"📊 Comptabilité", tab:"accounting", grad:"bg-white border border-gray-200", text:"text-obsidian", noGrad:true },
          ].map(a => (
            <button key={a.label} onClick={()=>setTab(a.tab)}
              className={`py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer hover:opacity-90 hover:-translate-y-0.5 ${a.noGrad ? `${a.grad} ${a.text} shadow-sm` : `bg-gradient-to-r ${a.grad} text-white shadow-md`}`}>
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Last invoices */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between border-b border-gray-50">
          <h3 className="font-heading text-sm font-bold text-obsidian">Dernières factures</h3>
          <button onClick={()=>setTab("invoices")} className="text-xs text-gmo-green font-semibold hover:underline cursor-pointer">Voir tout</button>
        </div>
        <div className="divide-y divide-gray-50">
          {dernièresFactures.length===0 ? (
            <div className="py-8 text-center text-sm text-obsidian/30 font-body">Aucune facture</div>
          ) : dernièresFactures.map(inv => {
            const statusMap = { paye:{l:"Validée",c:"bg-green-100 text-green-700"}, partiel:{l:"Part. payée",c:"bg-amber-100 text-amber-700"}, envoye:{l:"Envoyée",c:"bg-blue-100 text-blue-700"}, brouillon:{l:"Brouillon",c:"bg-gray-100 text-gray-500"}, annule:{l:"Annulée",c:"bg-red-100 text-red-600"} };
            const s = statusMap[inv.status] || {l:inv.status,c:"bg-gray-100 text-gray-500"};
            return (
              <div key={inv.id} className="px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                <div className="min-w-0">
                  <p className="font-heading text-sm font-bold text-obsidian">{inv.number || `FAC-${inv.id?.slice(-10)}`}</p>
                  <p className="text-xs text-obsidian/40 font-body truncate">{inv.client_name}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <p className="font-heading text-sm font-bold text-obsidian">{(inv.total||0).toLocaleString("fr-FR")} FCFA</p>
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${s.c}`}>{s.l}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CAChart({ data }) {
  const series = [
    { name: "CA Facturé", data: data.map(d=>d.facture) },
    { name: "Encaissé", data: data.map(d=>d.encaisse) },
  ];
  const options = {
    chart: { type:"bar", toolbar:{show:false}, background:"transparent" },
    colors: ["#6366f1","#22c55e"],
    stroke: { show:true, width:[0,3], curve:"smooth" },
    plotOptions: { bar:{columnWidth:"50%", borderRadius:4} },
    xaxis: { categories:data.map(d=>d.month), labels:{style:{fontSize:"11px",colors:"#9ca3af"}}, axisBorder:{show:false}, axisTicks:{show:false} },
    yaxis: { labels:{style:{fontSize:"10px",colors:"#9ca3af"},formatter:v=>`${(v/1000000).toFixed(0)}M`} },
    grid: { borderColor:"#f3f4f6", strokeDashArray:4 },
    tooltip: { theme:"light", y:{formatter:v=>`${Number(v).toLocaleString()} FCFA`} },
    legend: { position:"top", horizontalAlign:"left", labels:{colors:"#6B7280"}, fontSize:"12px" },
    dataLabels: { enabled:false },
  };
  return <Chart type="bar" series={series} options={options} height={200} />;
}

function ProjectionChart({ data }) {
  const real = data.filter(d=>!d.proj);
  const proj = data.filter(d=>d.proj);
  const series = [
    { name:"Réel", data: data.map(d=>d.proj ? null : d.value) },
    { name:"Prédit", data: data.map((d,i)=> i<real.length-1 ? null : d.value) },
  ];
  const options = {
    chart: { type:"line", toolbar:{show:false}, background:"transparent" },
    colors: ["#6366f1","#f59e0b"],
    stroke: { width:[3,2], curve:"smooth", dashArray:[0,6] },
    markers: { size:5 },
    xaxis: { categories:data.map(d=>d.month), labels:{style:{fontSize:"10px",colors:"#9ca3af"}}, axisBorder:{show:false}, axisTicks:{show:false} },
    yaxis: { labels:{style:{fontSize:"10px",colors:"#9ca3af"},formatter:v=>`${(v/1000000).toFixed(0)}M`} },
    grid: { borderColor:"#f3f4f6", strokeDashArray:4 },
    tooltip: { theme:"light", y:{formatter:v=>v?`${Number(v).toLocaleString()} FCFA`:"—"} },
    legend: { position:"top", horizontalAlign:"right", labels:{colors:"#6B7280"}, fontSize:"12px" },
    dataLabels: { enabled:false },
  };
  return <Chart type="line" series={series} options={options} height={200} />;
}