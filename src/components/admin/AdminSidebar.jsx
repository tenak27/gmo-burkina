import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import {
  LayoutDashboard, Users, UserCheck, FileText, Truck, Package,
  Tag, Warehouse, BarChart2, BookOpen, Users2, ShoppingCart,
  Shield, Globe, Bell, LogOut, ChevronRight, Menu, X, Search,
  DollarSign, TrendingDown, Navigation, Home, ChevronDown,
  Settings, Clock
} from "lucide-react";

const GROUPS = [
  {
    label: null,
    items: [{ id: "dashboard", label: "Dashboard", icon: LayoutDashboard }],
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
      { id: "orders",   label: "Commandes",       icon: ShoppingCart, badge: true },
      { id: "invoices", label: "Devis / Factures", icon: FileText },
    ],
  },
  {
    label: "Stock",
    items: [
      { id: "products",   label: "Produits",         icon: Package },
      { id: "categories", label: "Catégories",        icon: Tag },
      { id: "warehouses", label: "Entrepôts",          icon: Warehouse },
      { id: "stock",      label: "Mouvements stock",  icon: BarChart2 },
    ],
  },
  {
    label: "Livraison",
    items: [
      { id: "delivery", label: "Bons de livraison", icon: Truck },
      { id: "drivers",  label: "Chauffeurs",         icon: Navigation },
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
      { id: "hr",    label: "Ressources humaines", icon: Users2 },
      { id: "users", label: "Utilisateurs",         icon: Shield },
    ],
  },
];

const allItems = GROUPS.flatMap(g => g.items);

const TAB_LABELS = Object.fromEntries(allItems.map(i => [i.id, i.label]));

