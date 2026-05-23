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
  const colors = ["#F59E0B","#16A34A","#7C3AED","#0EA5E9","#10B981","#EF4444"];
  return Object.entries(counts).map(([k, v], i) => ({ name: labels[k] || k, value: v, color: colors[i % colors.length] }));
}

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
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Activité récente</h3>
      {items.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">Aucune activité</p>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={`${item.id}-${i}`} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm ${item.type === "order" ? "bg-amber-50" : "bg-blue-50"}`}>
                {item.type === "order" ? "🛒" : "📄"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{item.label}</p>
                <p className="text-xs text-gray-400 truncate">{item.sub}</p>
              </div>
              <div className="text-right flex-shrink-0">
                {item.amount && <p className="text-sm font-semibold text-green-600">{(Number(item.amount)/1000).toFixed(1)}k</p>}
                <p className="text-xs text-gray-400">{item.date ? new Date(item.date).toLocaleDateString("fr-FR", { day:"numeric", month:"short" }) : "—"}</p>
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

  const revenueSparkline = monthRevenue.map(m => m.revenus);
  const lastMonthRev = revenueSparkline[4] || 0;
  const thisMonthRev = revenueSparkline[5] || 0;
  const revTrend = lastMonthRev > 0 ? ((thisMonthRev - lastMonthRev) / lastMonthRev * 100).toFixed(0) : null;

  const kpis = [
    { label: "Chiffre d'affaires", value: totalRevenue > 0 ? `${(totalRevenue / 1000).toFixed(0)}k FCFA` : "0 FCFA", icon: DollarSign, accent: "#16A34A", bg: "bg-green-50", iconColor: "text-green-600", trend: revTrend, tab: "accounting" },
    { label: "Commandes en attente", value: pendingOrders, icon: ShoppingCart, accent: pendingOrders > 0 ? "#F59E0B" : "#16A34A", bg: pendingOrders > 0 ? "bg-amber-50" : "bg-green-50", iconColor: pendingOrders > 0 ? "text-amber-600" : "text-green-600", tab: "orders" },
    { label: "Factures impayées", value: pendingInvoices.length, icon: FileText, accent: pendingInvoices.length > 0 ? "#EF4444" : "#16A34A", bg: pendingInvoices.length > 0 ? "bg-red-50" : "bg-green-50", iconColor: pendingInvoices.length > 0 ? "text-red-500" : "text-green-600", tab: "invoices" },
    { label: "Devis validés", value: validatedQuotes, icon: CheckCircle2, accent: "#0EA5E9", bg: "bg-sky-50", iconColor: "text-sky-500", tab: "invoices" },
    { label: "Clients actifs", value: activeClients, icon: Users, accent: "#7C3AED", bg: "bg-violet-50", iconColor: "text-violet-600", tab: "clients" },
    { label: "Alertes stock", value: lowStock.length, icon: AlertTriangle, accent: lowStock.length > 0 ? "#F97316" : "#16A34A", bg: lowStock.length > 0 ? "bg-orange-50" : "bg-green-50", iconColor: lowStock.length > 0 ? "text-orange-500" : "text-green-600", tab: "stock" },
    { label: "Créances actives", value: (receivables||[]).filter(r=>r.status!=="soldee").length, icon: AlertCircle, accent: "#EF4444", bg: "bg-red-50", iconColor: "text-red-500", tab: "receivables" },
    { label: "Paiements en attente", value: (payments||[]).filter(p=>p.status==="en_attente").length, icon: CreditCard, accent: "#7C3AED", bg: "bg-violet-50", iconColor: "text-violet-600", tab: "payments" },
  ];

  const modules = [
    { id:"clients",    label:"Clients",      icon:Users,        bg:"bg-green-50",  ic:"text-green-600",  count:(clients||[]).length },
    { id:"suppliers",  label:"Fournisseurs", icon:UserCheck,    bg:"bg-violet-50", ic:"text-violet-600", count:(suppliers||[]).length },
    { id:"invoices",   label:"Factures",     icon:FileText,     bg:"bg-sky-50",    ic:"text-sky-500",    count:(invoices||[]).length },
    { id:"delivery",   label:"Livraisons",   icon:Truck,        bg:"bg-orange-50", ic:"text-orange-500", count:null },
    { id:"products",   label:"Produits",     icon:Package,      bg:"bg-emerald-50",ic:"text-emerald-600",count:(products||[]).length },
    { id:"warehouses", label:"Entrepôts",    icon:Warehouse,    bg:"bg-cyan-50",   ic:"text-cyan-600",   count:null },
    { id:"stock",      label:"Mouvements",   icon:BarChart2,    bg:"bg-indigo-50", ic:"text-indigo-600", count:null },
    { id:"accounting", label:"Comptabilité", icon:BookOpen,     bg:"bg-green-50",  ic:"text-green-600",  count:(entries||[]).length },
    { id:"hr",         label:"RH",           icon:Users2,       bg:"bg-pink-50",   ic:"text-pink-500",   count:(employees||[]).length },
    { id:"orders",     label:"Commandes",    icon:ShoppingCart, bg:"bg-amber-50",  ic:"text-amber-600",  count:(orders||[]).length },
    { id:"drivers",    label:"Chauffeurs",   icon:Navigation,   bg:"bg-orange-50", ic:"text-orange-500", count:(drivers||[]).length },
    { id:"payments",   label:"Paiements",    icon:CreditCard,   bg:"bg-violet-50", ic:"text-violet-600", count:(payments||[]).length },
    { id:"receivables",label:"Créances",     icon:TrendingDown, bg:"bg-red-50",    ic:"text-red-500",    count:(receivables||[]).length },
    { id:"applications",label:"Candidatures",icon:Briefcase,   bg:"bg-sky-50",    ic:"text-sky-500",    count:null },
    { id:"users",      label:"Utilisateurs", icon:Shield,       bg:"bg-slate-100", ic:"text-slate-500",  count:(users||[]).length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-sm text-gray-500 mt-0.5">Groupe Madina Oumarou · Vue en temps réel</p>
        </div>
        <div className="flex gap-2">
          <Link to="/client" className="text-sm text-gray-500 hover:text-green-600 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-green-300 bg-white flex items-center gap-1.5 transition-colors cursor-pointer">
            <Eye className="w-3.5 h-3.5" /> Client
          </Link>
          <Link to="/detaillant" className="text-sm text-gray-500 hover:text-amber-600 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-amber-300 bg-white flex items-center gap-1.5 transition-colors cursor-pointer">
            <Eye className="w-3.5 h-3.5" /> Détaillant
          </Link>
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-900 px-3 py-1.5 rounded-lg border border-gray-200 bg-white flex items-center gap-1.5 transition-colors cursor-pointer">
            <Globe className="w-3.5 h-3.5" /> Site
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => (
          <button key={k.label} onClick={() => setTab(k.tab)}
            className="bg-white border border-gray-200 rounded-xl p-4 text-left shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${k.bg} flex items-center justify-center`}>
                <k.icon className={`w-5 h-5 ${k.iconColor}`} />
              </div>
              {k.trend !== null && k.trend !== undefined && (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${Number(k.trend) >= 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                  {Number(k.trend) >= 0 ? "+" : ""}{k.trend}%
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mb-1">{k.label}</p>
            <p className="text-xl font-bold" style={{ color: k.accent }}>{k.value}</p>
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Revenus vs Dépenses</h3>
            <p className="text-xs text-gray-400 mt-0.5">6 derniers mois</p>
          </div>
          <RevenueChart data={monthRevenue} />
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-0.5">Statuts commandes</h3>
          <p className="text-xs text-gray-400 mb-3">{(orders||[]).length} total</p>
          {orderPie.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-sm text-gray-400">Aucune commande</p>
            </div>
          ) : (
            <OrderChart data={orderPie} />
          )}
        </div>
      </div>

      {/* Activity + Quick access */}
      <div className="grid lg:grid-cols-2 gap-4">
        <RecentActivity orders={orders} invoices={invoices} />

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Accès rapide</h3>
          <div className="grid grid-cols-5 gap-2">
            {modules.map(m => (
              <button key={m.id} onClick={() => setTab(m.id)}
                className="flex flex-col items-center p-2 rounded-xl hover:bg-gray-50 transition-all cursor-pointer group">
                <div className={`w-9 h-9 rounded-xl ${m.bg} flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform`}>
                  <m.icon className={`w-4 h-4 ${m.ic}`} />
                </div>
                <p className="text-[10px] text-gray-500 leading-tight text-center group-hover:text-gray-700 transition-colors">{m.label}</p>
                {m.count !== null && <p className={`text-[10px] font-bold mt-0.5 ${m.ic}`}>{m.count}</p>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stock alert */}
      {lowStock.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            <p className="text-sm font-semibold text-orange-700">{lowStock.length} produit(s) en stock critique</p>
            <button onClick={() => setTab("stock")} className="ml-auto text-xs text-orange-600 border border-orange-300 px-2.5 py-1 rounded-lg hover:bg-orange-100 transition-colors cursor-pointer bg-white">
              Gérer →
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStock.slice(0, 6).map(p => (
              <span key={p.id} className="text-xs text-orange-600 px-2.5 py-1 rounded-full bg-white border border-orange-200">
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
    colors: ["#16A34A", "#EF4444"],
    stroke: { curve: "smooth", width: 2 },
    fill: { type: "gradient", gradient: { opacityFrom: 0.12, opacityTo: 0 } },
    xaxis: { categories: data.map(d => d.month), labels: { style: { fontSize: "12px", colors: "#9CA3AF" } }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { style: { fontSize: "12px", colors: "#9CA3AF" }, formatter: v => `${(v/1000).toFixed(0)}k` } },
    grid: { borderColor: "#F3F4F6", strokeDashArray: 4 },
    tooltip: { theme: "light", y: { formatter: v => `${Number(v).toLocaleString()} FCFA` } },
    legend: { position: "top", horizontalAlign: "left", labels: { colors: "#6B7280" }, fontSize: "13px" }
  };
  return <Chart type="area" series={series} options={options} height={200} />;
}

function OrderChart({ data }) {
  const series = data.map(d => d.value);
  const options = {
    chart: { type: "donut", background: "transparent" },
    colors: data.map(d => d.color),
    labels: data.map(d => d.name),
    legend: { position: "bottom", fontSize: "12px", labels: { colors: "#6B7280" } },
    tooltip: { theme: "light", y: { formatter: v => `${v} commande(s)` } },
    plotOptions: { pie: { donut: { size: "65%", labels: { show: true, total: { show: true, label: "Total", color: "#9CA3AF", fontSize: "12px" } } } } },
    dataLabels: { enabled: false }
  };
  return <Chart type="donut" series={series} options={options} height={200} />;
}