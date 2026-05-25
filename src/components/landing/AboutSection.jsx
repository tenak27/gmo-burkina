import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Award, Users, Globe, Heart, Zap, Shield } from "lucide-react";

const VALUES = [
  {
    icon: Award,
    title: "Qualité & Service",
    description:
      "Nous travaillons à tenir notre promesse sur la qualité des produits que nous distribuons. Nous mettons uniquement sur le marché des produits locaux avec une qualité garantie.",
    image: "https://gmobfaso.com/assets/img/a-propos/a-propos-3.jpg",
  },
  {
    icon: Heart,
    title: "Responsabilité Sociétale",
    description:
      "Entreprise citoyenne, soucieuse du respect des normes, nous avons adopté une démarche RSE qui nous permet d'impacter positivement l'économie du Burkina.",
    image: "https://gmobfaso.com/assets/img/a-propos/a-propos-4.jpg",
  },
  {
    icon: Zap,
    title: "Innovation",
    description:
      "Nous mettons en place tous les moyens nécessaires pour livrer nos clients à temps. Application mobile en développement pour commander et être livré automatiquement.",
    image: "https://gmobfaso.com/assets/img/a-propos/a-propos-5.jpg",
  },
  {
    icon: Shield,
    title: "Équité & Confiance",
    description:
      "Nous respectons nos engagements vis-à-vis de tous nos partenaires. Nous reconnaissons et valorisons la contribution de tous les acteurs de l'entreprise.",
    image: "https://gmobfaso.com/assets/img/a-propos/a-propos-6.jpg",
  },
];

export default function AboutSection() {
  const ref = useRef(null);
  const valuesRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const valuesInView = useInView(valuesRef, { once: true, margin: "-80px" });

  return (
    <section id="apropos" className="bg-concrete overflow-hidden">
      {/* PDG Message */}
      <div className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div ref={ref} className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Images */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="relative z-10"
              >
                <img
                  src="https://gmobfaso.com/assets/img/a-propos/a-propos-1.jpg"
                  alt="PDG Hama TRAORE — Groupe Madina Oumarou"
                  className="w-full aspect-[3/4] object-cover object-top"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="absolute -bottom-6 -right-4 lg:-right-8 w-40 lg:w-56 z-20 shadow-2xl"
              >
                <img
                  src="https://gmobfaso.com/assets/img/a-propos/a-propos-2.jpg"
                  alt="Siège GMO"
                  className="w-full aspect-square object-cover border-4 border-concrete"
                />
              </motion.div>
              <div className="absolute top-4 left-4 w-full h-full border border-gmo-green/20 -z-0" />
            </div>

            {/* Content */}
            <div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.2 }}
                className="font-body text-xs uppercase tracking-[0.3em] text-gmo-red block mb-4"
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
                <span className="text-gmo-green">CITOYENNE</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
                className="font-body text-base text-obsidian/60 leading-[1.8] mb-6"
              >
                Le Groupe Madina Oumarou est une société à responsabilité limitée de droit burkinabè, 
                régie par les dispositions de l'OHADA et par la règlementation du Burkina Faso. 
                Entreprise citoyenne et socialement responsable, nous sommes le leader de la distribution.
                Notre siège social est situé à Dapoya, avec un point de vente au Kwame Kruma sur l'Avenue Yennega à Ouagadougou.
              </motion.p>

              {/* PDG Quote */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 }}
                className="border-l-4 border-gmo-green pl-6 mb-8 bg-gmo-green/5 py-4 pr-4"
              >
                <p className="font-body text-sm text-obsidian/70 leading-relaxed italic mb-3">
                  "Je suis ravi de vous souhaiter la bienvenue au sein de GMO. Notre entreprise est engagée dans l'excellence et l'innovation. Nous sommes convaincus que vous trouverez ici un environnement stimulant."
                </p>
                <p className="font-heading text-sm font-bold text-obsidian">Hama TRAORE</p>
                <p className="font-body text-xs uppercase tracking-widest text-gmo-green/70">PDG — Groupe Madina Oumarou</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-3 gap-6"
              >
                {[
                  { icon: Award, label: "Qualité" },
                  { icon: Users, label: "Service" },
                  { icon: Globe, label: "Expansion" },
                ].map((v) => (
                  <div key={v.label} className="text-center">
                    <div className="w-12 h-12 bg-obsidian flex items-center justify-center mx-auto mb-3">
                      <v.icon className="w-5 h-5 text-gmo-green" />
                    </div>
                    <p className="font-heading text-xs uppercase tracking-widest text-obsidian/70">{v.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Grid */}
      <div ref={valuesRef} className="bg-obsidian py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-16"
          >
            <span className="font-body text-xs uppercase tracking-[0.3em] text-gmo-green/70 block mb-4">Nos engagements</span>
            <h3 className="font-heading text-3xl lg:text-4xl font-bold text-concrete">NOS VALEURS</h3>
            <div className="w-16 h-[2px] bg-gmo-red mx-auto mt-6" />
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-concrete/5">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                className="group bg-obsidian p-8 hover:bg-obsidian/80 transition-all duration-300 relative overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-cover bg-center"
                  style={{ backgroundImage: `url(${v.image})` }}
                />
                <v.icon className="w-6 h-6 text-gmo-green mb-5 relative z-10" />
                <h4 className="font-heading text-base font-bold text-concrete mb-3 relative z-10">{v.title}</h4>
                <p className="font-body text-xs text-concrete/45 leading-relaxed relative z-10">{v.description}</p>
                <div className="absolute bottom-0 left-0 h-[2px] bg-gmo-red w-0 group-hover:w-full transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}