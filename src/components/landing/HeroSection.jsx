import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";

const PANELS = [
  {
    img: "https://gmobfaso.com/assets/img/slides/slide-1.jpg",
    label: "DISTRIBUTION",
    sub: "Nationale & Internationale",
    tagline: "Livraisons partout au Burkina Faso",
    color: "#1A7A2E",
  },
  {
    img: "https://gmobfaso.com/assets/img/slides/slide-2.jpg",
    label: "TRANSPORT",
    sub: "Logistique de pointe",
    tagline: "Flotte moderne, délais garantis",
    color: "#CC1717",
  },
  {
    img: "https://gmobfaso.com/assets/img/slides/slide-3.jpg",
    label: "QUALITÉ",
    sub: "Produits locaux certifiés",
    tagline: "Excellence & responsabilité",
    color: "#F5C400",
  },
  {
    img: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/1e2be0905_generated_51987d61.png",
    label: "EXPANSION",
    sub: "Afrique de l'Ouest",
    tagline: "Côte d'Ivoire · Mali · Niger",
    color: "#1A7A2E",
  },
];

const TICKER = ["OUAGADOUGOU → BOBO DIOULASSO", "LOGISTIQUE 24/7", "DIEBOUGOU → OUAHIGOUYA", "DISTRIBUTION NATIONALE", "BURKINA FASO", "CÔTE D'IVOIRE · MALI · NIGER"];

