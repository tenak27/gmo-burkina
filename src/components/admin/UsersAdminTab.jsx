import React from "react";
import EntityTable from "./EntityTable";
import { Shield, Package, ShoppingCart, Truck, Users, Star } from "lucide-react";

const ROLE_CONFIG = {
  pdg: {
    label: "PDG",
    color: "bg-purple-100 text-purple-700 border-purple-200",
    icon: Shield,
    desc: "Accès complet ERP",
    permissions: ["Dashboard", "Clients", "Fournisseurs", "Commandes", "Factures", "Stock", "Comptabilité", "RH", "Chauffeurs", "Livraisons", "Utilisateurs"],
  },
  commercial: {
    label: "Commercial",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: ShoppingCart,
    desc: "Ventes & CRM",
    permissions: ["Commandes", "Factures", "Clients", "Fournisseurs", "Bons de livraison"],
  },
  magasinier: {
    label: "Magasinier",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: Package,
    desc: "Gestion stock",
    permissions: ["Produits", "Entrepôts", "Mouvements stock", "Bons de livraison"],
  },
  chauffeur: {
    label: "Chauffeur",
    color: "bg-green-100 text-green-700 border-green-200",
    icon: Truck,
    desc: "Livraisons assignées",
    permissions: ["Livraisons assignées", "Mise à jour statut"],
  },
  detaillant: {
    label: "Détaillant",
    color: "bg-red-100 text-red-700 border-red-200",
    icon: Star,
    desc: "Espace partenaire",
    permissions: ["Catalogue grossiste", "Commander", "Stocks disponibles", "Suivi livraisons"],
  },
  client: {
    label: "Client",
    color: "bg-gray-100 text-gray-600 border-gray-200",
    icon: Users,
    desc: "Espace client",
    permissions: ["Suivi commandes", "Catalogue produits"],
  },
};

const COLUMNS = [
  {
    key: "full_name", label: "Utilisateur", render: (v, r) => {
      const cfg = ROLE_CONFIG[r.role] || ROLE_CONFIG.client;
      const Icon = cfg.icon;
      return (
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold font-heading flex-shrink-0 ${
            r.role === "pdg" ? "bg-purple-600"
            : r.role === "commercial" ? "bg-blue-600"
            : r.role === "magasinier" ? "bg-amber-500"
            : r.role === "chauffeur" ? "bg-gmo-green"
            : r.role === "detaillant" ? "bg-gmo-red"
            : "bg-obsidian/30"
          }`}>
            {v?.charAt(0) || "?"}
          </div>
          <div>
            <p className="font-heading text-xs font-semibold text-obsidian">{v || "—"}</p>
            <p className="text-[10px] text-obsidian/40 font-body">{r.email}</p>
          </div>
        </div>
      );
    }
  },
  {
    key: "role", label: "Rôle & Permissions", render: (v) => {
      const cfg = ROLE_CONFIG[v] || ROLE_CONFIG.client;
      const Icon = cfg.icon;
      return (
        <div className="flex items-start gap-2.5">
          <span className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-body border flex-shrink-0 ${cfg.color}`}>
            <Icon className="w-3 h-3" />
            {cfg.label}
          </span>
          <div>
            <p className="text-[10px] text-obsidian/45 font-body">{cfg.desc}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {cfg.permissions.slice(0, 3).map(p => (
                <span key={p} className="text-[9px] bg-gray-100 text-obsidian/50 px-1.5 py-0.5 rounded font-body">{p}</span>
              ))}
              {cfg.permissions.length > 3 && (
                <span className="text-[9px] bg-gray-100 text-obsidian/40 px-1.5 py-0.5 rounded font-body">+{cfg.permissions.length - 3}</span>
              )}
            </div>
          </div>
        </div>
      );
    }
  },
  {
    key: "created_date", label: "Inscrit le",
    render: v => <span className="text-xs text-obsidian/40 font-body">{v ? new Date(v).toLocaleDateString("fr-FR") : "—"}</span>
  },
];

const ROLE_MATRIX = [
  { role: "pdg",        label: "PDG",        color: "purple", modules: ["Dashboard complet", "Tous modules", "Gestion utilisateurs", "Comptabilité", "RH"] },
  { role: "commercial", label: "Commercial", color: "blue",   modules: ["Commandes", "Factures", "Clients & Fournisseurs", "Bons livraison"] },
  { role: "magasinier", label: "Magasinier", color: "amber",  modules: ["Produits", "Entrepôts", "Stock", "Bons livraison"] },
  { role: "chauffeur",  label: "Chauffeur",  color: "green",  modules: ["Livraisons assignées", "Mise à jour statut commande"] },
  { role: "detaillant", label: "Détaillant", color: "red",    modules: ["Catalogue grossiste", "Passer commande", "Stocks GMO", "Carte zones"] },
  { role: "client",     label: "Client",     color: "gray",   modules: ["Suivi commandes", "Catalogue produits"] },
];

const colorMap = {
  purple: "bg-purple-500", blue: "bg-blue-600", amber: "bg-amber-500",
  green: "bg-gmo-green", red: "bg-gmo-red", gray: "bg-obsidian/30",
};
const badgeMap = {
  purple: "bg-purple-100 text-purple-700", blue: "bg-blue-100 text-blue-700",
  amber: "bg-amber-100 text-amber-700", green: "bg-gmo-green/10 text-gmo-green",
  red: "bg-gmo-red/10 text-gmo-red", gray: "bg-gray-100 text-obsidian/50",
};

export default function UsersAdminTab({ users }) {
  return (
    <div className="space-y-5 animate-fade-up">
      {/* Permissions matrix */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-obsidian/30" />
          <h3 className="font-heading text-sm font-bold text-obsidian">Matrice des permissions par rôle</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {ROLE_MATRIX.map(r => (
            <div key={r.role} className="border border-gray-100 rounded-xl p-3 hover:shadow-sm transition-shadow">
              <div className={`w-8 h-8 rounded-lg ${colorMap[r.color]} flex items-center justify-center text-white text-xs font-bold mb-2`}>
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
        <p className="text-[10px] text-obsidian/30 font-body mt-4 flex items-center gap-1.5">
          <Shield className="w-3 h-3" />
          Pour modifier le rôle d'un utilisateur, allez dans le Backoffice → Utilisateurs → Modifier le rôle.
        </p>
      </div>

      {/* Users table */}
      <EntityTable
        title="Utilisateurs de l'application"
        subtitle={`${users.length} comptes enregistrés`}
        columns={COLUMNS}
        rows={users}
      />
    </div>
  );
}