import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Truck, Clock, TrendingUp } from "lucide-react";

const TICKER_ITEMS = [
  "OUAGADOUGOU → BOBO DIOULASSO",
  "LOGISTIQUE 24/7",
  "DIEBOUGOU → OUAHIGOUYA",
  "DISTRIBUTION NATIONALE",
  "BURKINA FASO",
  "CÔTE D'IVOIRE · MALI · NIGER",
];

const STATS = [
  { icon: MapPin, value: "4+", label: "Villes couvertes" },
  { icon: Truck, value: "50+", label: "Véhicules" },
  { icon: Clock, value: "24/7", label: "Disponibilité" },
  { icon: TrendingUp, value: "100+", label: "Livraisons/jour" },
];

export default function HeroSection({ heroImage }) {
  return (
    <section id="accueil" className="relative min-h-screen bg-obsidian overflow-hidden">
      {/* Background */}
      <motion.div
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <img src={heroImage} alt="Flotte GMO" className="w-full h-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/95 via-obsidian/75 to-obsidian/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent" />
      </motion.div>

      {/* Decorative animated lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 0.04, x: 0 }}
            transition={{ delay: 1 + i * 0.3, duration: 1 }}
            className="absolute left-0 right-0 border-t border-white"
            style={{ top: `${25 + i * 25}%` }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 min-h-screen flex flex-col justify-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center pt-24 pb-20">
          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="w-6 h-[2px] bg-gmo-green" />
              <span className="font-body text-xs uppercase tracking-[0.3em] text-gmo-green">
                Groupe Madina Oumarou · Burkina Faso
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-bold text-white leading-[0.92] mb-8 tracking-tight"
            >
              NOUS
              <br />
              <span className="text-gmo-green relative">
                DÉPLAÇONS
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.2, duration: 0.7, ease: "easeOut" }}
                  className="absolute -bottom-1 left-0 right-0 h-1 bg-gmo-red origin-left"
                />
              </span>
              <br />
              LE CONTINENT
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.7 }}
              className="font-body text-lg text-white/55 leading-relaxed max-w-lg mb-10"
            >
              Leader de la distribution au Burkina Faso. Logistique, transport et distribution 
              à travers l'Afrique de l'Ouest avec précision et fiabilité.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.7 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }); }}
                className="group bg-gmo-green text-white font-heading font-bold text-sm px-8 py-4 hover:bg-gmo-green/90 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-gmo-green/25 hover:shadow-gmo-green/40 hover:-translate-y-0.5"
              >
                Demander un devis
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#services"
                onClick={(e) => { e.preventDefault(); document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" }); }}
                className="border border-white/20 text-white font-heading font-medium text-sm px-8 py-4 hover:border-gmo-green/60 hover:text-gmo-green hover:bg-gmo-green/5 transition-all duration-300"
              >
                Nos services
              </a>
            </motion.div>
          </div>

          {/* Right: Stats */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="hidden lg:grid grid-cols-2 gap-4"
          >
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + i * 0.15 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="border border-white/10 p-6 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-gmo-green/30 transition-all duration-300 cursor-default"
              >
                <stat.icon className="w-5 h-5 text-gmo-green mb-3" />
                <p className="font-heading text-3xl font-bold text-white">{stat.value}</p>
                <p className="font-body text-xs text-white/40 uppercase tracking-widest mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Ticker */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/8 bg-white/5 backdrop-blur-sm">
        <div className="overflow-hidden py-3">
          <div className="animate-ticker flex whitespace-nowrap">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="font-body text-xs uppercase tracking-[0.2em] text-white/25 mx-8">
                {item}
                <span className="ml-8 text-gmo-red/50">●</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}