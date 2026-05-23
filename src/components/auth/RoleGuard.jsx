import React from "react";
import { useAuth } from "@/lib/AuthContext";
import { Link } from "react-router-dom";
import { Shield, LogIn, ArrowLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function RoleGuard({ roles, children }) {
  const { user, isAuthenticated, isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #0A0F1E 0%, #0D1A14 55%, #050D0A 100%)" }}>
        <div className="w-8 h-8 border-2 border-[#4ade80]/20 border-t-[#4ade80] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0A0F1E 0%, #0D1A14 55%, #050D0A 100%)" }}>
        {/* Ambient glows */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #4ade80 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 rounded-full opacity-8 pointer-events-none"
          style={{ background: "radial-gradient(circle, #22d3ee 0%, transparent 70%)", filter: "blur(60px)" }} />

        <div className="relative z-10 w-full max-w-sm rounded-3xl p-10 flex flex-col items-center"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", backdropFilter: "blur(20px)" }}>
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
            style={{ background: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)", boxShadow: "0 0 40px rgba(74,222,128,0.4)" }}>
            <Shield className="w-10 h-10 text-[#0a0f1e]" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-white mb-3">Accès restreint</h2>
          <p className="font-body text-sm text-white/40 mb-8 leading-relaxed">
            Vous devez être connecté pour accéder à cet espace.
          </p>
          <div className="flex gap-3 w-full">
            <button
              onClick={() => base44.auth.redirectToLogin(window.location.href)}
              className="flex-1 flex items-center justify-center gap-2 font-heading font-bold text-sm px-5 py-3 rounded-xl text-[#0a0f1e] cursor-pointer transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)", boxShadow: "0 4px 20px rgba(74,222,128,0.35)" }}
            >
              <LogIn className="w-4 h-4" /> Se connecter
            </button>
            <Link to="/"
              className="flex items-center justify-center gap-2 font-heading font-bold text-sm px-4 py-3 rounded-xl text-white/50 hover:text-white transition-all cursor-pointer"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(245,196,0,0.35)" }}>
              <ArrowLeft className="w-4 h-4" /> Accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (roles && !roles.includes(user.role)) {
    const ROLE_ROUTES = { pdg: "/admin", commercial: "/commercial", magasinier: "/magasinier", chauffeur: "/chauffeur", detaillant: "/detaillant", client: "/client" };
    const redirect = ROLE_ROUTES[user.role] || "/client";
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0A0F1E 0%, #0D1A14 55%, #050D0A 100%)" }}>
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full opacity-8 pointer-events-none"
          style={{ background: "radial-gradient(circle, #ef4444 0%, transparent 70%)", filter: "blur(80px)" }} />

        <div className="relative z-10 w-full max-w-sm rounded-3xl p-10 flex flex-col items-center"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", backdropFilter: "blur(20px)" }}>
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
            style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" }}>
            <Shield className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-white mb-3">Accès non autorisé</h2>
          <p className="font-body text-sm text-white/40 mb-8 leading-relaxed">
            Votre rôle <span className="text-white/70 font-semibold">({user.role})</span> ne permet pas d'accéder à cet espace.
          </p>
          <Link to={redirect}
            className="w-full flex items-center justify-center gap-2 font-heading font-bold text-sm px-5 py-3 rounded-xl text-[#0a0f1e] cursor-pointer transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)", boxShadow: "0 4px 20px rgba(74,222,128,0.3)" }}>
            Aller à mon espace →
          </Link>
        </div>
      </div>
    );
  }

  return children;
}