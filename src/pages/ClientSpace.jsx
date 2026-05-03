import React from "react";
import { motion } from "framer-motion";
import { Package, Clock, MapPin, Star, ShoppingBag, ArrowRight, Phone } from "lucide-react";

const FEATURES = [
  { icon: ShoppingBag, title: "Passer une commande", desc: "Commandez vos produits directement en ligne ou par WhatsApp.", action: "Commander", href: "https://wa.me/22676211633" },
  { icon: Clock, title: "Suivi de livraison", desc: "Suivez vos commandes en temps réel jusqu'à votre porte.", action: "Suivre", href: "#contact" },
  { icon: MapPin, title: "Points de collecte", desc: "Retrouvez nos points de distribution dans votre ville.", action: "Voir la carte", href: "#couverture" },
  { icon: Star, title: "Catalogue produits", desc: "Découvrez toute notre gamme de produits de qualité.", action: "Voir les produits", href: "#produits" },
];

export default function ClientSpace() {
  return (
    <div className="min-h-screen bg-concrete">
      {/* Header */}
      <div className="bg-obsidian text-white">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c7662a636_logo-gmo2x.png" alt="GMO" className="h-9 brightness-0 invert opacity-90" />
            <span className="font-body text-xs text-white/40 uppercase tracking-widest">Espace Client</span>
          </div>
          <a href="/" className="font-body text-xs text-white/40 hover:text-white transition-colors">← Retour au site</a>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-obsidian to-gmo-green/90 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="font-body text-xs uppercase tracking-[0.3em] text-gmo-green/80 block mb-4">Bienvenue</span>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              Espace <span className="text-gmo-green">Client</span>
            </h1>
            <p className="font-body text-white/55 text-base max-w-lg leading-relaxed">
              Commandez, suivez vos livraisons et accédez à nos services directement depuis votre espace dédié.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:border-gmo-green/20 transition-all duration-300 group flex flex-col"
            >
              <div className="w-11 h-11 bg-gmo-green/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-gmo-green/20 transition-colors">
                <f.icon className="w-5 h-5 text-gmo-green" />
              </div>
              <h3 className="font-heading text-base font-bold text-obsidian mb-2">{f.title}</h3>
              <p className="font-body text-sm text-obsidian/50 leading-relaxed flex-1 mb-4">{f.desc}</p>
              <a
                href={f.href}
                className="flex items-center gap-1 font-heading text-xs font-bold text-gmo-green uppercase tracking-widest group-hover:gap-2 transition-all"
              >
                {f.action} <ArrowRight className="w-3 h-3" />
              </a>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-obsidian rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div>
            <p className="font-heading text-xl font-bold text-white mb-1">Besoin d'aide ?</p>
            <p className="font-body text-sm text-white/45">Notre équipe est disponible Lun–Sam pour vous assister.</p>
          </div>
          <a
            href="tel:+22625331900"
            className="flex items-center gap-2 bg-gmo-green text-white font-heading font-bold text-sm px-7 py-3.5 rounded-lg hover:bg-gmo-green/90 transition-all flex-shrink-0"
          >
            <Phone className="w-4 h-4" /> +226 25 33 19 00
          </a>
        </motion.div>
      </div>
    </div>
  );
}