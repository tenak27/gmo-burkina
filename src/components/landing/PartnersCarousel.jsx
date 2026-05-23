import React from "react";

const PARTNERS = [
  { name: "SN CITEC",  desc: "Huiles & corps gras",     color: "#1A7A2E" },
  { name: "MABUCIG",   desc: "Tabac & distribution",     color: "#CC1717" },
  { name: "SN SOSUCO", desc: "Sucre GAZELLE",            color: "#F5C400" },
  { name: "COBIFA",    desc: "Confiserie",               color: "#0EA5E9" },
  { name: "GMB",       desc: "Grand Moulin du Faso",     color: "#7C3AED" },
  { name: "BRAKINA",   desc: "Boissons & brasserie",     color: "#EA580C" },
];

const DOUBLED = [...PARTNERS, ...PARTNERS];

export default function PartnersCarousel() {
  return (
    <section className="bg-white py-14 border-t border-b border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-6 h-[2px] bg-gmo-green" />
          <span className="font-body text-xs uppercase tracking-[0.3em] text-obsidian/40">
            Ils nous font confiance
          </span>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex gap-6 animate-ticker" style={{ width: "max-content" }}>
          {DOUBLED.map((partner, i) => (
            <div
              key={i}
              className="flex-shrink-0 flex flex-col items-center justify-center bg-white border border-gray-100 rounded-2xl px-8 py-5 w-48 hover:shadow-md hover:border-gray-200 transition-all duration-300 cursor-default h-24"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mb-2 font-heading font-bold text-white text-xs"
                style={{ backgroundColor: partner.color }}
              >
                {partner.name.slice(0, 2)}
              </div>
              <p className="font-heading text-xs font-bold text-obsidian tracking-widest uppercase leading-tight text-center">{partner.name}</p>
              <p className="font-body text-[9px] text-obsidian/35 mt-0.5 text-center">{partner.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}