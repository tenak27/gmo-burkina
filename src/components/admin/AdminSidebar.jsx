import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import {
  LayoutDashboard, Users, UserCheck, FileText, Truck, Package,
  Tag, Warehouse, BarChart2, BookOpen, Users2, ShoppingCart,
  Shield, Globe, Bell, LogOut, ChevronRight, Menu, X
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
      { id: "stock", label: "Mouvements", icon: BarChart2 },
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

export default function AdminSidebar({ tab, setTab, pendingOrders }) {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = ({ mobile = false }) => (
    <div className={`flex flex-col h-full ${mobile ? "w-72" : collapsed ? "w-16" : "w-56"} transition-all duration-300 ease-in-out`}>
      {/* Logo + toggle */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/8 flex-shrink-0">
        {(!collapsed || mobile) && (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img
              src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c7662a636_logo-gmo2x.png"
              alt="GMO"
              className="h-7 w-auto brightness-0 invert opacity-90 flex-shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] text-gmo-green/80 uppercase tracking-[0.25em] font-body whitespace-nowrap">ERP Admin</span>
              <span className="text-[8px] text-white/20 font-body whitespace-nowrap truncate">IAM TECHNOLOGY</span>
            </div>
          </div>
        )}
        {collapsed && !mobile && (
          <img
            src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c7662a636_logo-gmo2x.png"
            alt="GMO"
            className="h-6 w-auto brightness-0 invert opacity-70"
          />
        )}
        {!mobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-6 h-6 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/30 hover:text-white/60 transition-all flex-shrink-0"
          >
            <ChevronRight className={`w-3 h-3 transition-transform duration-300 ${collapsed ? "" : "rotate-180"}`} />
          </button>
        )}
        {mobile && (
          <button onClick={() => setMobileOpen(false)} className="text-white/40 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {GROUPS.map((group, gi) => (
          <div key={gi} className={gi > 0 ? "mt-3" : ""}>
            {group.label && (!collapsed || mobile) && (
              <p className="text-[8px] uppercase tracking-[0.3em] text-white/20 font-heading px-2 mb-1.5 mt-2">
                {group.label}
              </p>
            )}
            {group.label && (collapsed && !mobile) && <div className="h-px bg-white/8 mx-2 my-2" />}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = tab === item.id;
              const showBadge = item.badge && pendingOrders > 0;
              return (
                <button
                  key={item.id}
                  onClick={() => { setTab(item.id); if (mobile) setMobileOpen(false); }}
                  title={collapsed && !mobile ? item.label : ""}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all duration-200 group relative ${
                    isActive
                      ? "bg-gmo-green/15 text-gmo-green border border-gmo-green/20"
                      : "text-white/40 hover:text-white/80 hover:bg-white/5 border border-transparent"
                  } ${collapsed && !mobile ? "justify-center" : ""}`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? "text-gmo-green" : "text-white/35 group-hover:text-white/70"}`} />
                  {(!collapsed || mobile) && (
                    <span className="text-[11px] font-body font-medium truncate">{item.label}</span>
                  )}
                  {showBadge && (!collapsed || mobile) && (
                    <span className="ml-auto bg-gmo-red text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">
                      {pendingOrders}
                    </span>
                  )}
                  {showBadge && collapsed && !mobile && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-gmo-red rounded-full" />
                  )}
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-gmo-green rounded-r-full" />}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer user */}
      <div className="flex-shrink-0 border-t border-white/8 p-3">
        {(!collapsed || mobile) ? (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gmo-green to-gmo-green/60 flex items-center justify-center text-white text-[11px] font-bold font-heading flex-shrink-0">
              {user?.full_name?.charAt(0) || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-white/70 font-heading font-medium truncate">{user?.full_name}</p>
              <p className="text-[9px] text-white/30 font-body truncate">{user?.email}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <Link to="/" className="text-white/20 hover:text-white/60 transition-colors" title="Site public">
                <Globe className="w-3.5 h-3.5" />
              </Link>
              <button onClick={() => logout()} className="text-white/20 hover:text-red-400 transition-colors" title="Déconnexion">
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gmo-green to-gmo-green/60 flex items-center justify-center text-white text-[11px] font-bold font-heading">
              {user?.full_name?.charAt(0) || "A"}
            </div>
            <button onClick={() => logout()} className="text-white/20 hover:text-red-400 transition-colors">
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
      <aside className={`hidden lg:flex flex-col bg-[#1C1C1E] border-r border-white/5 h-screen sticky top-0 transition-all duration-300 flex-shrink-0 ${collapsed ? "w-16" : "w-56"}`}>
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden bg-[#1C1C1E] border-b border-white/5 sticky top-0 z-50 flex items-center justify-between px-4 h-12">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="text-white/50 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
          <img
            src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c7662a636_logo-gmo2x.png"
            alt="GMO"
            className="h-6 brightness-0 invert opacity-80"
          />
          <span className="text-[9px] text-gmo-green/70 uppercase tracking-widest font-body">ERP</span>
        </div>
        <div className="flex items-center gap-2">
          {pendingOrders > 0 && (
            <button onClick={() => setTab("orders")} className="relative">
              <Bell className="w-4 h-4 text-white/40" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-gmo-red rounded-full text-[8px] text-white flex items-center justify-center font-bold">{pendingOrders}</span>
            </button>
          )}
          <div className="w-6 h-6 rounded-full bg-gmo-green flex items-center justify-center text-white text-[10px] font-bold">
            {user?.full_name?.charAt(0) || "A"}
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 bg-[#1C1C1E] flex shadow-2xl animate-slide-in-left">
            <SidebarContent mobile />
          </div>
        </div>
      )}
    </>
  );
}