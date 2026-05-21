import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import { base44 } from "@/api/base44Client";

const CATEGORY_MAP = {
  alimentaire: "Alimentaire",
  hygiène: "Hygiène",
  boisson: "Boisson",
  cereale: "Céréale",
  autre: "Autre",
};

const WHATSAPP = "https://wa.me/22676211633";

function ProductCard({ product, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
      className="group relative bg-white border border-obsidian/8 flex flex-col overflow-hidden hover:shadow-xl transition-all duration-500"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 aspect-[4/3]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/10 transition-all duration-500" />
        <span className="absolute top-3 left-3 font-body text-[10px] uppercase tracking-widest text-gmo-red bg-white/90 backdrop-blur-sm border border-gmo-red/20 px-3 py-1">
          {product.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <p className="font-body text-[10px] uppercase tracking-widest text-gmo-green/60 mb-1">{product.brand}</p>
        <h3 className="font-heading text-lg font-bold text-obsidian leading-tight mb-3">{product.name}</h3>
        <p className="font-body text-sm text-obsidian/55 leading-relaxed mb-4">{product.description}</p>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 font-body text-xs uppercase tracking-widest text-gmo-green hover:text-gmo-green/70 transition-colors mb-3 text-left"
        >
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {expanded ? "Masquer les détails" : "Voir les détails"}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.ul
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-4"
            >
              {product.details.map((d) => (
                <li key={d} className="flex items-start gap-2 font-body text-xs text-obsidian/60 mb-1.5">
                  <span className="w-1 h-1 rounded-full bg-gmo-green mt-1.5 flex-shrink-0" />
                  {d}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>

        <div className="flex-1" />

        <a
          href={`${WHATSAPP}?text=Bonjour%20GMO%2C%20je%20souhaite%20un%20devis%20pour%20:%20${encodeURIComponent(product.name)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-2 bg-gmo-green text-white font-heading font-bold text-xs uppercase tracking-widest px-4 py-3 hover:bg-gmo-green/80 transition-colors duration-300"
        >
          <MessageCircle className="w-4 h-4" />
          Demander un devis
        </a>
      </div>

      <div className="absolute bottom-0 left-0 h-[2px] bg-gmo-red w-0 group-hover:w-full transition-all duration-500" />
    </motion.div>
  );
}

export default function ProductsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Product.list().then((data) => {
      setProducts(data.filter(p => p.is_active !== false));
      setLoading(false);
    });
  }, []);

  const categories = ["Tous", ...new Set(products.map(p => CATEGORY_MAP[p.category] || p.category))];
  
  const filtered = activeCategory === "Tous"
    ? products
    : products.filter((p) => (CATEGORY_MAP[p.category] || p.category) === activeCategory);

  return (
    <section id="produits" className="bg-gradient-to-b from-concrete via-concrete/98 to-concrete/95 py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div ref={ref} className="mb-10">
          <motion.span
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            className="font-body text-xs uppercase tracking-[0.3em] text-gmo-red block mb-4"
          >
            Notre catalogue
          </motion.span>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
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
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
              className="font-body text-sm text-obsidian/50 max-w-sm"
            >
              Alimentaire, hygiène, confiserie et agriculture — une gamme complète distribuée à travers le Burkina Faso.
            </motion.p>
          </div>
        </div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap gap-3 mb-12"
        >
          {loading ? (
            <div className="flex items-center gap-2 text-obsidian/40">
              <div className="w-4 h-4 border-2 border-gmo-green/30 border-t-gmo-green rounded-full animate-spin" />
              <span className="font-body text-xs">Chargement...</span>
            </div>
          ) : (
            categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`font-body text-xs uppercase tracking-widest px-5 py-2.5 border transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-gmo-green text-white border-gmo-green"
                    : "border-obsidian/15 text-obsidian/60 hover:border-gmo-green hover:text-gmo-green"
                }`}
              >
                {cat}
                {cat !== "Tous" && (
                  <span className="ml-2 opacity-50">
                    {filtered.filter((p) => (CATEGORY_MAP[p.category] || p.category) === cat).length}
                  </span>
                )}
              </button>
            ))
          )}
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {loading ? (
              Array(8).fill(0).map((_, i) => (
                <div key={i} className="bg-white border border-obsidian/8 rounded-2xl overflow-hidden">
                  <div className="aspect-[4/3] bg-gray-100 animate-pulse" />
                  <div className="p-6 space-y-3">
                    <div className="h-3 bg-gray-100 rounded w-1/3 animate-pulse" />
                    <div className="h-5 bg-gray-100 rounded w-3/4 animate-pulse" />
                    <div className="h-16 bg-gray-100 rounded w-full animate-pulse" />
                  </div>
                </div>
              ))
            ) : filtered.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <p className="font-body text-sm text-obsidian/40">Aucun produit disponible dans cette catégorie.</p>
              </div>
            ) : (
              filtered.map((product, i) => (
                <ProductCard 
                  key={product.id} 
                  product={{
                    name: product.name,
                    category: CATEGORY_MAP[product.category] || product.category,
                    brand: product.category ? `${product.category.toUpperCase()} · GMO` : "GMO",
                    description: product.description || "Produit disponible sur demande.",
                    details: [
                      product.unit ? `Unité: ${product.unit}` : "Disponible",
                      product.unit_price ? `Prix: ${product.unit_price.toLocaleString()} FCFA` : "Sur demande",
                      product.stock_quantity > 0 ? "En stock" : "Sur commande",
                    ].filter(Boolean),
                    image: product.image_url || "https://via.placeholder.com/400x300?text=Produit+GMO",
                  }} 
                  index={i} 
                />
              ))
            )}
          </motion.div>
        </AnimatePresence>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-16 bg-gradient-to-r from-obsidian to-obsidian/95 p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-6 border border-white/5 shadow-xl shadow-obsidian/20"
        >
          <div>
            <p className="font-body text-xs uppercase tracking-widest text-gmo-green/70 mb-2">Besoin d'un devis groupé ?</p>
            <h3 className="font-heading text-2xl lg:text-3xl font-bold text-concrete">
              Contactez notre équipe commerciale
            </h3>
          </div>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 flex items-center gap-3 bg-gmo-green text-white font-heading font-bold text-sm px-8 py-4 hover:bg-gmo-green/80 transition-colors duration-300"
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp +226 76 21 16 33
          </a>
        </motion.div>
      </div>
    </section>
  );
}