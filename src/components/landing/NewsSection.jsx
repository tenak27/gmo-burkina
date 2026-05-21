import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, ArrowRight, Calendar } from "lucide-react";

const NEWS = [
  {
    date: "21 mai 2026",
    title: "Nouvelle ligne Ouagadougou - Bobo Dioulasso",
    description: "Nous annonçons le lancement d'une nouvelle ligne de transport express avec garantie de livraison sous 48h. Service adapté pour les besoins logistiques urgents.",
    category: "Transport",
    highlight: true,
  },
  {
    date: "15 mai 2026",
    title: "Expansion de notre flotte de véhicules",
    description: "Acquisition de 5 nouveaux camions de transport équipés de GPS en temps réel. Amélioration continue de notre capacité de livraison et de traçabilité.",
    category: "Infrastructure",
    highlight: false,
  },
  {
    date: "8 mai 2026",
    title: "Partenariat logistique avec Côte d'Ivoire",
    description: "GMO Burkina officialise son partenariat avec un hub logistique majeur en Côte d'Ivoire pour améliorer les échanges commerciaux régionaux.",
    category: "Partenariat",
    highlight: false,
  },
  {
    date: "1 mai 2026",
    title: "Application de suivi en temps réel",
    description: "Lancement de notre nouvelle plateforme digitale permettant aux clients de suivre leurs livraisons en temps réel avec positionnement GPS précis.",
    category: "Technologie",
    highlight: false,
  },
];

export default function NewsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="actualites" className="bg-gradient-to-b from-white via-slate-50 to-white py-24 lg:py-32 relative overflow-hidden">
      {/* Accent lines */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-gmo-red/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-64 h-64 bg-gmo-green/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div ref={ref} className="mb-14">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-6 h-[2px] bg-gmo-red" />
            <span className="font-body text-xs uppercase tracking-[0.3em] text-gmo-red">Actualités & Mises à jour</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-4xl lg:text-5xl font-bold text-obsidian mb-4"
          >
            Restez informé de nos nouveautés
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="h-1 w-20 bg-gradient-to-r from-gmo-red to-gmo-green origin-left rounded-full"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
            className="font-body text-sm text-obsidian/55 max-w-2xl mt-6"
          >
            Découvrez les dernières innovations en matière de transport, logistique et distribution au Burkina Faso. GMO Burkina évolue constamment pour mieux servir ses clients.
          </motion.p>
        </div>

        {/* News Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {NEWS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative p-7 lg:p-8 rounded-2xl border transition-all duration-300 hover:shadow-lg ${
                item.highlight
                  ? "bg-gradient-to-br from-gmo-red/8 to-gmo-red/4 border-gmo-red/20 hover:border-gmo-red/40"
                  : "bg-white border-obsidian/8 hover:border-gmo-red/20"
              }`}
            >
              {item.highlight && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={isInView ? { width: 32 } : {}}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                  className="absolute top-0 left-0 h-1 bg-gradient-to-r from-gmo-red to-transparent rounded-tl-2xl"
                />
              )}

              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gmo-red" />
                  <span className="font-body text-xs text-obsidian/50">{item.date}</span>
                </div>
                <span className={`font-body text-[10px] uppercase tracking-widest px-3 py-1 rounded-full ${
                  item.highlight
                    ? "bg-gmo-red text-white"
                    : "bg-obsidian/8 text-obsidian/60"
                }`}>
                  {item.category}
                </span>
              </div>

              <h3 className="font-heading text-lg lg:text-xl font-bold text-obsidian mb-3 group-hover:text-gmo-red transition-colors duration-300">
                {item.title}
              </h3>

              <p className="font-body text-sm text-obsidian/60 leading-relaxed mb-5">
                {item.description}
              </p>

              <motion.button
                whileHover={{ x: 4 }}
                className="flex items-center gap-2 font-body text-xs uppercase tracking-widest text-gmo-red hover:text-gmo-red/80 transition-colors duration-300"
              >
                En savoir plus
                <ArrowRight className="w-3 h-3" />
              </motion.button>

              {item.highlight && (
                <div className="absolute top-0 right-0 w-12 h-12 bg-gmo-red/5 rounded-bl-full -z-10" />
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="font-body text-sm text-obsidian/60 mb-6">
            Vous avez une actualité à partager ou des questions ?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-gmo-red text-white font-heading font-bold text-sm px-8 py-4 rounded-xl hover:bg-gmo-red/90 transition-all duration-300 hover:shadow-lg hover:shadow-gmo-red/20"
          >
            <TrendingUp className="w-4 h-4" />
            Rester à l'écoute
          </a>
        </motion.div>
      </div>
    </section>
  );
}