import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { Bell, AlertTriangle, Globe, LogOut, ChevronDown } from "lucide-react";

function LiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const dateStr = now.toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit", month: "short" });
  const timeStr = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  return (
    <div className="flex items-center gap-2 text-white/40 text-xs font-body tabular-nums">
      <span className="text-white/20">{dateStr}</span>
      <span className="text-white/10">·</span>
      <span className="text-[#4ade80]/70 font-semibold">{timeStr}</span>
    </div>
  );
}

export default function AdminTopbar({ pendingOrders, setTab }) {
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <div className="h-14 flex items-center justify-between px-5 flex-shrink-0 sticky top-0 z-40 border-b border-white/[0.06]"
      style={{ background: "rgba(10,15,30,0.6)", backdropFilter: "blur(20px)" }}>

      {/* Left: page title */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 border-l border-white/[0.08] pl-4">
          <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" style={{ boxShadow: "0 0 6px #4ade80" }} />
          <span className="text-white/50 text-xs font-body">Système opérationnel</span>
        </div>
      </div>

      {/* Center: clock */}
      <div className="hidden md:flex items-center">
        <LiveClock />
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5">
        {/* Notifications */}
        <button onClick={() => setTab && setTab("orders")} aria-label="Commandes en attente"
          className="relative w-9 h-9 rounded-xl flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.07] transition-all cursor-pointer">
          <Bell className="w-4 h-4" />
          {pendingOrders > 0 && (
            <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full text-[7px] flex items-center justify-center font-bold text-[#0a0f1e]"
              style={{ background: "#4ade80", boxShadow: "0 0 8px rgba(74,222,128,0.6)" }}>
              {pendingOrders > 9 ? "9+" : pendingOrders}
            </span>
          )}
        </button>

        <button aria-label="Alertes"
          className="relative w-9 h-9 rounded-xl flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.07] transition-all cursor-pointer">
          <AlertTriangle className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-white/[0.08] mx-1" />

        {/* User dropdown */}
        <div className="relative">
          <button onClick={() => setUserMenuOpen(s => !s)}
            className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 hover:bg-white/[0.07] border border-white/[0.08] hover:border-white/[0.15] transition-all cursor-pointer"
            style={{ background: "rgba(255,255,255,0.04)" }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[#0a0f1e] text-[10px] font-bold font-heading flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#4ade80,#22c55e)" }}>
              {user?.full_name?.charAt(0) || "A"}
            </div>
            <span className="hidden sm:block text-xs text-white/50 font-body max-w-[90px] truncate">
              {user?.full_name?.split(" ")[0]}
            </span>
            <ChevronDown className="w-3 h-3 text-white/25" />
          </button>

          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-50"
                style={{ background: "rgba(8,13,28,0.95)", backdropFilter: "blur(24px)" }}>
                <div className="px-4 py-3.5 border-b border-white/[0.07]">
                  <p className="text-[12px] font-heading font-bold text-white">{user?.full_name}</p>
                  <p className="text-[10px] text-white/30 font-body truncate mt-0.5">{user?.email}</p>
                  <span className="inline-block mt-1.5 text-[8px] uppercase tracking-widest font-heading rounded-md px-2 py-0.5"
                    style={{ color: "#4ade80", background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.25)" }}>
                    PDG · Admin
                  </span>
                </div>
                <Link to="/" onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-body text-white/40 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer">
                  <Globe className="w-3.5 h-3.5" /> Site public
                </Link>
                <button onClick={() => logout()}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-body text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer">
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