function Clock_() {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  return (
    <span className="font-body text-xs text-white/40 tabular-nums">
      {time.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
    </span>
  );
}

function CommandPalette({ onNavigate, onClose }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const results = query ? allItems.filter(i => i.label.toLowerCase().includes(query.toLowerCase())) : allItems;

  useEffect(() => { inputRef.current?.focus(); }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#1a1d2e] rounded-2xl shadow-2xl overflow-hidden border border-white/10">
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
                <div className="w-7 h-7 bg-white/6 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#4f46e5]/20 transition-colors">
                  <Icon className="w-3.5 h-3.5 text-white/40 group-hover:text-[#818cf8] transition-colors" />
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
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setCmdOpen(s => !s); }
      if (e.key === "Escape") { setCmdOpen(false); setUserMenuOpen(false); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const navigate = (id) => { setTab(id); setMobileOpen(false); };

  // ── Sidebar inner content ──
  const SidebarContent = ({ mobile = false }) => (
    <div className={`flex flex-col h-full overflow-hidden ${mobile ? "w-64" : collapsed ? "w-16" : "w-60"} transition-all duration-300`}>

      {/* Brand */}
      <div className={`flex items-center h-16 border-b border-white/[0.07] flex-shrink-0 ${collapsed && !mobile ? "justify-center px-3" : "px-5 gap-3"}`}>
        <img src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c7662a636_logo-gmo2x.png"
          alt="GMO" className="h-7 w-auto brightness-0 invert opacity-90 flex-shrink-0" />
        {(!collapsed || mobile) && (
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-heading font-bold text-white leading-tight">GMO Burkina</p>
            <p className="text-[9px] text-gmo-green uppercase tracking-[0.2em] font-body">ERP · Admin</p>
          </div>
        )}
        {(!collapsed || mobile) && !mobile && (
          <button onClick={() => setCollapsed(true)}
            className="w-6 h-6 rounded-md flex items-center justify-center text-white/25 hover:text-white/70 hover:bg-white/8 transition-all flex-shrink-0">
            <Menu className="w-3.5 h-3.5" />
          </button>
        )}
        {mobile && (
          <button onClick={() => setMobileOpen(false)} className="text-white/40 hover:text-white ml-auto">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search */}
      {(!collapsed || mobile) && (
        <div className="px-3 pt-3 pb-1 flex-shrink-0">
          <button onClick={() => setCmdOpen(true)}
            className="w-full flex items-center gap-2.5 bg-white/[0.07] hover:bg-white/[0.1] rounded-xl px-3 py-2 text-left transition-all border border-white/[0.06]">
            <Search className="w-3.5 h-3.5 text-white/30" />
            <span className="text-xs text-white/30 font-body flex-1">Search menu…</span>
            <kbd className="text-[8px] text-white/20 font-body border border-white/10 rounded px-1 py-0.5">⌘K</kbd>
          </button>
        </div>
      )}
      {collapsed && !mobile && (
        <div className="px-2 pt-3 pb-1 flex-shrink-0">
          <button onClick={() => setCmdOpen(true)}
            className="w-full flex items-center justify-center bg-white/[0.07] hover:bg-white/[0.1] rounded-xl p-2 transition-all">
            <Search className="w-3.5 h-3.5 text-white/40" />
          </button>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-px">
        {GROUPS.map((group, gi) => (
          <div key={gi} className={gi > 0 ? "mt-4" : ""}>
            {group.label && (!collapsed || mobile) && (
              <p className="text-[9px] font-heading uppercase tracking-[0.3em] text-white/25 px-3 mb-1.5 mt-1">
                {group.label}
              </p>
            )}
            {group.label && collapsed && !mobile && (
              <div className="h-px bg-white/[0.07] mx-2 mb-2 mt-3" />
            )}
            {group.items.map(item => {
              const Icon = item.icon;
              const isActive = tab === item.id;
              const showBadge = item.badge && pendingOrders > 0;
              return (
                <button key={item.id}
                  onClick={() => navigate(item.id)}
                  title={collapsed && !mobile ? item.label : ""}
                  className={`w-full flex items-center gap-3 rounded-xl text-left transition-all duration-150 group relative
                    ${collapsed && !mobile ? "justify-center p-2.5" : "px-3 py-2"}
                    ${isActive
                      ? "bg-[#4f46e5] text-white shadow-lg shadow-[#4f46e5]/25"
                      : "text-white/50 hover:text-white/90 hover:bg-white/[0.07]"
                    }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-white" : "text-white/40 group-hover:text-white/80"}`} />
                  {(!collapsed || mobile) && (
                    <span className={`text-[13px] font-body truncate flex-1 ${isActive ? "font-semibold text-white" : "font-normal"}`}>
                      {item.label}
                    </span>
                  )}
                  {showBadge && (!collapsed || mobile) && (
                    <span className="bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 min-w-[18px] text-center">
                      {pendingOrders}
                    </span>
                  )}
                  {showBadge && collapsed && !mobile && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom: expand button (collapsed) + user */}
      <div className="flex-shrink-0 border-t border-white/[0.07] p-2">
        {collapsed && !mobile && (
          <button onClick={() => setCollapsed(false)}
            className="w-full flex items-center justify-center p-2.5 rounded-xl text-white/25 hover:text-white/70 hover:bg-white/[0.07] transition-all mb-2">
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
        {(!collapsed || mobile) ? (
          <div className="flex items-center gap-2.5 rounded-xl bg-white/[0.06] px-3 py-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.full_name?.charAt(0) || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-heading font-semibold text-white truncate leading-tight">{user?.full_name}</p>
              <p className="text-[9px] text-white/35 font-body truncate">PDG</p>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <Link to="/" title="Site public"
                className="w-6 h-6 rounded-lg flex items-center justify-center text-white/25 hover:text-white/70 hover:bg-white/10 transition-all">
                <Globe className="w-3 h-3" />
              </Link>
              <button onClick={() => logout()} title="Déconnexion"
                className="w-6 h-6 rounded-lg flex items-center justify-center text-white/25 hover:text-red-400 hover:bg-red-500/10 transition-all">
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] flex items-center justify-center text-white text-xs font-bold">
              {user?.full_name?.charAt(0) || "A"}
            </div>
            <button onClick={() => logout()}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/25 hover:text-red-400 hover:bg-red-500/10 transition-all">
              <LogOut className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // ── Topbar (content area) ──
  const currentLabel = TAB_LABELS[tab] || "Dashboard";

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className={`hidden lg:flex flex-col bg-[#0f1117] border-r border-white/[0.07] h-screen sticky top-0 flex-shrink-0 transition-all duration-300 ${collapsed ? "w-16" : "w-60"}`}>
        <SidebarContent />
      </aside>

      {/* ── Desktop topbar (injected via portal-like sticky bar on main) ── */}
      <div className="hidden lg:flex fixed top-0 left-0 right-0 z-40 pointer-events-none">
        {/* spacer = sidebar width */}
        <div className={`flex-shrink-0 transition-all duration-300 ${collapsed ? "w-16" : "w-60"}`} />
        <div className="flex-1 pointer-events-auto">
          <div className="h-14 bg-white border-b border-gray-100 shadow-sm flex items-center justify-between px-6">
            {/* Left: Hamburger + breadcrumb */}
            <div className="flex items-center gap-3">
              <button onClick={() => setCollapsed(s => !s)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all">
                <Menu className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1.5 text-xs font-body text-gray-400">
                <Home className="w-3.5 h-3.5" />
                <span className="text-gray-300">/</span>
                <span className="text-gray-600 font-medium">{currentLabel}</span>
              </div>
            </div>
            {/* Right: clock + notifications + user */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
                <Clock className="w-3 h-3 text-gray-400" />
                <Clock_ />
              </div>
              {pendingOrders > 0 && (
                <button onClick={() => setTab("orders")}
                  className="relative w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all">
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center font-bold">{pendingOrders}</span>
                </button>
              )}
              <div className="relative">
                <button onClick={() => setUserMenuOpen(s => !s)}
                  className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 transition-all">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] flex items-center justify-center text-white text-[10px] font-bold">
                    {user?.full_name?.charAt(0) || "A"}
                  </div>
                  <span className="text-xs text-gray-600 font-body hidden sm:block max-w-[120px] truncate">Hi, {user?.full_name}</span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-xs font-heading font-bold text-gray-800">{user?.full_name}</p>
                      <p className="text-[10px] text-gray-400 font-body truncate">{user?.email}</p>
                    </div>
                    <Link to="/" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-body text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                      <Globe className="w-3.5 h-3.5 text-gray-400" /> Site public
                    </Link>
                    <button onClick={() => logout()}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-body text-red-500 hover:bg-red-50 transition-colors">
                      <LogOut className="w-3.5 h-3.5" /> Déconnexion
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile top bar ── */}
      <div className="lg:hidden bg-[#0f1117] border-b border-white/[0.07] sticky top-0 z-50 flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="text-white/50 hover:text-white transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <img src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c7662a636_logo-gmo2x.png"
            alt="GMO" className="h-7 brightness-0 invert opacity-90" />
          <span className="text-[9px] text-[#818cf8] uppercase tracking-widest font-body">ERP</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setCmdOpen(true)} className="text-white/40 hover:text-white/80 transition-colors">
            <Search className="w-4 h-4" />
          </button>
          {pendingOrders > 0 && (
            <button onClick={() => setTab("orders")} className="relative">
              <Bell className="w-4 h-4 text-white/50" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center font-bold">{pendingOrders}</span>
            </button>
          )}
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] flex items-center justify-center text-white text-[10px] font-bold">
            {user?.full_name?.charAt(0) || "A"}
          </div>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 bg-[#0f1117] flex shadow-2xl animate-slide-in-left">
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

      {/* Click outside user menu */}
      {userMenuOpen && (
        <div className="fixed inset-0 z-30" onClick={() => setUserMenuOpen(false)} />
      )}
    </>
  );
}