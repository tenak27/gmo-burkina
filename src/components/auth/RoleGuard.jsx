import React from "react";
import { useAuth } from "@/lib/AuthContext";
import { Link } from "react-router-dom";
import { Shield, LogIn, ArrowLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";

/**
 * RoleGuard — protects a route based on required role(s).
 * Usage: <RoleGuard roles={["admin"]}><AdminDashboard /></RoleGuard>
 */
export default function RoleGuard({ roles, children }) {
  const { user, isAuthenticated, isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white/10 border-t-gmo-green rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center px-6 text-center">
        <Shield className="w-12 h-12 text-white/20 mb-6" />
        <h2 className="font-heading text-2xl font-bold text-white mb-3">Accès restreint</h2>
        <p className="font-body text-sm text-white/40 mb-8 max-w-xs">
          Vous devez être connecté pour accéder à cet espace.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => base44.auth.redirectToLogin(window.location.href)}
            className="flex items-center gap-2 bg-gmo-green text-white font-heading font-bold text-sm px-6 py-3 rounded-lg"
          >
            <LogIn className="w-4 h-4" /> Se connecter
          </button>
          <Link to="/" className="flex items-center gap-2 border border-white/20 text-white/60 font-heading font-bold text-sm px-6 py-3 rounded-lg hover:border-white/40 hover:text-white transition-all">
            <ArrowLeft className="w-4 h-4" /> Accueil
          </Link>
        </div>
      </div>
    );
  }

  if (roles && !roles.includes(user.role)) {
    // Redirect to correct space
    const ROLE_ROUTES = { pdg: "/admin", commercial: "/commercial", magasinier: "/magasinier", chauffeur: "/chauffeur", detaillant: "/detaillant", client: "/client" };
    const redirect = ROLE_ROUTES[user.role] || "/client";
    return (
      <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center px-6 text-center">
        <Shield className="w-12 h-12 text-gmo-red/60 mb-6" />
        <h2 className="font-heading text-2xl font-bold text-white mb-3">Accès non autorisé</h2>
        <p className="font-body text-sm text-white/40 mb-8 max-w-xs">
          Votre rôle <span className="text-white/70 font-semibold">({user.role})</span> ne permet pas d'accéder à cet espace.
        </p>
        <Link
          to={redirect}
          className="flex items-center gap-2 bg-gmo-green text-white font-heading font-bold text-sm px-6 py-3 rounded-lg"
        >
          Aller à mon espace
        </Link>
      </div>
    );
  }

  return children;
}