import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, Users, TrendingUp, Award, ChevronRight } from "lucide-react";

const EXECUTIVE_BOARD = [
{
  name: "Hama TRAORE",
  title: "Président Directeur Général",
  role: "PDG",
  description: "Fondateur et visionnaire du Groupe Madina Oumarou, Hama TRAORE pilote la stratégie de croissance du groupe depuis sa création avec plus de 15 ans d'expertise en distribution.",
  image: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/54507cccd_a-propos-1.jpg",
  color: "#1A7A2E",
  tag: "Fondateur"
},
{
  name: "Directeur Commercial",
  title: "Directeur Commercial",
  role: "DC",
  description: "En charge du développement des ventes, de la relation client et de l'expansion du réseau de distribution à travers le Burkina Faso.",
  image: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/7966bc145_a-propos-3.jpg",
  color: "#CC1717",
  tag: "Ventes & Croissance"
},
{
  name: "Directeur des Opérations",
  title: "Directeur des Opérations",
  role: "DOL",
  description: "Pilote l'ensemble de la chaîne logistique, des entrepôts à la livraison finale, en garantissant efficacité et respect des délais.",
  image: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/ffdae3761_a-propos-6.jpg",
  color: "#1A7A2E",
  tag: "Logistique & Ops"
}];


const OPERATIONAL_TEAM = [
{
  dept: "Commercial & Ventes",
  icon: "💼",
  count: "12+",
  desc: "Commerciaux terrain couvrant l'ensemble du territoire national",
  kpi: "150+ clients actifs",
  color: "from-blue-500/10 to-blue-600/5",
  border: "border-blue-200/60"
},
{
  dept: "Logistique & Transport",
  icon: "🚛",
  count: "25+",
  desc: "Chauffeurs et agents logistiques dédiés à la livraison rapide",
  kpi: "98% taux de livraison",
  color: "from-gmo-green/10 to-gmo-green/5",
  border: "border-gmo-green/20"
},
{
  dept: "Entrepôts & Stock",
  icon: "📦",
  count: "8+",
  desc: "Magasiniers et gestionnaires de stock qualifiés et certifiés",
  kpi: "3 entrepôts gérés",
  color: "from-amber-500/10 to-amber-600/5",
  border: "border-amber-200/60"
},
{
  dept: "Finance & Comptabilité",
  icon: "📊",
  count: "5+",
  desc: "Experts financiers et comptables certifiés OHADA",
  kpi: "Conformité totale",
  color: "from-purple-500/10 to-purple-600/5",
  border: "border-purple-200/60"
},
{
  dept: "Ressources Humaines",
  icon: "👥",
  count: "3+",
  desc: "Spécialistes RH au service des 60+ collaborateurs du groupe",
  kpi: "60+ collaborateurs",
  color: "from-pink-500/10 to-pink-600/5",
  border: "border-pink-200/60"
},
{
  dept: "Informatique & Digital",
  icon: "💻",
  count: "4+",
  desc: "Ingénieurs et développeurs pour la transformation digitale",
  kpi: "Plateforme digitale live",
  color: "from-cyan-500/10 to-cyan-600/5",
  border: "border-cyan-200/60"
}];


const STATS = [
{ value: "60+", label: "Collaborateurs", icon: Users },
{ value: "40+", label: "Années d'expérience", icon: Award },
{ value: "98%", label: "Satisfaction client", icon: TrendingUp }];


