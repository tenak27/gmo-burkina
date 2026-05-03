import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, FileText, Truck, Users, BarChart2, ArrowRight, Phone } from "lucide-react";

const FEATURES = [
  { icon: FileText, title: "Catalogue grossiste", desc: "Accédez aux tarifs préférentiels et conditions spéciales détaillants.", action: "Voir catalogue" },
  { icon: TrendingUp, title: "Commandes en gros", desc: "Passez vos commandes en volume avec des délais prioritaires.", action: "Commander" },
  { icon: Truck, title: "Livraisons dédiées", desc: "Livraison directe sur votre point de vente selon votre planning.", action: "Planifier" },
  { icon: BarChart2, title: "Suivi des ventes", desc: "Consultez vos historiques de commandes et statistiques.", action: "Voir stats" },
  { icon: Users, title: "Programme fidélité", desc: "Bénéficiez de remises progressives et offres exclusives.", action: "En savoir plus" },
];

export default function RetailerSpace() {
  return (
    <div className="min-h-screen bg-light-gray">
      {/* Header */}
      <div className="bg-obsidian text-white">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c7662a636_logo-gmo2x.png" alt="GMO" className="h-9 brightness-0 invert opacity-90" />
            <span className="font-body text-xs text-white/40 uppercase tracking-widest">Espace Détaillant</span>
          </div>
          <a href="/" className="font-body text-xs text-white/40 hover:text-white transition-colors">← Retour au site</a>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-obsidian via-obsidian to-gmo-red/80 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="font-body text-xs uppercase tracking-[0.3em] text-gmo-red/80 block mb-4">Partenaires</span>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              Espace <span className="text-gmo-red">Détaillant</span>
            </h1>
            <p className="font-body text-white/55 text-base max-w-lg leading-relaxed">
              Gérez vos approvisionnements, accédez aux tarifs préférentiels et développez votre commerce avec GMO Burkina.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
          {FEATURES.slice(0, 3).map((f, i) => (
            <FeatureCard key={f.title} f={f} i={i} accent="gmo-red" />
          ))}
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {FEATURES.slice(3).map((f, i) => (
            <FeatureCard key={f.title} f={f} i={i + 3} accent="gmo-red" />
          ))}
        </div>

        {/* Partner banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div>
            <p className="font-heading text-xl font-bold text-obsidian mb-1">Devenir partenaire détaillant</p>
            <p className="font-body text-sm text-obsidian/50">Rejoignez notre réseau et bénéficiez de conditions exclusives.</p>
          </div>
          <a
            href="https://wa.me/22676211633"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gmo-red text-white font-heading font-bold text-sm px-7 py-3.5 rounded-lg hover:bg-gmo-red/90 transition-all flex-shrink-0"
          >
            <Phone className="w-4 h-4" /> Nous contacter
          </a>
        </motion.div>
      </div>
    </div>
  );
}

function FeatureCard({ f, i }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.1, duration: 0.6 }}
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:border-gmo-red/20 transition-all duration-300 group flex flex-col"
    >
      <div className="w-11 h-11 bg-gmo-red/8 rounded-xl flex items-center justify-center mb-4 group-hover:bg-gmo-red/15 transition-colors">
        <f.icon className="w-5 h-5 text-gmo-red" />
      </div>
      <h3 className="font-heading text-base font-bold text-obsidian mb-2">{f.title}</h3>
      <p className="font-body text-sm text-obsidian/50 leading-relaxed flex-1 mb-4">{f.desc}</p>
      <div className="flex items-center gap-1 font-heading text-xs font-bold text-gmo-red uppercase tracking-widest group-hover:gap-2 transition-all cursor-pointer">
        {f.action} <ArrowRight className="w-3 h-3" />
      </div>
    </motion.div>
  );
}