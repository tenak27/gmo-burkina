import React from "react";
import { Link } from "react-router-dom";
import { Users, Package, ShoppingCart, TrendingUp, AlertTriangle, Eye, Globe, FileText, Truck, UserCheck, DollarSign, Warehouse } from "lucide-react";

export default function DashboardTab({ data, setTab }) {
  const { users, products, orders, clients, suppliers, invoices, employees, entries } = data;

  const totalRevenue = (invoices || []).filter(i => i.status === "paye").reduce((s, i) => s + (i.total || 0), 0);
  const pendingOrders = (orders || []).filter(o => o.status === "en_attente").length;
  const lowStock = (products || []).filter(p => p.stock_quantity <= (p.stock_alert || 10)).length;
  const unpaidInvoices = (invoices || []).filter(i => i.status === "envoye" || i.status === "partiel").length;

  const kpis = [
    { label: "Clients", value: (clients || []).length, icon: Users, color: "text-blue-600", bg: "bg-blue-50", tab: "clients" },
    { label: "Fournisseurs", value: (suppliers || []).length, icon: UserCheck, color: "text-purple-600", bg: "bg-purple-50", tab: "suppliers" },
    { label: "Produits", value: (products || []).length, icon: Package, color: "text-gmo-green", bg: "bg-green-50", tab: "products" },
    { label: "Commandes", value: (orders || []).length, icon: ShoppingCart, color: "text-amber-600", bg: "bg-amber-50", tab: "orders" },
    { label: "CA (factures payées)", value: totalRevenue > 0 ? `${(totalRevenue/1000).toFixed(0)}k FCFA` : "—", icon: DollarSign, color: "text-gmo-green", bg: "bg-green-50", tab: "accounting" },
    { label: "Factures impayées", value: unpaidInvoices, icon: FileText, color: unpaidInvoices > 0 ? "text-red-500" : "text-green-600", bg: unpaidInvoices > 0 ? "bg-red-50" : "bg-green-50", tab: "invoices" },
    { label: "Employés actifs", value: (employees || []).filter(e => e.status === "actif").length, icon: Users, color: "text-indigo-600", bg: "bg-indigo-50", tab: "hr" },
    { label: "Alertes stock", value: lowStock, icon: AlertTriangle, color: lowStock > 0 ? "text-amber-600" : "text-green-600", bg: lowStock > 0 ? "bg-amber-50" : "bg-green-50", tab: "stock" },
  ];

  const modules = [
    { id: "clients",    label: "Clients",            icon: Users,       color: "from-blue-500 to-cyan-500",       count: (clients||[]).length },
    { id: "suppliers",  label: "Fournisseurs",        icon: UserCheck,   color: "from-purple-500 to-violet-500",   count: (suppliers||[]).length },
    { id: "invoices",   label: "Devis / Factures",    icon: FileText,    color: "from-gmo-green to-emerald-500",   count: (invoices||[]).length },
    { id: "delivery",   label: "Bons de livraison",   icon: Truck,       color: "from-orange-500 to-amber-400",    count: null },
    { id: "products",   label: "Catalogue produits",  icon: Package,     color: "from-teal-500 to-green-500",      count: (products||[]).length },
    { id: "warehouses", label: "Entrepôts",           icon: Warehouse,   color: "from-cyan-500 to-sky-500",        count: null },
    { id: "stock",      label: "Mouvements stock",    icon: TrendingUp,  color: "from-indigo-500 to-blue-500",     count: null },
    { id: "accounting", label: "Comptabilité",        icon: DollarSign,  color: "from-gmo-green to-teal-500",      count: (entries||[]).length },
    { id: "hr",         label: "Ressources humaines", icon: Users,       color: "from-pink-500 to-rose-500",       count: (employees||[]).length },
    { id: "orders",     label: "Commandes clients",   icon: ShoppingCart,color: "from-amber-500 to-yellow-400",    count: pendingOrders > 0 ? `${pendingOrders} en attente` : (orders||[]).length },
    { id: "users",      label: "Utilisateurs app",    icon: Users,       color: "from-slate-500 to-gray-600",      count: (users||[]).length },
  ];

  return (
    <div>
      <div className="mb-5">
        <h1 className="font-heading text-xl font-bold text-white">Tableau de bord ERP</h1>
        <p className="text-xs text-white/30 font-body mt-0.5">GMO Burkina · IAM TECHNOLOGY · Développé par Armand Olivier KONATE</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {kpis.map(k => (
          <button key={k.label} onClick={() => setTab(k.tab)}
            className="rounded-xl p-4 text-left transition-all hover:-translate-y-0.5 cursor-pointer"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(26,122,46,0.12)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>
            <div className={`w-8 h-8 ${k.bg} rounded-lg flex items-center justify-center mb-2`}>
              <k.icon className={`w-4 h-4 ${k.color}`} />
            </div>
            <p className={`font-heading text-xl font-bold ${k.color}`}>{k.value}</p>
            <p className="text-[11px] text-white/40 font-body leading-tight">{k.label}</p>
          </button>
        ))}
      </div>

      {/* Modules grid */}
      <p className="text-[10px] uppercase tracking-widest text-white/25 font-heading mb-3">Modules de gestion</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
        {modules.map(m => (
          <button key={m.id} onClick={() => setTab(m.id)}
            className="rounded-xl p-4 text-left group cursor-pointer transition-all hover:-translate-y-0.5"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(26,122,46,0.12)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}>
            <div className={`w-9 h-9 bg-gradient-to-br ${m.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm`}>
              <m.icon className="w-4 h-4 text-white" />
            </div>
            <p className="font-heading text-sm font-bold text-white/80">{m.label}</p>
            {m.count !== null && <p className="text-[11px] text-white/30 font-body mt-0.5">{m.count} enregistrements</p>}
          </button>
        ))}
      </div>

      {/* Low stock alert */}
      {lowStock > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <p className="font-heading text-sm font-bold text-amber-800">{lowStock} produit(s) en stock critique</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(products||[]).filter(p => p.stock_quantity <= (p.stock_alert || 10)).slice(0,5).map(p => (
              <span key={p.id} className="text-[11px] bg-white border border-amber-200 text-amber-700 px-2.5 py-0.5 rounded-full font-body">
                {p.name} — {p.stock_quantity} {p.unit}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-4">
        <Link to="/client" className="text-[11px] text-white/30 hover:text-gmo-green font-body px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
          <Eye className="w-3 h-3" /> Vue Client
        </Link>
        <Link to="/detaillant" className="text-[11px] text-white/30 hover:text-gmo-red font-body px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
          <Eye className="w-3 h-3" /> Vue Détaillant
        </Link>
        <Link to="/" className="text-[11px] text-white/30 hover:text-white font-body px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
          <Globe className="w-3 h-3" /> Site public
        </Link>
      </div>
    </div>
  );
}