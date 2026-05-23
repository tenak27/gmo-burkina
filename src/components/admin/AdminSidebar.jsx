import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import {
  LayoutDashboard, Users, UserCheck, FileText, Truck, Package,
  Tag, Warehouse, BarChart2, BookOpen, Users2, ShoppingCart,
  Shield, Globe, LogOut, Menu, Search,
  DollarSign, TrendingDown, Navigation, X, Briefcase, TrendingUp, Bell, ChevronDown
} from "lucide-react";

const GROUPS = [
  {
    label: null,
    items: [{ id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard }],
  },
  {
    label: "CRM",
    items: [
      { id: "clients",   label: "Clients",      icon: Users },
      { id: "suppliers", label: "Fournisseurs",  icon: UserCheck },
    ],
  },
  {
    label: "Ventes",
    items: [
      { id: "orders",   label: "Commandes",        icon: ShoppingCart, badge: true },
      { id: "invoices", label: "Devis / Factures",  icon: FileText },
    ],
  },
  {
    label: "Stock",
    items: [
      { id: "products",   label: "Produits",    icon: Package },
      { id: "categories", label: "Catégories",  icon: Tag },
      { id: "warehouses", label: "Entrepôts",   icon: Warehouse },
      { id: "stock",      label: "Mouvements",  icon: BarChart2 },
    ],
  },
  {
    label: "Livraison",
    items: [
      { id: "delivery", label: "Livraisons", icon: Truck },
      { id: "drivers",  label: "Chauffeurs", icon: Navigation },
    ],
  },
  {
    label: "Finance",
    items: [
      { id: "accounting",  label: "Comptabilité", icon: BookOpen },
      { id: "payments",    label: "Paiements",    icon: DollarSign },
      { id: "receivables", label: "Créances",     icon: TrendingDown },
    ],
  },
  {
    label: "RH & Admin",
    items: [
      { id: "hr",           label: "RH",           icon: Users2 },
      { id: "applications", label: "Candidatures", icon: Briefcase, badgeKey: "applications" },
      { id: "users",        label: "Utilisateurs", icon: Shield },
    ],
  },
  {
    label: "Analytics",
    items: [
      { id: "stats", label: "Statistiques", icon: TrendingUp },
    ],
  },
];

function CommandPalette({ onNavigate, onClose }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const allItems = GROUPS.flatMap(g => g.items);
  const results = query
    ? allItems.filter(i => i.label.toLowerCase().includes(query.toLowerCase()))
    : allItems;

  useEffect(() => { inputRef.current?.focus(); }, []);

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-20 px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-xl overflow-hidden border border-gray-200 shadow-2xl bg-white">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <Search className="w-4 h-4 text-gray-400" />
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Rechercher un module…"
            className="flex-1 text-sm text-gray-700 placeholder:text-gray-400 bg-transparent focus:outline-none" />
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"><X className="w-4 h-4" /></button>
        </div>
        <div className="max-h-72 overflow-y-auto py-1">
          {results.map(item => {
            const Icon = item.icon;
            return (
              <button key={item.id} onClick={() => { onNavigate(item.id); onClose(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-green-50 text-left transition-colors group cursor-pointer">
                <Icon className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors" />
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SidebarContent({ tab, setTab, pendingOrders, newApplications, onClose, user, logout }) {
  const navigate = (id) => { setTab(id); onClose?.(); };

  return (
    <div className="flex flex-col h-full w-[220px] bg-white">
      {/* Logo */}
      <div className="px-5 py-4 flex items-center gap-2.5 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center flex-shrink-0">
          <Shield className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-gray-900 text-sm font-bold leading-tight">GMO ERP</p>
          <p className="text-green-600 text-[10px] font-medium">Administration</p>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-3 px-3">
        {GROUPS.map((group, gi) => (
          <div key={gi} className={gi > 0 ? "mt-4" : ""}>
            {group.label && (
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400 px-2 mb-1">
                {group.label}
              </p>
            )}
            {group.items.map(item => {
              const Icon = item.icon;
              const isActive = tab === item.id;
              const showOrderBadge = item.badge && pendingOrders > 0;
              const showAppBadge = item.badgeKey === "applications" && newApplications > 0;
              return (
                <button key={item.id} onClick={() => navigate(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all duration-150 cursor-pointer mb-0.5 text-[13px]
                    ${isActive
                      ? "bg-green-50 text-green-700 font-semibold border-l-[3px] border-green-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-[3px] border-transparent"
                    }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-green-600" : "text-gray-400"}`} />
                  <span className="flex-1 truncate">{item.label}</span>
                  {showOrderBadge && (
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
                      {pendingOrders}
                    </span>
                  )}
                  {showAppBadge && (
                    <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
                      {newApplications}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* User */}
      <div className="p-3 border-t border-gray-100">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
          <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.full_name?.charAt(0) || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-gray-800 truncate">{user?.full_name}</p>
            <p className="text-[10px] text-gray-400">PDG · Admin</p>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link to="/" title="Site public" className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"><Globe className="w-3 h-3" /></Link>
            <button onClick={() => logout()} title="Déconnexion" className="text-gray-400 hover:text-red-500 cursor-pointer p-1"><LogOut className="w-3 h-3" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminSidebar({ tab, setTab, pendingOrders, newApplications }) {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setCmdOpen(s => !s); }
      if (e.key === "Escape") setCmdOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col h-screen sticky top-0 flex-shrink-0 w-[220px] border-r border-gray-200 bg-white">
        <SidebarContent tab={tab} setTab={setTab} pendingOrders={pendingOrders} newApplications={newApplications} user={user} logout={logout} />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-50 flex items-center justify-between px-4 h-14 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="text-gray-500 hover:text-gray-900 cursor-pointer"><Menu className="w-5 h-5" /></button>
          <div className="w-7 h-7 rounded-lg bg-green-600 flex items-center justify-center"><Shield className="w-4 h-4 text-white" /></div>
          <span className="text-gray-900 text-sm font-bold">GMO ERP</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setCmdOpen(true)} className="text-gray-400 hover:text-gray-700 cursor-pointer"><Search className="w-4 h-4" /></button>
          {pendingOrders > 0 && (
            <button onClick={() => setTab("orders")} className="relative cursor-pointer">
              <Bell className="w-4 h-4 text-gray-400" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-500 text-white rounded-full text-[8px] flex items-center justify-center font-bold">{pendingOrders}</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 shadow-xl animate-slide-in-left">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-green-600 flex items-center justify-center"><Shield className="w-4 h-4 text-white" /></div>
                <span className="text-gray-900 text-sm font-bold">GMO ERP</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-gray-400 hover:text-gray-700 cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <SidebarContent tab={tab} setTab={setTab} pendingOrders={pendingOrders} newApplications={newApplications}
              onClose={() => setMobileOpen(false)} user={user} logout={logout} />
          </div>
        </div>
      )}

      {cmdOpen && (
        <CommandPalette
          onNavigate={(id) => { setTab(id); setMobileOpen(false); }}
          onClose={() => setCmdOpen(false)}
        />
      )}
    </>
  );
}