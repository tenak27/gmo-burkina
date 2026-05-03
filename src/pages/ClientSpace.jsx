import React, { useState } from "react";
import { motion } from "framer-motion";
import { Package, Clock, MapPin, Star, ShoppingBag, ArrowRight, Phone, LogOut, User, ChevronRight, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import RoleGuard from "@/components/auth/RoleGuard";

const PRODUCTS = [
  { name: "Huile MADINA", cat: "Alimentaire", img: "https://gmobfaso.com/assets/img/produits/huile-madina.jpg", status: "Disponible" },
  { name: "Sucre GAZELLE", cat: "Alimentaire", img: "https://gmobfaso.com/assets/img/produits/sucre-gazelle.jpg", status: "Disponible" },
  { name: "Farine Blé du Sahel", cat: "Alimentaire", img: "https://gmobfaso.com/assets/img/produits/farine.jpg", status: "Disponible" },
  { name: "Savon BURKINA", cat: "Hygiène", img: "https://gmobfaso.com/assets/img/produits/savon.jpg", status: "Disponible" },
];

const QUICK_ACTIONS = [
  { icon: ShoppingBag, label: "Commander", desc: "Passer une commande", href: "https://wa.me/22676211633", external: true, color: "gmo-green" },
  { icon: Clock, label: "Mes commandes", desc: "Historique & suivi", href: "#", external: false, color: "gmo-green" },
  { icon: MapPin, label: "Points de retrait", desc: "Trouver un point", href: "#", external: false, color: "gmo-green" },
  { icon: Star, label: "Catalogue", desc: "Voir nos produits", href: "#", external: false, color: "gmo-green" },
];

function ClientDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("accueil");

  return (
    <div className="min-h-screen bg-concrete">
      {/* Top bar */}
      <div className="bg-obsidian text-white sticky top-0 z-40 shadow-xl">
        <div className="max-w-5xl mx-auto px-5 py-0 flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <img src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c7662a636_logo-gmo2x.png" alt="GMO" className="h-8 brightness-0 invert opacity-90" />
            <span className="hidden sm:block w-px h-5 bg-white/15" />
            <span className="hidden sm:block font-body text-[11px] text-white/35 uppercase tracking-widest">Espace Client</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gmo-green flex items-center justify-center">
                <span className="font-heading font-bold text-white text-xs">{user?.full_name?.charAt(0) || "C"}</span>
              </div>
              <span className="hidden sm:block font-body text-xs text-white/55">{user?.full_name || "Client"}</span>
            </div>
            <button onClick={() => logout()} className="flex items-center gap-1 text-white/30 hover:text-gmo-red transition-colors ml-1">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-5xl mx-auto px-5 flex gap-1 border-t border-white/5">
          {[
            { id: "accueil", label: "Accueil" },
            { id: "commandes", label: "Commandes" },
            { id: "catalogue", label: "Catalogue" },
            { id: "contact", label: "Contact" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`font-body text-xs uppercase tracking-widest px-4 py-3.5 border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-gmo-green text-gmo-green"
                  : "border-transparent text-white/35 hover:text-white/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-8">
        {/* Welcome banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-obsidian to-gmo-green/80 rounded-2xl p-7 mb-8 text-white overflow-hidden relative"
        >
          <div className="absolute right-0 top-0 bottom-0 w-40 opacity-10">
            <div className="w-40 h-40 bg-white rounded-full -translate-y-8 translate-x-8" />
          </div>
          <p className="font-body text-xs uppercase tracking-widest text-white/50 mb-2">Bienvenue</p>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold mb-1">
            {user?.full_name || "Cher Client"} 👋
          </h1>
          <p className="font-body text-sm text-white/50">Gérez vos commandes et accédez à nos services depuis votre espace dédié.</p>
        </motion.div>

        {/* Quick actions */}
        <p className="font-heading text-xs uppercase tracking-widest text-obsidian/35 mb-4">Actions rapides</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {QUICK_ACTIONS.map((a, i) => (
            <motion.a
              key={a.label}
              href={a.href}
              target={a.external ? "_blank" : undefined}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-gmo-green/20 transition-all group flex flex-col items-center text-center cursor-pointer"
            >
              <div className="w-10 h-10 bg-gmo-green/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-gmo-green/20 transition-colors">
                <a.icon className="w-5 h-5 text-gmo-green" />
              </div>
              <p className="font-heading text-sm font-bold text-obsidian">{a.label}</p>
              <p className="font-body text-[11px] text-obsidian/40 mt-0.5">{a.desc}</p>
            </motion.a>
          ))}
        </div>

        {/* Products preview */}
        <p className="font-heading text-xs uppercase tracking-widest text-obsidian/35 mb-4">Nos produits</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {PRODUCTS.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.07 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all"
            >
              <div className="aspect-square bg-gray-50 overflow-hidden">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" onError={(e) => { e.target.style.display="none"; }} />
              </div>
              <div className="p-3">
                <p className="font-heading text-xs font-bold text-obsidian">{p.name}</p>
                <p className="font-body text-[10px] text-obsidian/35">{p.cat}</p>
                <span className="inline-block mt-1.5 font-body text-[9px] uppercase tracking-widest text-gmo-green bg-gmo-green/8 px-2 py-0.5 rounded-full">{p.status}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA block */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div>
            <p className="font-heading text-base font-bold text-obsidian mb-1">Besoin d'aide ?</p>
            <p className="font-body text-sm text-obsidian/45">Notre équipe est disponible Lun–Sam 8h30–18h.</p>
          </div>
          <a href="tel:+22625331900" className="flex items-center gap-2 bg-gmo-green text-white font-heading font-bold text-sm px-6 py-3 rounded-lg hover:bg-gmo-green/90 transition-all flex-shrink-0">
            <Phone className="w-4 h-4" /> +226 25 33 19 00
          </a>
        </motion.div>

        <p className="text-center font-body text-[11px] text-obsidian/25 mt-8">
          <Link to="/" className="hover:text-gmo-green transition-colors">← Retour au site public</Link>
        </p>
      </div>
    </div>
  );
}

export default function ClientSpace() {
  return (
    <RoleGuard roles={["user", "client", "admin"]}>
      <ClientDashboard />
    </RoleGuard>
  );
}