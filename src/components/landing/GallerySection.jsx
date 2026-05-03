import React, { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";

export default function GallerySection({ images }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [lightbox, setLightbox] = useState(null); // index of open image

  const prev = () => setLightbox((i) => (i - 1 + images.length) % images.length);
  const next = () => setLightbox((i) => (i + 1) % images.length);

  return (
    <section id="galerie" className="bg-obsidian py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div ref={ref} className="mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-6 h-[2px] bg-gmo-green" />
            <span className="font-body text-xs uppercase tracking-[0.3em] text-gmo-green/70">En images</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="font-heading text-4xl lg:text-5xl font-bold text-concrete"
          >
            GALERIE FLOTTE
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="h-1 w-20 bg-gradient-to-r from-gmo-green to-gmo-red mt-6 origin-left rounded-full"
          />
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.08 * i, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={`relative overflow-hidden group cursor-pointer rounded-xl ${i === 0 ? "col-span-2 row-span-2" : ""}`}
              onClick={() => setLightbox(i)}
            >
              <img
                src={img}
                alt={`GMOB Galerie ${i + 1}`}
                className={`w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${
                  i === 0 ? "aspect-video lg:aspect-[4/3]" : "aspect-square"
                }`}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
              {/* Zoom icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400">
                <div className="bg-white/15 backdrop-blur-sm border border-white/25 rounded-full p-3">
                  <ZoomIn className="w-5 h-5 text-white" />
                </div>
              </div>
              {/* Bottom bar */}
              <div className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-gmo-green to-gmo-red w-0 group-hover:w-full transition-all duration-600 rounded-b-xl" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-obsidian/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            {/* Close */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-5 right-5 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Prev */}
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 lg:left-8 w-12 h-12 bg-white/10 hover:bg-gmo-green/80 rounded-full flex items-center justify-center text-white transition-colors z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Image */}
            <motion.img
              key={lightbox}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              src={images[lightbox]}
              alt={`GMOB ${lightbox + 1}`}
              className="max-w-4xl max-h-[80vh] w-full object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Next */}
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 lg:right-8 w-12 h-12 bg-white/10 hover:bg-gmo-green/80 rounded-full flex items-center justify-center text-white transition-colors z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Counter */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 font-body text-xs text-white/40 tracking-widest">
              {lightbox + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}