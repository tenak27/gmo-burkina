import React from "react";
import { useAuth } from "@/lib/AuthContext";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function RoleGuard({ roles, children }) {
  const { user, isAuthenticated, isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-green-600/30 border-t-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    base44.auth.redirectToLogin(window.location.href, { locale: "fr" });
    return null;
  }

  if (roles && !roles.includes(user.role)) {
    const ROLE_ROUTES = { pdg: "/admin", commercial: "/commercial", magasinier: "/magasinier", chauffeur: "/chauffeur", detaillant: "/detaillant", client: "/client" };
    const redirect = ROLE_ROUTES[user.role] || "/client";
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white border border-gray-200 rounded-xl p-12 flex flex-col items-center text-center max-w-sm w-full shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mb-5">
            <Shield className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Accès non autorisé</h2>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Votre rôle <span className="font-semibold text-gray-700">({user.role})</span> ne permet pas d'accéder à cet espace.
          </p>
          <Link to={redirect}
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg cursor-pointer transition-colors w-full">
            Aller à mon espace →
          </Link>
        </div>
      </div>
    );
  }

  return children;
}