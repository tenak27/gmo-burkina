import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Users, Package, ShoppingCart, TrendingUp, AlertTriangle,
  Eye, Globe, FileText, Truck, UserCheck, DollarSign,
  Warehouse, Users2, Tag, CheckCircle2, Clock, XCircle, BarChart2
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
    const m = d.getMonth();
    const y = d.getFullYear();
    const rev = (invoices || [])
      .filter(inv => {
        const id = new Date(inv.created_date);
        return id.getMonth() === m && id.getFullYear() === y && inv.status === "paye";
      })
      .reduce((s, inv) => s + (inv.total || 0), 0);
    const dep = (entries || [])
      .filter(e => {
        const ed = new Date(e.date || e.created_date);
        return ed.getMonth() === m && ed.getFullYear() === y && e.type === "depense";
      })
      .reduce((s, e) => s + (e.amount || 0), 0);
    return { month: MONTHS[m], revenus: rev, depenses: dep };
  });
}

function buildOrderStatusData(orders) {
  const counts = {};
  (orders || []).forEach(o => { counts[o.status] = (counts[o.status] || 0) + 1; });
  const labels = {
    en_attente: "Attente", confirmee: "Confirmée", en_preparation: "Prépa.",
    en_livraison: "Livraison", livree: "Livrée", annulee: "Annulée"
  };
  const colors = ["#F5C400","#3B82F6","#8B5CF6","#1A7A2E","#10B981","#EF4444"];
  return Object.entries(counts).map(([k, v], i) => ({
    name: labels[k] || k, value: v, color: colors[i % colors.length]
  }));
}

