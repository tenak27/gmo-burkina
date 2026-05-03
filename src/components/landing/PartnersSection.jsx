import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const PARTNERS = [
  "SN CITEC",
  "MABUCIG",
  "SN SOSUCO",
  "COBIFA",
  "GMB",
];

export default function PartnersSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="bg-concrete py-16 lg:py-20 border-t border-obsidian/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div ref={ref}>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            className="font-body text-xs uppercase tracking-[0.3em] text-obsidian/30 text-center mb-12"
          >
            Ils nous font confiance
          </motion.p>

          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16">
            {PARTNERS.map((partner, i) => (
              <motion.div
                key={partner}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-center px-6 py-4 border border-obsidian/10 bg-white hover:border-gmo-green/30 transition-all duration-300"
              >
                <span className="font-heading text-sm font-bold text-obsidian/40 tracking-widest uppercase">
                  {partner}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}