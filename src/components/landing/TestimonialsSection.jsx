import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Moussa KABORÉ",
    role: "Gérant, Supermarché Bobo-Dioulasso",
    rating: 5,
    text: "GMO est notre partenaire de confiance depuis plus de 3 ans. Les livraisons sont toujours ponctuelles et les produits de qualité irréprochable. L'équipe est très réactive en cas de besoin.",
    city: "Bobo-Dioulasso",
  },
  {
    name: "Aminata OUÉDRAOGO",
    role: "Distributrice, Marché de Ouahigouya",
    rating: 5,
    text: "Depuis que je travaille avec GMO pour l'huile MADINA et le sucre GAZELLE, mon commerce a décollé. Le suivi client est exceptionnel, ils comprennent nos besoins locaux.",
    city: "Ouahigouya",
  },
  {
    name: "Seydou ZONGO",
    role: "Directeur, Chaîne de distribution Diébougou",
    rating: 5,
    text: "La rigueur de GMO dans la gestion logistique est impressionnante. Flotte bien entretenue, respect des délais, produits bien conditionnés. Je les recommande vivement à tous mes confrères.",
    city: "Diébougou",
  },
  {
    name: "Fatimata SAWADOGO",
    role: "Commerçante, Secteur alimentaire Ouagadougou",
    rating: 5,
    text: "GMO a transformé ma façon de m'approvisionner. La farine Blé du Sahel et l'huile MADINA se vendent très bien. Le service ambulant est une vraie innovation pour nous.",
    city: "Ouagadougou",
  },
  {
    name: "Ibrahim COMPAORÉ",
    role: "Responsable achats, Hôtel de Ouagadougou",
    rating: 5,
    text: "Partenaire GMO pour notre approvisionnement en produits alimentaires. Sérieux, professionnel et toujours disponible. Leur expansion régionale est une vraie valeur ajoutée pour le Burkina.",
    city: "Ouagadougou",
  },
];

function StarRow({ count }) {
  return (
    <div className="flex gap-1 mb-4">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-gold text-gold" />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setCurrent((c) => (c + 1) % TESTIMONIALS.length);

  const visible = [
    TESTIMONIALS[current],
    TESTIMONIALS[(current + 1) % TESTIMONIALS.length],
    TESTIMONIALS[(current + 2) % TESTIMONIALS.length],
  ];

  return (
    <section className="bg-concrete py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div ref={ref} className="mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            className="font-body text-xs uppercase tracking-[0.3em] text-gmo-red block mb-4"
          >
            Ce qu'ils disent de nous
          </motion.span>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 }}
                className="font-heading text-4xl lg:text-5xl font-bold text-obsidian"
              >
                TÉMOIGNAGES
              </motion.h2>
              <motion.div
                initial={{ width: 0 }}
                animate={isInView ? { width: 80 } : {}}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="h-[2px] bg-gmo-green mt-6"
              />
            </div>
            {/* Nav buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
              className="flex gap-3"
            >
              <button
                onClick={prev}
                className="w-12 h-12 border border-obsidian/15 hover:border-gmo-green hover:bg-gmo-green hover:text-white text-obsidian flex items-center justify-center transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="w-12 h-12 border border-obsidian/15 hover:border-gmo-green hover:bg-gmo-green hover:text-white text-obsidian flex items-center justify-center transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        </div>

        {/* Cards — desktop: 3, mobile: 1 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((t, i) => (
            <motion.div
              key={`${t.name}-${current}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`relative bg-white border border-obsidian/8 p-8 flex flex-col ${i > 0 ? "hidden md:flex" : ""} ${i === 2 ? "hidden lg:flex" : ""}`}
            >
              <Quote className="w-8 h-8 text-gmo-green/20 mb-4 flex-shrink-0" />
              <StarRow count={t.rating} />
              <p className="font-body text-sm text-obsidian/65 leading-relaxed flex-1 mb-6 italic">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-obsidian/6">
                <div className="w-10 h-10 bg-gmo-green flex items-center justify-center flex-shrink-0">
                  <span className="font-heading font-bold text-white text-sm">
                    {t.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-heading text-sm font-bold text-obsidian">{t.name}</p>
                  <p className="font-body text-xs text-obsidian/45">{t.role}</p>
                </div>
                <span className="ml-auto font-body text-[10px] uppercase tracking-widest text-gmo-red/70 border border-gmo-red/15 px-2 py-1">
                  {t.city}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 h-[2px] bg-gmo-green w-0 hover:w-full transition-all duration-500" />
            </motion.div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-10">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all duration-300 ${
                i === current ? "w-8 h-2 bg-gmo-green" : "w-2 h-2 bg-obsidian/20 hover:bg-obsidian/40"
              }`}
            />
          ))}
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-16 bg-obsidian grid grid-cols-2 lg:grid-cols-4"
        >
          {[
            { value: "5.0/5", label: "Note Google Maps", sub: "4 avis vérifiés" },
            { value: "100%", label: "Clients satisfaits", sub: "Engagement total" },
            { value: "50+", label: "Véhicules de livraison", sub: "Flotte moderne" },
            { value: "4+", label: "Villes desservies", sub: "Couverture nationale" },
          ].map((s, i) => (
            <div
              key={s.label}
              className={`p-8 text-center border-obsidian/10 ${i < 3 ? "border-r" : ""}`}
            >
              <p className="font-heading text-3xl font-bold text-gmo-green mb-1">{s.value}</p>
              <p className="font-heading text-xs uppercase tracking-widest text-concrete mb-1">{s.label}</p>
              <p className="font-body text-[10px] text-concrete/30">{s.sub}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}