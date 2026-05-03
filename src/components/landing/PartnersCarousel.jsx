import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const PARTNERS = [
  { name: "SN CITEC", desc: "Huiles & savons" },
  { name: "MABUCIG", desc: "Tabac & distribution" },
  { name: "SN SOSUCO", desc: "Sucre GAZELLE" },
  { name: "COBUFA", desc: "Confiserie ETALON" },
  { name: "GMB", desc: "Grand Moulin du Faso" },
  { name: "AXE", desc: "Hygiène & soins" },
  { name: "OHADA", desc: "Cadre juridique" },
  { name: "MINEFID", desc: "Partenaire institutionnel" },
];

// Duplicate for seamless loop
const DOUBLED = [...PARTNERS, ...PARTNERS];

export default function PartnersCarousel() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="bg-white py-16 lg:py-20 border-t border-b border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          className="flex items-center gap-3"
        >
          <div className="w-6 h-[2px] bg-gmo-green" />
          <span className="font-body text-xs uppercase tracking-[0.3em] text-obsidian/40">
            Ils nous font confiance
          </span>
        </motion.div>
      </div>

      {/* Scrolling track */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div
          className="flex gap-5 animate-ticker"
          style={{ width: "max-content" }}
        >
          {DOUBLED.map((partner, i) => (
            <div
              key={i}
              className="flex-shrink-0 flex flex-col items-center justify-center gap-1.5 bg-light-gray hover:bg-gmo-green/5 border border-gray-100 hover:border-gmo-green/25 rounded-2xl px-9 py-5 w-44 transition-all duration-300 cursor-default"
            >
              <span className="font-heading text-base font-bold text-obsidian tracking-wide">
                {partner.name}
              </span>
              <span className="font-body text-[10px] text-obsidian/35 uppercase tracking-widest text-center">
                {partner.desc}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}