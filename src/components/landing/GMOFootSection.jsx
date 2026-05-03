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
    <section id="gmofoot" className="bg-light-gray py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div ref={ref} className="grid lg:grid-cols-2 gap-16 items-center mb-14">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              className="flex items-center gap-3 mb-4"
            >
              <div className="w-6 h-[2px] bg-gmo-green" />
              <span className="font-body text-xs uppercase tracking-[0.3em] text-gmo-green">Engagement social</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading text-4xl lg:text-5xl font-bold text-obsidian"
            >
              GMO
              <br />
              <span className="text-gmo-red">FOOT</span>
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="h-1 w-20 bg-gradient-to-r from-gmo-green to-gmo-red mt-6 mb-7 origin-left rounded-full"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="font-body text-base text-obsidian/55 leading-[1.8]"
            >
              Le Tournoi Inter-Secteurs GMO Foot est bien plus qu'une compétition sportive. 
              C'est l'expression concrète de notre engagement envers la jeunesse du Burkina Faso. 
              En soutenant le sport populaire, GMO investit dans la cohésion sociale et le dynamisme des communautés.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="grid grid-cols-3 gap-4"
          >
            {[
              { icon: Trophy, value: "1ère", label: "Édition 2023", sub: "30 Avr — 04 Juin" },
              { icon: Users, value: "16+", label: "Équipes", sub: "Inter-secteurs" },
              { icon: Calendar, value: "5", label: "Semaines", sub: "de compétition" },
            ].map((s) => (
              <motion.div
                key={s.label}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-sm hover:shadow-md hover:border-gmo-green/20 transition-all duration-300"
              >
                <div className="w-10 h-10 bg-gmo-green/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <s.icon className="w-5 h-5 text-gmo-green" />
                </div>
                <p className="font-heading text-2xl font-bold text-obsidian">{s.value}</p>
                <p className="font-body text-[10px] uppercase tracking-widest text-obsidian/50 mt-1">{s.label}</p>
                <p className="font-body text-[9px] text-obsidian/30 mt-0.5">{s.sub}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {displayed.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.04 * i, duration: 0.5 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className="relative overflow-hidden rounded-xl group aspect-square shadow-sm"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => { e.target.parentElement.style.display = "none"; }}
              />
              <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/25 transition-all duration-400 rounded-xl" />
              <div className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-gmo-green to-gmo-red w-0 group-hover:w-full transition-all duration-500 rounded-b-xl" />
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
              className="font-heading font-bold text-xs uppercase tracking-widest text-obsidian bg-white border border-gray-200 rounded-xl px-8 py-4 hover:border-gmo-green hover:text-gmo-green hover:shadow-md transition-all duration-300"
            >
              Voir toute la galerie ({GALLERY.length} photos)
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}