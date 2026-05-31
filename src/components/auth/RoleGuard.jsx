import React from "react";
import { useAuth } from "@/lib/AuthContext";
import { Link } from "react-router-dom";
import { Shield, LogIn, ArrowLeft } from "lucide-react";
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
    return (
      <div className="min-h-screen flex bg-gray-50">
        {/* Fake sidebar for visual consistency */}
        <div className="hidden lg:flex flex-col w-[220px] border-r border-gray-200 bg-white h-screen sticky top-0">
          <div className="px-5 py-4 flex items-center gap-2.5 border-b border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-gray-900 text-sm font-bold leading-tight">GMO ERP</p>
              <p className="text-green-600 text-[10px] font-medium">Administration</p>
            </div>
          </div>
          <div className="px-3 py-3 space-y-0.5">
            {["Tableau de bord", "Utilisateurs", "Sécurité", "Authentification", "Paramètres", "Facturation"].map((item, i) => (
              <div key={item} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all
                ${i === 3 ? "bg-green-50 text-green-700 font-semibold border-l-[3px] border-green-600" : "text-gray-500 border-l-[3px] border-transparent"}`}>
                <Shield className={`w-4 h-4 flex-shrink-0 ${i === 3 ? "text-green-600" : "text-gray-300"}`} />
                {item}
              </div>
            ))}
          </div>
          <div className="mt-auto p-3 border-t border-gray-100">
            <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg">
              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs font-bold flex-shrink-0">
                A
              </div>
              <p className="text-[12px] text-gray-500">Profile</p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Topbar */}
          <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-end px-6 gap-3">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-64">
              <span className="text-sm text-gray-400">Rechercher…</span>
            </div>
          </div>

          {/* Access Restricted Card */}
          <div className="flex-1 p-6">
            <h1 className="text-xl font-bold text-gray-900 mb-5">Accès Restreint</h1>
            <div className="bg-white border border-gray-200 rounded-xl p-12 flex flex-col items-center text-center max-w-lg">
              <div className="w-20 h-20 rounded-2xl border-2 border-green-600 flex items-center justify-center mb-6">
                <Shield className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Accès restreint</h2>
              <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                Vous devez être connecté pour accéder à cet espace.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => base44.auth.redirectToLogin(window.location.href, { locale: "fr" })}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg cursor-pointer transition-colors">
                  <LogIn className="w-4 h-4" /> Se connecter
                </button>
                <Link to="/"
                  className="flex items-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm px-4 py-2.5 rounded-lg cursor-pointer transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Accueil
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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