import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Users, Store, CheckCircle, ArrowRight, LogOut } from 'lucide-react';

const ROLES = [
  {
    id: "client",
    label: "Client",
    icon: Users,
    description: "Passez vos commandes, suivez vos livraisons et consultez vos factures en ligne.",
    features: ["Passer des commandes", "Suivre mes livraisons", "Consulter mes factures", "Support client"],
    color: "green",
  },
  {
    id: "detaillant",
    label: "Détaillant",
    icon: Store,
    description: "Accédez aux tarifs grossiste, gérez vos commandes professionnelles et suivez vos paiements.",
    features: ["Tarifs grossiste", "Commandes en gros", "Suivi des paiements", "Espace dédié"],
    color: "amber",
  },
];

export default function UserNotRegisteredError() {
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const handleRegister = async () => {
    if (!selected || saving) return;
    setSaving(true);
    await base44.auth.updateMe({ role: selected });
    setDone(true);
    // Reload after short delay so AuthContext re-fetches the user
    setTimeout(() => window.location.reload(), 1500);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Inscription réussie !</h2>
          <p className="text-sm text-gray-500">Redirection en cours…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Bienvenue sur GMO Burkina</h1>
        <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
          Choisissez votre profil pour accéder à l'espace qui vous correspond.
        </p>
      </div>

      {/* Role cards */}
      <div className="grid sm:grid-cols-2 gap-4 w-full max-w-2xl mb-8">
        {ROLES.map(role => {
          const Icon = role.icon;
          const isSelected = selected === role.id;
          const isGreen = role.color === "green";
          return (
            <button
              key={role.id}
              onClick={() => setSelected(role.id)}
              className={`text-left p-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer
                ${isSelected
                  ? isGreen
                    ? "border-green-600 bg-green-50 shadow-md"
                    : "border-amber-500 bg-amber-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center
                  ${isSelected
                    ? isGreen ? "bg-green-600" : "bg-amber-500"
                    : "bg-gray-100"
                  }`}>
                  <Icon className={`w-6 h-6 ${isSelected ? "text-white" : "text-gray-500"}`} />
                </div>
                {isSelected && (
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isGreen ? "bg-green-600" : "bg-amber-500"}`}>
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">{role.label}</h3>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">{role.description}</p>
              <ul className="space-y-1.5">
                {role.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isGreen ? "bg-green-500" : "bg-amber-400"}`} />
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      {/* CTA */}
      <button
        onClick={handleRegister}
        disabled={!selected || saving}
        className={`flex items-center gap-2 font-semibold text-sm px-8 py-3 rounded-xl transition-all cursor-pointer
          ${selected
            ? "bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
      >
        {saving ? (
          <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Inscription en cours…</>
        ) : (
          <><ArrowRight className="w-4 h-4" /> Continuer en tant que {selected ? ROLES.find(r=>r.id===selected)?.label : "…"}</>
        )}
      </button>

      {/* Logout */}
      <button
        onClick={() => base44.auth.logout("/")}
        className="mt-5 flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
      >
        <LogOut className="w-3.5 h-3.5" /> Se déconnecter
      </button>
    </div>
  );
}