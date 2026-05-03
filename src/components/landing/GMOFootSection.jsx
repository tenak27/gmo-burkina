import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Trophy, Users, Calendar } from "lucide-react";

const GALLERY = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  src: `https://gmobfaso.com/assets/img/gmo-foot/thumbs/gmo-foot-${i + 1}.jpg`,
  alt: `GMO Foot Tournoi ${i + 1}`,
}));

export default function GMOFootSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [showAll, setShowAll] = useState(false);

  const displayed = showAll ? GALLERY : GALLERY.slice(0, 8);

  return (
    <section id="gmofoot" className="bg-obsidian py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div ref={ref} className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              className="font-body text-xs uppercase tracking-[0.3em] text-gmo-green/70 block mb-4"
            >
              Engagement social
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="font-heading text-4xl lg:text-5xl font-bold text-concrete"
            >
              GMO
              <br />
              <span className="text-gmo-red">FOOT</span>
            </motion.h2>
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: 80 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="h-[2px] bg-gmo-green mt-6 mb-8"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="font-body text-base text-concrete/55 leading-[1.8]"
            >
              Le Tournoi Inter-Secteurs GMO Foot est bien plus qu'une compétition sportive. 
              C'est l'expression concrète de notre engagement envers la jeunesse du Burkina Faso. 
              En soutenant le sport populaire, GMO investit dans la cohésion sociale et le dynamisme 
              des communautés locales.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="grid grid-cols-3 gap-4"
          >
            {[
              { icon: Trophy, value: "1ère", label: "Édition 2023", sub: "30 Avr — 04 Juin" },
              { icon: Users, value: "16+", label: "Équipes", sub: "Inter-secteurs" },
              { icon: Calendar, value: "5", label: "Semaines", sub: "de compétition" },
            ].map((s) => (
              <div key={s.label} className="border border-concrete/10 p-6 text-center bg-obsidian hover:border-gmo-green/30 transition-all duration-300">
                <s.icon className="w-5 h-5 text-gmo-green mx-auto mb-3" />
                <p className="font-heading text-2xl font-bold text-concrete">{s.value}</p>
                <p className="font-body text-[10px] uppercase tracking-widest text-concrete/50 mt-1">{s.label}</p>
                <p className="font-body text-[9px] text-concrete/25 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {displayed.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.05 * i, duration: 0.5 }}
              className="relative overflow-hidden group aspect-square"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => { e.target.style.display = "none"; e.target.parentElement.style.display = "none"; }}
              />
              <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/40 transition-all duration-500" />
              <div className="absolute bottom-0 left-0 h-[2px] bg-gmo-red w-0 group-hover:w-full transition-all duration-700" />
            </motion.div>
          ))}
        </div>

        {!showAll && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8 }}
            className="text-center mt-10"
          >
            <button
              onClick={() => setShowAll(true)}
              className="font-heading font-bold text-xs uppercase tracking-widest text-concrete border border-concrete/20 px-8 py-4 hover:border-gmo-green hover:text-gmo-green transition-all duration-300"
            >
              Voir toute la galerie ({GALLERY.length} photos)
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}