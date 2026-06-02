import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { IMAGES } from "@/lib/images";


const WHATSAPP = "https://wa.me/22670213831";

// Mappe category DB → catégories affichées
const CATEGORY_MAP = {
  "hamilton": "Cigarettes",
  "excellence": "Cigarettes",
  "dunhill": "Cigarettes",
  "farine de blé gmf etalon": "Embauche",
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
  "tourtaux": "Embauche",
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

const CATEGORIES_ORDER = ["Cigarettes", "Alimentaire", "Hygiène", "Embauche"];

const CIG_TARIFS = [
  { label: "Carton", sub: "25 cartouches", price: "275 000", icon: "📦" },
  { label: "Cartouche", sub: "10 paquets", price: "11 000", icon: "🗂️" },
  { label: "Paquet", sub: "10 tiges", price: "1 100", icon: "🚬" },
];

function ProductCard({ product, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [flipped, setFlipped] = useState(false);
  const isCig = product.category === "Cigarettes";
  const cardH = isCig ? 300 : 260;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: (index % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="cursor-pointer select-none"
      style={{ perspective: "1000px", height: cardH }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onTouchEnd={e => { e.preventDefault(); setFlipped(f => !f); }}
    >
      <div style={{
        position: "relative", width: "100%", height: "100%",
        transformStyle: "preserve-3d",
        transition: "transform 0.55s cubic-bezier(0.4, 0.2, 0.2, 1)",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
      }}>

        {/* ── FACE AVANT ── */}
        <div
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
          className="absolute inset-0 bg-white rounded-2xl shadow-md border border-gray-100 flex flex-col p-3 sm:p-5 overflow-hidden"
        >
          <div className="flex-1 flex items-center justify-center">
            <img src={product.image} alt={product.name}
              className="w-16 h-16 sm:w-24 sm:h-24 object-contain drop-shadow-md" />
          </div>
          <span className="self-start font-body text-[9px] sm:text-[10px] text-obsidian/50 bg-gray-100 px-2 py-0.5 rounded-full mb-1.5">
            {product.category}
          </span>
          <h3 className="font-heading text-[13px] sm:text-base font-bold text-obsidian leading-tight line-clamp-2">{product.name}</h3>
          <p className="font-body text-[9px] text-obsidian/25 mt-1.5 uppercase tracking-widest">Voir prix →</p>
        </div>

        {/* ── FACE ARRIÈRE ── */}
        <div
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          className="absolute inset-0 bg-gmo-green rounded-2xl shadow-lg flex flex-col items-center justify-between p-3 sm:p-4 text-center overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          <p className="font-heading text-[9px] font-bold text-white/50 uppercase tracking-[0.2em]">Tarifs</p>

          {isCig ? (
            <div className="w-full flex flex-col gap-1.5 my-1">
              {CIG_TARIFS.map(row => (
                <div key={row.label} className="bg-white/15 border border-white/20 rounded-xl px-2.5 py-2 flex items-center justify-between gap-1 min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0 flex-shrink">
                    <span className="text-sm leading-none flex-shrink-0">{row.icon}</span>
                    <div className="text-left min-w-0">
                      <p className="font-heading text-[11px] font-bold text-white leading-none truncate">{row.label}</p>
                      <p className="font-body text-[9px] text-white/40 mt-0.5 truncate">{row.sub}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-1">
                    <p className="font-heading text-[13px] font-black text-white leading-none whitespace-nowrap">{row.price} <span className="text-[9px] font-normal text-white/50">F</span></p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-heading text-2xl font-black text-white">
              {product.details?.find(d => d.startsWith("Prix"))
                ? product.details.find(d => d.startsWith("Prix")).replace("Prix : ", "")
                : "Sur demande"}
            </p>
          )}

          <a
            href={`${WHATSAPP}?text=Bonjour%20GMO%2C%20je%20souhaite%20effectuer%20un%20achat%20pour%20:%20${encodeURIComponent(product.name)}`}
            target="_blank" rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-1.5 bg-white text-gmo-green font-heading font-bold text-[11px] px-3 py-2 rounded-full hover:bg-white/90 transition-colors"
          >
            <MessageCircle className="w-3 h-3" />
            Effectuer un achat
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProductsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [dbProducts, setDbProducts] = useState([]);

  // Charger les produits depuis la base de données
  useEffect(() => {
    base44.entities.Product.list("display_order", 200)
      .then(data => {
        const activeProducts = (data || []).filter(p => p.is_active !== false && p.show_on_vitrine !== false);
        setDbProducts(activeProducts);
      })
      .catch(err => {
        console.error("Erreur chargement produits:", err);
        setDbProducts([]);
      });
  }, []);

  // Map DB category to display category
  const DB_CATEGORY_MAP = {
    "tabac": "Cigarettes",
    "alimentaire": "Alimentaire",
    "hygiene": "Hygiène",
    "embauche": "Embauche",
  };

  // Produits de la base de données avec images réelles
  const PRODUCTS_FROM_DB = dbProducts.map(p => {
    const name = p.name.toLowerCase();
    
    // Utiliser la catégorie de la base de données si disponible, sinon utiliser le mapping automatique
    const category = p.category && DB_CATEGORY_MAP[p.category] ? DB_CATEGORY_MAP[p.category] : getCategoryForProduct(p.name);
    
    // Vérifier les marques avec logos spécifiques
    const isSosuco = name.includes("sosuco");
    const isCobifa = name.includes("cobifa");
    const isImperialTobacco = name.includes("hamilton") || name.includes("excellence") || name.includes("dunhill");
    const isSnCitecProducts = name.includes("savon citec") || name.includes("tourtaux");
    const isGmfEtalon = name.includes("farine de blé gmf etalon") || name.includes("son de blé");
    
    const soscoImage = IMAGES.logoSosuco;
    const cobifaImage = IMAGES.logoCobifa;
    const imperialImage = IMAGES.logoImperial;
    const snCitecImage = IMAGES.logoSnCitec;
    const gmfEtalonImage = IMAGES.logoGmfEtalon;
    
    return {
      name: p.name,
      category: category,
      brand: p.name.split(" ")[0],
      description: p.description || "Produit de qualité",
      unit_price: p.unit_price || null,
      details: [
        p.unit ? `Unité : ${p.unit}` : "Conditionnement standard",
        p.unit_price ? `Prix : ${p.unit_price.toLocaleString()} FCFA` : "Prix sur demande",
        p.stock_quantity !== undefined ? `Stock : ${p.stock_quantity}` : "En stock",
      ].filter(Boolean),
      image: isSosuco ? soscoImage : (isCobifa ? cobifaImage : (isImperialTobacco ? imperialImage : (isSnCitecProducts ? snCitecImage : (isGmfEtalon ? gmfEtalonImage : (p.image_url || "https://images.unsplash.com/photo-1574080532925-1d5e8daf2d13?w=400&h=300&fit=crop"))))),
    };
  });

  // Supprimer les doublons par nom de produit
  const PRODUCTS = PRODUCTS_FROM_DB.filter(
    (product, index, self) => index === self.findIndex((p) => p.name === product.name)
  );

  const categories = ["Tous", ...CATEGORIES_ORDER.filter(cat => PRODUCTS.some(p => p.category === cat))];

  const filtered = activeCategory === "Tous"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <section key="products-section" id="produits" className="bg-concrete py-24 lg:py-32">
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

        {/* Grid with category badges */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5"
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
          className="mt-16 bg-obsidian p-6 sm:p-8 lg:p-12 flex flex-col items-center text-center lg:text-left lg:flex-row lg:items-center lg:justify-between gap-6"
        >
          <div className="w-full lg:w-auto">
            <p className="font-body text-xs uppercase tracking-widest text-gmo-green/70 mb-2">Besoin d'un devis groupé ?</p>
            <h3 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-concrete">
              Contactez notre équipe commerciale
            </h3>
          </div>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 w-full sm:w-auto flex items-center justify-center gap-3 bg-gmo-green text-white font-heading font-bold text-sm px-8 py-4 hover:bg-gmo-green/80 transition-colors duration-300"
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp +226 70 21 38 31
          </a>
        </motion.div>
      </div>
    </section>
  );
}