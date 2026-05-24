import React, { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { MessageCircle, ChevronDown, ChevronUp } from "lucide-react";

const CATEGORIES = ["Tous", "Alimentaire", "Confiserie", "Hygiène", "Élevage"];

const PRODUCTS = [
  {
    name: "Huile de coton SAVOR",
    category: "Alimentaire",
    brand: "SAVOR · SN CITEC",
    description:
      "L'huile de coton raffinée SAVOR, enrichie en vitamine A, 100% huile végétale et sans cholestérol. SAVOR, la saveur enrichie de la bonne cuisine.",
    details: ["Enrichie en vitamine A", "0% Cholestérol", "100% végétale", "Recommandée par les gourmets"],
    image: "https://gmobfaso.com/assets/img/produits/huile.jpg",
  },
  {
    name: "Farine de blé",
    category: "Alimentaire",
    brand: "Grand Moulin du Faso",
    description:
      "Pure farine de blé, résultat de la mouture de la graine du blé tendre. Produite par le Grand Moulin du Faso, distribuée par GMO au Burkina Faso.",
    details: ["Pure farine de blé", "Grand Moulin du Faso", "Plusieurs formats disponibles"],
    image: "https://gmobfaso.com/assets/img/produits/ble.jpg",
  },
  {
    name: "Sucre blond GAZELLE & blanc CASCADE",
    category: "Alimentaire",
    brand: "GAZELLE · CASCADE · SN SOSUCO",
    description:
      "Sucre blond de canne sans aromatisants ni colorants, conditionné sous différents formats. Disponible en sucre blanc sous la dénomination CASCADE.",
    details: ["Sac 50 kg granulé", "Sachets 1 kg (lot 25–50 kg)", "Morceaux GAZELLE 1 kg & 500 g", "Sucre blanc CASCADE morceaux 1 kg"],
    image: "https://gmobfaso.com/assets/img/produits/sucre.jpg",
  },
  {
    name: "Chewing-gum & Bonbons COBUFA",
    category: "Confiserie",
    brand: "ETALON · ZOODO · COBUFA",
    description:
      "Explosion de saveurs avec les chewing-gums et bonbons produits par COBUFA. Chaque pièce est une œuvre d'art de couleur et de texture fruitée.",
    details: ["Produit par COBUFA", "Chewing-gums ETALON", "Bonbons ZOODO saveur fruitée", "Conditionnement varié"],
    image: "https://gmobfaso.com/assets/img/produits/chewingum.jpg",
  },
  {
    name: "Bonbons ZOODO Gimgimbre",
    category: "Confiserie",
    brand: "ZOODO · COBUFA",
    description:
      "Les bonbons ZOODO au gingembre, une recette unique alliant la douceur sucrée et la saveur épicée du gingembre pour une expérience gustative unique.",
    details: ["Saveur gingembre unique", "Produit par COBUFA", "Pour tout âge", "Distribution nationale"],
    image: "https://gmobfaso.com/assets/img/produits/zoodo-gimgimbre.jpg",
  },
  {
    name: "Savon SN CITEC",
    category: "Hygiène",
    brand: "SN CITEC",
    description:
      "À partir de corps gras végétaux (karité, acide gras de palme), le savon SN CITEC hypoallergénique et bactéricide est recommandé pour les peaux sensibles.",
    details: ["Hypoallergénique & bactéricide", "Corps gras végétaux (karité, palme)", "Multi-usages : linge & corps", "Recommandé par les dermatologues"],
    image: "https://gmobfaso.com/assets/img/produits/savon.jpg",
  },
  {
    name: "Produits AXE",
    category: "Hygiène",
    brand: "AXE · GMO",
    description:
      "Gamme complète de produits d'hygiène AXE distribués par GMO à travers tout le Burkina Faso. Déodorants, soins — disponibles dans toutes les villes desservies.",
    details: ["Déodorants & soins corps", "Distribution nationale GMO", "Marque internationale de confiance"],
    image: "https://gmobfaso.com/assets/img/produits/axe.jpg",
  },
  {
    name: "Aliments pour bétail",
    category: "Élevage",
    brand: "GMO Agri",
    description:
      "Large gamme d'aliments pour bétail conçus pour les besoins nutritionnels spécifiques des bovins, moutons, chèvres. Riches en protéines, vitamines et minéraux.",
    details: ["Riches en protéines & vitamines", "Formules spécialisées par animal", "Ingrédients de première qualité", "Service conseil inclus"],
    image: "https://gmobfaso.com/assets/img/produits/produits-animaux.jpg",
  },
];

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
          {CATEGORIES.map((cat) => (
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
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
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