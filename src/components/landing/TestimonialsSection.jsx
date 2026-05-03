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
    role: "Directeur, Distribution Diébougou",
    rating: 5,
    text: "La rigueur de GMO dans la gestion logistique est impressionnante. Flotte bien entretenue, respect des délais, produits bien conditionnés. Je les recommande vivement.",
    city: "Diébougou",
  },
  {
    name: "Fatimata SAWADOGO",
    role: "Commerçante, Secteur alimentaire OUA",
    rating: 5,
    text: "GMO a transformé ma façon de m'approvisionner. La farine Blé du Sahel et l'huile MADINA se vendent très bien. Le service ambulant est une vraie innovation pour nous.",
    city: "Ouagadougou",
  },
  {
    name: "Ibrahim COMPAORÉ",
    role: "Responsable achats, Hôtel Ouagadougou",
    rating: 5,
    text: "Partenaire GMO pour notre approvisionnement alimentaire. Sérieux, professionnel et toujours disponible. Leur expansion régionale est une vraie valeur ajoutée pour le Burkina.",
    city: "Ouagadougou",
  },
];

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
    <section className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div ref={ref} className="mb-14">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-6 h-[2px] bg-gmo-red" />
            <span className="font-body text-xs uppercase tracking-[0.3em] text-gmo-red">Ce qu'ils disent de nous</span>
          </motion.div>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="font-heading text-4xl lg:text-5xl font-bold text-obsidian"
              >
                TÉMOIGNAGES
              </motion.h2>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="h-1 w-20 bg-gradient-to-r from-gmo-green to-gmo-red mt-6 origin-left rounded-full"
              />
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
              className="flex gap-3"
            >
              <button onClick={prev} className="w-11 h-11 rounded-xl border border-gray-200 hover:border-gmo-green hover:bg-gmo-green hover:text-white text-obsidian flex items-center justify-center transition-all duration-300 shadow-sm">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={next} className="w-11 h-11 rounded-xl border border-gray-200 hover:border-gmo-green hover:bg-gmo-green hover:text-white text-obsidian flex items-center justify-center transition-all duration-300 shadow-sm">
                <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map((t, i) => (
            <motion.div
              key={`${t.name}-${current}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`relative bg-white rounded-2xl border border-gray-100 p-7 flex flex-col shadow-sm hover:shadow-lg hover:border-gmo-green/20 transition-all duration-300 ${i > 0 ? "hidden md:flex" : ""} ${i === 2 ? "hidden lg:flex" : ""}`}
            >
              <Quote className="w-8 h-8 text-gmo-green/15 mb-3 flex-shrink-0" />
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="font-body text-sm text-obsidian/60 leading-relaxed flex-1 mb-5 italic">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 bg-gmo-green rounded-full flex items-center justify-center flex-shrink-0 shadow-md shadow-gmo-green/25">
                  <span className="font-heading font-bold text-white text-sm">{t.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading text-sm font-bold text-obsidian">{t.name}</p>
                  <p className="font-body text-xs text-obsidian/45 truncate">{t.role}</p>
                </div>
                <span className="font-body text-[10px] uppercase tracking-widest text-gmo-red/70 bg-gmo-red/8 border border-gmo-red/15 px-2 py-0.5 rounded-full flex-shrink-0">
                  {t.city}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`transition-all duration-300 rounded-full ${i === current ? "w-8 h-2 bg-gmo-green" : "w-2 h-2 bg-gray-200 hover:bg-gray-300"}`}
            />
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            { value: "5.0/5", label: "Note Google Maps", sub: "4 avis vérifiés", color: "bg-gmo-green" },
            { value: "100%", label: "Clients satisfaits", sub: "Engagement total", color: "bg-gmo-red" },
            { value: "50+", label: "Véhicules de livraison", sub: "Flotte moderne", color: "bg-gold" },
            { value: "4+", label: "Villes desservies", sub: "Couverture nationale", color: "bg-obsidian" },
          ].map((s) => (
            <motion.div
              key={s.label}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <p className={`font-heading text-3xl font-bold text-obsidian mb-1`}>{s.value}</p>
              <p className="font-heading text-xs uppercase tracking-widest text-obsidian/60 mb-0.5">{s.label}</p>
              <p className="font-body text-[10px] text-obsidian/35">{s.sub}</p>
              <div className={`w-8 h-1 ${s.color} mx-auto mt-3 rounded-full`} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}