import React, { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, FileText, Truck, Users, BarChart2, ArrowRight, Phone, LogOut, Bell, Package, ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import RoleGuard from "@/components/auth/RoleGuard";

const STATS = [
  { label: "Commandes ce mois", value: "—", icon: ShoppingCart, color: "text-gmo-red", bg: "bg-gmo-red/10" },
  { label: "Produits disponibles", value: "12+", icon: Package, color: "text-gmo-green", bg: "bg-gmo-green/10" },
  { label: "Livraisons planifiées", value: "—", icon: Truck, color: "text-gold", bg: "bg-gold/10" },
  { label: "Fidélité", value: "Actif", icon: Star, color: "text-gmo-green", bg: "bg-gmo-green/10" },
];

const QUICK_ACTIONS = [
  { icon: FileText, label: "Catalogue grossiste", desc: "Tarifs & conditions", color: "gmo-red" },
  { icon: ShoppingCart, label: "Passer commande", desc: "Commander en volume", color: "gmo-red" },
  { icon: Truck, label: "Planifier livraison", desc: "Calendrier livraisons", color: "gmo-red" },
  { icon: BarChart2, label: "Mes statistiques", desc: "Historique & KPIs", color: "gmo-red" },
];

function RetailerDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("accueil");

  return (
    <div className="min-h-screen bg-light-gray">
      {/* Top bar */}
      <div className="bg-obsidian text-white sticky top-0 z-40 shadow-xl">
        <div className="max-w-5xl mx-auto px-5 flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <img src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c7662a636_logo-gmo2x.png" alt="GMO" className="h-8 brightness-0 invert opacity-90" />
            <span className="hidden sm:block w-px h-5 bg-white/15" />
            <span className="hidden sm:block font-body text-[11px] text-gmo-red/70 uppercase tracking-widest">Espace Détaillant</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gmo-red flex items-center justify-center">
                <span className="font-heading font-bold text-white text-xs">{user?.full_name?.charAt(0) || "D"}</span>
              </div>
              <span className="hidden sm:block font-body text-xs text-white/55">{user?.full_name || "Détaillant"}</span>
            </div>
            <button onClick={() => logout()} className="flex items-center gap-1 text-white/30 hover:text-gmo-red transition-colors ml-1">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-5xl mx-auto px-5 flex gap-1 border-t border-white/5">
          {["accueil", "catalogue", "commandes", "livraisons", "statistiques"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-body text-xs uppercase tracking-widest px-4 py-3.5 border-b-2 transition-all capitalize ${
                activeTab === tab ? "border-gmo-red text-gmo-red" : "border-transparent text-white/35 hover:text-white/60"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-8">
        {/* Welcome banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-obsidian via-obsidian to-gmo-red/70 rounded-2xl p-7 mb-8 text-white relative overflow-hidden"
        >
          <div className="absolute right-4 top-4 opacity-5">
            <div className="w-32 h-32 bg-white rounded-full" />
          </div>
          <p className="font-body text-xs uppercase tracking-widest text-white/45 mb-2">Partenaire détaillant</p>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold mb-1">
            Bonjour, {user?.full_name || "Partenaire"} 👋
          </h1>
          <p className="font-body text-sm text-white/45">Gérez vos approvisionnements et accédez aux tarifs préférentiels.</p>
          <div className="mt-4 flex gap-4">
            <a href="https://wa.me/22676211633" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gmo-red text-white font-heading font-bold text-xs px-4 py-2 rounded-lg hover:bg-gmo-red/90 transition-all">
              <Phone className="w-3 h-3" /> Commander par WhatsApp
            </a>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
            >
              <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className="font-heading text-xl font-bold text-obsidian">{s.value}</p>
              <p className="font-body text-[11px] text-obsidian/40 mt-0.5 leading-tight">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick actions */}
        <p className="font-heading text-xs uppercase tracking-widest text-obsidian/35 mb-4">Services</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {QUICK_ACTIONS.map((a, i) => (
            <motion.div
              key={a.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.07 }}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-gmo-red/20 transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 bg-gmo-red/8 rounded-xl flex items-center justify-center mb-3 group-hover:bg-gmo-red/15 transition-colors">
                <a.icon className="w-5 h-5 text-gmo-red" />
              </div>
              <p className="font-heading text-sm font-bold text-obsidian mb-0.5">{a.label}</p>
              <p className="font-body text-[11px] text-obsidian/40">{a.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Programme fidélité */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div>
            <p className="font-heading text-base font-bold text-obsidian mb-1">Programme fidélité Détaillant</p>
            <p className="font-body text-sm text-obsidian/45">Bénéficiez de remises progressives selon votre volume d'achat.</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Star className="w-4 h-4 text-gold fill-gold" />
            <span className="font-heading font-bold text-sm text-obsidian">Niveau Bronze</span>
          </div>
        </motion.div>

        <p className="text-center font-body text-[11px] text-obsidian/25 mt-8">
          <Link to="/" className="hover:text-gmo-red transition-colors">← Retour au site public</Link>
        </p>
      </div>
    </div>
  );
}

export default function RetailerSpace() {
  return (
    <RoleGuard roles={["detaillant", "admin"]}>
      <RetailerDashboard />
    </RoleGuard>
  );
}