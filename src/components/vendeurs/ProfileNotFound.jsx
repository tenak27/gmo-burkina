import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Package, LogOut, RefreshCw, UserPlus, X, CheckCircle2 } from "lucide-react";

function CreateProfileForm({ user, onCreated, onClose }) {
  const [form, setForm] = useState({
    nom: user?.full_name?.split(" ").slice(-1)[0] || "",
    prenom: user?.full_name?.split(" ")[0] || "",
    phone: "",
    email: user?.email || "",
    zone: "",
    user_id: user?.id || "",
    is_active: true,
  });
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await base44.entities.Vendeur.create(form);
    setSaving(false);
    setDone(true);
    setTimeout(() => onCreated(), 1200);
  };

  if (done) {
    return (
      <div className="text-center py-6">
        <CheckCircle2 className="w-10 h-10 text-gmo-green mx-auto mb-3" />
        <p className="font-heading font-bold text-obsidian">Profil créé !</p>
        <p className="text-sm text-obsidian/50 mt-1">Chargement de votre espace…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mt-2">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-obsidian/50 uppercase tracking-wider">Prénom *</label>
          <input required value={form.prenom} onChange={e => setForm(f => ({...f, prenom: e.target.value}))}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gmo-green" />
        </div>
        <div>
          <label className="text-xs font-semibold text-obsidian/50 uppercase tracking-wider">Nom *</label>
          <input required value={form.nom} onChange={e => setForm(f => ({...f, nom: e.target.value}))}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gmo-green" />
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold text-obsidian/50 uppercase tracking-wider">Téléphone *</label>
        <input required value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))}
          className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gmo-green" />
      </div>
      <div>
        <label className="text-xs font-semibold text-obsidian/50 uppercase tracking-wider">Zone couverte</label>
        <input value={form.zone} onChange={e => setForm(f => ({...f, zone: e.target.value}))}
          placeholder="Ex: Secteur 15, Ouagadougou"
          className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gmo-green" />
      </div>
      <div className="flex gap-2 pt-1">
        <button type="button" onClick={onClose}
          className="flex-1 border border-gray-200 text-sm rounded-lg py-2.5 text-obsidian/60 hover:bg-gray-50">
          Annuler
        </button>
        <button type="submit" disabled={saving}
          className="flex-1 bg-gmo-green text-white text-sm font-semibold rounded-lg py-2.5 hover:bg-gmo-green/80 disabled:opacity-50">
          {saving ? "Création…" : "Créer mon profil"}
        </button>
      </div>
    </form>
  );
}

export default function ProfileNotFound({ user, onProfileCreated, onLogout }) {
  const [showCreate, setShowCreate] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const isAdmin = user?.role === "admin" || user?.role === "pdg" || user?.role === "admin_cig" || user?.role === "pdg_cig" || user?.role === "commercial_cig";

  const handleRefresh = async () => {
    setRefreshing(true);
    await onProfileCreated();
    setRefreshing(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-sm w-full">
        {!showCreate ? (
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Package className="w-7 h-7 text-gray-300" />
            </div>
            <h2 className="font-heading text-lg font-bold text-obsidian mb-2">Profil non trouvé</h2>
            <p className="text-sm text-obsidian/50 font-body leading-relaxed">
              {isAdmin
                ? "Aucun profil vendeur n'est lié à votre compte. Vous pouvez en créer un maintenant."
                : "Votre compte vendeur n'a pas encore été configuré. Contactez votre responsable."}
            </p>

            <div className="flex flex-col gap-2 mt-5">
              {isAdmin && (
                <button onClick={() => setShowCreate(true)}
                  className="flex items-center justify-center gap-2 bg-gmo-green text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-gmo-green/80 transition-colors">
                  <UserPlus className="w-4 h-4" /> Créer mon profil vendeur
                </button>
              )}
              <button onClick={handleRefresh} disabled={refreshing}
                className="flex items-center justify-center gap-2 border border-gray-200 text-obsidian/60 text-sm px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50">
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                {refreshing ? "Vérification…" : "Réessayer"}
              </button>
              <button onClick={onLogout}
                className="flex items-center justify-center gap-2 text-sm text-gmo-red font-body hover:underline mt-1">
                <LogOut className="w-4 h-4" /> Se déconnecter
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-obsidian">Créer votre profil</h3>
              <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <CreateProfileForm user={user} onCreated={onProfileCreated} onClose={() => setShowCreate(false)} />
          </div>
        )}
      </div>
    </div>
  );
}