import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, Users, TrendingUp, Award, ChevronRight } from "lucide-react";

function OperationalCard({ dept, index, isInView }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: index * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl cursor-default group"
      style={{ height: "320px" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Background image with Ken Burns */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out"
        style={{
          backgroundImage: `url(${dept.bgImage})`,
          transform: hovered ? "scale(1.12)" : "scale(1.03)",
        }}
      />

      {/* Permanent rich gradient — bottom heavy */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.25) 35%, rgba(0,0,0,0.82) 72%, rgba(0,0,0,0.97) 100%)"
      }} />

      {/* Accent color wash on hover */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: hovered ? 0.22 : 0,
          background: `radial-gradient(ellipse at bottom left, ${dept.accent}FF 0%, transparent 70%)`,
        }}
      />

      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] transition-opacity duration-500"
        style={{ background: `linear-gradient(to right, ${dept.accent}, transparent)`, opacity: hovered ? 1 : 0.45 }}
      />

      {/* Top row — icon + count */}
      <div className="absolute top-5 left-5 right-5 flex items-start justify-between z-10">
        {/* Icon pill */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-2xl transition-all duration-500"
          style={{
            background: hovered ? `${dept.accent}CC` : "rgba(255,255,255,0.10)",
            backdropFilter: "blur(12px)",
            border: `1px solid ${hovered ? dept.accent + "80" : "rgba(255,255,255,0.15)"}`,
          }}
        >
          <span className="text-xl leading-none">{dept.icon}</span>
        </div>

        {/* Count badge */}
        <div
          className="flex items-center gap-1 px-3 py-1.5 rounded-full transition-all duration-500"
          style={{
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(10px)",
            border: `1px solid rgba(255,255,255,0.12)`,
          }}
        >
          <span className="font-heading text-sm font-black text-white leading-none">{dept.count}</span>
          <span className="font-body text-[10px] text-white/50 leading-none">pers.</span>
        </div>
      </div>

      {/* Bottom content panel */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-10">

        {/* Dept name */}
        <p className="font-heading text-base font-black text-white leading-tight mb-2 drop-shadow-md">
          {dept.dept}
        </p>

        {/* Description — slides in on hover */}
        <div
          className="overflow-hidden transition-all duration-500"
          style={{ maxHeight: hovered ? "72px" : "0px", opacity: hovered ? 1 : 0 }}
        >
          <p className="font-body text-xs text-white/60 leading-relaxed mb-3">
            {dept.desc}
          </p>
        </div>

        {/* KPI chip */}
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0 transition-all duration-500"
            style={{ background: dept.accent, boxShadow: hovered ? `0 0 8px ${dept.accent}` : "none" }}
          />
          <span
            className="font-heading text-[11px] font-bold transition-colors duration-500"
            style={{ color: hovered ? dept.accent : "rgba(255,255,255,0.55)" }}
          >
            {dept.kpi}
          </span>
        </div>

        {/* Bottom separator line that grows on hover */}
        <div
          className="mt-3 h-[1px] rounded-full transition-all duration-700 origin-left"
          style={{
            background: `linear-gradient(to right, ${dept.accent}, transparent)`,
            transform: hovered ? "scaleX(1)" : "scaleX(0)",
            opacity: hovered ? 0.7 : 0,
          }}
        />
      </div>

      {/* Corner number watermark */}
      <div
        className="absolute bottom-4 right-5 font-heading font-black text-white/5 select-none pointer-events-none transition-all duration-500"
        style={{ fontSize: "clamp(3rem, 5vw, 5rem)", opacity: hovered ? 0 : 1 }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>
    </motion.div>
  );
}

const EXECUTIVE_BOARD = [
{
  name: "Hama TRAORE",
  title: "Président Directeur Général",
  role: "PDG",
  description: "Fondateur et visionnaire du Groupe Madina Oumarou, Hama TRAORE pilote la stratégie de croissance du groupe depuis sa création avec plus de 40 ans d'expertise en distribution.",
  image: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/54507cccd_a-propos-1.jpg",
  color: "#1A7A2E",
  tag: "Fondateur"
},
{
  name: "Responsable Commercial",
  title: "Responsable Commercial",
  role: "RC",
  description: "En charge du développement des ventes, de la relation client et de l'expansion du réseau de distribution à travers le Burkina Faso.",
  image: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/7966bc145_a-propos-3.jpg",
  color: "#CC1717",
  tag: "Ventes & Croissance"
},
{
  name: "Responsable des Ventes",
  title: "Responsable des Ventes",
  role: "RV",
  description: "En charge de la gestion des équipes commerciales et du développement du portefeuille clients sur l'ensemble du territoire.",
  image: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/50ca5b66a_Capturedcran2026-05-2511424PM.png",
  color: "#1A7A2E",
  tag: "Équipe Commerciale"
}];


const OPERATIONAL_TEAM = [
{
  dept: "Direction Générale",
  icon: "👔",
  count: "3",
  desc: "PDG et direction exécutive pilotant la stratégie du groupe",
  kpi: "40+ ans d'expertise",
  accent: "#1A7A2E",
  bgImage: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/1a0a79b3c_Gemini_Generated_Image_b8kbkwb8kbkwb8kb.png"
},
{
  dept: "Commercial & Ventes",
  icon: "💼",
  count: "15+",
  desc: "Commerciaux terrain, responsables secteur et attachés commerciaux",
  kpi: "200+ clients actifs",
  accent: "#1d4ed8",
  bgImage: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=85"
},
{
  dept: "Logistique & Transport",
  icon: "🚛",
  count: "30+",
  desc: "Chauffeurs, coordinateurs logistiques et planificateurs de tournées",
  kpi: "25+ véhicules en service",
  accent: "#1A7A2E",
  bgImage: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&q=85"
},
{
  dept: "Entrepôts & Stock",
  icon: "📦",
  count: "12+",
  desc: "Magasiniers, caristes et gestionnaires de stock certifiés",
  kpi: "3 sites de stockage",
  accent: "#d97706",
  bgImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=85"
},
{
  dept: "Finance & Comptabilité",
  icon: "📊",
  count: "8+",
  desc: "DAF, comptables, auditeurs et contrôleurs de gestion OHADA",
  kpi: "Conformité 100%",
  accent: "#7c3aed",
  bgImage: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=85"
},
{
  dept: "Ressources Humaines",
  icon: "👥",
  count: "5+",
  desc: "DRH, chargés de recrutement et formation continue",
  kpi: "80+ collaborateurs",
  accent: "#be185d",
  bgImage: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=85"
},
{
  dept: "Informatique & Digital",
  icon: "💻",
  count: "6+",
  desc: "DSI, développeurs full-stack et administrateurs systèmes",
  kpi: "Plateforme 100% opérationnelle",
  accent: "#0891b2",
  bgImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=85"
},
{
  dept: "Marketing & Communication",
  icon: "📢",
  count: "4+",
  desc: "Chef de projet marketing, community managers et graphistes",
  kpi: "Présence multi-canaux",
  accent: "#CC1717",
  bgImage: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=85"
},
{
  dept: "Service Client",
  icon: "🎧",
  count: "6+",
  desc: "Conseillers clientèle et support après-vente dédiés",
  kpi: "98% satisfaction",
  accent: "#4f46e5",
  bgImage: "https://images.unsplash.com/photo-1553775927-a071d5a6a39a?w=800&q=85"
},
{
  dept: "Qualité & Sécurité",
  icon: "🛡️",
  count: "3+",
  desc: "Responsables QSE et auditeurs qualité certifiés",
  kpi: "Normes ISO respectées",
  accent: "#059669",
  bgImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=85"
},
{
  dept: "Achats & Approvisionnement",
  icon: "🛒",
  count: "4+",
  desc: "Buyers, négociateurs et gestionnaires de relations fournisseurs",
  kpi: "50+ fournisseurs partenaires",
  accent: "#0d9488",
  bgImage: "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=800&q=85"
}];


const STATS = [
{ value: "80+", label: "Collaborateurs", icon: Users },
{ value: "40+", label: "Années d'expérience", icon: Award },
{ value: "98%", label: "Satisfaction client", icon: TrendingUp },
{ value: "12", label: "Départements", icon: Users }];


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
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
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

          {/* Dept cards premium grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {OPERATIONAL_TEAM.map((dept, i) => (
              <OperationalCard key={dept.dept} dept={dept} index={i} isInView={teamInView} />
            ))}
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