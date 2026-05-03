import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function GallerySection({ images }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="galerie" className="bg-obsidian py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div ref={ref} className="mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            className="font-body text-xs uppercase tracking-[0.3em] text-gmo-green/70 block mb-4"
          >
            En images
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="font-heading text-4xl lg:text-5xl font-bold text-concrete"
          >
            GALERIE
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: 80 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="h-[2px] bg-gmo-red mt-6"
          />
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.1 * i, duration: 0.6 }}
              className={`relative overflow-hidden group ${
                i === 0 ? "col-span-2 row-span-2" : ""
              }`}
            >
              <img
                src={img}
                alt={`GMOB Galerie ${i + 1}`}
                className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                  i === 0 ? "aspect-square lg:aspect-[4/3]" : "aspect-square"
                }`}
              />
              <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/30 transition-all duration-500" />
              <div className="absolute bottom-0 left-0 h-[2px] bg-gmo-red w-0 group-hover:w-full transition-all duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}