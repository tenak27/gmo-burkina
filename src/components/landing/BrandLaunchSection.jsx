import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Sparkles, Leaf, Award } from "lucide-react";

export default function BrandLaunchSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-gmo-green/5 via-transparent to-amber-500/5">
      {/* Decorative elements */}
      <div className="absolute top-10 right-0 w-96 h-96 bg-gmo-green/10 rounded-full blur-3xl -z-0" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl -z-0" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -60, scale: 0.95 }}
            animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex items-center justify-center order-2 lg:order-1"
          >
            <div className="relative w-full max-w-md">
              <img
                src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/678f80d25_huile.jpg"
                alt="Farine du Sahel - Nouvelle marque GMO"
                className="w-full h-auto drop-shadow-2xl"
              />
              {/* Badge */}
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={isInView ? { scale: 1, rotate: 0 } : {}}
                transition={{ delay: 0.4, type: "spring", stiffness: 120 }}
                className="absolute -top-8 -right-4 bg-gmo-red text-white px-6 py-3 rounded-full shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-heading font-bold text-sm">NOUVEAU</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="w-8 h-[2px] bg-gmo-red" />
              <span className="font-body text-xs uppercase tracking-[0.3em] text-gmo-red">Lancement Exclusif</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="font-heading text-3xl lg:text-5xl font-bold text-obsidian mb-6 leading-tight"
            >
              FARINE DU <span className="text-gmo-green">SAHEL</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="font-body text-base text-obsidian/60 leading-relaxed mb-8"
            >
              GMO est fier de vous présenter sa nouvelle marque premium : <span className="font-semibold text-obsidian">Farine du Sahel</span>. 
              Élaborée selon les plus hauts standards de qualité, cette farine issue de la sélection rigoureuse des meilleures céréales 
              sahéliennes offre une excellence culinaire inégalée pour vos tables familiales et professionnelles.
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="space-y-4 mb-8"
            >
              {[
                { icon: Leaf, label: "100% Naturelle", desc: "Sans additifs ni conservateurs" },
                { icon: Award, label: "Certifiée Qualité", desc: "Contrôle strict à chaque étape" },
                { icon: Sparkles, label: "Goût Premium", desc: "Pour une cuisine d'excellence" },
              ].map((feature, i) => (
                <div key={feature.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gmo-green/10 border border-gmo-green/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <feature.icon className="w-5 h-5 text-gmo-green" />
                  </div>
                  <div>
                    <p className="font-heading text-sm font-bold text-obsidian">{feature.label}</p>
                    <p className="font-body text-xs text-obsidian/50">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href="https://wa.me/22670213831?text=Bonjour%20GMO%2C%20je%20souhaite%20commander%20de%20la%20Farine%20du%20Sahel"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gmo-green hover:bg-gmo-green/90 text-white font-heading font-bold px-8 py-4 rounded-xl transition-all duration-300 text-center"
              >
                Commander maintenant
              </a>
              <button className="flex-1 border border-gmo-green text-gmo-green hover:bg-gmo-green/5 font-heading font-bold px-8 py-4 rounded-xl transition-all duration-300">
                En savoir plus
              </button>
            </motion.div>

            {/* Stock info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 }}
              className="mt-8 p-4 bg-gmo-green/5 border border-gmo-green/20 rounded-xl"
            >
              <p className="font-body text-xs text-obsidian/60">
                <span className="font-bold text-gmo-green">Disponible dès maintenant</span> dans tous nos points de vente et auprès de nos distributeurs agréés à travers le Burkina Faso.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}