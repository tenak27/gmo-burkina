import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { Bell, Moon, Sun, Globe, LogOut, Search, Building2, ChevronDown } from "lucide-react";

export default function AdminTopbar({ pendingOrders, setTab }) {
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [companyName, setCompanyName] = useState("GMO Burkina");

  useEffect(() => {
    import("@/api/base44Client").then(({ base44 }) => {
      base44.entities.CompanySettings.list("-created_date", 1).then(arr => {
        if (arr?.[0]?.raison_sociale) setCompanyName(arr[0].sigle || arr[0].raison_sociale);
      }).catch(() => {});
    });
  }, []);

  const roleLabel = { pdg: "Administrateur", commercial: "Commercial", magasinier: "Magasinier", chauffeur: "Chauffeur" }[user?.role] || user?.role || "Utilisateur";

  return (
    <div className="h-14 flex items-center justify-between px-5 flex-shrink-0 sticky top-0 z-40"
      style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(240,245,255,0.95) 100%)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(99,102,241,0.1)" }}>
      {/* Search */}
      <div className="flex items-center gap-2 rounded-xl px-3 py-2 w-56" style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(99,102,241,0.2)" }}>
        <Search className="w-3.5 h-3.5 text-indigo-400/50 flex-shrink-0" />
        <span className="text-xs text-indigo-400/40 select-none font-body">Rechercher…</span>
      </div>

      {/* Right cluster */}
      <div className="flex items-center gap-2">
        {/* Company chip */}
        <div className="hidden md:flex items-center gap-2 rounded-xl px-3 py-1.5" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
          <div className="w-5 h-5 rounded bg-indigo-500/10 flex items-center justify-center">
            <Building2 className="w-3 h-3 text-indigo-600" />
          </div>
          <div>
            <p className="text-[10px] text-indigo-600/60 font-body leading-none">Société active</p>
            <p className="text-xs font-bold text-indigo-900 leading-none mt-0.5 max-w-[100px] truncate font-heading">{companyName}</p>
          </div>
        </div>

        {/* Dark mode toggle */}
        <button onClick={() => setDarkMode(d => !d)}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-indigo-400/50 hover:bg-indigo-100 transition-all cursor-pointer">
          {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <button onClick={() => setTab && setTab("orders")}
          className="relative w-8 h-8 rounded-xl flex items-center justify-center text-indigo-400/50 hover:bg-indigo-100 transition-all cursor-pointer">
          <Bell className="w-4 h-4" />
          {pendingOrders > 0 && (
            <span className="absolute top-1 right-1 min-w-[14px] h-[14px] px-0.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[9px] font-bold flex items-center justify-center">
              {pendingOrders > 9 ? "9+" : pendingOrders}
            </span>
          )}
        </button>

        {/* User */}
        <div className="relative">
          <button onClick={() => setUserMenuOpen(s => !s)}
            className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 hover:bg-indigo-100/50 transition-all cursor-pointer" style={{ border: "1px solid rgba(99,102,241,0.15)" }}>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.full_name?.charAt(0) || "A"}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-obsidian leading-none font-heading">{user?.full_name?.split(" ").slice(0,2).join(" ")}</p>
              <p className="text-[10px] text-obsidian/40 leading-none mt-0.5 font-body">{roleLabel}</p>
            </div>
            <ChevronDown className="w-3 h-3 text-obsidian/30 hidden sm:block" />
          </button>

          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1.5 w-52 rounded-2xl shadow-xl overflow-hidden z-50 bg-white" style={{ border: "1px solid rgba(99,102,241,0.15)" }}>
                <div className="px-4 py-3 border-b border-indigo-100" style={{ background: "rgba(99,102,241,0.05)" }}>
                  <p className="text-sm font-bold text-obsidian font-heading">{user?.full_name}</p>
                  <p className="text-xs text-obsidian/40 truncate mt-0.5 font-body">{user?.email}</p>
                  <span className="inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-600/10 text-indigo-700 border border-indigo-200">
                    {roleLabel}
                  </span>
                </div>
                <Link to="/" onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-obsidian/60 hover:bg-indigo-50 transition-colors cursor-pointer font-body">
                  <Globe className="w-3.5 h-3.5 text-obsidian/30" /> Site public
                </Link>
                <button onClick={() => logout()}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer font-body">
                  <LogOut className="w-3.5 h-3.5" /> Déconnexion
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}