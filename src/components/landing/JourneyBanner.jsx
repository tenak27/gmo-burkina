import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function JourneyBanner({ journeyImage }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative h-[55vh] lg:h-[65vh] overflow-hidden">
      <motion.img
        src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/fb07a6a03_Gemini_Generated_Image_nlu5sanlu5sanlu5.png"
        alt="Voyage logistique GMOB"
        initial={{ scale: 1.1 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 2, ease: "easeOut" }}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-obsidian/80 via-obsidian/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 via-transparent to-transparent" />

      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-[2px] bg-gmo-red" />
              <p className="font-body text-xs uppercase tracking-[0.4em] text-white/60">Notre mission</p>
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight max-w-2xl">
              LA FORCE DU
              <br />
              <span className="text-gmo-green">MOUVEMENT</span>
            </h2>
            <p className="font-body text-base text-white/50 mt-6 max-w-xl leading-relaxed">
              Chaque jour, nos équipes parcourent des milliers de kilomètres pour connecter les 
              communautés et alimenter le commerce à travers le Burkina Faso.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-4 right-6 font-body text-[10px] text-white/20 tracking-widest">
        12.3714° N · 1.5197° W — OUAGADOUGOU
      </div>
    </section>
  );
}