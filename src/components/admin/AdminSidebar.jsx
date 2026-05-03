import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import {
  LayoutDashboard, Users, UserCheck, FileText, Truck, Package,
  Tag, Warehouse, BarChart2, BookOpen, Users2, ShoppingCart,
  Shield, Globe, Bell, LogOut, ChevronRight, Menu, X, Search, Command
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
      { id: "delivery", label: "Bons de livraison", icon: Truck },
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
    label: "Finance",
    items: [{ id: "accounting", label: "Comptabilité", icon: BookOpen }],
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
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100">
          <Search className="w-4 h-4 text-obsidian/30 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Naviguer vers un module…"
            className="flex-1 text-sm font-body text-obsidian placeholder:text-obsidian/25 focus:outline-none"
          />
          <kbd className="text-[9px] text-obsidian/25 font-body border border-gray-200 rounded px-1.5 py-0.5">ESC</kbd>
        </div>
        {/* Results */}
        <div className="max-h-72 overflow-y-auto py-2">
          {results.map(item => {
            const Icon = item.icon;
            return (
              <button key={item.id} onClick={() => { onNavigate(item.id); onClose(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left transition-colors group">
                <div className="w-7 h-7 bg-obsidian/5 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gmo-green/10 transition-colors">
                  <Icon className="w-3.5 h-3.5 text-obsidian/50 group-hover:text-gmo-green transition-colors" />
                </div>
                <span className="text-sm font-body text-obsidian/70 group-hover:text-obsidian">{item.label}</span>
              </button>
            );
          })}
        </div>
        <div className="px-4 py-2 border-t border-gray-50 flex items-center gap-2">
          <Command className="w-3 h-3 text-obsidian/20" />
          <span className="text-[10px] text-obsidian/25 font-body">K pour ouvrir · Echap pour fermer</span>
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

  // Cmd+K shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setCmdOpen(s => !s); }
      if (e.key === "Escape") setCmdOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const SidebarContent = ({ mobile = false }) => (
    <div className={`flex flex-col h-full ${mobile ? "w-72" : collapsed ? "w-16" : "w-60"} transition-all duration-300 ease-in-out`}>
      {/* Logo + toggle */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/6 flex-shrink-0">
        {(!collapsed || mobile) && (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img
              src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c7662a636_logo-gmo2x.png"
              alt="GMO"
              className="h-7 w-auto brightness-0 invert opacity-90 flex-shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] text-gmo-green/90 uppercase tracking-[0.28em] font-body whitespace-nowrap">ERP Admin</span>
              <span className="text-[8px] text-white/18 font-body whitespace-nowrap truncate">GMO Burkina</span>
            </div>
          </div>
        )}
        {collapsed && !mobile && (
          <img src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c7662a636_logo-gmo2x.png" alt="GMO" className="h-6 w-auto brightness-0 invert opacity-70 mx-auto" />
        )}
        {!mobile && (
          <button onClick={() => setCollapsed(!collapsed)}
            className="w-6 h-6 rounded-md bg-white/5 hover:bg-white/12 flex items-center justify-center text-white/25 hover:text-white/60 transition-all flex-shrink-0 ml-auto">
            <ChevronRight className={`w-3 h-3 transition-transform duration-300 ${collapsed ? "" : "rotate-180"}`} />
          </button>
        )}
        {mobile && (
          <button onClick={() => setMobileOpen(false)} className="text-white/40 hover:text-white ml-auto">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search bar (expanded only) */}
      {(!collapsed || mobile) && (
        <div className="px-3 py-2.5 border-b border-white/5">
          <button onClick={() => setCmdOpen(true)}
            className="w-full flex items-center gap-2 bg-white/5 hover:bg-white/8 border border-white/8 rounded-lg px-3 py-2 text-left transition-all group">
            <Search className="w-3 h-3 text-white/25 group-hover:text-white/50 transition-colors" />
            <span className="text-[11px] text-white/25 group-hover:text-white/50 font-body flex-1 transition-colors">Rechercher…</span>
            <kbd className="text-[8px] text-white/15 font-body border border-white/10 rounded px-1 py-0.5 flex-shrink-0">⌘K</kbd>
          </button>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-px">
        {GROUPS.map((group, gi) => (
          <div key={gi} className={gi > 0 ? "mt-4" : ""}>
            {group.label && (!collapsed || mobile) && (
              <p className="text-[8px] uppercase tracking-[0.35em] text-white/18 font-heading px-2.5 mb-1.5">
                {group.label}
              </p>
            )}
            {group.label && collapsed && !mobile && <div className="h-px bg-white/8 mx-2 my-3" />}
            {group.items.map(item => {
              const Icon = item.icon;
              const isActive = tab === item.id;
              const showBadge = item.badge && pendingOrders > 0;
              return (
                <button
                  key={item.id}
                  onClick={() => { setTab(item.id); if (mobile) setMobileOpen(false); }}
                  title={collapsed && !mobile ? item.label : ""}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-all duration-150 group relative ${
                    isActive
                      ? "bg-gmo-green/18 text-gmo-green border border-gmo-green/25 shadow-sm shadow-gmo-green/5"
                      : "text-white/38 hover:text-white/75 hover:bg-white/6 border border-transparent"
                  } ${collapsed && !mobile ? "justify-center" : ""}`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? "text-gmo-green" : "text-white/30 group-hover:text-white/65"}`} />
                  {(!collapsed || mobile) && (
                    <span className={`text-[11px] font-body font-medium truncate flex-1 ${isActive ? "font-semibold" : ""}`}>{item.label}</span>
                  )}
                  {showBadge && (!collapsed || mobile) && (
                    <span className="bg-gmo-red text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 animate-pulse">
                      {pendingOrders}
                    </span>
                  )}
                  {showBadge && collapsed && !mobile && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-gmo-red rounded-full animate-pulse" />
                  )}
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-gmo-green rounded-r-full" />}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="flex-shrink-0 border-t border-white/6 p-3">
        {(!collapsed || mobile) ? (
          <div className="flex items-center gap-2.5 px-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gmo-green to-gmo-green/50 flex items-center justify-center text-white text-[11px] font-bold font-heading flex-shrink-0 ring-2 ring-gmo-green/20">
              {user?.full_name?.charAt(0) || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-white/70 font-heading font-semibold truncate">{user?.full_name}</p>
              <p className="text-[9px] text-white/28 font-body truncate">{user?.email}</p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Link to="/" className="w-6 h-6 rounded-lg hover:bg-white/8 flex items-center justify-center text-white/20 hover:text-white/60 transition-all" title="Site public">
                <Globe className="w-3.5 h-3.5" />
              </Link>
              <button onClick={() => logout()} className="w-6 h-6 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-white/20 hover:text-red-400 transition-all" title="Déconnexion">
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gmo-green to-gmo-green/50 flex items-center justify-center text-white text-[11px] font-bold font-heading ring-2 ring-gmo-green/20">
              {user?.full_name?.charAt(0) || "A"}
            </div>
            <button onClick={() => logout()} className="w-6 h-6 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-white/20 hover:text-red-400 transition-all">
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
      <aside className={`hidden lg:flex flex-col bg-[#161618] border-r border-white/[0.06] h-screen sticky top-0 transition-all duration-300 flex-shrink-0 ${collapsed ? "w-16" : "w-60"}`}>
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden bg-[#161618] border-b border-white/[0.06] sticky top-0 z-50 flex items-center justify-between px-4 h-12">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="text-white/50 hover:text-white transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <img src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c7662a636_logo-gmo2x.png" alt="GMO" className="h-6 brightness-0 invert opacity-80" />
          <span className="text-[9px] text-gmo-green/60 uppercase tracking-widest font-body">ERP</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setCmdOpen(true)} className="text-white/30 hover:text-white/60 transition-colors">
            <Search className="w-4 h-4" />
          </button>
          {pendingOrders > 0 && (
            <button onClick={() => setTab("orders")} className="relative">
              <Bell className="w-4 h-4 text-white/40" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-gmo-red rounded-full text-[8px] text-white flex items-center justify-center font-bold animate-pulse">{pendingOrders}</span>
            </button>
          )}
          <div className="w-7 h-7 rounded-full bg-gmo-green flex items-center justify-center text-white text-[10px] font-bold ring-2 ring-gmo-green/20">
            {user?.full_name?.charAt(0) || "A"}
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 bg-[#161618] flex shadow-2xl animate-slide-in-left">
            <SidebarContent mobile />
          </div>
        </div>
      )}

      {/* Command palette */}
      {cmdOpen && (
        <CommandPalette
          onNavigate={(id) => { setTab(id); setMobileOpen(false); }}
          onClose={() => setCmdOpen(false)}
        />
      )}
    </>
  );
}