export default function HeroSection() {
  const [hovered, setHovered] = useState(null);
  const [autoIdx, setAutoIdx] = useState(0);

  // Auto-cycle when no hover
  useEffect(() => {
    if (hovered !== null) return;
    const t = setInterval(() => setAutoIdx(i => (i + 1) % PANELS.length), 3500);
    return () => clearInterval(t);
  }, [hovered]);

  const activeIdx = hovered !== null ? hovered : autoIdx;
  const active = PANELS[activeIdx];

  return (
    <section id="accueil" className="relative bg-obsidian overflow-hidden" style={{ height: "100svh", minHeight: 600 }}>

      {/* ── FULL-BLEED background that transitions ── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={activeIdx}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
        >
          <img src={active.img} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{
            background: `linear-gradient(105deg, rgba(28,28,30,0.97) 0%, rgba(28,28,30,0.82) 38%, rgba(28,28,30,0.3) 70%, rgba(28,28,30,0.15) 100%)`
          }} />
        </motion.div>
      </AnimatePresence>

      {/* ── CONTENT LAYER ── */}
      <div className="relative z-10 h-full flex flex-col lg:flex-row">

        {/* LEFT — text content */}
        <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-16 xl:px-20 pt-24 pb-16 lg:py-0 w-full lg:w-[420px] xl:w-[480px] flex-shrink-0">

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-5 h-[2px] bg-gmo-green" />
            <span className="font-body text-[10px] uppercase tracking-[0.3em] text-gmo-green whitespace-nowrap">
              Groupe Madina Oumarou · BF
            </span>
          </motion.div>

          {/* Title block */}
          <div className="mb-7" style={{ minHeight: "10rem" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <h1
                  className="font-heading font-black leading-[0.88] tracking-tight mb-4"
                  style={{
                    fontSize: "clamp(2.8rem, 5vw, 5.5rem)",
                    color: active.color,
                  }}
                >
                  {active.label}
                </h1>
                <p className="font-heading text-white font-semibold text-xl mb-2 leading-snug">
                  {active.sub}
                </p>
                <p className="font-body text-white/40 text-sm tracking-wide">
                  {active.tagline}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dot indicators */}
          <div className="flex items-center gap-2 mb-8">
            {PANELS.map((p, i) => (
              <button
                key={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setAutoIdx(i)}
                className="transition-all duration-500 rounded-full flex-shrink-0"
                style={{
                  width: i === activeIdx ? 28 : 8,
                  height: 8,
                  background: i === activeIdx ? p.color : "rgba(255,255,255,0.2)",
                }}
              />
            ))}
          </div>

          <p className="font-body text-sm text-white/40 leading-relaxed max-w-[300px] mb-8">
            Leader de la distribution au Burkina Faso. Transport, logistique et distribution à travers l'Afrique de l'Ouest.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }); }}
              className="group bg-gmo-green text-white font-heading font-bold text-sm px-7 py-3.5 rounded-lg hover:bg-gmo-green/90 transition-all duration-300 flex items-center gap-2 shadow-xl shadow-gmo-green/25 hover:-translate-y-0.5 active:translate-y-0"
            >
              Demander un devis
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#services"
              onClick={(e) => { e.preventDefault(); document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" }); }}
              className="border border-white/15 text-white/60 font-heading font-medium text-sm px-7 py-3.5 rounded-lg hover:border-white/40 hover:text-white hover:bg-white/5 transition-all duration-300"
            >
              Nos services
            </a>
          </div>

          {/* Scroll hint */}
          <motion.div
            className="hidden lg:flex items-center gap-2 mt-12 text-white/20"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-4 h-4" />
            <span className="font-body text-[10px] uppercase tracking-widest">Défiler</span>
          </motion.div>
        </div>

        {/* RIGHT — vertical accordion panels */}
        <div className="hidden lg:flex flex-1 min-w-0 gap-1 p-4 pl-0">
          {PANELS.map((panel, i) => {
            const isActive = i === activeIdx;
            return (
              <motion.div
                key={panel.label}
                className="relative overflow-hidden rounded-2xl cursor-pointer"
                animate={{ flex: isActive ? 5 : 1 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Image */}
                <motion.img
                  src={panel.img}
                  alt={panel.label}
                  className="absolute inset-0 w-full h-full object-cover"
                  animate={{ scale: isActive ? 1.1 : 1.0 }}
                  transition={{ duration: 1.0, ease: "easeOut" }}
                />

                {/* Color gradient overlay */}
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    background: isActive
                      ? `linear-gradient(to top, ${panel.color}DD 0%, ${panel.color}55 45%, rgba(0,0,0,0.05) 100%)`
                      : "linear-gradient(to top, rgba(10,10,12,0.88) 0%, rgba(10,10,12,0.55) 55%, rgba(10,10,12,0.1) 100%)",
                  }}
                  transition={{ duration: 0.6 }}
                />

                {/* Top bar */}
                <motion.div
                  className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl"
                  style={{ background: panel.color }}
                  animate={{ opacity: isActive ? 1 : 0.25 }}
                  transition={{ duration: 0.4 }}
                />

                {/* Panel number */}
                <div className="absolute top-4 right-4 font-heading text-[10px] text-white/20 tracking-widest">
                  {String(i + 1).padStart(2, "0")}
                </div>

                {/* Collapsed label (vertical) */}
                <AnimatePresence>
                  {!isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 flex flex-col items-center justify-end pb-10 gap-3"
                    >
                      <div
                        className="w-[2px] h-12 rounded-full"
                        style={{ background: panel.color, opacity: 0.7 }}
                      />
                      <p
                        className="font-heading font-black text-white/80 text-[0.65rem] tracking-[0.4em] uppercase"
                        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                      >
                        {panel.label}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Expanded content */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 flex flex-col justify-end p-8"
                    >
                      <motion.div
                        className="h-[2px] rounded-full mb-5"
                        style={{ background: "rgba(255,255,255,0.6)" }}
                        initial={{ width: 0 }}
                        animate={{ width: 40 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      />
                      <p
                        className="font-heading font-black text-white leading-none tracking-tight mb-2 drop-shadow-xl"
                        style={{ fontSize: "clamp(2rem, 3.5vw, 3.5rem)" }}
                      >
                        {panel.label}
                      </p>
                      <p className="font-body text-white/65 text-sm uppercase tracking-[0.2em] mb-1">
                        {panel.sub}
                      </p>
                      <p className="font-body text-white/35 text-xs tracking-wide">
                        {panel.tagline}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Ticker */}
      <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/8 bg-white/5 backdrop-blur-sm">
        <div className="overflow-hidden py-3">
          <div className="animate-ticker flex whitespace-nowrap">
            {[...TICKER, ...TICKER].map((item, i) => (
              <span key={i} className="font-body text-[10px] uppercase tracking-[0.25em] text-white/25 mx-8">
                {item}<span className="ml-8 text-gmo-red/40">●</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}