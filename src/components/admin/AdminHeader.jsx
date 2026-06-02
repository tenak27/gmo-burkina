import React from "react";
import { Link } from "react-router-dom";
import { Shield, Bell, LogOut, Globe, ChevronDown } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

const MODULES = [
  { id: "dashboard",    label: "Dashboard",     group: "main" },
  { id: "clients",      label: "Clients",        group: "crm" },
  { id: "suppliers",    label: "Fournisseurs",   group: "crm" },
  { id: "invoices",     label: "Devis / Factures", group: "ventes" },
  { id: "delivery",     label: "Bons",           group: "ventes" },
  { id: "products",     label: "Produits",       group: "stock" },
  { id: "categories",   label: "Catégories",     group: "stock" },
  { id: "warehouses",   label: "Entrepôts",      group: "stock" },
  { id: "stock",        label: "Mouvements",     group: "stock" },
  { id: "accounting",   label: "Comptabilité",   group: "finance" },
  { id: "hr",           label: "RH",             group: "rh" },
  { id: "users",        label: "Utilisateurs",   group: "admin" },
  { id: "orders",       label: "Commandes",      group: "ventes" },
];

export { MODULES };

export default function AdminHeader({ tab, setTab, pendingOrders }) {
  const { user, logout } = useAuth();

  const groups = [
    { key: "main",    label: null },
    { key: "crm",     label: "CRM" },
    { key: "ventes",  label: "Ventes" },
    { key: "stock",   label: "Stock" },
    { key: "finance", label: "Finance" },
    { key: "rh",      label: "RH" },
    { key: "admin",   label: "Admin" },
  ];

  return (
    <header className="bg-[#1C1C1E] sticky top-0 z-50">
      {/* Top bar */}
      <div className="max-w-full px-4 sm:px-6 h-13 flex items-center justify-between border-b border-white/5 py-2.5">
        <div className="flex items-center gap-3">
          <img src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c7662a636_logo-gmo2x.png" alt="GMO" className="h-6 brightness-0 invert opacity-90" />
          <span className="hidden sm:block w-px h-4 bg-white/15" />
          <div className="hidden sm:flex items-center gap-1.5">
            <Shield className="w-3 h-3 text-gmo-green" />
            <span className="text-[10px] text-gmo-green/80 uppercase tracking-widest font-body">ERP Admin</span>
          </div>
          <span className="hidden lg:block text-[9px] text-white/20 font-body">— IAM TECHNOLOGY · Armand Olivier KONATE</span>
        </div>
        <div className="flex items-center gap-3">
          {pendingOrders > 0 && (
            <div className="relative cursor-pointer" onClick={() => setTab("orders")}>
              <Bell className="w-4 h-4 text-white/40" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-gmo-red rounded-full text-[8px] text-white flex items-center justify-center font-bold">{pendingOrders}</span>
            </div>
          )}
          <Link to="/" className="text-white/25 hover:text-white/60 transition-colors" title="Site public">
            <Globe className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2 border-l border-white/10 pl-3">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gmo-green to-gmo-green/60 flex items-center justify-center text-white text-[10px] font-bold font-heading">
              {user?.full_name?.charAt(0) || "A"}
            </div>
            <span className="hidden sm:block text-[11px] text-white/50 font-body">{user?.full_name}</span>
            <button onClick={() => logout()} className="text-white/20 hover:text-red-400 transition-colors ml-1" title="Déconnexion">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Nav groups */}
      <nav className="flex overflow-x-auto border-b border-white/5 scrollbar-hide">
        {groups.map(g => {
          const items = MODULES.filter(m => m.group === g.key);
          return items.map(m => (
            <button
              key={m.id}
              onClick={() => setTab(m.id)}
              className={`px-4 py-2 text-[10px] font-body uppercase tracking-widest border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
                tab === m.id
                  ? "border-gmo-green text-gmo-green bg-white/3"
                  : "border-transparent text-white/30 hover:text-white/60 hover:bg-white/2"
              }`}
            >
              {g.label && tab !== m.id ? <span className="text-white/15 mr-1">{g.label} /</span> : null}
              {m.label}
            </button>
          ));
        })}
      </nav>
    </header>
  );
}