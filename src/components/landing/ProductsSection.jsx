import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { MessageCircle, ChevronDown, ChevronUp } from "lucide-react";


const WHATSAPP = "https://wa.me/22676211633";

// Mappe category DB → catégories affichées
const CATEGORY_MAP = {
  "hamilton": "Cigarettes",
  "excellence": "Cigarettes",
  "dunhill": "Cigarettes",
  "farine gmf": "Alimentaire",
  "farine": "Alimentaire",
  "huile sn citec": "Alimentaire",
  "huile savor soja": "Alimentaire",
  "huile savor graine": "Alimentaire",
  "huile savor": "Alimentaire",
  "sucre": "Alimentaire",
  "sosuco": "Alimentaire",
  "savon citec": "Hygiène",
  "savon n°": "Hygiène",
  "cobifa axe": "Alimentaire",
  "cobifa chewngun": "Alimentaire",
  "cobifa": "Alimentaire",
  "tourteaux": "Embauche",
  "betail": "Embauche",
  "son de blé": "Embauche",
  "aliment bétail": "Embauche",
  "aliment de betail": "Embauche",
};

const getCategoryForProduct = (name) => {
  const normalized = name.toLowerCase();
  for (const [key, cat] of Object.entries(CATEGORY_MAP)) {
    if (normalized.includes(key)) return cat;
  }
  return "Alimentaire";
};

const CATEGORIES_ORDER = ["Cigarettes", "Alimentaire", "Embauche"];

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
  const [dbProducts, setDbProducts] = useState([]);

  // Produits statiques pour la vitrine - EN STOCK
  const PRODUCTS_IN_STOCK = [
    // Cigarettes
    { name: "Hamilton Light", category: "Cigarettes", brand: "Hamilton", description: "Cigarettes premium", image: "https://gmobfaso.com/assets/img/products/hamilton-light.jpg" },
    { name: "Hamilton Classic", category: "Cigarettes", brand: "Hamilton", description: "Cigarettes classiques", image: "https://gmobfaso.com/assets/img/products/hamilton-classic.jpg" },
    { name: "Excellence", category: "Cigarettes", brand: "Excellence", description: "Cigarettes qualité supérieure", image: "https://gmobfaso.com/assets/img/products/excellence.jpg" },
    { name: "Dunhill Light", category: "Cigarettes", brand: "Dunhill", description: "Cigarettes légères", image: "https://gmobfaso.com/assets/img/products/dunhill-light.jpg" },
    { name: "Dunhill Classic", category: "Cigarettes", brand: "Dunhill", description: "Cigarettes traditionnelles", image: "https://gmobfaso.com/assets/img/products/dunhill-classic.jpg" },
    // Alimentaire - Huiles
    { name: "Huile Savor Soja 5l", category: "Alimentaire", brand: "Savor", description: "Huile de soja raffinée", image: "https://gmobfaso.com/assets/img/products/huile-savor-soja-5l.jpg" },
    { name: "Huile Savor Soja 20l", category: "Alimentaire", brand: "Savor", description: "Huile de soja en bidon", image: "https://gmobfaso.com/assets/img/products/huile-savor-soja-20l.jpg" },
    { name: "Huile Savor Graine de coton 5l", category: "Alimentaire", brand: "Savor", description: "Huile de coton raffinée", image: "https://gmobfaso.com/assets/img/products/huile-savor-coton-5l.jpg" },
    { name: "Huile Savor Graine de coton 20l", category: "Alimentaire", brand: "Savor", description: "Huile de coton grand format", image: "https://gmobfaso.com/assets/img/products/huile-savor-coton-20l.jpg" },
    // Alimentaire - Farine
    { name: "Farine de Blé GMF Etalon 50kg", category: "Alimentaire", brand: "GMF", description: "Farine de blé premium", image: "https://gmobfaso.com/assets/img/products/farine-gmf-50kg.jpg" },
    // Alimentaire - Sucres
    { name: "Sosuco sucre morceau blond 25 paquets", category: "Alimentaire", brand: "Sosuco", description: "Sucre en morceaux", image: "https://gmobfaso.com/assets/img/products/sosuco-morceau-blond.jpg" },
    { name: "Sosuco sucre granulé blond 50kg", category: "Alimentaire", brand: "Sosuco", description: "Sucre granulé professionnel", image: "https://gmobfaso.com/assets/img/products/sosuco-granule-blond.jpg" },
    { name: "Sosuco sucre morceau Blanc 25 paquets", category: "Alimentaire", brand: "Sosuco", description: "Sucre blanc raffiné", image: "https://gmobfaso.com/assets/img/products/sosuco-morceau-blanc.jpg" },
    { name: "Sosuco sucre granulé blanc 50kg", category: "Alimentaire", brand: "Sosuco", description: "Sucre blanc en sac", image: "https://gmobfaso.com/assets/img/products/sosuco-granule-blanc.jpg" },
    // Alimentaire - Cobifa
    { name: "Cobifa AXE zoodo", category: "Alimentaire", brand: "Cobifa", description: "Assaisonnement cube", image: "https://gmobfaso.com/assets/img/products/cobifa-axe.jpg" },
    { name: "Cobifa chewngun etalon", category: "Alimentaire", brand: "Cobifa", description: "Bonbons chewing-gum", image: "https://gmobfaso.com/assets/img/products/cobifa-chewngun.jpg" },
    // Embauche
    { name: "Son de blé sac de 25kg", category: "Embauche", brand: "GMF", description: "Aliment pour bétail", image: "https://gmobfaso.com/assets/img/products/son-ble-25kg.jpg" },
    { name: "Aliment bétail coton sac 50kg", category: "Embauche", brand: "GMF", description: "Tourteau de coton", image: "https://gmobfaso.com/assets/img/products/aliment-betail-coton.jpg" },
    { name: "Tourtaux de coton sac de 50kg", category: "Embauche", brand: "GMF", description: "Tourteau pour élevage", image: "https://gmobfaso.com/assets/img/products/tourteaux-coton.jpg" },
    { name: "Aliment de Betail soja sac 50kg", category: "Embauche", brand: "GMF", description: "Aliment riche en protéines", image: "https://gmobfaso.com/assets/img/products/aliment-betail-soja.jpg" },
    { name: "Tourtaux de soja sac 50kg", category: "Embauche", brand: "GMF", description: "Tourteau de soja premium", image: "https://gmobfaso.com/assets/img/products/tourteaux-soja.jpg" },
  ];

  const PRODUCTS = PRODUCTS_IN_STOCK;

  const categories = ["Tous", ...CATEGORIES_ORDER.filter(cat => PRODUCTS.some(p => p.category === cat))];

  const filtered = activeCategory === "Tous"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <section id="produits" className="bg-concrete py-24 lg:py-32">
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
              Alimentaire, hygiène, confiserie et élevage — une gamme complète distribuée à travers le Burkina Faso.
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
          {categories.map((cat) => (
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
                  {PRODUCTS.filter((p) => p.category === cat).length}
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {filtered.map((product, i) => (
              <ProductCard key={product.name} product={product} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-16 bg-obsidian p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-6"
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