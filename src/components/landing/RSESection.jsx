import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Leaf, Heart, Users, Sun, Recycle, HandHeart, GraduationCap, Building2 } from "lucide-react";

const RSE_PILLARS = [
  {
    icon: Leaf,
    category: "Environnement",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    title: "Réduction de l'empreinte carbone",
    description: "Nous optimisons nos itinéraires de livraison et investissons dans une flotte plus propre pour réduire nos émissions de CO₂ et préserver l'environnement sahélien.",
    actions: ["Flotte véhicules optimisée", "Routes logistiques vertes", "Réduction des emballages plastiques"],
  },
  {
    icon: GraduationCap,
    category: "Éducation",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
    title: "Soutien à l'éducation",
    description: "GMO finance des bourses scolaires et soutient des initiatives éducatives pour les enfants des communautés où nous opérons, investissant dans les générations futures.",
    actions: ["Bourses scolaires annuelles", "Partenariats écoles & lycées", "Kits scolaires offerts"],
  },
  {
    icon: Heart,
    category: "Social",
    color: "text-rose-400",
    bg: "bg-rose-400/10",
    border: "border-rose-400/20",
    title: "Bien-être des communautés",
    description: "Actions humanitaires, soutien aux associations locales et programmes de solidarité pour améliorer les conditions de vie dans les quartiers défavorisés de Ouagadougou.",
    actions: ["Distributions alimentaires", "Aide médicale communautaire", "Soutien aux associations locales"],
  },
  {
    icon: Users,
    category: "Emploi",
    color: "text-gmo-green",
    bg: "bg-gmo-green/10",
    border: "border-gmo-green/20",
    title: "Création d'emplois locaux",
    description: "Nous privilégions le recrutement local et offrons des opportunités de carrière aux jeunes burkinabè, contribuant activement à la réduction du chômage.",
    actions: ["60+ emplois directs", "Stages & alternances", "Formation professionnelle continue"],
  },
  {
    icon: Sun,
    category: "Énergie",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    title: "Transition énergétique",
    description: "Nos entrepôts s'équipent progressivement de panneaux solaires pour réduire notre dépendance aux énergies fossiles et diminuer notre impact environnemental.",
    actions: ["Panneaux solaires entrepôts", "Éclairage LED basse consommation", "Objectif neutralité carbone 2030"],
  },
  {
    icon: HandHeart,
    category: "Partenariats",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20",
    title: "Partenariats solidaires",
    description: "Collaboration avec des ONG, institutions publiques et entreprises sociales pour maximiser notre impact positif sur la société burkinabè.",
    actions: ["Partenariats ONG actifs", "Collaboration institutions publiques", "Mécénat culturel & sportif"],
  },
];

const IMPACT_STATS = [
  { value: "500+", label: "Familles soutenues", icon: "🏠" },
  { value: "200+", label: "Bourses octroyées", icon: "🎓" },
  { value: "60+", label: "Emplois créés", icon: "💼" },
  { value: "30%", label: "Réduction CO₂ visée", icon: "🌱" },
];

export default function RSESection() {
  const ref = useRef(null);
  const statsRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });

  return (
    <section id="rse" className="bg-concrete overflow-hidden">
      <div className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Header */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-16"
          >
            <span className="font-body text-xs uppercase tracking-[0.3em] text-gmo-red block mb-4">Responsabilité Sociétale</span>
            <h2 className="font-heading text-3xl lg:text-5xl font-bold text-obsidian leading-tight mb-6">
              NOS ENGAGEMENTS
              <br />
              <span className="text-gmo-green">RSE</span>
            </h2>
            <p className="font-body text-base text-obsidian/55 max-w-2xl mx-auto leading-relaxed">
              Au-delà de nos activités commerciales, GMO s'engage résolument pour un développement durable et inclusif au Burkina Faso — environnement, éducation, social et emploi.
            </p>
            <div className="w-16 h-[2px] bg-gmo-red mx-auto mt-8" />
          </motion.div>

          {/* Pillars grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {RSE_PILLARS.map((pillar, i) => (
              <motion.div
                key={pillar.category}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08 }}
                className={`group bg-white border ${pillar.border} hover:shadow-lg transition-all duration-500 p-7 relative overflow-hidden`}
              >
                <div className={`inline-flex w-11 h-11 ${pillar.bg} border ${pillar.border} items-center justify-center rounded-xl mb-5`}>
                  <pillar.icon className={`w-5 h-5 ${pillar.color}`} />
                </div>
                <span className={`font-heading text-[9px] uppercase tracking-[0.3em] ${pillar.color} block mb-2`}>{pillar.category}</span>
                <h4 className="font-heading text-base font-bold text-obsidian mb-3 leading-tight">{pillar.title}</h4>
                <p className="font-body text-xs text-obsidian/55 leading-relaxed mb-5">{pillar.description}</p>
                <ul className="space-y-1.5">
                  {pillar.actions.map((action, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs font-body text-obsidian/60">
                      <div className={`w-1.5 h-1.5 rounded-full ${pillar.bg.replace('/10', '/60')} flex-shrink-0`} />
                      {action}
                    </li>
                  ))}
                </ul>
                <div className="absolute bottom-0 left-0 h-[2px] bg-gmo-green w-0 group-hover:w-full transition-all duration-500" />
              </motion.div>
            ))}
          </div>

          {/* Impact Stats */}
          <div ref={statsRef} className="bg-obsidian rounded-2xl p-10 lg:p-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              className="text-center mb-12"
            >
              <p className="font-heading text-xs uppercase tracking-[0.3em] text-gmo-green/70 mb-3">Impact mesuré</p>
              <h3 className="font-heading text-2xl lg:text-3xl font-bold text-concrete">
                NOTRE <span className="text-gmo-green">IMPACT RSE</span> EN CHIFFRES
              </h3>
            </motion.div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {IMPACT_STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={statsInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl mb-3">{s.icon}</div>
                  <p className="font-heading text-3xl lg:text-4xl font-black text-gmo-green mb-2">{s.value}</p>
                  <p className="font-body text-xs text-concrete/45 uppercase tracking-wide">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}