import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    img: "https://gmobfaso.com/assets/img/slides/slide-1.jpg",
    title: "GMO BURKINA",
    subtitle: "Leader de la distribution",
  },
  {
    img: "https://gmobfaso.com/assets/img/slides/slide-2.jpg",
    title: "LOGISTIQUE",
    subtitle: "Transport & Distribution nationale",
  },
  {
    img: "https://gmobfaso.com/assets/img/slides/slide-3.jpg",
    title: "QUALITÉ",
    subtitle: "Produits locaux garantis",
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
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const go = (idx) => {
    setCurrent((idx + SLIDES.length) % SLIDES.length);
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCurrent((c) => (c + 1) % SLIDES.length), 5000);
  };

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const prev = () => { go(current - 1); resetTimer(); };
  const next = () => { go(current + 1); resetTimer(); };

  return (
    <section id="accueil" className="relative min-h-screen bg-obsidian overflow-hidden">
      {/* Slides background */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src={SLIDES[current].img}
            alt={SLIDES[current].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian/90 via-obsidian/60 to-obsidian/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 min-h-screen flex flex-col justify-center">
        <div className="pt-24 pb-28 max-w-2xl">
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

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-bold text-white leading-[0.92] mb-6 tracking-tight">
                {SLIDES[current].title.split(" ").map((word, i) => (
                  <span key={i} className={i === 1 ? "text-gmo-green block" : "block"}>
                    {word}
                  </span>
                ))}
              </h1>
              <p className="font-body text-base sm:text-lg text-white/55 leading-relaxed mb-8 max-w-md">
                {SLIDES[current].subtitle} — Leader de la distribution au Burkina Faso.
              </p>
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap gap-3"
          >
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }); }}
              className="group bg-gmo-green text-white font-heading font-bold text-sm px-7 py-3.5 hover:bg-gmo-green/90 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-gmo-green/30 rounded-lg hover:-translate-y-0.5"
            >
              Demander un devis
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#services"
              onClick={(e) => { e.preventDefault(); document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" }); }}
              className="border border-white/20 text-white font-heading font-medium text-sm px-7 py-3.5 hover:border-gmo-green/60 hover:text-gmo-green hover:bg-gmo-green/5 transition-all duration-300 rounded-lg"
            >
              Nos services
            </a>
          </motion.div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-gmo-green/80 border border-white/20 hover:border-gmo-green rounded-full flex items-center justify-center text-white transition-all duration-300 backdrop-blur-sm"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-gmo-green/80 border border-white/20 hover:border-gmo-green rounded-full flex items-center justify-center text-white transition-all duration-300 backdrop-blur-sm"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => { go(i); resetTimer(); }}
            className={`transition-all duration-400 rounded-full ${i === current ? "w-8 h-2.5 bg-gmo-green" : "w-2.5 h-2.5 bg-white/30 hover:bg-white/60"}`}
          />
        ))}
      </div>

      {/* Ticker */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/8 bg-white/5 backdrop-blur-sm z-20">
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