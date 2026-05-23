import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import {
  LayoutDashboard, Users, UserCheck, FileText, Truck, Package,
  Tag, Warehouse, BarChart2, BookOpen, Users2, ShoppingCart,
  Shield, Globe, LogOut, Menu, Search,
  DollarSign, TrendingDown, Navigation, X, Briefcase, TrendingUp, Bell
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
      { id: "products",   label: "Produits",    icon: Package },
      { id: "categories", label: "Catégories",   icon: Tag },
      { id: "warehouses", label: "Entrepôts",     icon: Warehouse },
      { id: "stock",      label: "Mouvements",   icon: BarChart2 },
    ],
  },
  {
    label: "Livraison",
    items: [
      { id: "delivery", label: "Livraisons",  icon: Truck },
      { id: "drivers",  label: "Chauffeurs",   icon: Navigation },
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

const allItems = GROUPS.flatMap(g => g.items);

function CommandPalette({ onNavigate, onClose }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const results = query
    ? allItems.filter(i => i.label.toLowerCase().includes(query.toLowerCase()))
    : allItems;

  useEffect(() => { inputRef.current?.focus(); }, []);

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-20 px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
        style={{ background: "rgba(15,20,40,0.95)", backdropFilter: "blur(24px)" }}>
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.08]">
          <Search className="w-4 h-4 text-[#4ade80]/60" />
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Rechercher un module…"
            className="flex-1 text-sm text-white placeholder:text-white/25 bg-transparent focus:outline-none font-body" />
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <div className="max-h-72 overflow-y-auto py-2">
          {results.map(item => {
            const Icon = item.icon;
            return (
              <button key={item.id} onClick={() => { onNavigate(item.id); onClose(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.06] text-left transition-colors group cursor-pointer">
                <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center group-hover:bg-[#4ade80]/10 transition-colors">
                  <Icon className="w-3.5 h-3.5 text-white/40 group-hover:text-[#4ade80] transition-colors" />
                </div>
                <span className="text-sm text-white/50 group-hover:text-white transition-colors font-body">{item.label}</span>
              </button>
            );
          })}
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

  const navigate = (id) => { setTab(id); setMobileOpen(false); };

  const SidebarInner = () => (
    <div className="flex flex-col h-full w-[220px]">
      {/* Logo */}
      <div className="px-5 pt-5 pb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)", boxShadow: "0 0 20px rgba(74,222,128,0.4)" }}>
            <Shield className="w-4.5 h-4.5 text-[#0a0f1e]" />
          </div>
          <div>
            <p className="text-white text-[13px] font-heading font-bold leading-tight">GMO ERP</p>
            <p className="text-[#4ade80] text-[9px] uppercase tracking-[0.25em] font-body">Admin</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 pb-3 flex-shrink-0">
        <button onClick={() => setCmdOpen(true)}
          className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-all cursor-pointer border border-white/[0.08] hover:border-[#4ade80]/30"
          style={{ background: "rgba(255,255,255,0.04)" }}>
          <Search className="w-3.5 h-3.5 text-white/30" />
          <span className="text-xs text-white/25 font-body flex-1">Rechercher… ⌘K</span>
        </button>
      </div>

      {/* Divider */}
      <div className="mx-4 mb-3 h-px bg-white/[0.06]" />

      {/* Nav groups */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-0.5">
        {GROUPS.map((group, gi) => (
          <div key={gi} className={gi > 0 ? "mt-4" : ""}>
            {group.label && (
              <p className="text-[9px] font-heading font-bold uppercase tracking-[0.35em] text-white/20 px-2 mb-2 mt-1">
                {group.label}
              </p>
            )}
            {group.items.map(item => {
              const Icon = item.icon;
              const isActive = tab === item.id;
              const showOrderBadge = item.badge && pendingOrders > 0;
              const showAppBadge = item.badgeKey === "applications" && newApplications > 0;
              return (
                <button key={item.id} onClick={() => navigate(item.id)} aria-label={item.label}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all duration-150 cursor-pointer mb-0.5 group
                    ${isActive
                      ? "text-[#0a0f1e]"
                      : "text-white/40 hover:text-white/80 hover:bg-white/[0.05]"
                    }`}
                  style={isActive ? {
                    background: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)",
                    boxShadow: "0 4px 20px rgba(74,222,128,0.3)"
                  } : {}}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? "text-[#0a0f1e]" : "text-white/30 group-hover:text-white/70"}`} />
                  <span className={`text-[12.5px] font-body flex-1 truncate ${isActive ? "font-semibold text-[#0a0f1e]" : ""}`}>
                    {item.label}
                  </span>
                  {showOrderBadge && (
                    <span className="bg-[#F5C400] text-[#0a0f1e] text-[8px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                      {pendingOrders}
                    </span>
                  )}
                  {showAppBadge && (
                    <span className="bg-cyan-400 text-[#0a0f1e] text-[8px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                      {newApplications}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom user card */}
      <div className="flex-shrink-0 p-3 border-t border-white/[0.06]">
        <div className="rounded-xl p-3 flex items-center gap-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-[#0a0f1e] text-sm font-bold font-heading flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)" }}>
            {user?.full_name?.charAt(0) || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-heading font-semibold text-white truncate">{user?.full_name}</p>
            <p className="text-[9px] text-white/30 font-body">PDG · Admin</p>
          </div>
          <div className="flex gap-1">
            <Link to="/" title="Site public" aria-label="Site public"
              className="w-6 h-6 rounded-lg flex items-center justify-center text-white/25 hover:text-white/70 hover:bg-white/10 transition-all cursor-pointer">
              <Globe className="w-3 h-3" />
            </Link>
            <button onClick={() => logout()} title="Déconnexion" aria-label="Déconnexion" className="w-6 h-6 rounded-lg flex items-center justify-center text-white/25 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer">
              <LogOut className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col h-screen sticky top-0 flex-shrink-0 w-[220px] border-r border-white/[0.06]"
        style={{ background: "rgba(10,15,30,0.7)", backdropFilter: "blur(20px)" }}>
        <SidebarInner />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden border-b border-white/[0.07] sticky top-0 z-50 flex items-center justify-between px-4 h-14"
        style={{ background: "rgba(10,15,30,0.9)", backdropFilter: "blur(16px)" }}>
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="text-white/50 hover:text-white transition-colors cursor-pointer" aria-label="Menu">
            <Menu className="w-5 h-5" />
          </button>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#4ade80,#22c55e)" }}>
            <Shield className="w-4 h-4 text-[#0a0f1e]" />
          </div>
          <span className="text-white text-sm font-heading font-bold">GMO ERP</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setCmdOpen(true)} className="text-white/30 hover:text-white transition-colors cursor-pointer" aria-label="Rechercher"><Search className="w-4 h-4" /></button>
          {pendingOrders > 0 && (
            <button onClick={() => setTab("orders")} className="relative cursor-pointer" aria-label="Commandes">
              <Bell className="w-4 h-4 text-white/40" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#4ade80] text-[#0a0f1e] rounded-full text-[7px] flex items-center justify-center font-bold">{pendingOrders}</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 shadow-2xl animate-slide-in-left flex flex-col border-r border-white/[0.08]"
            style={{ background: "rgba(8,13,26,0.97)", backdropFilter: "blur(24px)" }}>
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#4ade80,#22c55e)" }}>
                  <Shield className="w-4 h-4 text-[#0a0f1e]" />
                </div>
                <span className="text-white text-sm font-heading font-bold">GMO ERP</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-white/40 hover:text-white transition-colors cursor-pointer" aria-label="Fermer"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <SidebarInner />
            </div>
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