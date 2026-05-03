import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import {
  LayoutDashboard, Users, UserCheck, FileText, Truck, Package,
  Tag, Warehouse, BarChart2, BookOpen, Users2, ShoppingCart,
  Shield, Globe, Bell, LogOut, ChevronRight, Menu, X, Search,
  DollarSign, TrendingDown, Navigation
} from "lucide-react";

const GROUPS = [
  {
    label: null,
    items: [{ id: "dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "CRM",
    items: [
      { id: "clients", label: "Clients", icon: Users },
      { id: "suppliers", label: "Fournisseurs", icon: UserCheck },
    ],
  },
  {
    label: "Ventes",
    items: [
      { id: "orders", label: "Commandes", icon: ShoppingCart, badge: true },
      { id: "invoices", label: "Devis / Factures", icon: FileText },
    ],
  },
  {
    label: "Stock",
    items: [
      { id: "products", label: "Produits", icon: Package },
      { id: "categories", label: "Catégories", icon: Tag },
      { id: "warehouses", label: "Entrepôts", icon: Warehouse },
      { id: "stock", label: "Mouvements stock", icon: BarChart2 },
    ],
  },
  {
    label: "Livraison",
    items: [
      { id: "delivery", label: "Bons de livraison", icon: Truck },
      { id: "drivers", label: "Chauffeurs", icon: Navigation },
    ],
  },
  {
    label: "Finance",
    items: [
      { id: "accounting", label: "Comptabilité", icon: BookOpen },
      { id: "payments", label: "Paiements", icon: DollarSign },
      { id: "receivables", label: "Créances", icon: TrendingDown },
    ],
  },
  {
    label: "RH & Admin",
    items: [
      { id: "hr", label: "Ressources humaines", icon: Users2 },
      { id: "users", label: "Utilisateurs", icon: Shield },
    ],
  },
];

const allItems = GROUPS.flatMap(g => g.items);

function CommandPalette({ onNavigate, onClose }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const results = query ? allItems.filter(i => i.label.toLowerCase().includes(query.toLowerCase())) : allItems;

  useEffect(() => { inputRef.current?.focus(); }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#1E1E22] rounded-2xl shadow-2xl overflow-hidden border border-white/10">
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/8">
          <Search className="w-4 h-4 text-white/40 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Naviguer vers un module…"
            className="flex-1 text-sm font-body text-white placeholder:text-white/25 focus:outline-none bg-transparent"
          />
          <kbd className="text-[9px] text-white/20 font-body border border-white/10 rounded px-1.5 py-0.5">ESC</kbd>
        </div>
        <div className="max-h-72 overflow-y-auto py-2">
          {results.map(item => {
            const Icon = item.icon;
            return (
              <button key={item.id} onClick={() => { onNavigate(item.id); onClose(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/6 text-left transition-colors group">
                <div className="w-7 h-7 bg-white/6 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gmo-green/15 transition-colors">
                  <Icon className="w-3.5 h-3.5 text-white/40 group-hover:text-gmo-green transition-colors" />
                </div>
                <span className="text-sm font-body text-white/55 group-hover:text-white/90">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function AdminSidebar({ tab, setTab, pendingOrders }) {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
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

  const SidebarContent = ({ mobile = false }) => (
    <div className={`flex flex-col h-full ${mobile ? "w-72" : collapsed ? "w-16" : "w-64"} transition-all duration-300 ease-in-out`}>
      
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 flex-shrink-0">
        {(!collapsed || mobile) && (
          <div className="flex items-center gap-3 overflow-hidden">
            <img
              src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c7662a636_logo-gmo2x.png"
              alt="GMO" className="h-8 w-auto brightness-0 invert flex-shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-heading font-bold text-white whitespace-nowrap">GMO Burkina</span>
              <span className="text-[9px] text-gmo-green uppercase tracking-[0.25em] font-body whitespace-nowrap">ERP Admin</span>
            </div>
          </div>
        )}
        {collapsed && !mobile && (
          <img src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c7662a636_logo-gmo2x.png" alt="GMO" className="h-7 w-auto brightness-0 invert opacity-80 mx-auto" />
        )}
        {!mobile && (
          <button onClick={() => setCollapsed(!collapsed)}
            className="w-7 h-7 rounded-lg bg-white/8 hover:bg-white/15 flex items-center justify-center text-white/50 hover:text-white transition-all flex-shrink-0 ml-auto">
            <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-300 ${collapsed ? "" : "rotate-180"}`} />
          </button>
        )}
        {mobile && (
          <button onClick={() => setMobileOpen(false)} className="text-white/50 hover:text-white ml-auto">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search */}
      {(!collapsed || mobile) && (
        <div className="px-3 pb-3">
          <button onClick={() => setCmdOpen(true)}
            className="w-full flex items-center gap-2.5 bg-white/8 hover:bg-white/12 border border-white/10 rounded-xl px-3 py-2.5 text-left transition-all group">
            <Search className="w-3.5 h-3.5 text-white/40 group-hover:text-white/70 transition-colors" />
            <span className="text-xs text-white/40 group-hover:text-white/70 font-body flex-1 transition-colors">Rechercher…</span>
            <kbd className="text-[8px] text-white/20 font-body border border-white/10 rounded px-1.5 py-0.5 flex-shrink-0">⌘K</kbd>
          </button>
        </div>
      )}

      <div className="h-px bg-white/8 mx-3 mb-2" />

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-0.5">
        {GROUPS.map((group, gi) => (
          <div key={gi} className={gi > 0 ? "mt-5" : ""}>
            {group.label && (!collapsed || mobile) && (
              <p className="text-[9px] uppercase tracking-[0.32em] text-white/45 font-heading px-3 mb-2">
                {group.label}
              </p>
            )}
            {group.label && collapsed && !mobile && <div className="h-px bg-white/8 mx-1 my-3" />}
            {group.items.map(item => {
              const Icon = item.icon;
              const isActive = tab === item.id;
              const showBadge = item.badge && pendingOrders > 0;
              return (
                <button
                  key={item.id}
                  onClick={() => { setTab(item.id); if (mobile) setMobileOpen(false); }}
                  title={collapsed && !mobile ? item.label : ""}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 group relative ${
                    isActive
                      ? "bg-gmo-green text-white shadow-md shadow-gmo-green/20"
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  } ${collapsed && !mobile ? "justify-center px-0" : ""}`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-white" : "text-white/55 group-hover:text-white"}`} />
                  {(!collapsed || mobile) && (
                    <span className={`text-sm font-body truncate flex-1 ${isActive ? "font-semibold text-white" : "font-normal"}`}>{item.label}</span>
                  )}
                  {showBadge && (!collapsed || mobile) && (
                    <span className="bg-gmo-red text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">
                      {pendingOrders}
                    </span>
                  )}
                  {showBadge && collapsed && !mobile && (
                    <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-gmo-red rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="h-px bg-white/8 mx-3 mt-2" />

      {/* User footer */}
      <div className="flex-shrink-0 p-3">
        {(!collapsed || mobile) ? (
          <div className="flex items-center gap-3 bg-white/6 rounded-xl px-3 py-2.5">
            <div className="w-8 h-8 rounded-full bg-gmo-green flex items-center justify-center text-white text-xs font-bold font-heading flex-shrink-0">
              {user?.full_name?.charAt(0) || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-heading font-semibold truncate leading-tight">{user?.full_name}</p>
              <p className="text-[10px] text-white/55 font-body truncate">{user?.email}</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Link to="/" className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/35 hover:text-white/80 transition-all" title="Site public">
                <Globe className="w-3.5 h-3.5" />
              </Link>
              <button onClick={() => logout()} className="w-7 h-7 rounded-lg hover:bg-red-500/15 flex items-center justify-center text-white/35 hover:text-red-400 transition-all" title="Déconnexion">
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gmo-green flex items-center justify-center text-white text-xs font-bold">
              {user?.full_name?.charAt(0) || "A"}
            </div>
            <button onClick={() => logout()} className="w-7 h-7 rounded-lg hover:bg-red-500/15 flex items-center justify-center text-white/35 hover:text-red-400 transition-all">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col bg-[#111113] border-r border-white/[0.07] h-screen sticky top-0 transition-all duration-300 flex-shrink-0 ${collapsed ? "w-16" : "w-64"}`}>
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden bg-[#111113] border-b border-white/[0.07] sticky top-0 z-50 flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="text-white/60 hover:text-white transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <img src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c7662a636_logo-gmo2x.png" alt="GMO" className="h-7 brightness-0 invert opacity-90" />
          <span className="text-[9px] text-gmo-green uppercase tracking-widest font-body">ERP</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setCmdOpen(true)} className="text-white/40 hover:text-white/80 transition-colors">
            <Search className="w-4 h-4" />
          </button>
          {pendingOrders > 0 && (
            <button onClick={() => setTab("orders")} className="relative">
              <Bell className="w-4 h-4 text-white/50" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-gmo-red rounded-full text-[8px] text-white flex items-center justify-center font-bold">{pendingOrders}</span>
            </button>
          )}
          <div className="w-8 h-8 rounded-full bg-gmo-green flex items-center justify-center text-white text-xs font-bold">
            {user?.full_name?.charAt(0) || "A"}
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 bg-[#111113] flex shadow-2xl animate-slide-in-left">
            <SidebarContent mobile />
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