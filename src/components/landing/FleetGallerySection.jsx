import React, { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Truck, Package, ChevronLeft, ChevronRight, X } from "lucide-react";
import { base44 } from "@/api/base44Client";

const FLEET_ITEMS = [
  {
    id: 1,
    title: "Camion de distribution",
    category: "Transport",
    description: "Flotte de camions réfrigérés pour la distribution en zone urbaine",
    image: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/12a75595c_generated_image.png",
    withLogo: true,
  },
  {
    id: 2,
    title: "Installations d'entrepôt Ouagadougou",
    category: "Infrastructure",
    description: "Nos installations logistiques modernes à Dapoya",
    image: "https://gmobfaso.com/assets/img/a-propos/a-propos-2.jpg",
    withLogo: false,
  },
  {
    id: 3,
    title: "Camionnette de vente ambulante",
    category: "Commercial",
    description: "Véhicules de représentation commerciale équipés de stocks",
    image: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/7966bc145_a-propos-3.jpg",
    withLogo: true,
  },
  {
    id: 4,
    title: "Centre de stockage produits",
    category: "Infrastructure",
    description: "Entrepôts spécialisés avec système de gestion automatisé",
    image: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/50ca5b66a_Capturedcran2026-05-2511424PM.png",
    withLogo: false,
  },
  {
    id: 5,
    title: "Moto-taxi de livraison express",
    category: "Logistique",
    description: "Motos équipées pour les livraisons rapides en zone urbaine",
    image: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/1e2be0905_generated_51987d61.png",
    withLogo: true,
  },
  {
    id: 6,
    title: "Quai de chargement principal",
    category: "Infrastructure",
    description: "Installations modernes avec zones de tri et emballage",
    image: "https://gmobfaso.com/assets/img/slides/slide-2.jpg",
    withLogo: false,
  },
];

function FleetCard({ item, index, isInView, onOpen }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      onClick={() => onOpen(item)}
      className="group relative overflow-hidden rounded-lg cursor-pointer h-64 sm:h-72"
    >
      {/* Image */}
      <img
        src={item.image}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/30 to-transparent" />

      {/* GMO Logo watermark (si applicable) */}
      {item.withLogo && (
        <div className="absolute top-3 right-3 opacity-60 group-hover:opacity-80 transition-opacity">
          <img
            src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/47050d727_logo-gmo2x-EVZXLeXs.png"
            alt="GMO"
            className="h-8 w-auto brightness-0 invert"
          />
        </div>
      )}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-2">
          {item.category.includes("Transport") || item.category.includes("Logistique") || item.category.includes("Commercial") ? (
            <Truck className="w-4 h-4 text-gmo-green" />
          ) : (
            <Package className="w-4 h-4 text-gmo-green" />
          )}
          <span className="font-body text-[10px] uppercase tracking-widest text-gmo-green">{item.category}</span>
        </div>
        <h3 className="font-heading text-base sm:text-lg font-bold text-white mb-2 leading-snug group-hover:text-gmo-green transition-colors">
          {item.title}
        </h3>
        <p className="font-body text-xs text-white/70 leading-relaxed line-clamp-2">{item.description}</p>
      </div>

      {/* Hover accent */}
      <div className="absolute bottom-0 left-0 h-1 bg-gmo-green w-0 group-hover:w-full transition-all duration-500" />
    </motion.div>
  );
}

function LightboxModal({ item, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-obsidian/95 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl w-full"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/60 hover:text-white transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Image */}
        <div className="relative overflow-hidden rounded-lg bg-black/50">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-auto max-h-[75vh] object-cover"
          />
          {item.withLogo && (
            <div className="absolute bottom-4 right-4 opacity-70">
              <img
                src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/47050d727_logo-gmo2x-EVZXLeXs.png"
                alt="GMO"
                className="h-12 w-auto brightness-0 invert"
              />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            {item.category.includes("Transport") || item.category.includes("Logistique") || item.category.includes("Commercial") ? (
              <Truck className="w-5 h-5 text-gmo-green" />
            ) : (
              <Package className="w-5 h-5 text-gmo-green" />
            )}
            <span className="font-body text-xs uppercase tracking-widest text-gmo-green">{item.category}</span>
          </div>
          <h2 className="font-heading text-2xl font-bold text-white mb-2">{item.title}</h2>
          <p className="font-body text-sm text-white/70 max-w-md mx-auto">{item.description}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function FleetGallerySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <section id="flotte" className="bg-light-gray py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-[2px] bg-gmo-green" />
            <span className="font-body text-xs uppercase tracking-[0.3em] text-gmo-green">Infrastructure & Logistique</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h2 className="font-heading text-4xl lg:text-5xl font-bold text-obsidian">
                NOS INSTALLATIONS<br />
                <span className="text-gmo-green">EN ACTION</span>
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-gmo-green to-transparent mt-5 rounded-full" />
            </div>
            <p className="font-body text-sm text-obsidian/50 max-w-xs leading-relaxed">
              Découvrez notre flotte de véhicules modernes et nos installations logistiques au service de vos approvisionnements.
            </p>
          </div>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {FLEET_ITEMS.map((item, i) => (
            <FleetCard
              key={item.id}
              item={item}
              index={i}
              isInView={isInView}
              onOpen={setSelectedItem}
            />
          ))}
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-3 gap-4 md:gap-6 bg-white/50 rounded-xl p-8"
        >
          {[
            { value: "25+", label: "Véhicules en service" },
            { value: "3", label: "Entrepôts operationnels" },
            { value: "98%", label: "Taux de disponibilité" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-heading text-2xl lg:text-3xl font-bold text-gmo-green">{stat.value}</p>
              <p className="font-body text-xs uppercase tracking-widest text-obsidian/60 mt-2">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <LightboxModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}