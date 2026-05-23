import React from "react";

const PARTNERS = [
  {
    name: "SN CITEC",
    logo: "https://gmobfaso.com/assets/img/partenaires/sn-citec.jpg",
    desc: "Huiles & corps gras",
  },
  {
    name: "MABUCIG",
    logo: "https://gmobfaso.com/assets/img/partenaires/mabucig.jpg",
    desc: "Tabac & distribution",
  },
  {
    name: "SN SOSUCO",
    logo: "https://gmobfaso.com/assets/img/partenaires/sn-sosuco.jpg",
    desc: "Sucre GAZELLE",
  },
  {
    name: "COBIFA",
    logo: "https://gmobfaso.com/assets/img/partenaires/cobifa.jpg",
    desc: "Confiserie",
  },
  {
    name: "GMB",
    logo: "https://gmobfaso.com/assets/img/partenaires/gmb.jpg",
    desc: "Grand Moulin du Faso",
  },
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
              className="flex-shrink-0 flex items-center justify-center bg-white border border-gray-100 rounded-2xl px-8 py-6 w-48 hover:shadow-md hover:border-gray-200 transition-all duration-300 cursor-default h-24"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}