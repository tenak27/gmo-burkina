import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const PANELS = [
  {
    img: "https://gmobfaso.com/assets/img/slides/slide-1.jpg",
    label: "DISTRIBUTION",
    sublabel: "Nationale",
    color: "#1A7A2E",
    accent: "bg-gmo-green",
  },
  {
    img: "https://gmobfaso.com/assets/img/slides/slide-2.jpg",
    label: "TRANSPORT",
    sublabel: "Logistique",
    color: "#CC1717",
    accent: "bg-gmo-red",
  },
  {
    img: "https://gmobfaso.com/assets/img/slides/slide-3.jpg",
    label: "QUALITÉ",
    sublabel: "Produits locaux",
    color: "#F5C400",
    accent: "bg-gold",
  },
  {
    img: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/1e2be0905_generated_51987d61.png",
    label: "EXPANSION",
    sublabel: "Afrique de l'Ouest",
    color: "#1A7A2E",
    accent: "bg-gmo-green",
  },
];

const TICKER_ITEMS = [
  "OUAGADOUGOU → BOBO DIOULASSO",
  "LOGISTIQUE 24/7",
  "DIEBOUGOU → OUAHIGOUYA",
  "DISTRIBUTION NATIONALE",
  "BURKINA FASO",
  "CÔTE D'IVOIRE · MALI · NIGER",
];

export default function HeroSection() {
  const [hovered, setHovered] = useState(null);

  return (
    <section id="accueil" className="relative min-h-screen bg-obsidian overflow-hidden flex flex-col">
      {/* Main slider */}
      <div className="flex flex-1 min-h-screen">
        {/* Left info panel — always visible */}
        <div className="relative z-10 flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-28 w-full lg:w-auto lg:min-w-[380px] xl:min-w-[440px] flex-shrink-0 pointer-events-none select-none">
          {/* Overlay for mobile — darkened bg */}
          <div className="absolute inset-0 lg:hidden bg-obsidian/70 backdrop-blur-sm" />

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-6 h-[2px] bg-gmo-green" />
              <span className="font-body text-xs uppercase tracking-[0.25em] text-gmo-green">
                Groupe Madina Oumarou · Burkina Faso
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-bold text-white leading-[0.9] tracking-tight mb-6"
            >
              {hovered !== null ? (
                <>
                  <motion.span
                    key={hovered}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="block"
                    style={{ color: PANELS[hovered].color }}
                  >
                    {PANELS[hovered].label}
                  </motion.span>
                  <motion.span
                    key={`sub-${hovered}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="block text-white"
                  >
                    {PANELS[hovered].sublabel.toUpperCase()}
                  </motion.span>
                </>
              ) : (
                <>
                  <span className="block text-white">NOUS</span>
                  <span className="block text-gmo-green">DÉPLAÇONS</span>
                  <span className="block text-white">LE CONTINENT</span>
                </>
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="font-body text-sm text-white/50 leading-relaxed max-w-xs mb-8"
            >
              Leader de la distribution au Burkina Faso. Logistique, transport et distribution à travers l'Afrique de l'Ouest.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-wrap gap-3 pointer-events-auto"
            >
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }); }}
                className="group bg-gmo-green text-white font-heading font-bold text-sm px-7 py-3.5 rounded-lg hover:bg-gmo-green/90 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-gmo-green/30 hover:-translate-y-0.5"
              >
                Demander un devis
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#services"
                onClick={(e) => { e.preventDefault(); document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" }); }}
                className="border border-white/20 text-white font-heading font-medium text-sm px-7 py-3.5 rounded-lg hover:border-white/50 hover:bg-white/5 transition-all duration-300"
              >
                Nos services
              </a>
            </motion.div>
          </div>
        </div>

        {/* Vertical panels — desktop */}
        <div className="hidden lg:flex flex-1">
          {PANELS.map((panel, i) => {
            const isHovered = hovered === i;
            return (
              <motion.div
                key={panel.label}
                className="relative overflow-hidden cursor-pointer flex-shrink-0"
                animate={{ flex: isHovered ? 3.5 : 1 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Image with zoom */}
                <motion.img
                  src={panel.img}
                  alt={panel.label}
                  className="absolute inset-0 w-full h-full object-cover"
                  animate={{ scale: isHovered ? 1.08 : 1 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />

                {/* Color tint overlay */}
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    background: isHovered
                      ? `linear-gradient(to top, ${panel.color}CC 0%, ${panel.color}33 60%, transparent 100%)`
                      : `linear-gradient(to top, ${panel.color}99 0%, ${panel.color}44 50%, transparent 100%)`,
                  }}
                  transition={{ duration: 0.5 }}
                />

                {/* Dark overlay when not hovered */}
                <motion.div
                  className="absolute inset-0 bg-obsidian"
                  animate={{ opacity: isHovered ? 0 : 0.45 }}
                  transition={{ duration: 0.4 }}
                />

                {/* Vertical label */}
                <div className="absolute inset-0 flex items-end justify-center pb-12">
                  <motion.div
                    className="flex flex-col items-center gap-3"
                    animate={{ opacity: isHovered ? 0 : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className="w-[2px] h-16"
                      style={{ background: panel.color }}
                    />
                    <p
                      className="font-heading font-bold text-white tracking-[0.25em] uppercase"
                      style={{
                        writingMode: "vertical-rl",
                        textOrientation: "mixed",
                        transform: "rotate(180deg)",
                        fontSize: "0.8rem",
                        letterSpacing: "0.3em",
                      }}
                    >
                      {panel.label}
                    </p>
                  </motion.div>

                  {/* Expanded content */}
                  <motion.div
                    className="absolute inset-0 flex flex-col justify-end p-8"
                    animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
                    transition={{ duration: 0.4, delay: isHovered ? 0.15 : 0 }}
                  >
                    <div
                      className="w-8 h-[3px] mb-4 rounded-full"
                      style={{ background: panel.color }}
                    />
                    <p className="font-heading text-3xl font-bold text-white mb-1">{panel.label}</p>
                    <p className="font-body text-sm text-white/60 uppercase tracking-widest">{panel.sublabel}</p>
                  </motion.div>
                </div>

                {/* Top color accent line */}
                <motion.div
                  className="absolute top-0 left-0 right-0 h-[3px]"
                  style={{ background: panel.color }}
                  animate={{ scaleX: isHovered ? 1 : 0.3, opacity: isHovered ? 1 : 0.5 }}
                  transition={{ duration: 0.4 }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Mobile: background image from first panel */}
        <div className="absolute inset-0 lg:hidden -z-0">
          <img
            src={PANELS[0].img}
            alt="GMO Burkina"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian/90 to-obsidian/60" />
        </div>
      </div>

      {/* Ticker */}
      <div className="border-t border-white/8 bg-white/5 backdrop-blur-sm relative z-10">
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