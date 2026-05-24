import React, { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { base44 } from "@/api/base44Client";

const FALLBACK_PARTNERS = ["Impérial Tobacco", "GMF Alien de GMB", "SN CITEC", "SN SUSUCO", "COBIFA"];

export default function PartnersSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    base44.entities.Category.list("name", 200).then(data => {
      const dynamic = (data || []).filter(d => d.code === "PARTENAIRE");
      const order = ["Impérial Tobacco", "GMF Alien de GMB", "SN CITEC", "SN SUSUCO", "COBIFA"];
      const norm = s => s?.toLowerCase().replace(/[éèê]/g, "e").trim();
      const normOrder = order.map(norm);
      const sorted = dynamic.sort((a, b) => {
        const ia = normOrder.indexOf(norm(a.name));
        const ib = normOrder.indexOf(norm(b.name));
        return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
      });
      setPartners(sorted);
    }).catch(() => {});
  }, []);

  const displayPartners = partners.length > 0 ? partners : FALLBACK_PARTNERS.map(name => ({ name, id: name }));

  return (
    <section className="bg-light-gray py-16 lg:py-20 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div ref={ref}>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            className="font-body text-xs uppercase tracking-[0.3em] text-obsidian/30 text-center mb-10"
          >
            Ils nous font confiance
          </motion.p>

          <div className="flex flex-wrap justify-center items-center gap-6 lg:gap-12">
            {displayPartners.map((partner, i) => (
              <motion.div
                key={partner.id || partner.name}
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="flex items-center justify-center px-7 py-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gmo-green/25 transition-all duration-300"
              >
                {partner.description ? (
                  <img src={partner.description} alt={partner.name} className="h-10 w-auto max-w-[120px] object-contain" onError={e => { e.target.style.display="none"; e.target.nextSibling.style.display="block"; }} />
                ) : null}
                <span className="font-heading text-sm font-bold text-obsidian/50 tracking-widest uppercase" style={{ display: partner.description ? "none" : "block" }}>
                  {partner.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}