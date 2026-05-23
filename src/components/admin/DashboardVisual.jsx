import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import Chart from "react-apexcharts";
import {
  Users, Package, ShoppingCart, TrendingUp, AlertTriangle,
  Eye, Globe, FileText, Truck, UserCheck, DollarSign,
  Warehouse, Users2, Tag, CheckCircle2, ArrowUpRight, ArrowDownRight,
  BarChart2, Activity, CreditCard, AlertCircle
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
  const colors = ["#F5C400","#3B82F6","#8B5CF6","#1A7A2E","#10B981","#EF4444"];
  return Object.entries(counts).map(([k, v], i) => ({ name: labels[k] || k, value: v, color: colors[i % colors.length] }));
}

function MiniChart({ data, color = "#3B82F6" }) {
  const series = [{ data }];
  const options = {
    chart: { type: "area", sparkline: { enabled: true }, toolbar: { show: false } },
    stroke: { curve: "smooth", width: 1.5, colors: [color] },
    fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0 } },
    tooltip: { enabled: false },
  };
  return <Chart type="area" series={series} options={options} width="60" height="20" />;
}

function RecentActivity({ orders, invoices }) {
  const items = [
    ...(orders || []).slice(0, 3).map(o => ({
      id: o.id, type: "order",
      label: `CMD ${o.order_number || o.id?.slice(-6)}`,
      sub: o.client_name,
      amount: o.total_amount,
      date: o.created_date,
      color: "bg-amber-100 text-amber-700",
    })),
    ...(invoices || []).slice(0, 3).map(i => ({
      id: i.id, type: "invoice",
      label: `FAC ${i.number || i.id?.slice(-4)}`,
      sub: i.client_name,
      amount: i.total,
      date: i.created_date,
      color: "bg-blue-50 text-blue-600",
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
      <h3 className="font-heading text-sm font-bold text-gray-900 mb-4">Activité récente</h3>
      {items.length === 0 ? (
        <p className="text-xs text-gray-400 font-body text-center py-4">Aucune activité</p>
      ) : (
        <div className="space-y-2.5">
          {items.map((item, i) => (
            <div key={`${item.id}-${i}`} className="flex items-center gap-3 text-xs">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex-shrink-0 ${item.color}`}>
                {item.type === "order" ? "🔹 CMD" : "📄 FAC"}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{item.label}</p>
                <p className="text-gray-500 truncate">{item.sub}</p>
              </div>
              <div className="text-right flex-shrink-0">
                {item.amount && <p className="font-bold text-gray-900">{(Number(item.amount)/1000).toFixed(1)}k</p>}
                <p className="text-gray-400">{item.date ? new Date(item.date).toLocaleDateString("fr-FR", { day:"numeric", month:"short" }) : "—"}</p>
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

  // Sparkline data per month for clients
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
      label: "Chiffre d'affaires", value: totalRevenue > 0 ? `${(totalRevenue / 1000).toFixed(0)}k` : "0", unit: "FCFA",
      icon: DollarSign, color: "text-gmo-green", bg: "from-gmo-green/8 to-gmo-green/3", border: "border-gmo-green/15",
      sparkline: revenueSparkline, sparkColor: "#1A7A2E",
      trend: revTrend, tab: "accounting"
    },
    {
      label: "Commandes en attente", value: pendingOrders, unit: "ordres",
      icon: ShoppingCart, color: pendingOrders > 0 ? "text-amber-500" : "text-green-600",
      bg: pendingOrders > 0 ? "from-amber-50 to-amber-50/40" : "from-green-50 to-green-50/40",
      border: pendingOrders > 0 ? "border-amber-200" : "border-green-100",
      tab: "orders"
    },
    {
      label: "Factures impayées", value: pendingInvoices.length, unit: "en attente",
      icon: FileText, color: pendingInvoices.length > 0 ? "text-red-500" : "text-green-600",
      bg: pendingInvoices.length > 0 ? "from-red-50 to-red-50/40" : "from-green-50 to-green-50/40",
      border: pendingInvoices.length > 0 ? "border-red-200" : "border-green-100",
      tab: "invoices"
    },
    {
      label: "Devis validés", value: validatedQuotes, unit: "ce mois",
      icon: CheckCircle2, color: "text-blue-600", bg: "from-blue-50 to-blue-50/40", border: "border-blue-100",
      tab: "invoices"
    },
    {
      label: "Clients actifs", value: activeClients, unit: "partenaires",
      icon: Users, color: "text-purple-600", bg: "from-purple-50 to-purple-50/40", border: "border-purple-100",
      sparkline: clientSparkline, sparkColor: "#7C3AED", tab: "clients"
    },
    {
      label: "Alertes stock", value: lowStock.length, unit: "produits",
      icon: AlertTriangle, color: lowStock.length > 0 ? "text-amber-600" : "text-green-600",
      bg: lowStock.length > 0 ? "from-amber-50 to-amber-50/40" : "from-green-50 to-green-50/40",
      border: lowStock.length > 0 ? "border-amber-200" : "border-green-100",
      tab: "stock"
    },
    {
      label: "Créances actives",
      value: (receivables||[]).filter(r=>r.status!=="soldee").length,
      unit: "clients",
      icon: AlertCircle, color: "text-red-500", bg: "from-red-50 to-red-50/40", border: "border-red-100",
      tab: "receivables"
    },
    {
      label: "Paiements en attente",
      value: (payments||[]).filter(p=>p.status==="en_attente").length,
      unit: "à valider",
      icon: CreditCard, color: "text-violet-600", bg: "from-violet-50 to-violet-50/40", border: "border-violet-100",
      tab: "payments"
    },
  ];

  const modules = [
    { id:"clients", label:"Clients", icon:Users, color:"bg-blue-500", count:(clients||[]).length },
    { id:"suppliers", label:"Fournisseurs", icon:UserCheck, color:"bg-purple-500", count:(suppliers||[]).length },
    { id:"invoices", label:"Factures", icon:FileText, color:"bg-gmo-green", count:(invoices||[]).length },
    { id:"delivery", label:"Livraisons", icon:Truck, color:"bg-orange-500", count:null },
    { id:"products", label:"Produits", icon:Package, color:"bg-teal-500", count:(products||[]).length },
    { id:"warehouses", label:"Entrepôts", icon:Warehouse, color:"bg-cyan-500", count:null },
    { id:"stock", label:"Mouvements", icon:BarChart2, color:"bg-indigo-500", count:null },
    { id:"accounting", label:"Comptabilité", icon:DollarSign, color:"bg-emerald-500", count:(entries||[]).length },
    { id:"hr", label:"RH", icon:Users2, color:"bg-pink-500", count:(employees||[]).length },
    { id:"orders", label:"Commandes", icon:ShoppingCart, color:"bg-amber-500", count:(orders||[]).length },
    { id:"categories", label:"Catégories", icon:Tag, color:"bg-rose-500", count:null },
    { id:"drivers", label:"Chauffeurs", icon:Truck, color:"bg-orange-500", count:(drivers||[]).length },
    { id:"payments", label:"Paiements", icon:CreditCard, color:"bg-violet-500", count:(payments||[]).length },
    { id:"receivables", label:"Créances", icon:AlertCircle, color:"bg-red-500", count:(receivables||[]).length },
    { id:"users", label:"Utilisateurs", icon:Users, color:"bg-gray-600", count:(users||[]).length },
  ];

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-obsidian">Tableau de bord</h1>
          <p className="text-xs text-obsidian/35 font-body mt-0.5">Groupe Madina Oumarou · Vue en temps réel</p>
        </div>
        <div className="flex gap-2">
          <Link to="/client" className="text-[10px] text-obsidian/40 hover:text-gmo-green font-body border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors hover:border-gmo-green/30">
            <Eye className="w-3 h-3" /> Client
          </Link>
          <Link to="/detaillant" className="text-[10px] text-obsidian/40 hover:text-gmo-red font-body border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors hover:border-gmo-red/30">
            <Eye className="w-3 h-3" /> Détaillant
          </Link>
          <Link to="/" className="text-[10px] text-obsidian/40 hover:text-obsidian font-body border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
            <Globe className="w-3 h-3" /> Site
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {kpis.map(k => (
          <button key={k.label} onClick={() => setTab(k.tab)}
            className={`bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 text-left group hover:-translate-y-0.5`}>
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 ${k.bg} rounded-lg flex items-center justify-center`}>
                <k.icon className={`w-5 h-5 ${k.color}`} />
              </div>
              {k.sparkline && <div className="w-16"><MiniChart data={k.sparkline} color={k.sparkColor} /></div>}
            </div>
            <p className="text-xs text-gray-600 font-body mb-1">{k.label}</p>
            <div className="flex items-end justify-between">
              <p className={`font-heading text-xl font-bold ${k.color}`}>{k.value}</p>
              {k.trend !== null && k.trend !== undefined && (
                <span className={`text-[9px] font-bold ${Number(k.trend) >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {Number(k.trend) >= 0 ? "+" : ""}{k.trend}%
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading text-sm font-bold text-gray-900">Revenus vs Dépenses</h3>
              <p className="text-xs text-gray-500 font-body">6 derniers mois</p>
            </div>
          </div>
          <RevenueChart data={monthRevenue} />
        </div>

        {/* Pie chart */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <h3 className="font-heading text-sm font-bold text-gray-900 mb-1">Statuts commandes</h3>
          <p className="text-xs text-gray-500 font-body mb-4">{(orders||[]).length} total</p>
          {orderPie.length === 0 ? (
            <div className="flex items-center justify-center h-40"><p className="text-xs text-gray-400 font-body">Aucune commande</p></div>
          ) : (
            <OrderChart data={orderPie} />
          )}
        </div>
      </div>

      {/* Activity + Modules */}
      <div className="grid lg:grid-cols-2 gap-4">
        <RecentActivity orders={orders} invoices={invoices} />

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <h3 className="font-heading text-sm font-bold text-gray-900 mb-4">Accès rapide</h3>
          <div className="grid grid-cols-3 gap-2">
            {modules.map(m => (
              <button key={m.id} onClick={() => setTab(m.id)}
                className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors text-center">
                <div className={`w-8 h-8 ${m.color} rounded-lg flex items-center justify-center mb-1.5`}>
                  <m.icon className="w-3.5 h-3.5 text-white" />
                </div>
                <p className="font-body text-[10px] text-gray-700 leading-tight">{m.label}</p>
                {m.count !== null && <p className="text-[9px] text-gray-500 font-body">{m.count}</p>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stock alert */}
      {lowStock.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-orange-600" />
            <p className="font-heading text-sm font-bold text-orange-800">{lowStock.length} produit(s) en stock critique</p>
            <button onClick={() => setTab("stock")} className="ml-auto text-xs text-orange-600 font-body border border-orange-300 px-2 py-0.5 rounded transition-colors">
              Gérer
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStock.slice(0, 6).map(p => (
              <span key={p.id} className="text-xs bg-white border border-orange-200 text-orange-700 px-2 py-0.5 rounded-full font-body">
                {p.name} ({p.stock_quantity})
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Revenue Chart Component
function RevenueChart({ data }) {
  const series = [
    { name: "Revenus", data: data.map(d => d.revenus) },
    { name: "Dépenses", data: data.map(d => d.depenses) }
  ];
  const options = {
    chart: { type: "area", toolbar: { show: false }, sparkline: { enabled: false } },
    colors: ["#3B82F6", "#EF4444"],
    stroke: { curve: "smooth", width: 2 },
    fill: { type: "gradient", gradient: { opacityFrom: 0.2, opacityTo: 0 } },
    xaxis: { categories: data.map(d => d.month), labels: { style: { fontSize: "12px", colors: "#9CA3AF" } } },
    yaxis: { labels: { style: { fontSize: "12px", colors: "#9CA3AF" }, formatter: v => `${(v/1000).toFixed(0)}k` } },
    grid: { borderColor: "#E5E7EB" },
    tooltip: { y: { formatter: v => `${Number(v).toLocaleString()} FCFA` } },
    legend: { position: "top", horizontalAlign: "left" }
  };
  return <Chart type="area" series={series} options={options} height={220} />;
}

// Order Status Chart Component
function OrderChart({ data }) {
  const series = data.map(d => d.value);
  const options = {
    chart: { type: "donut" },
    colors: data.map(d => d.color),
    labels: data.map(d => d.name),
    legend: { position: "bottom", fontSize: "12px" },
    tooltip: { y: { formatter: v => `${v} commande(s)` } },
    plotOptions: { pie: { donut: { size: "65%" } } }
  };
  return <Chart type="donut" series={series} options={options} height={200} />;
}