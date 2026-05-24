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
    <div className="h-14 flex items-center justify-between px-5 flex-shrink-0 sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      {/* Search */}
      <div className="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 w-56">
        <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
        <span className="text-xs text-gray-400 select-none">Rechercher…</span>
      </div>

      {/* Right cluster */}
      <div className="flex items-center gap-2">
        {/* Company chip */}
        <div className="hidden md:flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-1.5 bg-gray-50">
          <div className="w-5 h-5 rounded bg-gmo-green/10 flex items-center justify-center">
            <Building2 className="w-3 h-3 text-gmo-green" />
          </div>
          <div>
            <p className="text-[10px] text-obsidian/40 font-body leading-none">Société active</p>
            <p className="text-xs font-bold text-obsidian leading-none mt-0.5 max-w-[100px] truncate">{companyName}</p>
          </div>
        </div>

        {/* Dark mode toggle */}
        <button onClick={() => setDarkMode(d => !d)}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-all cursor-pointer">
          {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <button onClick={() => setTab && setTab("orders")}
          className="relative w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-all cursor-pointer">
          <Bell className="w-4 h-4" />
          {pendingOrders > 0 && (
            <span className="absolute top-1 right-1 min-w-[14px] h-[14px] px-0.5 rounded-full bg-gmo-red text-white text-[9px] font-bold flex items-center justify-center border border-white">
              {pendingOrders > 9 ? "9+" : pendingOrders}
            </span>
          )}
        </button>

        {/* User */}
        <div className="relative">
          <button onClick={() => setUserMenuOpen(s => !s)}
            className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 hover:bg-gray-100 transition-all cursor-pointer border border-transparent hover:border-gray-200">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gmo-green to-emerald-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.full_name?.charAt(0) || "A"}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-obsidian leading-none">{user?.full_name?.split(" ").slice(0,2).join(" ")}</p>
              <p className="text-[10px] text-obsidian/40 leading-none mt-0.5">{roleLabel}</p>
            </div>
            <ChevronDown className="w-3 h-3 text-gray-400 hidden sm:block" />
          </button>

          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1.5 w-52 rounded-2xl shadow-xl border border-gray-100 bg-white overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                  <p className="text-sm font-bold text-obsidian">{user?.full_name}</p>
                  <p className="text-xs text-obsidian/40 truncate mt-0.5">{user?.email}</p>
                  <span className="inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gmo-green/10 text-gmo-green">
                    {roleLabel}
                  </span>
                </div>
                <Link to="/" onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
                  <Globe className="w-3.5 h-3.5 text-gray-400" /> Site public
                </Link>
                <button onClick={() => logout()}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer">
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