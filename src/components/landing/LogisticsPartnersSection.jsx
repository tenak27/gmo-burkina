import React from "react";
import { motion } from "framer-motion";

const PARTNERS = [
  { name: "SONATAB", desc: "Transport routier national", initials: "SNT", color: "from-blue-600/20 to-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  { name: "STMB", desc: "Société de transport Burkina", initials: "STB", color: "from-amber-500/20 to-amber-400/10", text: "text-amber-400", border: "border-amber-500/20" },
  { name: "DHL Express", desc: "Livraison internationale", initials: "DHL", color: "from-red-500/20 to-red-400/10", text: "text-red-400", border: "border-red-500/20" },
  { name: "FEDEX", desc: "Fret & logistique mondiale", initials: "FDX", color: "from-purple-600/20 to-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
  { name: "WAEMU Freight", desc: "Zone UEMOA", initials: "WAF", color: "from-gmo-green/20 to-gmo-green/5", text: "text-gmo-green", border: "border-gmo-green/20" },
  { name: "Air Burkina", desc: "Fret aérien régional", initials: "ABK", color: "from-sky-500/20 to-sky-400/10", text: "text-sky-400", border: "border-sky-500/20" },
  { name: "LONAB Log.", desc: "Réseau national BF", initials: "LNB", color: "from-orange-500/20 to-orange-400/10", text: "text-orange-400", border: "border-orange-500/20" },
  { name: "TRANS SAHEL", desc: "Corridor Sahélien", initials: "TSH", color: "from-yellow-500/20 to-yellow-400/10", text: "text-yellow-400", border: "border-yellow-500/20" },
];

const STATS = [
  { value: "12+", label: "Partenaires logistiques" },
  { value: "15", label: "Villes desservies" },
  { value: "4", label: "Pays UEMOA" },
  { value: "24/7", label: "Suivi en temps réel" },
];

export default function LogisticsPartnersSection() {
  return (
    <section className="bg-gradient-to-br from-obsidian via-obsidian/85 to-black py-20 relative overflow-hidden border-t border-white/5">
      {/* Ambient glows */}
      <div className="absolute top-0 left-1/3 w-96 h-64 bg-gmo-green/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-48 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-[1px] bg-gmo-green/50" />
            <span className="font-body text-[10px] uppercase tracking-[0.35em] text-gmo-green/70">Réseau de distribution</span>
            <div className="w-8 h-[1px] bg-gmo-green/50" />
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
            Partenaires <span className="text-gmo-green">Logistiques</span>
          </h2>
          <p className="font-body text-sm text-white/35 max-w-xl mx-auto leading-relaxed">
            Un réseau de transporteurs et d'opérateurs logistiques sélectionnés pour garantir fiabilité, délais et couverture à travers l'Afrique de l'Ouest.
          </p>
        </motion.div>

        {/* Partner grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-14">
          {PARTNERS.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className={`bg-gradient-to-br ${p.color} border ${p.border} rounded-2xl p-5 flex flex-col items-center gap-3 hover:border-opacity-60 transition-all duration-300 group hover:-translate-y-1`}
            >
              <div className={`w-12 h-12 rounded-xl bg-white/5 border ${p.border} flex items-center justify-center font-heading font-black text-sm ${p.text} group-hover:bg-white/10 transition-colors`}>
                {p.initials}
              </div>
              <div className="text-center">
                <p className="font-heading text-xs font-bold text-white/85">{p.name}</p>
                <p className="font-body text-[10px] text-white/35 mt-0.5 leading-tight">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {STATS.map((s, i) => (
            <div key={i} className="bg-white/[0.04] border border-white/[0.07] rounded-2xl px-5 py-5 text-center">
              <p className="font-heading text-3xl font-black text-gmo-green mb-1">{s.value}</p>
              <p className="font-body text-[11px] text-white/35 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center"
        >
          <p className="font-body text-xs text-white/25">
            Vous êtes transporteur ou opérateur logistique ?{" "}
            <a href="#contact" onClick={e => { e.preventDefault(); document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }); }}
              className="text-gmo-green/70 hover:text-gmo-green transition-colors underline underline-offset-2">
              Rejoignez notre réseau →
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}