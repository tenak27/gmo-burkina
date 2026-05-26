import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Handshake, TrendingUp, Award } from "lucide-react";

export default function PartnershipBanner() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-white py-16 lg:py-20 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div ref={ref} className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-6">
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-[2px] bg-gmo-green" />
              <span className="font-body text-xs uppercase tracking-[0.3em] text-gmo-green">
                Partenariat Stratégique
              </span>
            </div>

            <h2 className="font-heading text-3xl lg:text-4xl font-bold leading-tight">Un trio d'excellence pour une force unique :
GMO, Mabucig, SN CITEC

            </h2>

            <p className="font-body text-sm text-obsidian/60 leading-relaxed">Groupe Madina Oumarou s'associe avec Mabucig SA et SN CITEC deux acteurs majeurs burkinabè. Mabucig, filiale d'Impérial Tobacco (4ème groupe tabac mondial présent dans 160+ pays), et SN CITEC, acteur incontournable dans l'industrie agroalimentaire , constituent des partenaires stratégiques clés pour GMO. Ces alliances nous positionnent comme leader de la distribution national avec des marques premium et une couverture réseau unique sur l'ensemble du territoire.</p>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gmo-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Handshake className="w-5 h-5 text-gmo-green" />
                </div>
                <div>
                  <p className="font-heading text-sm font-bold text-obsidian">Distribution Exclusive</p>
                  <p className="font-body text-xs text-obsidian/50">Accès aux produits Mabucig et SN CITEC</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gmo-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-gmo-green" />
                </div>
                <div>
                  <p className="font-heading text-sm font-bold text-obsidian">Croissance Partagée</p>
                  <p className="font-body text-xs text-obsidian/50">Développement conjoint de nouveaux marchés</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gmo-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-gmo-green" />
                </div>
                <div>
                  <p className="font-heading text-sm font-bold text-obsidian">Qualité Garantie</p>
                  <p className="font-body text-xs text-obsidian/50">Produits certifiés et traçables</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Logos Display */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative">
            
            <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl p-8 lg:p-12 shadow-lg">
              <div className="flex flex-col items-center justify-center gap-8">
                
                {/* GMO Logo */}
                <div className="relative">
                  <img
                    src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/47050d727_logo-gmo2x-EVZXLeXs.png"
                    alt="GMO"
                    className="h-20 lg:h-24 w-auto object-contain" />
                </div>

                {/* Partnership Symbol */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-[2px] bg-gradient-to-r from-gmo-green to-gmo-red" />
                  <div className="w-12 h-12 bg-gmo-green/10 rounded-full flex items-center justify-center">
                    <Handshake className="w-6 h-6 text-gmo-green" />
                  </div>
                  <div className="w-16 h-[2px] bg-gradient-to-l from-gmo-red to-gmo-green" />
                </div>



                {/* SN CITEC Logo */}
                <div className="relative">
                  <img src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/5455769ac_Logo-2025-taille-normale-300x91.jpg"
                  alt="SN CITEC"
                  className="h-16 lg:h-20 w-auto object-contain" />
                </div>

              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-gmo-green/5 rounded-full blur-2xl" />
              <div className="absolute bottom-4 left-4 w-24 h-24 bg-gmo-red/5 rounded-full blur-2xl" />
            </div>


          </motion.div>

        </div>
      </div>
    </section>);

}