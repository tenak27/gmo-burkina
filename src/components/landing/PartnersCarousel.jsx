import React from "react";

const PARTNERS = [
  { name: "SN CITEC", logo: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/sncitec_logo.png" },
  { name: "Imperial Tobacco", logo: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/imperial_tobacco.png" },
  { name: "Manicure", logo: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/manicure_logo.png" },
  { name: "COBIFA", logo: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/cobifa_logo.png" },
  { name: "Brakina", logo: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/brakina_logo.png" },
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
              className="flex-shrink-0 flex flex-col items-center justify-center bg-white border border-gray-100 rounded-2xl px-8 py-6 w-56 hover:shadow-md hover:border-gray-200 transition-all duration-300 cursor-default"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="h-16 w-auto object-contain mb-3"
              />
              <p className="font-heading text-xs font-bold text-obsidian tracking-widest uppercase text-center">{partner.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}