import React from "react";
import { base44 } from "@/api/base44Client";

export default function UserNotRegisteredError() {
  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <h1 className="font-heading text-2xl font-bold text-concrete mb-4">Bienvenue chez GMO</h1>
        <p className="font-body text-sm text-concrete/50 mb-6">
          Pour accéder à cette fonctionnalité, veuillez vous connecter ou créer un compte.
        </p>
        <button
          onClick={() => base44.auth.redirectToLogin('/', { locale: "fr" })}
          className="bg-gmo-green text-white font-heading font-bold text-sm px-6 py-3 rounded-xl hover:bg-gmo-green/80 transition-colors"
        >
          Se connecter
        </button>
      </div>
    </div>
  );
}