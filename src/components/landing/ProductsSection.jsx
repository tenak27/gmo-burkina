import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const PRODUCTS = [
  { name: "Huile alimentaire", category: "Alimentaire" },
  { name: "Blé & Farine", category: "Alimentaire" },
  { name: "Sucre", category: "Alimentaire" },
  { name: "Chewing-gum", category: "Confiserie" },
  { name: "Produits Axe", category: "Hygiène" },
  { name: "Zoodo Gingembre", category: "Boissons" },
  { name: "Savon", category: "Hygiène" },
  { name: "Produits animaux", category: "Agriculture" },
];

function ProductCard({ product, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative border border-obsidian/10 bg-white p-6 hover:border-gold/50 hover:shadow-lg transition-all duration-500"
    >
      <span className="absolute top-3 right-3 font-body text-[10px] uppercase tracking-widest text-obsidian/25">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="w-10 h-10 bg-obsidian flex items-center justify-center mb-5">
        <span className="font-heading text-sm font-bold text-gmo-green">
          {product.name.charAt(0)}
        </span>
      </div>

      <h3 className="font-heading text-lg font-bold text-obsidian mb-2">
        {product.name}
      </h3>

      <span className="font-body text-[10px] uppercase tracking-[0.2em] text-gmo-red/80 border border-gmo-red/20 px-3 py-1 inline-block">
        {product.category}
      </span>

      <div className="absolute bottom-0 left-0 h-[2px] bg-gmo-green w-0 group-hover:w-full transition-all duration-500" />
    </motion.div>
  );
}

export default function ProductsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="produits" className="bg-concrete py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div ref={ref} className="mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            className="font-body text-xs uppercase tracking-[0.3em] text-gmo-red block mb-4"
          >
            Notre catalogue
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="font-heading text-4xl lg:text-5xl font-bold text-obsidian"
          >
            NOS PRODUITS
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: 80 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="h-[2px] bg-gmo-green mt-6"
          />
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRODUCTS.map((product, i) => (
            <ProductCard key={product.name} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}