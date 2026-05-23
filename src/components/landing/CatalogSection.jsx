import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Package, ShoppingBag, Phone, ChevronRight, Tag } from "lucide-react";

const CATEGORY_LABELS = {
  alimentaire: "Alimentaire",
  hygiene: "Hygiène",
  boisson: "Boissons",
  cereale: "Céréales",
  autre: "Autres",
};

const CATEGORY_COLORS = {
  alimentaire: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-400" },
  hygiene:     { bg: "bg-blue-50",  text: "text-blue-700",  border: "border-blue-200",  dot: "bg-blue-400" },
  boisson:     { bg: "bg-cyan-50",  text: "text-cyan-700",  border: "border-cyan-200",  dot: "bg-cyan-400" },
  cereale:     { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", dot: "bg-green-500" },
  autre:       { bg: "bg-gray-50",  text: "text-gray-600",  border: "border-gray-200",  dot: "bg-gray-400" },
};

function ProductCard({ product, index, isInView }) {
  const cat = product.category || "autre";
  const colors = CATEGORY_COLORS[cat] || CATEGORY_COLORS.autre;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.06 * index, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-gray-200" />
          </div>
        )}
        {/* Category badge */}
        <div className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-heading font-bold uppercase tracking-widest ${colors.bg} ${colors.text} ${colors.border}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
          {CATEGORY_LABELS[cat] || cat}
        </div>
        {/* Stock indicator */}
        {product.stock_quantity !== undefined && (
          <div className={`absolute top-2 right-2 text-[10px] font-body px-2 py-0.5 rounded-full ${
            product.stock_quantity <= 0
              ? "bg-red-100 text-red-600 border border-red-200"
              : product.stock_quantity <= (product.stock_alert || 10)
                ? "bg-amber-100 text-amber-700 border border-amber-200"
                : "bg-green-100 text-green-700 border border-green-200"
          }`}>
            {product.stock_quantity <= 0 ? "Rupture" : `Stock: ${product.stock_quantity}`}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <p className="font-heading text-sm font-black text-obsidian leading-tight mb-1">{product.name}</p>
        {product.description && (
          <p className="text-[11px] text-obsidian/40 font-body leading-relaxed mb-3 flex-1 line-clamp-2">{product.description}</p>
        )}
        <div className="flex items-end justify-between gap-2 mt-auto pt-3 border-t border-gray-50">
          <div>
            {product.unit_price && (
              <p className="font-heading text-base font-black text-gmo-green">{product.unit_price.toLocaleString()} <span className="text-[10px] text-obsidian/40 font-body">FCFA</span></p>
            )}
            <p className="text-[10px] text-obsidian/30 font-body">{product.unit || "unité"}</p>
          </div>
          <a
            href={`https://wa.me/22676211633?text=Bonjour%20GMO%2C%20je%20souhaite%20commander%20:%20${encodeURIComponent(product.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 bg-obsidian text-white text-[11px] font-heading font-bold px-3 py-1.5 rounded-xl hover:bg-gmo-green transition-colors duration-200"
          >
            <ShoppingBag className="w-3 h-3" /> Commander
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function CatalogSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    base44.entities.Product.filter({ is_active: true }, "name", 100)
      .then(data => { setProducts(data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const categories = ["all", ...Object.keys(CATEGORY_LABELS).filter(cat =>
    products.some(p => p.category === cat)
  )];

  const filtered = activeCategory === "all"
    ? products
    : products.filter(p => p.category === activeCategory);

  if (!loading && products.length === 0) return null;

  return (
    <section id="produits" className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <div ref={ref} className="mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-6 h-[2px] bg-gmo-green" />
            <span className="font-body text-xs uppercase tracking-[0.3em] text-gmo-green">Catalogue produits</span>
          </motion.div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="font-heading text-4xl lg:text-5xl font-bold text-obsidian"
              >
                NOS PRODUITS
                <br />
                <span className="text-gmo-green">EN STOCK</span>
              </motion.h2>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="h-1 w-20 bg-gradient-to-r from-gmo-green to-gmo-red mt-5 origin-left rounded-full"
              />
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
              className="font-body text-sm text-obsidian/50 max-w-xs leading-relaxed"
            >
              Découvrez notre gamme de produits disponibles à la distribution. Commandez directement ou contactez notre équipe commerciale.
            </motion.p>
          </div>
        </div>

        {/* Category filters */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {categories.map(cat => {
              const colors = CATEGORY_COLORS[cat];
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-widest transition-all duration-200 border ${
                    isActive
                      ? "bg-obsidian text-white border-obsidian shadow-sm"
                      : colors
                        ? `${colors.bg} ${colors.text} ${colors.border} hover:shadow-sm`
                        : "bg-gray-100 text-obsidian/60 border-gray-200 hover:bg-gray-200"
                  }`}
                >
                  {cat !== "all" && colors && <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-white" : colors.dot}`} />}
                  {cat === "all" ? `Tous (${products.length})` : `${CATEGORY_LABELS[cat]} (${products.filter(p => p.category === cat).length})`}
                </button>
              );
            })}
          </motion.div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} isInView={isInView} />
            ))}
          </div>
        )}

        {/* CTA Banner */}
        {!loading && products.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-obsidian to-[#1A7A2E]/80 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-5"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Tag className="w-4 h-4 text-gmo-green" />
                <p className="font-heading text-base font-bold text-white">Besoin d'un devis groupé ?</p>
              </div>
              <p className="font-body text-xs text-white/50">Tarifs grossiste disponibles pour les commandes en volume. Connectez-vous pour accéder au formulaire de devis.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <a
                href="tel:+22625331900"
                className="flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white font-heading font-bold text-sm px-5 py-3 rounded-xl hover:bg-white/15 transition-colors"
              >
                <Phone className="w-4 h-4" /> Appeler
              </a>
              <a
                href="https://wa.me/22676211633"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-gmo-green text-white font-heading font-bold text-sm px-5 py-3 rounded-xl hover:bg-gmo-green/80 transition-colors"
              >
                <ChevronRight className="w-4 h-4" /> Commander via WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}