function ExecutiveCard({ person, index, isInView }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-default"
      style={{ border: `1px solid ${person.color}22` }}>
      
      {/* Top color accent */}
      <div className="h-1 w-full" style={{ background: person.color }} />

      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-gray-100">
        <img
          src={person.image}
          alt={person.name}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
        
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 via-transparent to-transparent" />
        {/* Role badge */}
        <div className="absolute bottom-3 left-3">
          <span
            className="font-heading text-[11px] font-black text-white px-3 py-1 rounded-full uppercase tracking-widest"
            style={{ background: person.color }}>
            
            {person.role}
          </span>
        </div>
        {/* Tag top right */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-0.5">
          <span className="text-[10px] font-body text-obsidian/60 uppercase tracking-widest">{person.tag}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="font-heading text-base font-black text-obsidian mb-0.5 leading-tight">{person.name}</p>
        <p className="font-body text-xs font-medium mb-3" style={{ color: person.color }}>{person.title}</p>
        <p className="font-body text-xs text-obsidian/50 leading-relaxed">{person.description}</p>

        {/* Hover CTA */}
        <motion.div
          animate={{ height: hovered ? "auto" : 0, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden mt-0">
          
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-obsidian/25" />
            <span className="text-[10px] text-obsidian/35 font-body">contact@gmobfaso.com</span>
          </div>
        </motion.div>
      </div>
    </motion.div>);

}

export default function TeamSection() {
  const execRef = useRef(null);
  const teamRef = useRef(null);
  const statsRef = useRef(null);
  const execInView = useInView(execRef, { once: true, margin: "-80px" });
  const teamInView = useInView(teamRef, { once: true, margin: "-80px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-60px" });

  return (
    <section id="equipe" className="overflow-hidden">

      {/* ── EXECUTIVE BOARD ── */}
      <div ref={execRef} className="bg-light-gray py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={execInView ? { opacity: 1, y: 0 } : {}}
            className="mb-14">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-[2px] bg-gmo-green" />
              <span className="font-body text-xs uppercase tracking-[0.3em] text-gmo-green">Direction Générale</span>
            </div>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <h2 className="font-heading text-4xl lg:text-5xl font-bold text-obsidian">
                  EXECUTIVE<br />
                  <span className="text-gmo-green">BOARD</span>
                </h2>
                <div className="h-1 w-20 bg-gradient-to-r from-gmo-green to-transparent mt-5 rounded-full" />
              </div>
              <p className="font-body text-sm text-obsidian/50 max-w-xs leading-relaxed">
                L'équipe de direction qui pilote la stratégie et la croissance du <span className="text-obsidian font-semibold">Groupe Madina Oumarou</span> depuis plus de 15 ans.
              </p>
            </div>
          </motion.div>

          {/* Executive cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {EXECUTIVE_BOARD.map((person, i) =>
            <ExecutiveCard key={person.name} person={person} index={i} isInView={execInView} />
            )}
          </div>

          {/* Stats row */}
          <motion.div
            ref={statsRef}
            initial={{ opacity: 0, y: 30 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            className="mt-16 grid grid-cols-3 gap-4 md:gap-6">
            {STATS.map((stat, i) =>
            <div key={stat.label} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 bg-gmo-green/10 rounded-xl flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-gmo-green" />
                  </div>
                </div>
                <p className="font-heading text-3xl lg:text-4xl font-bold text-obsidian">{stat.value}</p>
                <p className="font-body text-xs uppercase tracking-widest text-obsidian/50 mt-2">{stat.label}</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      

































































      

      {/* ── OPERATIONAL TEAM ── */}
      <div ref={teamRef} className="bg-obsidian py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={teamInView ? { opacity: 1, y: 0 } : {}}
            className="mb-14">
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-[2px] bg-gmo-green" />
              <span className="font-body text-xs uppercase tracking-[0.3em] text-gmo-green/70">Organisation interne</span>
            </div>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <h3 className="font-heading text-4xl lg:text-5xl font-bold text-concrete">
                  ÉQUIPE<br />
                  <span className="text-gmo-green">OPÉRATIONNELLE</span>
                </h3>
                <div className="h-1 w-20 bg-gradient-to-r from-gmo-green to-transparent mt-5 rounded-full" />
              </div>
              <p className="font-body text-sm text-concrete/40 max-w-xs leading-relaxed">
                Plus de <span className="text-white font-semibold">60 collaborateurs</span> passionnés, organisés en départements spécialisés pour vous servir chaque jour.
              </p>
            </div>
          </motion.div>

          {/* Dept cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {OPERATIONAL_TEAM.map((dept, i) =>
            <motion.div
              key={dept.dept}
              initial={{ opacity: 0, y: 24 }}
              animate={teamInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.09, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className={`group bg-gradient-to-br ${dept.color} border ${dept.border} rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-300`}>
              
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-3xl flex-shrink-0 w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    {dept.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                      <p className="font-heading text-sm font-bold text-concrete leading-tight">{dept.dept}</p>
                      <span className="font-heading text-xs font-black text-gmo-green bg-gmo-green/15 border border-gmo-green/25 px-2.5 py-0.5 rounded-full flex-shrink-0">
                        {dept.count}
                      </span>
                    </div>
                    <p className="font-body text-[11px] text-concrete/40 leading-relaxed">{dept.desc}</p>
                  </div>
                </div>

                {/* KPI row */}
                <div className="flex items-center justify-between pt-3 border-t border-white/8">
                  <span className="text-[10px] font-body text-concrete/30 uppercase tracking-widest">Indicateur clé</span>
                  <div className="flex items-center gap-1 text-gmo-green">
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-[11px] font-heading font-bold">{dept.kpi}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={teamInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.7 }}
            className="mt-12 bg-white/[0.04] border border-white/8 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-5">
            
            <div>
              <p className="font-heading text-base font-bold text-concrete mb-1">Vous souhaitez rejoindre l'équipe ?</p>
              <p className="font-body text-xs text-concrete/40">Découvrez nos opportunités de carrière et postulez dès aujourd'hui.</p>
            </div>
            <a
              href="/carrieres"
              className="flex-shrink-0 flex items-center gap-2 bg-gmo-green text-white font-heading font-bold text-sm px-6 py-3 rounded-xl hover:bg-gmo-green/80 transition-colors">
              
              Voir les offres <ChevronRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>);

}