import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import Chart from "react-apexcharts";
import {
  Users, Package, ShoppingCart, AlertTriangle,
  Eye, Globe, FileText, Truck, UserCheck, DollarSign,
  Warehouse, Users2, Tag, CheckCircle2,
  BarChart2, CreditCard, AlertCircle, Navigation, BookOpen, TrendingDown, Shield, Briefcase, TrendingUp
} from "lucide-react";

const MONTHS = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];

function buildRevenueData(invoices, entries) {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const m = d.getMonth(); const y = d.getFullYear();
    const rev = (invoices || []).filter(inv => {
      const id = new Date(inv.created_date);
      return id.getMonth() === m && id.getFullYear() === y && inv.status === "paye";
    }).reduce((s, inv) => s + (inv.total || 0), 0);
    const dep = (entries || []).filter(e => {
      const ed = new Date(e.date || e.created_date);
      return ed.getMonth() === m && ed.getFullYear() === y && e.type === "depense";
    }).reduce((s, e) => s + (e.amount || 0), 0);
    return { month: MONTHS[m], revenus: rev, depenses: dep };
  });
}

function buildOrderStatusData(orders) {
  const counts = {};
  (orders || []).forEach(o => { counts[o.status] = (counts[o.status] || 0) + 1; });
  const labels = { en_attente:"Attente", confirmee:"Confirmée", en_preparation:"Prépa.", en_livraison:"Livraison", livree:"Livrée", annulee:"Annulée" };
  const colors = ["#F5C400","#4ade80","#8B5CF6","#22d3ee","#10B981","#EF4444"];
  return Object.entries(counts).map(([k, v], i) => ({ name: labels[k] || k, value: v, color: colors[i % colors.length] }));
}

function MiniChart({ data, color = "#4ade80" }) {
  const series = [{ data }];
  const options = {
    chart: { type: "area", sparkline: { enabled: true }, toolbar: { show: false }, background: "transparent" },
    stroke: { curve: "smooth", width: 1.5, colors: [color] },
    fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.25, opacityTo: 0 } },
    tooltip: { enabled: false },
  };
  return <Chart type="area" series={series} options={options} width="70" height="24" />;
}

const GLASS_CARD = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(12px)",
};

const GLASS_CARD_HOVER = {
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(74,222,128,0.2)",
};

