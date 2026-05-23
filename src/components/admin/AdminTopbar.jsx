import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { Bell, AlertTriangle, Globe, LogOut, ChevronDown, Menu, MoreVertical } from "lucide-react";

function LiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const dateStr = now.toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });
  const timeStr = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  return (
    <div className="flex items-center gap-2 bg-white/[0.08] border border-white/[0.1] rounded-lg px-3 py-1.5 text-white/70 text-xs font-body tabular-nums">
      <span>📅</span>
      <span>{dateStr}</span>
      <span className="text-white/30">·</span>
      <span>🕐</span>
      <span>{timeStr}</span>
      <span className="text-white/30">·</span>
      <span>🌡</span>
      <span>Ouagadougou</span>
    </div>
  );
}

export default function AdminTopbar({ pendingOrders, setTab, sidebarOpen, setSidebarOpen }) {
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <div className="h-14 bg-[#1e2235] border-b border-white/[0.07] flex items-center justify-between px-4 flex-shrink-0 sticky top-0 z-40">
      {/* Left: logo + brand + hamburger */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <img
            src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c7662a636_logo-gmo2x.png"
            alt="GMO" className="h-6 brightness-0 invert opacity-90"
          />
          <div className="hidden sm:flex flex-col">
            <span className="text-white text-[11px] font-heading font-bold leading-tight">GMO ERP</span>
            <span className="text-[8px] text-[#4ade80] uppercase tracking-[0.2em] font-body">v1.0</span>
          </div>
        </div>
        <div className="w-px h-6 bg-white/10 mx-1" />
        <button onClick={() => setSidebarOpen && setSidebarOpen(s => !s)}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* Center: clock */}
      <div className="hidden md:flex items-center">
        <LiveClock />
      </div>

      {/* Right: bells + user */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button onClick={() => setTab && setTab("orders")}
          className="relative w-9 h-9 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all">
          <Bell className="w-4 h-4" />
          {pendingOrders > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-[#4ade80] text-[#0f1117] rounded-full text-[7px] flex items-center justify-center font-bold">
              {pendingOrders > 9 ? "9+" : pendingOrders}
            </span>
          )}
        </button>
        <button className="relative w-9 h-9 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all">
          <AlertTriangle className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-orange-400 text-white rounded-full text-[7px] flex items-center justify-center font-bold">!</span>
        </button>

        <div className="w-px h-6 bg-white/10 mx-1" />

        {/* User dropdown */}
        <div className="relative">
          <button onClick={() => setUserMenuOpen(s => !s)}
            className="flex items-center gap-2 rounded-lg bg-white/[0.08] border border-white/[0.1] hover:bg-white/[0.14] px-2.5 py-1.5 transition-all">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#4ade80] to-[#22c55e] flex items-center justify-center text-[#0f1117] text-[10px] font-bold font-heading">
              {user?.full_name?.charAt(0) || "A"}
            </div>
            <span className="hidden sm:block text-xs text-white/70 font-body max-w-[100px] truncate">
              Hi, {user?.full_name?.split(" ")[0]}
            </span>
            <ChevronDown className="w-3 h-3 text-white/40" />
          </button>

          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-52 bg-[#2a2f45] rounded-xl shadow-2xl border border-white/10 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-white/[0.07]">
                  <p className="text-[12px] font-heading font-bold text-white">{user?.full_name}</p>
                  <p className="text-[10px] text-white/35 font-body truncate">{user?.email}</p>
                  <span className="inline-block mt-1 text-[8px] uppercase tracking-widest text-[#4ade80] font-heading border border-[#4ade80]/30 rounded px-1.5 py-0.5">PDG · Admin</span>
                </div>
                <Link to="/" onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-body text-white/55 hover:text-white hover:bg-white/[0.07] transition-colors">
                  <Globe className="w-3.5 h-3.5" /> Site public
                </Link>
                <button onClick={() => logout()}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-body text-red-400 hover:bg-red-500/10 transition-colors">
                  <LogOut className="w-3.5 h-3.5" /> Déconnexion
                </button>
              </div>
            </>
          )}
        </div>

        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}