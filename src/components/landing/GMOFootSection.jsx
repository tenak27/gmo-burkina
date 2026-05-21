import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Trophy, Users, Calendar, X, ChevronLeft, ChevronRight, ZoomIn, Play, Pause } from "lucide-react";

const GALLERY = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  src: `https://gmobfaso.com/assets/img/gmo-foot/thumbs/gmo-foot-${i + 1}.jpg`,
  alt: `GMO Foot Tournoi ${i + 1}`,
}));

// Duplicate for infinite loop
const LOOP = [...GALLERY, ...GALLERY, ...GALLERY];

function PhotoCard({ img, index, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      className="relative flex-shrink-0 w-60 h-44 lg:w-72 lg:h-52 rounded-2xl overflow-hidden cursor-pointer shadow-lg"
      style={{ transformOrigin: "center bottom" }}
      whileHover={{ scale: 1.06, zIndex: 10, y: -6, boxShadow: "0 24px 60px rgba(0,0,0,0.45)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onClick(img)}
    >
      <img
        src={img.src}
        alt={img.alt}
        className="w-full h-full object-cover transition-transform duration-700"
        style={{ transform: hovered ? "scale(1.12)" : "scale(1)" }}
        onError={(e) => { e.target.parentElement.style.display = "none"; }}
      />
      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-obsidian/70 via-transparent to-transparent transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`} />
      {/* Bottom accent bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-gmo-green to-gmo-red rounded-b-2xl"
        initial={{ width: 0 }}
        animate={{ width: hovered ? "100%" : "0%" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
      {/* Zoom icon */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="bg-white/15 backdrop-blur-md border border-white/30 rounded-full p-3">
              <ZoomIn className="w-5 h-5 text-white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function InfiniteStrip({ direction = 1, speed = 40, onClick }) {
  const [paused, setPaused] = useState(false);
  const x = useMotionValue(0);
  const animRef = useRef(null);
  const lastTimeRef = useRef(null);
  const posRef = useRef(0);
  const cardW = 300; // approx card width + gap
  const totalWidth = GALLERY.length * cardW;

  useEffect(() => {
    const animate = (time) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      if (!paused) {
        posRef.current -= (direction * speed * delta) / 1000;
        if (posRef.current <= -totalWidth) posRef.current += totalWidth;
        if (posRef.current >= 0) posRef.current -= totalWidth;
        x.set(posRef.current);
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [paused, direction, speed]);

  return (
    <div
      className="overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <motion.div
        className="flex gap-4 py-3"
        style={{ x, width: `${LOOP.length * cardW}px` }}
      >
        {LOOP.map((img, i) => (
          <PhotoCard key={`${img.id}-${i}`} img={img} index={i} onClick={onClick} />
        ))}
      </motion.div>
    </div>
  );
}

function Lightbox({ images, startIndex, onClose }) {
  const [current, setCurrent] = useState(startIndex);

  const prev = useCallback(() => setCurrent(i => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCurrent(i => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 bg-obsidian/96 backdrop-blur-xl flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-11 h-11 bg-white/10 hover:bg-white/20 border border-white/15 rounded-full flex items-center justify-center text-white transition-all z-20"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Prev */}
      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        className="absolute left-4 lg:left-8 w-14 h-14 bg-white/8 hover:bg-gmo-green/80 border border-white/15 hover:border-gmo-green rounded-full flex items-center justify-center text-white transition-all z-20"
      >
        <ChevronLeft className="w-7 h-7" />
      </button>

      {/* Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 0.88, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: -10 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-4xl w-full px-16 lg:px-24"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <img
              src={images[current].src}
              alt={images[current].alt}
              className="w-full max-h-[75vh] object-contain"
            />
            <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-obsidian/80 to-transparent flex items-end px-5 pb-4">
              <span className="font-body text-xs text-white/50 tracking-widest">
                GMO Foot — Photo {current + 1} / {images.length}
              </span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Next */}
      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        className="absolute right-4 lg:right-8 w-14 h-14 bg-white/8 hover:bg-gmo-green/80 border border-white/15 hover:border-gmo-green rounded-full flex items-center justify-center text-white transition-all z-20"
      >
        <ChevronRight className="w-7 h-7" />
      </button>

      {/* Thumbnails strip */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
            className={`transition-all duration-300 rounded-full ${i === current ? "w-6 h-2 bg-gmo-green" : "w-2 h-2 bg-white/30 hover:bg-white/60"}`}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function GMOFootSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [lightboxImg, setLightboxImg] = useState(null);

  const openLightbox = (img) => {
    const idx = GALLERY.findIndex(g => g.id === img.id);
    setLightboxImg(idx >= 0 ? idx : 0);
  };

  return (
    <section id="gmofoot" className="bg-light-gray py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header + Stats */}
        <div ref={ref} className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              className="flex items-center gap-3 mb-4"
            >
              <div className="w-6 h-[2px] bg-gmo-green" />
              <span className="font-body text-xs uppercase tracking-[0.3em] text-gmo-green">Engagement social</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading text-4xl lg:text-5xl font-bold text-obsidian"
            >
              GMO
              <br />
              <span className="text-gmo-red">FOOT</span>
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="h-1 w-20 bg-gradient-to-r from-gmo-green to-gmo-red mt-6 mb-7 origin-left rounded-full"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="font-body text-base text-obsidian/55 leading-[1.8]"
            >
              Le Tournoi Inter-Secteurs GMO Foot est bien plus qu'une compétition sportive. 
              C'est l'expression concrète de notre engagement envers la jeunesse du Burkina Faso. 
              En soutenant le sport populaire, GMO investit dans la cohésion sociale et le dynamisme des communautés.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="grid grid-cols-3 gap-4"
          >
            {[
              { icon: Trophy, value: "1ère", label: "Édition 2023", sub: "30 Avr — 04 Juin" },
              { icon: Users, value: "16+", label: "Équipes", sub: "Inter-secteurs" },
              { icon: Calendar, value: "5", label: "Semaines", sub: "de compétition" },
            ].map((s) => (
              <motion.div
                key={s.label}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-sm hover:shadow-md hover:border-gmo-green/20 transition-all duration-300"
              >
                <div className="w-10 h-10 bg-gmo-green/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <s.icon className="w-5 h-5 text-gmo-green" />
                </div>
                <p className="font-heading text-2xl font-bold text-obsidian">{s.value}</p>
                <p className="font-body text-[10px] uppercase tracking-widest text-obsidian/50 mt-1">{s.label}</p>
                <p className="font-body text-[9px] text-obsidian/30 mt-0.5">{s.sub}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Infinite scroll strips — full-width */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-5"
      >
        {/* Strip 1 — left to right */}
        <InfiniteStrip direction={1} speed={38} onClick={openLightbox} />
        {/* Strip 2 — right to left, slightly different speed */}
        <InfiniteStrip direction={-1} speed={28} onClick={openLightbox} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1.1 }}
        className="text-center mt-10 px-6"
      >
        <p className="font-body text-sm text-obsidian/35 tracking-wide">
          Survolez les photos pour les agrandir · Cliquez pour ouvrir la galerie complète
        </p>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImg !== null && (
          <Lightbox images={GALLERY} startIndex={lightboxImg} onClose={() => setLightboxImg(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}