export default function DashboardVisual({ data, setTab }) {
  const { users, products, orders, clients, suppliers, invoices, employees, entries } = data;

  const totalRevenue = (invoices || []).filter(i => i.status === "paye").reduce((s, i) => s + (i.total || 0), 0);
  const pendingInvoices = (invoices || []).filter(i => i.status === "envoye" || i.status === "partiel");
  const pendingOrders = (orders || []).filter(o => o.status === "en_attente").length;
  const lowStock = (products || []).filter(p => p.stock_quantity <= (p.stock_alert || 10));
  const validatedQuotes = (invoices || []).filter(i => i.type === "devis" && i.status === "paye").length;
  const monthRevenue = buildRevenueData(invoices, entries);
  const orderPie = buildOrderStatusData(orders);

  const kpis = [
    { label: "Chiffre d'affaires", value: totalRevenue > 0 ? `${(totalRevenue / 1000).toFixed(0)}k` : "—", unit: "FCFA", icon: DollarSign, color: "text-gmo-green", bg: "from-gmo-green/10 to-gmo-green/5", border: "border-gmo-green/20", tab: "accounting" },
    { label: "Commandes en attente", value: pendingOrders, unit: "ordres", icon: ShoppingCart, color: pendingOrders > 0 ? "text-amber-500" : "text-green-600", bg: pendingOrders > 0 ? "from-amber-50 to-amber-50/50" : "from-green-50 to-green-50/50", border: pendingOrders > 0 ? "border-amber-200" : "border-green-200", tab: "orders" },
    { label: "Factures impayées", value: pendingInvoices.length, unit: "en attente", icon: FileText, color: pendingInvoices.length > 0 ? "text-red-500" : "text-green-600", bg: pendingInvoices.length > 0 ? "from-red-50 to-red-50/50" : "from-green-50 to-green-50/50", border: pendingInvoices.length > 0 ? "border-red-200" : "border-green-200", tab: "invoices" },
    { label: "Devis validés", value: validatedQuotes, unit: "ce mois", icon: CheckCircle2, color: "text-blue-600", bg: "from-blue-50 to-blue-50/50", border: "border-blue-200", tab: "invoices" },
    { label: "Clients actifs", value: (clients || []).filter(c => c.is_active !== false).length, unit: "partenaires", icon: Users, color: "text-purple-600", bg: "from-purple-50 to-purple-50/50", border: "border-purple-200", tab: "clients" },
    { label: "Alertes stock", value: lowStock.length, unit: "produits", icon: AlertTriangle, color: lowStock.length > 0 ? "text-amber-600" : "text-green-600", bg: lowStock.length > 0 ? "from-amber-50 to-amber-50/50" : "from-green-50 to-green-50/50", border: lowStock.length > 0 ? "border-amber-200" : "border-green-200", tab: "stock" },
  ];

  const modules = [
    { id: "clients", label: "Clients", icon: Users, color: "bg-blue-500", count: (clients||[]).length },
    { id: "suppliers", label: "Fournisseurs", icon: UserCheck, color: "bg-purple-500", count: (suppliers||[]).length },
    { id: "invoices", label: "Devis / Factures", icon: FileText, color: "bg-gmo-green", count: (invoices||[]).length },
    { id: "delivery", label: "Bons livraison", icon: Truck, color: "bg-orange-500", count: null },
    { id: "products", label: "Produits", icon: Package, color: "bg-teal-500", count: (products||[]).length },
    { id: "warehouses", label: "Entrepôts", icon: Warehouse, color: "bg-cyan-500", count: null },
    { id: "stock", label: "Mouvements", icon: BarChart2, color: "bg-indigo-500", count: null },
    { id: "accounting", label: "Comptabilité", icon: DollarSign, color: "bg-emerald-500", count: (entries||[]).length },
    { id: "hr", label: "RH", icon: Users2, color: "bg-pink-500", count: (employees||[]).length },
    { id: "orders", label: "Commandes", icon: ShoppingCart, color: "bg-amber-500", count: (orders||[]).length },
    { id: "categories", label: "Catégories", icon: Tag, color: "bg-rose-500", count: null },
    { id: "users", label: "Utilisateurs", icon: Users, color: "bg-gray-600", count: (users||[]).length },
  ];

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-obsidian">Tableau de bord ERP</h1>
          <p className="text-xs text-obsidian/40 font-body mt-0.5">Groupe Madina Oumarou · Vue temps réel</p>
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
            className={`bg-gradient-to-br ${k.bg} rounded-2xl p-4 border ${k.border} shadow-sm hover:shadow-md transition-all duration-200 text-left group hover:-translate-y-0.5`}>
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                <k.icon className={`w-4 h-4 ${k.color}`} />
              </div>
              <span className={`text-[9px] font-body uppercase tracking-widest ${k.color} opacity-60`}>{k.unit}</span>
            </div>
            <p className={`font-heading text-2xl font-bold ${k.color}`}>{k.value}</p>
            <p className="text-[11px] text-obsidian/50 font-body mt-0.5 leading-tight">{k.label}</p>
          </button>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading text-sm font-bold text-obsidian">Revenus vs Dépenses</h3>
              <p className="text-[10px] text-obsidian/35 font-body">6 derniers mois</p>
            </div>
            <TrendingUp className="w-4 h-4 text-gmo-green/50" />
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={monthRevenue} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1A7A2E" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1A7A2E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="depGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#CC1717" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#CC1717" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => v > 0 ? `${(v/1000).toFixed(0)}k` : "0"} />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 10, border: "1px solid #e5e7eb", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                formatter={v => [`${v.toLocaleString()} FCFA`]}
              />
              <Area type="monotone" dataKey="revenus" stroke="#1A7A2E" strokeWidth={2} fill="url(#revGrad)" name="Revenus" />
              <Area type="monotone" dataKey="depenses" stroke="#CC1717" strokeWidth={2} fill="url(#depGrad)" name="Dépenses" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Order status pie */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="mb-4">
            <h3 className="font-heading text-sm font-bold text-obsidian">Statuts commandes</h3>
            <p className="text-[10px] text-obsidian/35 font-body">{(orders||[]).length} total</p>
          </div>
          {orderPie.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-xs text-obsidian/25 font-body">Aucune commande</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={orderPie} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                  {orderPie.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                <Legend iconType="circle" iconSize={6} formatter={(v) => <span style={{ fontSize: 9, color: "#6b7280" }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Modules grid */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-obsidian/30 font-heading mb-3">Modules de gestion</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          {modules.map(m => (
            <button key={m.id} onClick={() => setTab(m.id)}
              className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm hover:shadow-md hover:border-gmo-green/20 transition-all duration-200 text-left group hover:-translate-y-0.5">
              <div className={`w-8 h-8 ${m.color} rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200`}>
                <m.icon className="w-3.5 h-3.5 text-white" />
              </div>
              <p className="font-heading text-[11px] font-bold text-obsidian leading-tight">{m.label}</p>
              {m.count !== null && <p className="text-[9px] text-obsidian/30 font-body mt-0.5">{m.count}</p>}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts */}
      {lowStock.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <p className="font-heading text-sm font-bold text-amber-800">{lowStock.length} produit(s) en stock critique</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStock.slice(0, 5).map(p => (
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