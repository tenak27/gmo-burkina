import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Package, Truck, BarChart2, Settings, Shield, Bell, TrendingUp, LogOut, Eye, Database, MessageSquare, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import RoleGuard from "@/components/auth/RoleGuard";

const STATS = [
  { label: "Clients inscrits", value: "—", icon: Users, color: "text-gmo-green", bg: "bg-gmo-green/10" },
  { label: "Détaillants actifs", value: "340+", icon: Globe, color: "text-gmo-red", bg: "bg-gmo-red/10" },
  { label: "Produits catalogue", value: "12+", icon: Package, color: "text-gold", bg: "bg-gold/10" },
  { label: "Croissance", value: "+12%", icon: TrendingUp, color: "text-gmo-green", bg: "bg-gmo-green/10" },
];

const MODULES = [
  { icon: Users, title: "Gestion utilisateurs", desc: "Clients, détaillants, rôles et permissions.", color: "gmo-green", link: "#" },
  { icon: Package, title: "Catalogue & stocks", desc: "Produits, catégories et alertes de stock.", color: "gmo-red", link: "#" },
  { icon: Truck, title: "Logistique", desc: "Tournées, flotte et suivi des livraisons.", color: "gold", link: "#" },
  { icon: BarChart2, title: "Analytics", desc: "KPIs, ventes et tableaux de bord.", color: "gmo-green", link: "#" },
  { icon: MessageSquare, title: "Messages & Notifications", desc: "Alertes clients et communications.", color: "gmo-red", link: "#" },
  { icon: Settings, title: "Configuration", desc: "Paramètres généraux et sécurité.", color: "gold", link: "#" },
];

const TABS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "users", label: "Utilisateurs" },
  { id: "orders", label: "Commandes" },
  { id: "analytics", label: "Analytics" },
  { id: "settings", label: "Paramètres" },
];

