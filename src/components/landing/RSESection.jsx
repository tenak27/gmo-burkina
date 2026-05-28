import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Leaf, Heart, Users, Sun, Recycle, HandHeart, GraduationCap, Building2 } from "lucide-react";

function RSECard3D({ pillar, index, isInView }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08 }}
      className="relative"
      style={{ perspective: "1000px", height: "340px" }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div
        className="w-full h-full relative transition-transform duration-700"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* FRONT FACE */}
        <div
          className={`absolute inset-0 bg-white border ${pillar.border} rounded-2xl p-7 shadow-sm`}
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
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
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-[9px] font-body text-obsidian/30 uppercase tracking-wider">Survolez →</span>
          </div>
        </div>

        {/* BACK FACE (rotated 180deg) */}
        <div
          className={`absolute inset-0 ${pillar.bg.replace('/10', '/90')} ${pillar.color.replace('text-', 'bg-').replace('400', '500').replace('gmo-green', 'gmo-green')} rounded-2xl p-7 flex flex-col items-center justify-center text-center border ${pillar.border} shadow-2xl`}
          style={{ 
            backfaceVisibility: "hidden", 
            WebkitBackfaceVisibility: "hidden", 
            transform: "rotateY(180deg)",
            background: pillar.category === "Environnement" ? "linear-gradient(135deg, #059669 0%, #047857 100%)" :
                       pillar.category === "Éducation" ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" :
                       pillar.category === "Social" ? "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)" :
                       pillar.category === "Emploi" ? "linear-gradient(135deg, #16a34a 0%, #15803d 100%)" :
                       pillar.category === "Énergie" ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" :
                       "linear-gradient(135deg, #a855f7 0%, #9333ea 100%)"
          }}
        >
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
            <pillar.icon className="w-8 h-8 text-white" />
          </div>
          <h4 className="font-heading text-lg font-black text-white mb-3">{pillar.category}</h4>
          <div className="w-12 h-[2px] bg-white/40 mb-4" />
          <p className="font-body text-sm text-white/90 leading-relaxed mb-4">{pillar.title}</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {pillar.actions.slice(0, 2).map((action, j) => (
              <span key={j} className="text-[10px] font-body text-white/80 bg-white/15 px-3 py-1.5 rounded-full">
                {action}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

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

          {/* Pillars grid 3D flip */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {RSE_PILLARS.map((pillar, i) => (
              <RSECard3D key={pillar.category} pillar={pillar} index={i} isInView={isInView} />
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