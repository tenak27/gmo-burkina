import React, { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Truck, Package, MapPin, Users, TrendingUp, Clock, Bike } from "lucide-react";

const STATS = [
  { icon: Truck, value: 50, suffix: "+", label: "Véhicules", desc: "Flotte moderne et entretenue" },
  { icon: Bike, value: 25, suffix: "+", label: "Motos électriques", desc: "Livraison écologique urbaine" },
  { icon: Package, value: 100, suffix: "+", label: "Livraisons / jour", desc: "Partout au Burkina Faso" },
  { icon: MapPin, value: 7, suffix: "", label: "Villes couvertes", desc: "Ouaga · Bobo · Ouahigouya · Doris · Boromo · Diebougou · Po" },
  { icon: Users, value: 500, suffix: "+", label: "Clients actifs", desc: "Commerçants & distributeurs" },
  { icon: TrendingUp, value: 40, suffix: "+ ans", label: "D'expérience", desc: "Leader de la distribution" },
];

function AnimatedCounter({ target, suffix, started }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    const duration = 1800;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, target]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-obsidian py-20 lg:py-28 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute border border-white rounded-full"
            style={{
              width: `${150 + i * 80}px`,
              height: `${150 + i * 80}px`,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div ref={ref} className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="w-6 h-[2px] bg-gmo-green" />
            <span className="font-body text-xs uppercase tracking-[0.3em] text-gmo-green/70">
              GMO en chiffres
            </span>
            <div className="w-6 h-[2px] bg-gmo-green" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-4xl lg:text-5xl font-bold text-white"
          >
            NOS STATISTIQUES
            <br />
            <span className="text-gmo-green">LOGISTIQUES</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-white/5">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40, scale: 0.94 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: i * 0.12, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
              className="group bg-obsidian p-8 lg:p-10 text-center hover:bg-white/5 transition-colors duration-300"
            >
              <div className="w-12 h-12 bg-gmo-green/10 rounded-xl flex items-center justify-center mx-auto mb-5 group-hover:bg-gmo-green/20 transition-colors duration-300">
                <stat.icon className="w-5 h-5 text-gmo-green" />
              </div>
              <p className="font-heading text-4xl lg:text-5xl font-bold text-white mb-2">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} started={isInView} />
              </p>
              <p className="font-heading text-sm font-bold text-white/70 mb-1 uppercase tracking-widest">
                {stat.label}
              </p>
              <p className="font-body text-xs text-white/30">{stat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}