function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (activeTab === "users") loadUsers();
  }, [activeTab]);

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const list = await base44.entities.User.list("-created_date", 20);
      setUsers(list || []);
    } catch (e) {
      console.error(e);
    }
    setLoadingUsers(false);
  };

  return (
    <div className="min-h-screen bg-light-gray">
      {/* Top bar */}
      <div className="bg-obsidian text-white sticky top-0 z-40 shadow-2xl">
        <div className="max-w-7xl mx-auto px-5 flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <img src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c7662a636_logo-gmo2x.png" alt="GMO" className="h-8 brightness-0 invert opacity-90" />
            <span className="hidden sm:block w-px h-5 bg-white/15" />
            <div className="hidden sm:flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-gmo-green" />
              <span className="font-body text-[11px] text-gmo-green/70 uppercase tracking-widest">Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-gmo-red rounded-full" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gmo-green to-gmo-green/60 flex items-center justify-center">
                <span className="font-heading font-bold text-white text-xs">{user?.full_name?.charAt(0) || "A"}</span>
              </div>
              <div className="hidden sm:block">
                <p className="font-heading text-xs font-semibold text-white">{user?.full_name || "Admin"}</p>
                <p className="font-body text-[9px] text-gmo-green/70 uppercase tracking-widest">Administrateur</p>
              </div>
            </div>
            <button onClick={() => logout()} className="flex items-center gap-1.5 text-white/30 hover:text-gmo-red transition-colors ml-2 font-body text-xs">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-5 flex gap-0 border-t border-white/5 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`font-body text-xs uppercase tracking-widest px-5 py-3.5 border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id ? "border-gmo-green text-gmo-green" : "border-transparent text-white/30 hover:text-white/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-8">

        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Header */}
            <div className="mb-8">
              <h1 className="font-heading text-2xl font-bold text-obsidian mb-1">Tableau de bord</h1>
              <p className="font-body text-sm text-obsidian/40">GMO Burkina — Vue d'ensemble</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all"
                >
                  <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                    <s.icon className={`w-4 h-4 ${s.color}`} />
                  </div>
                  <p className="font-heading text-2xl font-bold text-obsidian">{s.value}</p>
                  <p className="font-body text-[11px] text-obsidian/40 mt-0.5">{s.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Modules */}
            <p className="font-heading text-xs uppercase tracking-widest text-obsidian/30 mb-4">Modules de gestion</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {MODULES.map((m, i) => (
                <motion.div
                  key={m.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.08 }}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"
                >
                  <div className={`w-10 h-10 bg-${m.color}/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <m.icon className={`w-5 h-5 text-${m.color}`} />
                  </div>
                  <h3 className="font-heading text-base font-bold text-obsidian mb-1">{m.title}</h3>
                  <p className="font-body text-sm text-obsidian/45 leading-relaxed">{m.desc}</p>
                  <div className={`mt-4 h-[2px] bg-${m.color} w-0 group-hover:w-full transition-all duration-500 rounded-full`} />
                </motion.div>
              ))}
            </div>

            {/* Quick links */}
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/client" className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-5 py-3 font-body text-sm text-obsidian/60 hover:border-gmo-green hover:text-gmo-green transition-all shadow-sm">
                <Eye className="w-4 h-4" /> Voir Espace Client
              </Link>
              <Link to="/detaillant" className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-5 py-3 font-body text-sm text-obsidian/60 hover:border-gmo-red hover:text-gmo-red transition-all shadow-sm">
                <Eye className="w-4 h-4" /> Voir Espace Détaillant
              </Link>
              <Link to="/" className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-5 py-3 font-body text-sm text-obsidian/60 hover:border-obsidian hover:text-obsidian transition-all shadow-sm">
                <Globe className="w-4 h-4" /> Site public
              </Link>
            </div>
          </motion.div>
        )}

        {/* USERS TAB */}
        {activeTab === "users" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mb-6">
              <h2 className="font-heading text-xl font-bold text-obsidian mb-1">Gestion des utilisateurs</h2>
              <p className="font-body text-sm text-obsidian/40">Clients et détaillants inscrits sur la plateforme.</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <p className="font-heading text-sm font-bold text-obsidian">Utilisateurs récents</p>
                <button onClick={loadUsers} className="font-body text-xs text-gmo-green hover:underline">Actualiser</button>
              </div>
              {loadingUsers ? (
                <div className="flex justify-center py-12">
                  <div className="w-6 h-6 border-3 border-gmo-green/30 border-t-gmo-green rounded-full animate-spin" />
                </div>
              ) : users.length === 0 ? (
                <div className="py-12 text-center">
                  <Database className="w-8 h-8 text-obsidian/15 mx-auto mb-3" />
                  <p className="font-body text-sm text-obsidian/35">Aucun utilisateur trouvé</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {users.map((u) => (
                    <div key={u.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="w-9 h-9 rounded-full bg-obsidian flex items-center justify-center flex-shrink-0">
                        <span className="font-heading font-bold text-white text-sm">{u.full_name?.charAt(0) || "?"}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-heading text-sm font-semibold text-obsidian truncate">{u.full_name || "—"}</p>
                        <p className="font-body text-xs text-obsidian/40 truncate">{u.email}</p>
                      </div>
                      <span className={`font-body text-[10px] uppercase tracking-widest px-3 py-1 rounded-full ${
                        u.role === "admin" ? "bg-gmo-green/10 text-gmo-green" : u.role === "detaillant" ? "bg-gmo-red/10 text-gmo-red" : "bg-gray-100 text-obsidian/50"
                      }`}>
                        {u.role || "user"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* OTHER TABS — placeholder */}
        {["orders", "analytics", "settings"].includes(activeTab) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24">
            <Database className="w-10 h-10 text-obsidian/15 mb-4" />
            <p className="font-heading text-base font-bold text-obsidian/40 mb-1 capitalize">{activeTab}</p>
            <p className="font-body text-sm text-obsidian/25">Module en cours de développement</p>
          </motion.div>
        )}

        <p className="text-center font-body text-[11px] text-obsidian/20 mt-12 uppercase tracking-widest">
          GMO Burkina Admin · Accès restreint aux administrateurs
        </p>
      </div>
    </div>
  );
}

export default function AdminSpace() {
  return (
    <RoleGuard roles={["admin"]}>
      <AdminDashboard />
    </RoleGuard>
  );
}