import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function JourneyBanner({ journeyImage }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative h-[50vh] lg:h-[60vh] overflow-hidden">
      <motion.img
        src={journeyImage}
        alt="Voyage logistique GMOB"
        initial={{ scale: 1.1 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-obsidian/60" />
      
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-center px-6"
        >
          <p className="font-body text-xs uppercase tracking-[0.4em] text-gold/60 mb-4">
            Notre mission
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-6xl font-bold text-concrete leading-tight max-w-3xl">
            LA FORCE DU
            <br />
            <span className="text-gmo-green">MOUVEMENT</span>
          </h2>
          <p className="font-body text-sm text-concrete/50 mt-6 max-w-xl mx-auto leading-relaxed">
            Chaque jour, nos équipes parcourent des milliers de kilomètres pour connecter les communautés 
            et alimenter le commerce à travers le Burkina Faso et l'Afrique de l'Ouest.
          </p>
        </motion.div>
      </div>

      {/* Coordinate overlay */}
      <div className="absolute bottom-4 left-6 font-body text-[10px] text-concrete/20 tracking-widest">
        12.3714° N · 1.5197° W — OUAGADOUGOU
      </div>
    </section>
  );
}