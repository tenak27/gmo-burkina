import React, { useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TESTIMONIALS = [
  {
    name: "Abdoulaye Konaté",
    role: "Gérant, Supermarché La Paix",
    city: "Ouagadougou",
    avatar: "AK",
    rating: 5,
    text: "Partenaire depuis 3 ans. La qualité des produits GMO est irréprochable et les délais de livraison sont toujours respectés. Notre chiffre d'affaires a augmenté de 30% grâce à leurs tarifs grossiste compétitifs.",
    color: "from-gmo-green/20 to-gmo-green/5",
  },
  {
    name: "Fatoumata Traoré",
    role: "Propriétaire, Épicerie Moderne",
    city: "Bobo-Dioulasso",
    avatar: "FT",
    rating: 5,
    text: "L'espace détaillant en ligne est révolutionnaire ! Je passe mes commandes en quelques clics et je suis livrée dans les 24h. L'équipe GMO est très réactive et professionnelle.",
    color: "from-blue-500/15 to-blue-500/5",
  },
  {
    name: "Ibrahim Ouédraogo",
    role: "Directeur Achats, Groupe Diallo",
    city: "Ouagadougou",
    avatar: "IO",
    rating: 5,
    text: "GMO Burkina est un acteur incontournable de la distribution au Burkina. Leur logistique est impeccable et le suivi des commandes en temps réel nous facilite énormément la gestion.",
    color: "from-amber-500/15 to-amber-500/5",
  },
  {
    name: "Marie-Claire Kaboré",
    role: "Commerçante, Marché Central",
    city: "Koudougou",
    avatar: "MK",
    rating: 5,
    text: "Je travaille avec GMO depuis le début de mon activité. Ils m'ont aidée à développer mon commerce avec des produits de qualité. La confiance est totale, je recommande à tous les commerçants.",
    color: "from-purple-500/15 to-purple-500/5",
  },
  {
    name: "Salif Compaoré",
    role: "Responsable Approvisionnement",
    city: "Dédougou",
    avatar: "SC",
    rating: 5,
    text: "Le programme fidélité GMO est très avantageux. Plus on achète, plus les remises sont importantes. C'est une relation gagnant-gagnant qui nous permet de rester compétitifs sur notre marché.",
    color: "from-gmo-red/15 to-gmo-red/5",
  },
];

function Stars({ count = 5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = (dir) => {
    setDirection(dir);
    setIndex(i => (i + dir + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const t = TESTIMONIALS[index];

  return (
    <section id="temoignages" className="bg-[#0F0F11] py-20 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-1/3 w-96 h-64 bg-gmo-green/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-48 bg-amber-500/4 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-gmo-green/40" />
            <span className="text-[10px] text-gmo-green/70 uppercase tracking-[0.3em] font-body">Témoignages</span>
            <div className="w-8 h-px bg-gmo-green/40" />
          </div>
          <h2 className="font-heading text-3xl lg:text-4xl font-black text-white mb-3">
            Ils nous font confiance
          </h2>
          <p className="font-body text-sm text-white/35 max-w-md mx-auto">
            Commerçants, détaillants et entreprises partagent leur expérience avec GMO Burkina.
          </p>
        </div>

        {/* Featured testimonial */}
        <div className="grid lg:grid-cols-5 gap-8 mb-10">
          {/* Main card */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -direction * 40 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className={`bg-gradient-to-br ${t.color} border border-white/8 rounded-3xl p-8 h-full`}
              >
                <Quote className="w-10 h-10 text-white/10 mb-5" />
                <p className="font-body text-lg text-white/80 leading-relaxed mb-8 italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center font-heading font-bold text-white text-sm flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-heading font-bold text-white text-sm">{t.name}</p>
                    <p className="text-[11px] text-white/40 font-body">{t.role} · {t.city}</p>
                    <Stars count={t.rating} />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Other testimonials list */}
          <div className="lg:col-span-2 space-y-3">
            {TESTIMONIALS.filter((_, i) => i !== index).slice(0, 3).map((item, i) => (
              <button
                key={item.name}
                onClick={() => { setDirection(1); setIndex(TESTIMONIALS.indexOf(item)); }}
                className="w-full text-left bg-white/[0.03] border border-white/6 hover:border-white/14 rounded-2xl p-4 transition-all duration-200 group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center font-heading font-bold text-white/60 text-xs flex-shrink-0 group-hover:bg-gmo-green/20 transition-colors">
                    {item.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading text-xs font-bold text-white/70 group-hover:text-white transition-colors">{item.name}</p>
                    <p className="text-[10px] text-white/30 font-body truncate">{item.city}</p>
                    <p className="text-[11px] text-white/40 font-body mt-1 line-clamp-2">"{item.text.slice(0, 80)}…"</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Controls + dots */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
                className={`rounded-full transition-all duration-300 ${i === index ? "w-6 h-2 bg-gmo-green" : "w-2 h-2 bg-white/15 hover:bg-white/30"}`} />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => go(-1)}
              className="w-10 h-10 rounded-xl bg-white/6 hover:bg-white/12 border border-white/8 flex items-center justify-center text-white/50 hover:text-white transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => go(1)}
              className="w-10 h-10 rounded-xl bg-gmo-green hover:bg-gmo-green/80 flex items-center justify-center text-white transition-all btn-glow-green">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-14 grid grid-cols-3 gap-4 border-t border-white/6 pt-10">
          {[
            { value: "500+", label: "Partenaires détaillants" },
            { value: "98%", label: "Taux de satisfaction" },
            { value: "15 ans", label: "D'expérience" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="font-heading text-2xl lg:text-3xl font-black text-white mb-1">{s.value}</p>
              <p className="text-xs text-white/35 font-body">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}