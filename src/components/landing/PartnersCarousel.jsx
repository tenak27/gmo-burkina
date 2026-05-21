import React from "react";

const PARTNERS = [
  {
    name: "SN CITEC",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/240px-PNG_transparency_demonstration_1.png",
    desc: "Huiles & corps gras",
    initials: "SNC",
    color: "from-yellow-500/20 to-yellow-400/10",
    text: "text-yellow-700",
  },
  {
    name: "SN SOSUCO",
    logo: null,
    desc: "Sucre GAZELLE",
    initials: "SNS",
    color: "from-blue-500/15 to-blue-400/8",
    text: "text-blue-700",
  },
  {
    name: "COBUFA",
    logo: null,
    desc: "Confiserie ETALON",
    initials: "CBF",
    color: "from-purple-500/15 to-purple-400/8",
    text: "text-purple-700",
  },
  {
    name: "GMB",
    logo: null,
    desc: "Grand Moulin du Faso",
    initials: "GMB",
    color: "from-amber-500/15 to-amber-400/8",
    text: "text-amber-700",
  },
  {
    name: "MABUCIG",
    logo: null,
    desc: "Tabac & distribution",
    initials: "MBG",
    color: "from-green-500/15 to-green-400/8",
    text: "text-green-700",
  },
  {
    name: "AXE",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Axe_brand_logo.png/220px-Axe_brand_logo.png",
    desc: "Hygiène & soins",
    initials: "AXE",
    color: "from-slate-500/15 to-slate-400/8",
    text: "text-slate-700",
  },
  {
    name: "FASO SAVON",
    logo: null,
    desc: "Savonnerie locale",
    initials: "FS",
    color: "from-orange-500/15 to-orange-400/8",
    text: "text-orange-700",
  },
  {
    name: "BRAKINA",
    logo: null,
    desc: "Brasseries du Faso",
    initials: "BRK",
    color: "from-red-500/15 to-red-400/8",
    text: "text-red-700",
  },
];

const DOUBLED = [...PARTNERS, ...PARTNERS];

export default function PartnersCarousel() {
  return (
    <section className="bg-gradient-to-r from-concrete via-white/98 to-concrete py-14 border-t border-b border-gray-100 overflow-hidden">
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

        <div className="flex gap-4 animate-ticker" style={{ width: "max-content" }}>
          {DOUBLED.map((partner, i) => (
            <div
              key={i}
              className={`flex-shrink-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br ${partner.color} border border-gray-100 rounded-2xl px-7 py-5 w-40 hover:shadow-md hover:border-gray-200 transition-all duration-300 cursor-default`}
            >
              <div className={`w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center font-heading font-black text-sm ${partner.text}`}>
                {partner.initials}
              </div>
              <div className="text-center">
                <p className="font-heading text-xs font-bold text-obsidian">{partner.name}</p>
                <p className="font-body text-[9px] text-obsidian/40 uppercase tracking-wider mt-0.5">{partner.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}