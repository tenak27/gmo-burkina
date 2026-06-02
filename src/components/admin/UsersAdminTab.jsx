import React, { useState } from "react";
import { Shield, Package, ShoppingCart, Truck, Users, Star, UserPlus, X, Loader2, CheckCircle2, Edit2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

const ROLE_CONFIG = {
  pdg:        { label: "PDG",        color: "bg-purple-100 text-purple-700 border-purple-200", avatarBg: "bg-purple-600",  icon: Shield,       desc: "Accès complet ERP",       permissions: ["Dashboard", "Clients", "Fournisseurs", "Commandes", "Factures", "Stock", "Comptabilité", "RH", "Chauffeurs", "Livraisons", "Utilisateurs"] },
  commercial: { label: "Commercial", color: "bg-blue-100 text-blue-700 border-blue-200",       avatarBg: "bg-blue-600",    icon: ShoppingCart, desc: "Ventes & CRM",            permissions: ["Commandes", "Factures", "Clients", "Fournisseurs", "Bons de livraison"] },
  magasinier: { label: "Magasinier", color: "bg-amber-100 text-amber-700 border-amber-200",    avatarBg: "bg-amber-500",   icon: Package,      desc: "Gestion stock",           permissions: ["Produits", "Entrepôts", "Mouvements stock", "Bons de livraison"] },
  chauffeur:  { label: "Chauffeur",  color: "bg-green-100 text-green-700 border-green-200",    avatarBg: "bg-gmo-green",   icon: Truck,        desc: "Livraisons assignées",    permissions: ["Livraisons assignées", "Mise à jour statut"] },
  detaillant: { label: "Détaillant", color: "bg-red-100 text-red-700 border-red-200",          avatarBg: "bg-gmo-red",     icon: Star,         desc: "Espace partenaire",       permissions: ["Catalogue grossiste", "Commander", "Stocks disponibles", "Suivi livraisons"] },
  client:     { label: "Client",     color: "bg-gray-100 text-gray-600 border-gray-200",       avatarBg: "bg-obsidian/30", icon: Users,        desc: "Espace client",           permissions: ["Suivi commandes", "Catalogue produits"] },
};

const ALL_ROLES = [
  { value: "pdg",        label: "PDG",        desc: "Accès complet ERP" },
  { value: "commercial", label: "Commercial", desc: "Ventes & CRM" },
  { value: "magasinier", label: "Magasinier", desc: "Gestion stock" },
  { value: "chauffeur",  label: "Chauffeur",  desc: "Livraisons" },
  { value: "detaillant", label: "Détaillant", desc: "Espace partenaire" },
  { value: "client",     label: "Client",     desc: "Espace client" },
];

const ROLE_MATRIX = [
  { role: "pdg",        label: "PDG",        color: "bg-purple-500", modules: ["Dashboard complet", "Tous modules", "Gestion utilisateurs", "Comptabilité", "RH"] },
  { role: "commercial", label: "Commercial", color: "bg-blue-600",   modules: ["Commandes", "Factures", "Clients & Fournisseurs", "Bons livraison"] },
  { role: "magasinier", label: "Magasinier", color: "bg-amber-500",  modules: ["Produits", "Entrepôts", "Stock", "Bons livraison"] },
  { role: "chauffeur",  label: "Chauffeur",  color: "bg-gmo-green",  modules: ["Livraisons assignées", "Mise à jour statut commande"] },
  { role: "detaillant", label: "Détaillant", color: "bg-gmo-red",    modules: ["Catalogue grossiste", "Passer commande", "Stocks GMO", "Carte zones"] },
  { role: "client",     label: "Client",     color: "bg-obsidian/30",modules: ["Suivi commandes", "Catalogue produits"] },
];

// ─── Modal Changer Rôle ────────────────────────────────────────────────────────
function ChangeRoleModal({ user, onClose, onSaved }) {
  const [role, setRole] = useState(user.role || "client");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (role === user.role) return onClose();
    setLoading(true);
    setError("");
    try {
      await base44.entities.User.update(user.id, { role });
      onSaved(user.id, role);
      onClose();
    } catch (e) {
      setError(e?.message || "Erreur lors de la mise à jour.");
    } finally {
      setLoading(false);
    }
  };

  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.client;
  const Icon = cfg.icon;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Edit2 className="w-4 h-4 text-gmo-green" />
            <h4 className="font-heading text-base font-bold text-obsidian">Modifier le rôle</h4>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* User info */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold font-heading flex-shrink-0 ${ROLE_CONFIG[user.role]?.avatarBg || "bg-obsidian/30"}`}>
              {user.full_name?.charAt(0) || "?"}
            </div>
            <div>
              <p className="font-heading text-sm font-bold text-obsidian">{user.full_name || "—"}</p>
              <p className="text-[11px] text-obsidian/40 font-body">{user.email}</p>
            </div>
          </div>

          {/* Role selector */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Nouveau rôle</label>
            <div className="space-y-2">
              {ALL_ROLES.map(r => {
                const rcfg = ROLE_CONFIG[r.value];
                const RIcon = rcfg.icon;
                const selected = role === r.value;
                return (
                  <button
                    key={r.value}
                    onClick={() => setRole(r.value)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all cursor-pointer text-left ${
                      selected ? "border-gmo-green bg-gmo-green/5" : "border-gray-100 hover:border-gray-200 bg-white"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${selected ? rcfg.avatarBg : "bg-gray-100"}`}>
                      <RIcon className={`w-4 h-4 ${selected ? "text-white" : "text-obsidian/40"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-heading text-sm font-bold ${selected ? "text-obsidian" : "text-obsidian/70"}`}>{r.label}</p>
                      <p className="font-body text-[11px] text-obsidian/40">{r.desc}</p>
                    </div>
                    {selected && <CheckCircle2 className="w-4 h-4 text-gmo-green flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {error && <p className="text-xs text-red-500 font-body">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 border border-gray-200 text-sm font-heading font-semibold py-2.5 rounded-xl cursor-pointer hover:bg-gray-50">Annuler</button>
            <button onClick={handleSave} disabled={loading}
              className="flex-1 bg-gmo-green text-white text-sm font-heading font-bold py-2.5 rounded-xl cursor-pointer disabled:opacity-50 hover:opacity-90 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              {loading ? "Enregistrement…" : "Confirmer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Modal Inviter ─────────────────────────────────────────────────────────────
function InviteModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("client");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleInvite = async () => {
    if (!email.trim()) return setError("Veuillez saisir un email.");
    setLoading(true);
    setError("");
    try {
      await base44.users.inviteUser(email.trim(), role);
      setSuccess(true);
    } catch (e) {
      setError(e?.message || "Erreur lors de l'envoi. Vérifiez l'email et réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-gmo-green" />
            <h4 className="font-heading text-base font-bold text-obsidian">Inviter un utilisateur</h4>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        {success ? (
          <div className="px-6 py-10 text-center">
            <CheckCircle2 className="w-12 h-12 text-gmo-green mx-auto mb-3" />
            <p className="font-heading text-base font-bold text-obsidian mb-1">Invitation envoyée !</p>
            <p className="text-sm font-body text-obsidian/50 mb-6">{email} recevra un email d'invitation.</p>
            <button onClick={onClose} className="bg-gmo-green text-white text-sm font-heading font-bold px-6 py-2.5 rounded-xl cursor-pointer hover:opacity-90">Fermer</button>
          </div>
        ) : (
          <div className="px-6 py-5 space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Adresse email *</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(""); }}
                placeholder="exemple@email.com"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body text-obsidian focus:outline-none focus:border-gmo-green transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Rôle attribué</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body text-obsidian focus:outline-none focus:border-gmo-green transition-colors"
              >
                {ALL_ROLES.map(r => <option key={r.value} value={r.value}>{r.label} — {r.desc}</option>)}
              </select>
            </div>
            {error && <p className="text-xs text-red-500 font-body">{error}</p>}
            <div className="flex gap-3 pt-2">
              <button onClick={onClose} className="flex-1 border border-gray-200 text-sm font-heading font-semibold py-2.5 rounded-xl cursor-pointer hover:bg-gray-50">Annuler</button>
              <button onClick={handleInvite} disabled={loading}
                className="flex-1 bg-gmo-green text-white text-sm font-heading font-bold py-2.5 rounded-xl cursor-pointer disabled:opacity-50 hover:opacity-90 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                {loading ? "Envoi…" : "Envoyer l'invitation"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function UsersAdminTab({ users, setUsers }) {
  const [showInvite, setShowInvite] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [search, setSearch] = useState("");

  const handleRoleSaved = (userId, newRole) => {
    if (setUsers) setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  const filtered = users.filter(u =>
    !search || u.full_name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Matrice des permissions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-obsidian/30" />
          <h3 className="font-heading text-sm font-bold text-obsidian">Matrice des permissions par rôle</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {ROLE_MATRIX.map(r => (
            <div key={r.role} className="border border-gray-100 rounded-xl p-3 hover:shadow-sm transition-shadow">
              <div className={`w-8 h-8 rounded-lg ${r.color} flex items-center justify-center text-white text-xs font-bold mb-2`}>
                {r.label.charAt(0)}
              </div>
              <p className="font-heading text-xs font-bold text-obsidian mb-2">{r.label}</p>
              <div className="space-y-1">
                {r.modules.map(m => (
                  <div key={m} className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-gmo-green flex-shrink-0" />
                    <span className="text-[9px] text-obsidian/55 font-body leading-tight">{m}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tableau utilisateurs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 gap-3 flex-wrap">
          <div>
            <h3 className="font-heading text-sm font-bold text-obsidian">Utilisateurs de l'application</h3>
            <p className="text-[11px] text-obsidian/40 font-body mt-0.5">{users.length} compte(s) enregistré(s)</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher…"
                className="border border-gray-200 rounded-xl px-3 py-2 text-xs font-body focus:outline-none focus:border-gmo-green w-44 pl-7"
              />
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
            </div>
            <button
              onClick={() => setShowInvite(true)}
              className="flex items-center gap-2 bg-gmo-green text-white text-xs font-heading font-bold px-4 py-2.5 rounded-xl shadow-md hover:opacity-90 cursor-pointer transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" /> Inviter
            </button>
          </div>
        </div>

        {/* Table */}
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-5 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Utilisateur</th>
              <th className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Rôle actuel</th>
              <th className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Permissions</th>
              <th className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Inscrit le</th>
              <th className="text-center px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(u => {
              const cfg = ROLE_CONFIG[u.role] || ROLE_CONFIG.client;
              const Icon = cfg.icon;
              return (
                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                  {/* Utilisateur */}
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold font-heading flex-shrink-0 ${cfg.avatarBg}`}>
                        {u.full_name?.charAt(0) || "?"}
                      </div>
                      <div>
                        <p className="font-heading text-sm font-semibold text-obsidian">{u.full_name || "—"}</p>
                        <p className="text-[10px] text-obsidian/40 font-body">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  {/* Rôle */}
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-body border ${cfg.color}`}>
                      <Icon className="w-3 h-3" />
                      {cfg.label}
                    </span>
                  </td>
                  {/* Permissions */}
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {cfg.permissions.slice(0, 3).map(p => (
                        <span key={p} className="text-[9px] bg-gray-100 text-obsidian/50 px-1.5 py-0.5 rounded font-body">{p}</span>
                      ))}
                      {cfg.permissions.length > 3 && (
                        <span className="text-[9px] bg-gray-100 text-obsidian/40 px-1.5 py-0.5 rounded font-body">+{cfg.permissions.length - 3}</span>
                      )}
                    </div>
                  </td>
                  {/* Date */}
                  <td className="px-4 py-3">
                    <span className="text-xs text-obsidian/40 font-body">
                      {u.created_date ? new Date(u.created_date).toLocaleDateString("fr-FR") : "—"}
                    </span>
                  </td>
                  {/* Action */}
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setEditingUser(u)}
                      className="inline-flex items-center gap-1.5 text-[10px] font-heading font-bold px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gmo-green hover:text-gmo-green transition-all cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" /> Changer rôle
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-sm text-obsidian/30 font-body">Aucun utilisateur trouvé</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}
      {editingUser && <ChangeRoleModal user={editingUser} onClose={() => setEditingUser(null)} onSaved={handleRoleSaved} />}
    </div>
  );
}