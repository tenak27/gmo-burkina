import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

const PANELS = [
  {
    img: "https://gmobfaso.com/assets/img/slides/slide-1.jpg",
    label: "DISTRIBUTION",
    sublabel: "Nationale & Internationale",
    tagline: "Livrons partout au Burkina Faso",
    color: "#1A7A2E",
  },
  {
    img: "https://gmobfaso.com/assets/img/slides/slide-2.jpg",
    label: "TRANSPORT",
    sublabel: "Logistique de pointe",
    tagline: "Flotte moderne, délais garantis",
    color: "#CC1717",
  },
  {
    img: "https://gmobfaso.com/assets/img/slides/slide-3.jpg",
    label: "QUALITÉ",
    sublabel: "Produits locaux certifiés",
    tagline: "Excellence & responsabilité",
    color: "#F5C400",
  },
  {
    img: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/1e2be0905_generated_51987d61.png",
    label: "EXPANSION",
    sublabel: "Afrique de l'Ouest",
    tagline: "Côte d'Ivoire · Mali · Niger",
    color: "#1A7A2E",
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
    <section id="accueil" className="relative bg-obsidian overflow-hidden flex flex-col" style={{ minHeight: "100svh" }}>
      <div className="flex flex-1" style={{ minHeight: "calc(100svh - 44px)" }}>

        {/* ── Left text panel ── */}
        <div
          className="relative z-10 flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-28 flex-shrink-0 pointer-events-none select-none"
          style={{ width: "clamp(280px, 30vw, 420px)" }}
        >
          <div className="absolute inset-0 lg:hidden bg-obsidian/75 backdrop-blur-sm" />

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 mb-7"
            >
              <div className="w-6 h-[2px] bg-gmo-green" />
              <span className="font-body text-[10px] uppercase tracking-[0.3em] text-gmo-green">
                Groupe Madina Oumarou · Burkina Faso
              </span>
            </motion.div>

            {/* Dynamic title */}
            <div className="mb-7 overflow-hidden" style={{ minHeight: "15rem" }}>
              <AnimatePresence mode="wait">
                {hovered !== null ? (
                  <motion.div
                    key={`panel-${hovered}`}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p
                      className="font-heading text-6xl sm:text-7xl lg:text-8xl font-bold leading-[0.88] tracking-tight mb-3"
                      style={{ color: PANELS[hovered].color }}
                    >
                      {PANELS[hovered].label}
                    </p>
                    <p className="font-heading text-xl text-white/80 font-semibold mb-2">
                      {PANELS[hovered].sublabel}
                    </p>
                    <p className="font-body text-sm text-white/40 tracking-wide">
                      {PANELS[hovered].tagline}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="default"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p className="font-heading text-6xl sm:text-7xl lg:text-8xl font-bold text-white leading-[0.88] tracking-tight mb-1">NOUS</p>
                    <p className="font-heading text-6xl sm:text-7xl lg:text-8xl font-bold leading-[0.88] tracking-tight mb-1 text-gmo-green">DÉPLAÇONS</p>
                    <p className="font-heading text-6xl sm:text-7xl lg:text-8xl font-bold text-white leading-[0.88] tracking-tight">
                      LE MONDE
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="font-body text-sm text-white/40 leading-relaxed max-w-xs mb-9"
            >
              Leader de la distribution au Burkina Faso. Transport et distribution à travers l'Afrique de l'Ouest avec précision.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="flex flex-col sm:flex-row gap-3 pointer-events-auto"
            >
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }); }}
                className="group bg-gmo-green text-white font-heading font-bold text-sm px-7 py-3.5 rounded-lg hover:bg-gmo-green/90 transition-all duration-300 flex items-center justify-center gap-2 shadow-xl shadow-gmo-green/30 hover:-translate-y-0.5"
              >
                Demander un devis
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#services"
                onClick={(e) => { e.preventDefault(); document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" }); }}
                className="border border-white/15 text-white/70 font-heading font-medium text-sm px-7 py-3.5 rounded-lg hover:border-white/40 hover:text-white hover:bg-white/5 transition-all duration-300 text-center"
              >
                Nos services
              </a>
            </motion.div>
          </div>
        </div>

        {/* ── Vertical panels — desktop ── */}
        <div className="hidden lg:flex flex-1 min-w-0">
          {PANELS.map((panel, i) => {
            const isHovered = hovered === i;
            return (
              <motion.div
                key={panel.label}
                className="relative overflow-hidden cursor-pointer"
                animate={{ flex: isHovered ? 5 : 1 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Image zoom */}
                <motion.img
                  src={panel.img}
                  alt={panel.label}
                  className="absolute inset-0 w-full h-full object-cover"
                  animate={{ scale: isHovered ? 1.12 : 1.04 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                />

                {/* Gradient overlay */}
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    background: isHovered
                      ? `linear-gradient(to top, ${panel.color}EE 0%, ${panel.color}66 40%, rgba(0,0,0,0.1) 100%)`
                      : `linear-gradient(to top, rgba(28,28,30,0.85) 0%, rgba(28,28,30,0.5) 50%, rgba(28,28,30,0.2) 100%)`,
                  }}
                  transition={{ duration: 0.55 }}
                />

                {/* Top accent bar */}
                <motion.div
                  className="absolute top-0 left-0 right-0 h-[3px]"
                  style={{ background: panel.color }}
                  animate={{ opacity: isHovered ? 1 : 0.3, scaleX: isHovered ? 1 : 0.4 }}
                  transition={{ duration: 0.4 }}
                />

                {/* Collapsed: vertical text */}
                <motion.div
                  className="absolute inset-0 flex flex-col items-center justify-end pb-14 gap-4"
                  animate={{ opacity: isHovered ? 0 : 1 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="w-[2px] h-14 rounded-full" style={{ background: panel.color, opacity: 0.8 }} />
                  <p
                    className="font-heading font-black text-white text-[0.7rem] tracking-[0.35em] uppercase"
                    style={{
                      writingMode: "vertical-rl",
                      transform: "rotate(180deg)",
                    }}
                  >
                    {panel.label}
                  </p>
                </motion.div>

                {/* Expanded: full content */}
                <motion.div
                  className="absolute inset-0 flex flex-col justify-end p-10"
                  animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 28 }}
                  transition={{ duration: 0.45, delay: isHovered ? 0.15 : 0, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.div
                    className="h-[3px] w-12 rounded-full mb-5"
                    style={{ background: "#fff" }}
                    animate={{ width: isHovered ? 48 : 0 }}
                    transition={{ duration: 0.4, delay: 0.25 }}
                  />
                  <p className="font-heading text-5xl font-black text-white mb-2 leading-none tracking-tight drop-shadow-xl">
                    {panel.label}
                  </p>
                  <p className="font-body text-sm text-white/70 uppercase tracking-[0.2em] mb-1">
                    {panel.sublabel}
                  </p>
                  <p className="font-body text-xs text-white/40 tracking-wide">
                    {panel.tagline}
                  </p>
                </motion.div>

                {/* Panel number */}
                <div className="absolute top-5 right-5 font-heading text-xs text-white/20 tracking-widest">
                  {String(i + 1).padStart(2, "0")}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile background */}
        <div className="absolute inset-0 lg:hidden -z-0">
          <img src={PANELS[0].img} alt="GMO Burkina" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian/95 to-obsidian/60" />
        </div>
      </div>

      {/* Ticker */}
      <div className="border-t border-white/8 bg-white/5 backdrop-blur-sm relative z-10 flex-shrink-0">
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