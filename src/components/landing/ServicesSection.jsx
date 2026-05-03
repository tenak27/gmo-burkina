import React from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Truck, Package, MapPin, Shield, Clock, Zap } from "lucide-react";

const SERVICES = [
  {
    icon: Truck,
    title: "Transport & Logistique",
    description: "Distribution nationale et internationale à travers le Burkina Faso et l'Afrique de l'Ouest. Flotte moderne et fiable.",
    specs: ["Flotte 50+ véhicules", "Couverture nationale"],
  },
  {
    icon: Package,
    title: "Distribution",
    description: "Leader de la distribution de produits de grande consommation. Réseau étendu couvrant toutes les régions du pays.",
    specs: ["Produits alimentaires", "Produits d'hygiène"],
  },
  {
    icon: MapPin,
    title: "Couverture Régionale",
    description: "Présent dans les principales villes du Burkina avec une expansion vers la Côte d'Ivoire, le Mali et le Niger.",
    specs: ["4 villes actives", "3 villes en expansion"],
  },
  {
    icon: Shield,
    title: "Qualité & Fiabilité",
    description: "Engagement total envers la satisfaction client. Respect des délais et intégrité des marchandises garantis.",
    specs: ["Suivi en temps réel", "Garantie marchandise"],
  },
  {
    icon: Clock,
    title: "Service 24/7",
    description: "Une équipe dynamique et expérimentée disponible en permanence pour répondre à vos besoins logistiques.",
    specs: ["Support continu", "Équipe dédiée"],
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "Application mobile en développement pour commander et suivre vos livraisons directement depuis votre téléphone.",
    specs: ["App mobile (bientôt)", "Commande en ligne"],
  },
];

function ServiceCard({ service, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative bg-obsidian border border-concrete/10 p-8 hover:border-gold/30 transition-all duration-500"
    >
      {/* Index number */}
      <span className="absolute top-4 right-4 font-heading text-xs text-concrete/15 tracking-widest">
        {String(index + 1).padStart(2, "0")}
      </span>

      <service.icon className="w-6 h-6 text-gold mb-6" />
      
      <h3 className="font-heading text-xl font-bold text-concrete mb-3">
        {service.title}
      </h3>
      
      <p className="font-body text-sm text-concrete/50 leading-relaxed mb-6">
        {service.description}
      </p>

      {/* Specs */}
      <div className="flex flex-wrap gap-2">
        {service.specs.map((spec) => (
          <span
            key={spec}
            className="font-body text-[10px] uppercase tracking-widest text-gold/60 border border-gold/15 px-3 py-1"
          >
            {spec}
          </span>
        ))}
      </div>

      {/* Hover line */}
      <div className="absolute bottom-0 left-0 h-[2px] bg-gold w-0 group-hover:w-full transition-all duration-500" />
    </motion.div>
  );
}

export default function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="bg-obsidian py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div ref={ref} className="mb-16 lg:mb-20">
          <motion.span
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            className="font-body text-xs uppercase tracking-[0.3em] text-gold/60 block mb-4"
          >
            Ce que nous faisons
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="font-heading text-4xl lg:text-5xl font-bold text-concrete"
          >
            NOS SERVICES
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: 80 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="h-[2px] bg-gold mt-6"
          />
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-concrete/5">
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}