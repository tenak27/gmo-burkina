import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Award, Users, Globe } from "lucide-react";

export default function AboutSection({ hubImage, detailImage }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="apropos" className="bg-concrete py-24 lg:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div ref={ref} className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: Images */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="relative z-10"
            >
              <img
                src={hubImage}
                alt="Centre logistique GMOB"
                className="w-full aspect-[4/3] object-cover"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute -bottom-8 -right-4 lg:right-[-2rem] w-48 lg:w-64 z-20 shadow-2xl"
            >
              <img
                src={detailImage}
                alt="Détail logistique"
                className="w-full aspect-square object-cover border-4 border-concrete"
              />
            </motion.div>

            {/* Decorative */}
            <div className="absolute top-4 left-4 w-full h-full border border-gold/20 -z-0" />
          </div>

          {/* Right: Content */}
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
              className="font-body text-xs uppercase tracking-[0.3em] text-gold block mb-4"
            >
              À propos de nous
            </motion.span>
            
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="font-heading text-3xl lg:text-5xl font-bold text-obsidian leading-tight mb-6"
            >
              UNE ENTREPRISE
              <br />
              <span className="text-gold">CITOYENNE</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="font-body text-base text-obsidian/60 leading-[1.8] mb-8"
            >
              Le Groupe Madina Oumarou est une société à responsabilité limitée de droit burkinabè. 
              Entreprise citoyenne et socialement responsable, nous sommes le leader de la distribution 
              au Burkina Faso, avec une vision d'expansion à travers toute l'Afrique de l'Ouest.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="font-body text-base text-obsidian/60 leading-[1.8] mb-10"
            >
              Nous nous adaptons à tous les changements possibles et nous travaillons à respecter nos délais. 
              Nous mettons en place tous les moyens nécessaires pour livrer nos clients à temps.
            </motion.p>

            {/* Values */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-6 mb-10"
            >
              {[
                { icon: Award, label: "Qualité" },
                { icon: Users, label: "Service" },
                { icon: Globe, label: "Expansion" },
              ].map((v) => (
                <div key={v.label} className="text-center">
                  <div className="w-12 h-12 bg-obsidian flex items-center justify-center mx-auto mb-3">
                    <v.icon className="w-5 h-5 text-gold" />
                  </div>
                  <p className="font-heading text-xs uppercase tracking-widest text-obsidian/70">
                    {v.label}
                  </p>
                </div>
              ))}
            </motion.div>

            <motion.a
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7 }}
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 font-heading font-bold text-sm text-obsidian hover:text-gold transition-colors group"
            >
              En savoir plus
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
}