import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import {
  LayoutDashboard, Users, UserCheck, FileText, Truck, Package,
  Tag, Warehouse, BarChart2, BookOpen, Users2, ShoppingCart,
  Shield, Globe, LogOut, Menu, Search,
  DollarSign, TrendingDown, Navigation, X, Briefcase, TrendingUp, Bell, Settings, ChevronRight, Wallet
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
      { id: "orders",   label: "Commandes",       icon: ShoppingCart, badge: true },
      { id: "invoices", label: "Devis / Factures", icon: FileText },
    ],
  },
  {
    label: "Stock",
    items: [
      { id: "products",   label: "Produits",   icon: Package },
      { id: "categories", label: "Catégories", icon: Tag },
      { id: "warehouses", label: "Entrepôts",  icon: Warehouse },
      { id: "stock",      label: "Mouvements", icon: BarChart2 },
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
      { id: "caisse",      label: "Caisse",        icon: Wallet },
      { id: "payments",    label: "Paiements",    icon: DollarSign },
      { id: "receivables", label: "Créances",     icon: TrendingDown },
    ],
  },
  {
    label: "Revendeurs",
    items: [
      { id: "revendeurs", label: "Revendeurs", icon: TrendingUp },
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
  {
    label: "Site Web",
    items: [
      { id: "vitrine", label: "Site Vitrine", icon: Globe },
    ],
  },
  {
    label: null,
    items: [
      { id: "settings", label: "Paramètres", icon: Settings },
    ],
  },
];

// Couleur d'accent par groupe
const GROUP_ACCENTS = {
  "CRM": "text-blue-300",
  "Ventes": "text-amber-300",
  "Stock": "text-teal-300",
  "Livraison": "text-orange-300",
  "Finance": "text-emerald-300",
  "RH & Admin": "text-purple-300",
  "Analytics": "text-cyan-300",
  "Site Web": "text-violet-300",
};

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
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-obsidian">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
          <Search className="w-4 h-4 text-white/40" />
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Rechercher un module…"
            className="flex-1 text-sm text-white placeholder:text-white/30 bg-transparent focus:outline-none" />
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors cursor-pointer"><X className="w-4 h-4" /></button>
        </div>
        <div className="max-h-72 overflow-y-auto py-1">
          {results.map(item => {
            const Icon = item.icon;
            return (
              <button key={item.id} onClick={() => { onNavigate(item.id); onClose(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 text-left transition-colors group cursor-pointer">
                <Icon className="w-4 h-4 text-white/40 group-hover:text-gmo-green transition-colors" />
                <span className="text-sm text-white/60 group-hover:text-white transition-colors">{item.label}</span>
                <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 ml-auto transition-colors" />
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
    <div className="flex flex-col h-full w-[220px]"
      style={{ background: "linear-gradient(160deg, #1C1C1E 0%, #0f2a15 60%, #1C1C1E 100%)" }}>

      {/* Logo */}
      <div className="px-5 py-4 flex items-center gap-3 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-gmo-green flex items-center justify-center flex-shrink-0 shadow-lg"
          style={{ boxShadow: "0 0 16px rgba(26,122,46,0.5)" }}>
          <Shield className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-white text-sm font-bold leading-tight font-heading">GMO ERP</p>
          <p className="text-gmo-green text-[10px] font-medium font-body">Administration</p>
        </div>
      </div>

      {/* Search shortcut */}
      <div className="px-3 pt-3">
        <button onClick={() => {}} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/30 text-xs font-body hover:bg-white/10 transition-colors cursor-pointer">
          <Search className="w-3.5 h-3.5" />
          <span>Rechercher…</span>
          <span className="ml-auto text-[10px] bg-white/10 px-1.5 py-0.5 rounded">⌘K</span>
        </button>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
        {GROUPS.map((group, gi) => (
          <div key={gi} className={gi > 0 ? "mt-3" : ""}>
            {group.label && (
              <p className={`text-[9px] font-bold uppercase tracking-[0.18em] px-2 mb-1.5 ${GROUP_ACCENTS[group.label] || "text-white/30"}`}>
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
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all duration-150 cursor-pointer text-[13px] mb-0.5 relative group
                    ${isActive
                      ? "bg-gmo-green text-white font-semibold shadow-lg"
                      : "text-white/50 hover:bg-white/10 hover:text-white"
                    }`}
                  style={isActive ? { boxShadow: "0 4px 14px rgba(26,122,46,0.45)" } : {}}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 transition-all ${isActive ? "text-white" : "text-white/35 group-hover:text-white/70"}`} />
                  <span className="flex-1 truncate font-body">{item.label}</span>
                  {isActive && <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white/60" />}
                  {showOrderBadge && (
                    <span className="bg-amber-400 text-obsidian text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
                      {pendingOrders}
                    </span>
                  )}
                  {showAppBadge && (
                    <span className="bg-blue-400 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
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
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group">
          <div className="w-7 h-7 rounded-full bg-gmo-green flex items-center justify-center text-white text-xs font-bold flex-shrink-0 flex-shrink-0"
            style={{ boxShadow: "0 0 10px rgba(26,122,46,0.4)" }}>
            {user?.full_name?.charAt(0) || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-white/80 truncate font-body">{user?.full_name}</p>
            <p className="text-[9px] text-white/30 font-body">PDG · Admin</p>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link to="/" title="Site public" className="text-white/30 hover:text-white cursor-pointer p-1 transition-colors"><Globe className="w-3 h-3" /></Link>
            <button onClick={() => logout()} title="Déconnexion" className="text-white/30 hover:text-gmo-red cursor-pointer p-1 transition-colors"><LogOut className="w-3 h-3" /></button>
          </div>
        </div>
      </div>

      {/* Subtle animated bottom glow */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(26,122,46,0.06), transparent)" }} />
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
      <aside className="hidden lg:flex flex-col h-screen sticky top-0 flex-shrink-0 w-[220px] relative overflow-hidden"
        style={{ borderRight: "1px solid rgba(255,255,255,0.07)" }}>
        <SidebarContent tab={tab} setTab={setTab} pendingOrders={pendingOrders} newApplications={newApplications} user={user} logout={logout} />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-50 flex items-center justify-between px-4 h-14"
        style={{ background: "linear-gradient(90deg, #1C1C1E 0%, #0f2a15 100%)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="text-white/50 hover:text-white cursor-pointer"><Menu className="w-5 h-5" /></button>
          <div className="w-7 h-7 rounded-lg bg-gmo-green flex items-center justify-center" style={{ boxShadow: "0 0 10px rgba(26,122,46,0.5)" }}>
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-white text-sm font-bold font-heading">GMO ERP</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setCmdOpen(true)} className="text-white/40 hover:text-white cursor-pointer"><Search className="w-4 h-4" /></button>
          {pendingOrders > 0 && (
            <button onClick={() => setTab("orders")} className="relative cursor-pointer">
              <Bell className="w-4 h-4 text-white/40" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 text-obsidian rounded-full text-[8px] flex items-center justify-center font-bold">{pendingOrders}</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 shadow-2xl animate-slide-in-left">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10"
              style={{ background: "#1C1C1E" }}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gmo-green flex items-center justify-center"><Shield className="w-4 h-4 text-white" /></div>
                <span className="text-white text-sm font-bold font-heading">GMO ERP</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-white/40 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
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