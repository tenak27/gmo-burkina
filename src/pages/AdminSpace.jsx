import React from "react";
import { motion } from "framer-motion";
import { Users, Package, Truck, BarChart2, Settings, Shield, Bell, TrendingUp } from "lucide-react";

const STATS = [
  { label: "Commandes / mois", value: "1 240+", icon: Package, color: "text-gmo-green", bg: "bg-gmo-green/10" },
  { label: "Livraisons actives", value: "87", icon: Truck, color: "text-gmo-red", bg: "bg-gmo-red/10" },
  { label: "Détaillants actifs", value: "340+", icon: Users, color: "text-gold", bg: "bg-gold/10" },
  { label: "Croissance mensuelle", value: "+12%", icon: TrendingUp, color: "text-gmo-green", bg: "bg-gmo-green/10" },
];

const MODULES = [
  { icon: Users, title: "Gestion clients", desc: "Gérez les comptes clients, détaillants et leur historique.", color: "gmo-green" },
  { icon: Package, title: "Catalogue & stocks", desc: "Produits, catégories, niveaux de stock et alertes.", color: "gmo-red" },
  { icon: Truck, title: "Gestion logistique", desc: "Tournées, chauffeurs, flotte et suivi des livraisons.", color: "gold" },
  { icon: BarChart2, title: "Rapports & analytics", desc: "KPIs, ventes, performances et tableaux de bord.", color: "gmo-green" },
  { icon: Bell, title: "Notifications", desc: "Alertes, annonces et communications internes.", color: "gmo-red" },
  { icon: Settings, title: "Configuration", desc: "Paramètres généraux, utilisateurs et permissions.", color: "gold" },
];

export default function AdminSpace() {
  return (
    <div className="min-h-screen bg-light-gray">
      {/* Header */}
      <div className="bg-obsidian text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c7662a636_logo-gmo2x.png" alt="GMO" className="h-9 brightness-0 invert opacity-90" />
            <div className="w-px h-6 bg-white/15" />
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-gmo-green" />
              <span className="font-body text-xs text-white/50 uppercase tracking-widest">Administration</span>
            </div>
          </div>
          <a href="/" className="font-body text-xs text-white/40 hover:text-white transition-colors">← Site public</a>
        </div>
      </div>

      {/* Page title */}
      <div className="bg-obsidian border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="font-body text-[10px] uppercase tracking-[0.3em] text-gmo-green block mb-3">Dashboard</span>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-1">
              Panneau d'<span className="text-gmo-green">administration</span>
            </h1>
            <p className="font-body text-sm text-white/35">GMO Burkina — Groupe Madina Oumarou</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all"
            >
              <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className="font-heading text-2xl font-bold text-obsidian">{s.value}</p>
              <p className="font-body text-xs text-obsidian/45 mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Modules */}
        <div className="mb-6">
          <p className="font-heading text-xs uppercase tracking-widest text-obsidian/35 mb-4">Modules</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              className={`bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:border-${m.color}/20 transition-all duration-300 group cursor-pointer`}
            >
              <div className={`w-10 h-10 bg-${m.color}/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <m.icon className={`w-5 h-5 text-${m.color}`} />
              </div>
              <h3 className="font-heading text-base font-bold text-obsidian mb-1">{m.title}</h3>
              <p className="font-body text-sm text-obsidian/50 leading-relaxed">{m.desc}</p>
              <div className={`mt-4 h-[2px] bg-${m.color} w-0 group-hover:w-full transition-all duration-500 rounded-full`} />
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center font-body text-xs text-obsidian/25 mt-12 tracking-widest uppercase"
        >
          GMO Burkina Admin · Accès restreint
        </motion.p>
      </div>
    </div>
  );
}