function RecentActivity({ orders, invoices }) {
  const items = [
    ...(orders || []).slice(0, 3).map(o => ({
      id: o.id, type: "order",
      label: `CMD ${o.order_number || o.id?.slice(-6)}`,
      sub: o.client_name,
      amount: o.total_amount,
      date: o.created_date,
    })),
    ...(invoices || []).slice(0, 3).map(i => ({
      id: i.id, type: "invoice",
      label: `FAC ${i.number || i.id?.slice(-4)}`,
      sub: i.client_name,
      amount: i.total,
      date: i.created_date,
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);

  return (
    <div className="rounded-2xl p-5" style={GLASS_CARD}>
      <h3 className="font-heading text-sm font-bold text-white mb-4">Activité récente</h3>
      {items.length === 0 ? (
        <p className="text-xs text-white/25 font-body text-center py-6">Aucune activité</p>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={`${item.id}-${i}`} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-sm ${item.type === "order" ? "bg-[#F5C400]/10" : "bg-cyan-400/10"}`}>
                {item.type === "order" ? "🛒" : "📄"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white/80 truncate font-body">{item.label}</p>
                <p className="text-[10px] text-white/30 truncate font-body">{item.sub}</p>
              </div>
              <div className="text-right flex-shrink-0">
                {item.amount && <p className="text-xs font-bold text-[#4ade80]">{(Number(item.amount)/1000).toFixed(1)}k</p>}
                <p className="text-[10px] text-white/25 font-body">{item.date ? new Date(item.date).toLocaleDateString("fr-FR", { day:"numeric", month:"short" }) : "—"}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardVisual({ data, setTab }) {
  const { users, products, orders, clients, suppliers, invoices, employees, entries, drivers, payments, receivables } = data;

  const totalRevenue = (invoices || []).filter(i => i.status === "paye").reduce((s, i) => s + (i.total || 0), 0);
  const pendingInvoices = (invoices || []).filter(i => i.status === "envoye" || i.status === "partiel");
  const pendingOrders = (orders || []).filter(o => o.status === "en_attente").length;
  const lowStock = (products || []).filter(p => p.stock_quantity <= (p.stock_alert || 10));
  const validatedQuotes = (invoices || []).filter(i => i.type === "devis" && i.status === "paye").length;
  const activeClients = (clients || []).filter(c => c.is_active !== false).length;

  const monthRevenue = useMemo(() => buildRevenueData(invoices, entries), [invoices, entries]);
  const orderPie = useMemo(() => buildOrderStatusData(orders), [orders]);

  const clientSparkline = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      return (clients || []).filter(c => {
        const cd = new Date(c.created_date);
        return cd.getMonth() === d.getMonth() && cd.getFullYear() === d.getFullYear();
      }).length;
    });
  }, [clients]);

  const revenueSparkline = monthRevenue.map(m => m.revenus);
  const lastMonthRev = revenueSparkline[4] || 0;
  const thisMonthRev = revenueSparkline[5] || 0;
  const revTrend = lastMonthRev > 0 ? ((thisMonthRev - lastMonthRev) / lastMonthRev * 100).toFixed(0) : null;

  const kpis = [
    {
      label: "Chiffre d'affaires", value: totalRevenue > 0 ? `${(totalRevenue / 1000).toFixed(0)}k` : "0",
      icon: DollarSign, accent: "#4ade80", glow: "rgba(74,222,128,0.25)",
      sparkline: revenueSparkline, sparkColor: "#4ade80", trend: revTrend, tab: "accounting"
    },
    {
      label: "Commandes en attente", value: pendingOrders,
      icon: ShoppingCart, accent: pendingOrders > 0 ? "#F5C400" : "#4ade80", glow: pendingOrders > 0 ? "rgba(245,196,0,0.2)" : "rgba(74,222,128,0.15)",
      tab: "orders"
    },
    {
      label: "Factures impayées", value: pendingInvoices.length,
      icon: FileText, accent: pendingInvoices.length > 0 ? "#ef4444" : "#4ade80", glow: pendingInvoices.length > 0 ? "rgba(239,68,68,0.2)" : "rgba(74,222,128,0.15)",
      tab: "invoices"
    },
    {
      label: "Devis validés", value: validatedQuotes,
      icon: CheckCircle2, accent: "#22d3ee", glow: "rgba(34,211,238,0.2)",
      tab: "invoices"
    },
    {
      label: "Clients actifs", value: activeClients,
      icon: Users, accent: "#a78bfa", glow: "rgba(167,139,250,0.2)",
      sparkline: clientSparkline, sparkColor: "#a78bfa", tab: "clients"
    },
    {
      label: "Alertes stock", value: lowStock.length,
      icon: AlertTriangle, accent: lowStock.length > 0 ? "#fb923c" : "#4ade80", glow: lowStock.length > 0 ? "rgba(251,146,60,0.2)" : "rgba(74,222,128,0.15)",
      tab: "stock"
    },
    {
      label: "Créances actives", value: (receivables||[]).filter(r=>r.status!=="soldee").length,
      icon: AlertCircle, accent: "#f87171", glow: "rgba(248,113,113,0.2)",
      tab: "receivables"
    },
    {
      label: "Paiements en attente", value: (payments||[]).filter(p=>p.status==="en_attente").length,
      icon: CreditCard, accent: "#c084fc", glow: "rgba(192,132,252,0.2)",
      tab: "payments"
    },
  ];

  const modules = [
    { id:"clients",    label:"Clients",      icon:Users,        accent:"#4ade80",  count:(clients||[]).length },
    { id:"suppliers",  label:"Fournisseurs", icon:UserCheck,    accent:"#a78bfa",  count:(suppliers||[]).length },
    { id:"invoices",   label:"Factures",     icon:FileText,     accent:"#22d3ee",  count:(invoices||[]).length },
    { id:"delivery",   label:"Livraisons",   icon:Truck,        accent:"#fb923c",  count:null },
    { id:"products",   label:"Produits",     icon:Package,      accent:"#34d399",  count:(products||[]).length },
    { id:"warehouses", label:"Entrepôts",    icon:Warehouse,    accent:"#67e8f9",  count:null },
    { id:"stock",      label:"Mouvements",   icon:BarChart2,    accent:"#818cf8",  count:null },
    { id:"accounting", label:"Comptabilité", icon:BookOpen,     accent:"#4ade80",  count:(entries||[]).length },
    { id:"hr",         label:"RH",           icon:Users2,       accent:"#f9a8d4",  count:(employees||[]).length },
    { id:"orders",     label:"Commandes",    icon:ShoppingCart, accent:"#F5C400",  count:(orders||[]).length },
    { id:"drivers",    label:"Chauffeurs",   icon:Navigation,   accent:"#fdba74",  count:(drivers||[]).length },
    { id:"payments",   label:"Paiements",    icon:CreditCard,   accent:"#c084fc",  count:(payments||[]).length },
    { id:"receivables",label:"Créances",     icon:TrendingDown, accent:"#f87171",  count:(receivables||[]).length },
    { id:"applications",label:"Candidatures",icon:Briefcase,   accent:"#38bdf8",  count:null },
    { id:"users",      label:"Utilisateurs", icon:Shield,       accent:"#94a3b8",  count:(users||[]).length },
  ];

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-heading text-xl font-bold text-white">Tableau de bord</h1>
          <p className="text-[11px] text-white/30 font-body mt-0.5">Groupe Madina Oumarou · Vue en temps réel</p>
        </div>
        <div className="flex gap-2">
          <Link to="/client" className="text-[10px] text-white/30 hover:text-[#4ade80] font-body px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors border border-white/[0.08] hover:border-[#4ade80]/30 cursor-pointer"
            style={{ background: "rgba(255,255,255,0.03)" }}>
            <Eye className="w-3 h-3" /> Client
          </Link>
          <Link to="/detaillant" className="text-[10px] text-white/30 hover:text-[#F5C400] font-body px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors border border-white/[0.08] hover:border-[#F5C400]/30 cursor-pointer"
            style={{ background: "rgba(255,255,255,0.03)" }}>
            <Eye className="w-3 h-3" /> Détaillant
          </Link>
          <Link to="/" className="text-[10px] text-white/30 hover:text-white font-body px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors border border-white/[0.08] hover:border-white/20 cursor-pointer"
            style={{ background: "rgba(255,255,255,0.03)" }}>
            <Globe className="w-3 h-3" /> Site
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map(k => (
          <button key={k.label} onClick={() => setTab(k.tab)}
            className="rounded-2xl p-4 text-left transition-all duration-200 hover:scale-[1.02] cursor-pointer group"
            style={GLASS_CARD}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${k.accent}18`, border: `1px solid ${k.accent}30` }}>
                <k.icon className="w-4.5 h-4.5" style={{ color: k.accent }} />
              </div>
              {k.sparkline && <div className="opacity-60"><MiniChart data={k.sparkline} color={k.sparkColor} /></div>}
            </div>
            <p className="text-[10px] text-white/35 font-body mb-1 leading-tight">{k.label}</p>
            <div className="flex items-end justify-between">
              <p className="font-heading text-xl font-bold" style={{ color: k.accent }}>{k.value}</p>
              {k.trend !== null && k.trend !== undefined && (
                <span className={`text-[9px] font-bold ${Number(k.trend) >= 0 ? "text-[#4ade80]" : "text-red-400"}`}>
                  {Number(k.trend) >= 0 ? "+" : ""}{k.trend}%
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl p-5" style={GLASS_CARD}>
          <div className="mb-4">
            <h3 className="font-heading text-sm font-bold text-white">Revenus vs Dépenses</h3>
            <p className="text-[10px] text-white/30 font-body mt-0.5">6 derniers mois</p>
          </div>
          <RevenueChart data={monthRevenue} />
        </div>

        <div className="rounded-2xl p-5" style={GLASS_CARD}>
          <h3 className="font-heading text-sm font-bold text-white mb-0.5">Statuts commandes</h3>
          <p className="text-[10px] text-white/30 font-body mb-3">{(orders||[]).length} total</p>
          {orderPie.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-xs text-white/20 font-body">Aucune commande</p>
            </div>
          ) : (
            <OrderChart data={orderPie} />
          )}
        </div>
      </div>

      {/* Activity + Quick access */}
      <div className="grid lg:grid-cols-2 gap-4">
        <RecentActivity orders={orders} invoices={invoices} />

        <div className="rounded-2xl p-5" style={GLASS_CARD}>
          <h3 className="font-heading text-sm font-bold text-white mb-4">Accès rapide</h3>
          <div className="grid grid-cols-5 gap-2">
            {modules.map(m => (
              <button key={m.id} onClick={() => setTab(m.id)}
                className="flex flex-col items-center p-2.5 rounded-xl transition-all cursor-pointer group hover:bg-white/[0.05]">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-1.5 transition-all group-hover:scale-110"
                  style={{ background: `${m.accent}15`, border: `1px solid ${m.accent}25` }}>
                  <m.icon className="w-3.5 h-3.5" style={{ color: m.accent }} />
                </div>
                <p className="font-body text-[9px] text-white/40 leading-tight text-center group-hover:text-white/70 transition-colors">{m.label}</p>
                {m.count !== null && <p className="text-[9px] font-bold mt-0.5" style={{ color: m.accent }}>{m.count}</p>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stock alert */}
      {lowStock.length > 0 && (
        <div className="rounded-2xl p-4 border border-[#fb923c]/20" style={{ background: "rgba(251,146,60,0.07)" }}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-[#fb923c]" />
            <p className="font-heading text-sm font-bold text-[#fb923c]">{lowStock.length} produit(s) en stock critique</p>
            <button onClick={() => setTab("stock")} className="ml-auto text-[10px] text-[#fb923c]/70 font-body border border-[#fb923c]/30 px-2.5 py-1 rounded-lg hover:bg-[#fb923c]/10 transition-colors cursor-pointer">
              Gérer →
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStock.slice(0, 6).map(p => (
              <span key={p.id} className="text-[10px] text-[#fb923c]/70 px-2.5 py-1 rounded-full font-body border border-[#fb923c]/20"
                style={{ background: "rgba(251,146,60,0.08)" }}>
                {p.name} ({p.stock_quantity})
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RevenueChart({ data }) {
  const series = [
    { name: "Revenus", data: data.map(d => d.revenus) },
    { name: "Dépenses", data: data.map(d => d.depenses) }
  ];
  const options = {
    chart: { type: "area", toolbar: { show: false }, background: "transparent" },
    colors: ["#4ade80", "#f87171"],
    stroke: { curve: "smooth", width: 2 },
    fill: { type: "gradient", gradient: { opacityFrom: 0.15, opacityTo: 0 } },
    xaxis: { categories: data.map(d => d.month), labels: { style: { fontSize: "11px", colors: "rgba(255,255,255,0.3)" } }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { style: { fontSize: "11px", colors: "rgba(255,255,255,0.3)" }, formatter: v => `${(v/1000).toFixed(0)}k` } },
    grid: { borderColor: "rgba(255,255,255,0.06)", strokeDashArray: 4 },
    tooltip: { theme: "dark", y: { formatter: v => `${Number(v).toLocaleString()} FCFA` } },
    legend: { position: "top", horizontalAlign: "left", labels: { colors: "rgba(255,255,255,0.5)" } }
  };
  return <Chart type="area" series={series} options={options} height={200} />;
}

function OrderChart({ data }) {
  const series = data.map(d => d.value);
  const options = {
    chart: { type: "donut", background: "transparent" },
    colors: data.map(d => d.color),
    labels: data.map(d => d.name),
    legend: { position: "bottom", fontSize: "11px", labels: { colors: "rgba(255,255,255,0.4)" } },
    tooltip: { theme: "dark", y: { formatter: v => `${v} commande(s)` } },
    plotOptions: { pie: { donut: { size: "65%", labels: { show: true, total: { show: true, label: "Total", color: "rgba(255,255,255,0.4)", fontSize: "11px" } } } } },
    dataLabels: { enabled: false }
  };
  return <Chart type="donut" series={series} options={options} height={200} />;
}