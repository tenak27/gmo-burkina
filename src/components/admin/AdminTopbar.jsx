import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { Bell, HelpCircle, Settings, ChevronDown, Globe, LogOut, Search } from "lucide-react";

function LiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="text-sm text-gray-500 tabular-nums hidden md:inline">
      {now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
    </span>
  );
}

export default function AdminTopbar({ pendingOrders, setTab }) {
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <div className="h-14 flex items-center justify-between px-6 flex-shrink-0 sticky top-0 z-40 bg-white border-b border-gray-200">

      {/* Left: Search */}
      <div className="flex items-center gap-3 flex-1 max-w-sm">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full">
          <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className="text-sm text-gray-400 select-none">Rechercher…</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        <LiveClock />

        <div className="w-px h-5 bg-gray-200 mx-2" />

        {/* Notifications */}
        <button onClick={() => setTab && setTab("orders")}
          className="relative w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-all cursor-pointer">
          <Bell className="w-4 h-4" />
          {pendingOrders > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-white" />
          )}
        </button>

        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-all cursor-pointer">
          <HelpCircle className="w-4 h-4" />
        </button>

        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-all cursor-pointer">
          <Settings className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        {/* User dropdown */}
        <div className="relative">
          <button onClick={() => setUserMenuOpen(s => !s)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100 transition-all cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.full_name?.charAt(0) || "A"}
            </div>
            <span className="hidden sm:block text-sm text-gray-700 font-medium max-w-[80px] truncate">
              {user?.full_name?.split(" ")[0]}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1.5 w-52 rounded-xl shadow-lg border border-gray-200 bg-white overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{user?.full_name}</p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email}</p>
                  <span className="inline-block mt-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                    PDG · Admin
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