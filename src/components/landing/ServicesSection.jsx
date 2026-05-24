import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Truck, Package, MapPin, Shield, Clock, Zap, Gauge, Rocket } from "lucide-react";

const SERVICES = [
{
  icon: Truck,
  title: "Transport & Logistique",
  description: "Distribution nationale et internationale à travers le Burkina Faso et l'Afrique de l'Ouest. Flotte moderne et fiable.",
  specs: ["Flotte 50+ véhicules", "Couverture nationale"],
  color: "bg-gmo-green"
},
{
  icon: Package,
  title: "Distribution",
  description: "Leader de la distribution de produits de grande consommation. Réseau étendu couvrant toutes les régions du pays.",
  specs: ["Produits alimentaires", "Produits d'hygiène"],
  color: "bg-gmo-red"
},
{
  icon: MapPin,
  title: "Couverture Régionale",
  description: "Présent dans les principales villes du Burkina avec une expansion vers la Côte d'Ivoire, le Mali et le Niger.",
  specs: ["4 villes actives", "3 villes en expansion"],
  color: "bg-gold"
},
{
  icon: Shield,
  title: "Qualité & Fiabilité",
  description: "Engagement total envers la satisfaction client. Respect des délais et intégrité des marchandises garantis.",
  specs: ["Suivi en temps réel", "Garantie marchandise"],
  color: "bg-gmo-green"
},
{
  icon: Clock,
  title: "Service 24/7",
  description: "Une équipe dynamique et expérimentée disponible en permanence pour répondre à vos besoins logistiques.",
  specs: ["Support continu", "Équipe dédiée"],
  color: "bg-gmo-red"
},
{
  icon: Zap,
  title: "Innovation",
  description: "Application mobile en développement pour commander et suivre vos livraisons directement depuis votre téléphone.",
  specs: ["App mobile (bientôt)", "Commande en ligne"],
  color: "bg-gold"
},
{
  icon: Gauge,
  title: "Quantité & Fiabilité",
  description: "Garantie de livraison complète et intégrité des produits. Respect strict des délais et des normes de qualité.",
  specs: ["100% conformité", "Délais garantis"],
  color: "bg-gmo-green"
},
{
  icon: Rocket,
  title: "Service Express",
  description: "Livraison rapide et prioritaire pour les commandes urgentes. Livraison le même jour disponible dans les zones couvertes.",
  specs: ["Livraison rapide", "Prioritaire"],
  color: "bg-gmo-red"
},
{
  icon: Clock,
  title: "Service 6j/7 8h-24h",
  description: "Disponibilité maximale pour vos besoins. Ouvert 6 jours sur 7 de 8h à minuit pour assurer votre satisfaction.",
  specs: ["6 jours par semaine", "8h à minuit"],
  color: "bg-gold"
}];


function ServiceCard({ service, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl border border-gray-100 hover:border-gmo-green/20 transition-all duration-400 overflow-hidden">
      
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-gmo-green/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl hidden" />

      {/* Number */}
      <span className="absolute top-5 right-5 font-heading text-xs text-gray-100 tracking-widest font-bold">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Icon */}
      <div className={`w-12 h-12 ${service.color} rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300`}>
        <service.icon className="w-5 h-5 text-white" />
      </div>

      <h3 className="font-heading text-xl font-bold text-obsidian mb-3 relative z-10">
        {service.title}
      </h3>
      <p className="font-body text-sm text-obsidian/55 leading-relaxed mb-6 relative z-10">
        {service.description}
      </p>

      <div className="flex flex-wrap gap-2 relative z-10">
        {service.specs.map((spec) =>
        <span key={spec} className="font-body text-[10px] uppercase tracking-widest text-gmo-green bg-gmo-green/8 border border-gmo-green/15 px-3 py-1 rounded-full">
            {spec}
          </span>
        )}
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-gmo-green to-gmo-red w-0 group-hover:w-full transition-all duration-500 rounded-b-2xl" />
    </motion.div>);

}

export default function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="bg-light-gray py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div ref={ref} className="mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            className="flex items-center gap-3 mb-4">
            
            <div className="w-6 h-[2px] bg-gmo-green" />
            <span className="font-body text-xs uppercase tracking-[0.3em] text-gmo-green">Ce que nous faisons</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-4xl lg:text-5xl font-bold text-obsidian">
            
            NOS SERVICES
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="h-1 w-20 bg-gradient-to-r from-gmo-green to-gmo-red mt-6 origin-left rounded-full" />
          
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, i) =>
          <ServiceCard key={service.title} service={service} index={i} />
          )}
        </div>
      </div>
    </section>);

}