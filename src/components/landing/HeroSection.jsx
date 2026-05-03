import React from "react";
import { motion } from "framer-motion";
import { ArrowDown, MapPin, Truck, Clock } from "lucide-react";

const TICKER_ITEMS = [
  "OUAGADOUGOU → BOBO DIOULASSO",
  "LOGISTIQUE 24/7",
  "DIEBOUGOU → OUAHIGOUYA",
  "DISTRIBUTION NATIONALE",
  "BURKINA FASO",
  "CÔTE D'IVOIRE · MALI · NIGER",
];

export default function HeroSection({ heroImage }) {
  return (
    <section id="accueil" className="relative min-h-screen bg-obsidian overflow-hidden">
      {/* Background Image */}
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <img
          src={heroImage}
          alt="Flotte logistique GMOB"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian/40" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 min-h-screen flex flex-col justify-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center pt-20">
          {/* Left: Headline */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mb-6"
            >
              <span className="font-body text-xs uppercase tracking-[0.3em] text-gmo-green/80">
                Groupe Madina Oumarou · Burkina Faso
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="font-heading text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-concrete leading-[0.95] mb-8"
            >
              NOUS
              <br />
              <span className="text-gmo-green">DÉPLAÇONS</span>
              <br />
              LE CONTINENT
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="font-body text-lg text-concrete/60 leading-relaxed max-w-lg mb-10"
            >
              Leader de la distribution au Burkina Faso. Logistique, transport et distribution 
              à travers l'Afrique de l'Ouest avec précision et fiabilité.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-gmo-green text-white font-heading font-bold text-sm px-8 py-4 hover:bg-gmo-green/80 transition-colors duration-300 flex items-center gap-2"
              >
                Demander un devis
                <ArrowDown className="w-4 h-4 rotate-[-90deg]" />
              </a>
              <a
                href="#services"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="border border-concrete/20 text-concrete font-heading font-medium text-sm px-8 py-4 hover:border-gmo-green/50 hover:text-gmo-green transition-all duration-300"
              >
                Nos services
              </a>
            </motion.div>
          </div>

          {/* Right: Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="hidden lg:grid grid-cols-2 gap-6"
          >
            {[
              { icon: MapPin, value: "4+", label: "Villes couvertes" },
              { icon: Truck, value: "100+", label: "Livraisons / jour" },
              { icon: Clock, value: "24/7", label: "Disponibilité" },
              { icon: ArrowDown, value: "5+", label: "Partenaires majeurs" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + i * 0.15 }}
                className="border border-concrete/10 p-6 bg-obsidian/40 backdrop-blur-sm"
              >
                <stat.icon className="w-5 h-5 text-gmo-green mb-3" />
                <p className="font-heading text-3xl font-bold text-concrete">{stat.value}</p>
                <p className="font-body text-xs text-concrete/50 uppercase tracking-widest mt-1">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Ticker */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-concrete/10 bg-obsidian/60 backdrop-blur-sm">
        <div className="overflow-hidden py-3">
          <div className="animate-ticker flex whitespace-nowrap">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span
                key={i}
                className="font-body text-xs uppercase tracking-[0.2em] text-concrete/30 mx-8"
              >
                {item}
                <span className="ml-8 text-gmo-red/40">●</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}