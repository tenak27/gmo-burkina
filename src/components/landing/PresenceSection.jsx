import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Globe } from "lucide-react";

const CITIES = [
  { name: "Ouagadougou", status: "Opérationnel", color: "text-gmo-green" },
  { name: "Bobo Dioulasso", status: "Opérationnel", color: "text-gmo-green" },
  { name: "Diébougou", status: "Opérationnel", color: "text-gmo-green" },
  { name: "Pô", status: "Opérationnel", color: "text-gmo-green" },
  { name: "Boromo", status: "Opérationnel", color: "text-gmo-green" },
  { name: "Dori", status: "Opérationnel", color: "text-gmo-green" },
  { name: "Banfora", status: "Bientôt", color: "text-amber-500" },
];

const INTERNATIONAL = [
  { name: "Mali", status: "Très bientôt", color: "text-blue-500" },
  { name: "Niger", status: "Très bientôt", color: "text-blue-500" },
  { name: "Côte d'Ivoire", status: "Très bientôt", color: "text-blue-500" },
];

export default function PresenceSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="bg-white py-16 lg:py-24 border-t border-gray-100" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-gmo-green" />
            <p className="font-body text-xs uppercase tracking-[0.3em] text-obsidian/40">Notre présence</p>
          </div>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-obsidian mb-3">Où nous trouver</h2>
          <p className="font-body text-lg text-obsidian/55 max-w-2xl mx-auto">
            GMO opère dans plusieurs villes du Burkina Faso et prépare son expansion régionale
          </p>
        </motion.div>

        {/* Two columns */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Burkina Faso */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-4 h-4 rounded-full bg-gmo-green" />
              <h3 className="font-heading text-xl font-bold text-obsidian">Burkina Faso</h3>
            </div>
            <div className="space-y-3">
              {CITIES.map((city, i) => (
                <motion.div
                  key={city.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.05 }}
                  className="flex items-center justify-between p-4 bg-light-gray rounded-xl border border-gray-100 hover:border-gmo-green/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-gmo-green" />
                    <span className="font-heading text-sm font-bold text-obsidian">{city.name}</span>
                  </div>
                  <span className={`font-body text-xs font-semibold ${city.color}`}>{city.status}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* International expansion */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Globe className="w-5 h-5 text-blue-500" />
              <h3 className="font-heading text-xl font-bold text-obsidian">Expansion régionale</h3>
            </div>
            <div className="space-y-3">
              {INTERNATIONAL.map((region, i) => (
                <motion.div
                  key={region.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.05 }}
                  className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100 hover:border-blue-300 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="font-heading text-sm font-bold text-obsidian">{region.name}</span>
                  </div>
                  <span className={`font-body text-xs font-semibold ${region.color}`}>{region.status}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="font-body text-sm text-amber-900">
                <span className="font-bold">En préparation :</span> Banfora (Burkina Faso) arrive très bientôt
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}