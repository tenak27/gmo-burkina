import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import {
  LayoutDashboard, Users, UserCheck, FileText, Truck, Package,
  Tag, Warehouse, BarChart2, BookOpen, Users2, ShoppingCart,
  Shield, Globe, Bell, LogOut, Menu, Search,
  DollarSign, TrendingDown, Navigation, Settings, ChevronDown, X
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
      { id: "products",   label: "Produits",        icon: Package },
      { id: "categories", label: "Catégories",       icon: Tag },
      { id: "warehouses", label: "Entrepôts",         icon: Warehouse },
      { id: "stock",      label: "Mouvements",       icon: BarChart2 },
    ],
  },
  {
    label: "Livraison",
    items: [
      { id: "delivery", label: "Bons livraison", icon: Truck },
      { id: "drivers",  label: "Chauffeurs",      icon: Navigation },
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
      { id: "hr",    label: "RH",            icon: Users2 },
      { id: "users", label: "Utilisateurs",   icon: Shield },
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
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#2a2f45] rounded-xl shadow-2xl overflow-hidden border border-white/10">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
          <Search className="w-4 h-4 text-white/40" />
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Rechercher un module…"
            className="flex-1 text-sm text-white placeholder:text-white/30 bg-transparent focus:outline-none" />
          <button onClick={onClose}><X className="w-4 h-4 text-white/30 hover:text-white" /></button>
        </div>
        <div className="max-h-64 overflow-y-auto py-2">
          {results.map(item => {
            const Icon = item.icon;
            return (
              <button key={item.id} onClick={() => { onNavigate(item.id); onClose(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/8 text-left transition-colors group">
                <Icon className="w-4 h-4 text-white/40 group-hover:text-white/80" />
                <span className="text-sm text-white/60 group-hover:text-white">{item.label}</span>
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
    <div className="flex flex-col h-full w-[200px]">
      {/* Search */}
      <div className="px-3 py-3 flex-shrink-0">
        <button onClick={() => setCmdOpen(true)}
          className="w-full flex items-center gap-2 bg-white/[0.08] hover:bg-white/[0.12] rounded-lg px-3 py-2 text-left transition-all border border-white/[0.06]">
          <Search className="w-3.5 h-3.5 text-white/40" />
          <span className="text-xs text-white/35 font-body flex-1">Search Menu...</span>
          <Search className="w-3 h-3 text-white/20" />
        </button>
      </div>

      {/* Nav groups */}
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {GROUPS.map((group, gi) => (
          <div key={gi} className={gi > 0 ? "mt-5" : "mt-1"}>
            {group.label && (
              <div className="flex items-center justify-between px-2 mb-1.5">
                <span className="text-[9px] font-heading font-bold uppercase tracking-[0.3em] text-white/35">
                  {group.label}
                </span>
                <Settings className="w-3 h-3 text-white/20 cursor-pointer hover:text-white/50 transition-colors" />
              </div>
            )}
            {group.items.map(item => {
              const Icon = item.icon;
              const isActive = tab === item.id;
              const showBadge = item.badge && pendingOrders > 0;
              return (
                <button key={item.id} onClick={() => navigate(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all duration-150 group mb-0.5
                    ${isActive
                      ? "bg-white/[0.12] text-white"
                      : "text-white/50 hover:text-white/90 hover:bg-white/[0.06]"
                    }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-white" : "text-white/40 group-hover:text-white/70"}`} />
                  <span className={`text-[13px] font-body flex-1 truncate ${isActive ? "font-semibold" : ""}`}>
                    {item.label}
                  </span>
                  {showBadge && (
                    <span className="bg-[#4ade80] text-[#0f1117] text-[8px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                      {pendingOrders}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom: visitor counter style */}
      <div className="flex-shrink-0 p-3 border-t border-white/[0.07]">
        <div className="flex flex-col items-center gap-1 bg-white/[0.06] rounded-xl p-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#4ade80] flex items-center justify-center text-white text-xs font-bold font-heading bg-white/[0.08]">
            {user?.full_name?.charAt(0) || "A"}
          </div>
          <p className="text-[11px] font-heading font-semibold text-white mt-1 truncate max-w-full">{user?.full_name}</p>
          <p className="text-[9px] text-white/35 font-body">PDG · Admin</p>
          <div className="flex gap-2 mt-1">
            <Link to="/" title="Site public"
              className="w-6 h-6 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/10 transition-all">
              <Globe className="w-3 h-3" />
            </Link>
            <button onClick={() => logout()} title="Déconnexion"
              className="w-6 h-6 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all">
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
      <aside className="hidden lg:flex flex-col bg-[#2a2f45] h-screen sticky top-0 flex-shrink-0 w-[200px]">
        <SidebarInner />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden bg-[#1e2235] border-b border-white/[0.07] sticky top-0 z-50 flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="text-white/60 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
          <img src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c7662a636_logo-gmo2x.png"
            alt="GMO" className="h-6 brightness-0 invert opacity-90" />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setCmdOpen(true)} className="text-white/40 hover:text-white">
            <Search className="w-4 h-4" />
          </button>
          {pendingOrders > 0 && (
            <button onClick={() => setTab("orders")} className="relative">
              <Bell className="w-4 h-4 text-white/50" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#4ade80] text-[#0f1117] rounded-full text-[7px] flex items-center justify-center font-bold">{pendingOrders}</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 bg-[#2a2f45] shadow-2xl animate-slide-in-left flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
              <img src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c7662a636_logo-gmo2x.png"
                alt="GMO" className="h-6 brightness-0 invert opacity-90" />
              <button onClick={() => setMobileOpen(false)} className="text-white/40 hover:text-white">
                <X className="w-4 h-4" />
              </button>
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