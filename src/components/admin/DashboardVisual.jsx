import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Users, Package, ShoppingCart, TrendingUp, AlertTriangle,
  Eye, Globe, FileText, Truck, UserCheck, DollarSign,
  Warehouse, Users2, Tag, CheckCircle2, ArrowUpRight, ArrowDownRight,
  BarChart2, Activity, CreditCard, AlertCircle
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

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

function Sparkline({ data, color = "#1A7A2E" }) {
  if (!data || data.length < 2) return <div className="h-8 w-16 flex items-center justify-center"><span className="text-[9px] text-obsidian/20 font-body">—</span></div>;
  const max = Math.max(...data, 1);
  const points = data.map((v, i) => `${(i / (data.length - 1)) * 60},${20 - (v / max) * 18}`).join(" ");
  const filled = `${points} 60,20 0,20`;
  return (
    <svg width="60" height="20" viewBox="0 0 60 20" className="overflow-visible">
      <polygon points={filled} fill={color} fillOpacity="0.12" />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RecentActivity({ orders, invoices }) {
  const items = [
    ...(orders || []).slice(0, 3).map(o => ({
      id: o.id, type: "order",
      label: `Commande ${o.order_number || o.id?.slice(-6)}`,
      sub: o.client_name,
      amount: o.total_amount,
      date: o.created_date,
      color: "bg-amber-100 text-amber-700",
    })),
    ...(invoices || []).slice(0, 3).map(i => ({
      id: i.id, type: "invoice",
      label: i.number || i.type,
      sub: i.client_name,
      amount: i.total,
      date: i.created_date,
      color: "bg-blue-50 text-blue-600",
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 card-hover">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 text-obsidian/30" />
        <h3 className="font-heading text-sm font-bold text-obsidian">Activité récente</h3>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-obsidian/25 font-body text-center py-4">Aucune activité récente</p>
      ) : (
        <div className="space-y-2.5">
          {items.map((item, i) => (
            <div key={`${item.id}-${i}`} className="flex items-center gap-3">
              <span className={`text-[9px] font-body px-2 py-0.5 rounded-full flex-shrink-0 ${item.color}`}>
                {item.type === "order" ? "CMD" : "FAC"}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-heading font-semibold text-obsidian truncate">{item.label}</p>
                <p className="text-[10px] text-obsidian/35 font-body truncate">{item.sub}</p>
              </div>
              <div className="text-right flex-shrink-0">
                {item.amount && <p className="text-xs font-heading font-bold text-obsidian">{Number(item.amount).toLocaleString()}</p>}
                <p className="text-[9px] text-obsidian/30 font-body">{item.date ? new Date(item.date).toLocaleDateString("fr-FR", { day:"numeric", month:"short" }) : "—"}</p>
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
            className={`bg-gradient-to-br ${k.bg} rounded-2xl p-4 border ${k.border} shadow-sm hover:shadow-lg card-glow transition-all duration-200 text-left group hover:-translate-y-1`}>
            <div className="flex items-start justify-between mb-2">
              <div className={`w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                <k.icon className={`w-4 h-4 ${k.color}`} />
              </div>
              {k.sparkline && <Sparkline data={k.sparkline} color={k.sparkColor} />}
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className={`font-heading text-2xl font-bold ${k.color}`}>{k.value}</p>
                <p className="text-[11px] text-obsidian/45 font-body mt-0.5 leading-tight">{k.label}</p>
              </div>
              {k.trend !== null && k.trend !== undefined && (
                <div className={`flex items-center gap-0.5 text-[10px] font-heading font-bold mb-1 ${Number(k.trend) >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {Number(k.trend) >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {Math.abs(Number(k.trend))}%
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading text-sm font-bold text-obsidian">Revenus vs Dépenses</h3>
              <p className="text-[10px] text-obsidian/35 font-body">6 derniers mois</p>
            </div>
            <TrendingUp className="w-4 h-4 text-gmo-green/40" />
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart data={monthRevenue} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1A7A2E" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#1A7A2E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="depGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#CC1717" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#CC1717" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => v > 0 ? `${(v/1000).toFixed(0)}k` : "0"} />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 12, border: "1px solid #e5e7eb", boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
                formatter={v => [`${Number(v).toLocaleString()} FCFA`]}
              />
              <Area type="monotone" dataKey="revenus" stroke="#1A7A2E" strokeWidth={2.5} fill="url(#revGrad)" name="Revenus" dot={{ r: 3, fill: "#1A7A2E", strokeWidth: 0 }} activeDot={{ r: 5 }} />
              <Area type="monotone" dataKey="depenses" stroke="#CC1717" strokeWidth={2} fill="url(#depGrad)" name="Dépenses" dot={{ r: 2.5, fill: "#CC1717", strokeWidth: 0 }} activeDot={{ r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie + Activity */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 card-hover">
            <h3 className="font-heading text-sm font-bold text-obsidian mb-1">Statuts commandes</h3>
            <p className="text-[10px] text-obsidian/35 font-body mb-3">{(orders||[]).length} total</p>
            {orderPie.length === 0 ? (
              <div className="flex items-center justify-center h-28"><p className="text-xs text-obsidian/20 font-body">Aucune commande</p></div>
            ) : (
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={orderPie} cx="50%" cy="50%" innerRadius={38} outerRadius={58} dataKey="value" paddingAngle={3}>
                    {orderPie.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                  <Legend iconType="circle" iconSize={6} formatter={v => <span style={{ fontSize: 9, color: "#6b7280" }}>{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Activity + low stock row */}
      <div className="grid lg:grid-cols-2 gap-4">
        <RecentActivity orders={orders} invoices={invoices} />

        {/* Modules */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 card-hover">
          <h3 className="font-heading text-sm font-bold text-obsidian mb-4">Accès rapide</h3>
          <div className="grid grid-cols-3 gap-2">
            {modules.map(m => (
              <button key={m.id} onClick={() => setTab(m.id)}
                className="flex flex-col items-center p-3 rounded-xl hover:bg-gray-50 transition-colors group text-center">
                <div className={`w-8 h-8 ${m.color} rounded-xl flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform duration-200`}>
                  <m.icon className="w-3.5 h-3.5 text-white" />
                </div>
                <p className="font-body text-[10px] text-obsidian/60 leading-tight">{m.label}</p>
                {m.count !== null && <p className="text-[9px] text-obsidian/30 font-body">{m.count}</p>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stock alert */}
      {lowStock.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <p className="font-heading text-sm font-bold text-amber-800">{lowStock.length} produit(s) en stock critique</p>
            <button onClick={() => setTab("stock")} className="ml-auto text-[10px] text-amber-600 hover:text-amber-800 font-body border border-amber-300 px-2 py-0.5 rounded-lg transition-colors flex items-center gap-1">
              Gérer <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStock.slice(0, 6).map(p => (
              <span key={p.id} className="text-[11px] bg-white border border-amber-200 text-amber-700 px-2.5 py-0.5 rounded-full font-body">
                {p.name} — {p.stock_quantity} {p.unit}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}