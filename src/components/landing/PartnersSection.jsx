import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const PARTNERS = ["SN CITEC", "MABUCIG", "SN SOSUCO", "COBIFA", "GMB"];

export default function PartnersSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

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
            {PARTNERS.map((partner, i) => (
              <motion.div
                key={partner}
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="flex items-center justify-center px-7 py-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gmo-green/25 transition-all duration-300"
              >
                <span className="font-heading text-sm font-bold text-obsidian/50 tracking-widest uppercase">
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