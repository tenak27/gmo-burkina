import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase, MapPin, ChevronRight, Star, TrendingUp,
  Heart, Send, GraduationCap, ArrowLeft, Users, CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const TEAM_PHOTOS = [
  { src: "https://gmobfaso.com/assets/img/a-propos/a-propos-1.jpg", label: "PDG Hama TRAORE", role: "Président Directeur Général" },
  { src: "https://gmobfaso.com/assets/img/a-propos/a-propos-2.jpg", label: "Siège Social", role: "Ouagadougou, Burkina Faso" },
  { src: "https://gmobfaso.com/assets/img/a-propos/a-propos-3.jpg", label: "Équipe Commerciale", role: "Qualité & Service Client" },
  { src: "https://gmobfaso.com/assets/img/a-propos/a-propos-4.jpg", label: "RSE & Engagement", role: "Responsabilité Sociétale" },
  { src: "https://gmobfaso.com/assets/img/a-propos/a-propos-5.jpg", label: "Innovation", role: "Logistique & Digitalisation" },
  { src: "https://gmobfaso.com/assets/img/a-propos/a-propos-6.jpg", label: "Nos Valeurs", role: "Équité & Confiance" },
];

const JOB_OFFERS = [
  {
    title: "Commercial Terrain",
    department: "Commercial & Ventes",
    location: "Ouagadougou, BF",
    type: "CDI",
    icon: "💼",
    description: "Développement du portefeuille clients, prospection terrain et suivi des commandes dans votre zone géographique assignée.",
    skills: ["Négociation", "Connaissance terrain", "Rigueur"],
    urgent: true,
  },
  {
    title: "Chauffeur Livreur",
    department: "Logistique & Transport",
    location: "Ouagadougou / Bobo-Dioulasso",
    type: "CDI",
    icon: "🚛",
    description: "Livraison des commandes chez les clients dans le respect des délais, maintenance de premier niveau du véhicule.",
    skills: ["Permis C", "Ponctualité", "Sens du service"],
    urgent: true,
  },
  {
    title: "Gestionnaire de Stock",
    department: "Entrepôts & Logistique",
    location: "Ouagadougou, BF",
    type: "CDD",
    icon: "📦",
    description: "Gestion des entrées/sorties de stock, inventaires périodiques et coordination avec les équipes commerciales.",
    skills: ["Gestion stocks", "ERP/Logiciels", "Organisation"],
    urgent: false,
  },
  {
    title: "Comptable Junior",
    department: "Finance & Comptabilité",
    location: "Ouagadougou, BF",
    type: "CDI",
    icon: "📊",
    description: "Saisie comptable, rapprochements bancaires, participation aux clôtures mensuelles et déclarations fiscales.",
    skills: ["Comptabilité SYSCOHADA", "Excel", "Rigueur"],
    urgent: false,
  },
  {
    title: "Stage Développement Web",
    department: "Informatique & Digital",
    location: "Ouagadougou, BF",
    type: "Stage",
    icon: "💻",
    description: "Participation au développement et à la maintenance des outils digitaux internes (ERP, site web, applications mobiles).",
    skills: ["React / JS", "HTML/CSS", "Dynamisme"],
    urgent: false,
  },
  {
    title: "Assistant(e) RH",
    department: "Ressources Humaines",
    location: "Ouagadougou, BF",
    type: "CDD",
    icon: "👥",
    description: "Gestion administrative du personnel, suivi des présences, recrutement et participation à la formation interne.",
    skills: ["Droit du travail", "Communication", "Discrétion"],
    urgent: false,
  },
];

const WHY_GMO = [
  { icon: TrendingUp, title: "Croissance rapide", desc: "Un groupe en pleine expansion avec des perspectives d'évolution réelles" },
  { icon: Heart, title: "Ambiance humaine", desc: "Culture d'entreprise fondée sur le respect, la solidarité et la bonne humeur" },
  { icon: GraduationCap, title: "Formation continue", desc: "Développez vos compétences grâce à nos programmes de formation interne" },
  { icon: Star, title: "Impact local", desc: "Contribuez à l'économie burkinabè et au rayonnement d'une entreprise citoyenne" },
  { icon: Users, title: "Équipe soudée", desc: "Plus de 50 collaborateurs unis autour d'une mission commune" },
  { icon: CheckCircle, title: "Avantages sociaux", desc: "CNSS, congés payés et couverture santé pour tous nos employés" },
];

const TYPE_COLORS = {
  CDI: "text-gmo-green bg-gmo-green/10 border-gmo-green/20",
  CDD: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  Stage: "text-amber-500 bg-amber-500/10 border-amber-500/20",
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] } }),
};

export default function Careers() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="min-h-screen bg-obsidian overflow-x-hidden">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-[70vh] flex items-center pt-24 pb-16 overflow-hidden">
        {/* Animated background blobs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.12, 0.05] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-10 w-[600px] h-[600px] bg-gmo-green rounded-full blur-[120px] pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.04, 0.08, 0.04] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gmo-red rounded-full blur-[100px] pointer-events-none"
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 w-full">
          <motion.div initial="hidden" animate="visible">
            <motion.div variants={fadeUp} custom={0}>
              <Link to="/" className="inline-flex items-center gap-2 text-concrete/35 hover:text-gmo-green transition-colors font-body text-sm mb-10">
                <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
              </Link>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <motion.span variants={fadeUp} custom={1} className="font-body text-xs uppercase tracking-[0.35em] text-gmo-red block mb-5">
                  Recrutement — Rejoindre GMO
                </motion.span>
                <motion.h1 variants={fadeUp} custom={2} className="font-heading text-5xl lg:text-7xl font-bold text-concrete leading-[0.9] mb-8">
                  REJOINDRE<br />
                  <span className="text-gmo-green">L'ÉQUIPE</span><br />
                  GMO
                </motion.h1>
                <motion.p variants={fadeUp} custom={3} className="font-body text-base text-concrete/50 leading-relaxed mb-10 max-w-md">
                  Vous êtes ambitieux, dynamique et souhaitez contribuer au développement d'un groupe leader en Afrique de l'Ouest ? Découvrez nos opportunités.
                </motion.p>
                <motion.div variants={fadeUp} custom={4} className="flex flex-wrap gap-4">
                  <a href="#offres" onClick={e => { e.preventDefault(); document.querySelector('#offres')?.scrollIntoView({ behavior: 'smooth' }); }}
                    className="flex items-center gap-2 bg-gmo-green text-white font-heading font-bold text-sm px-7 py-3.5 rounded-xl btn-glow-green">
                    <Briefcase className="w-4 h-4" /> Voir les offres
                  </a>
                  <a href="mailto:rh@gmoburkina.com?subject=Candidature Spontanée"
                    className="flex items-center gap-2 border border-white/15 text-concrete/60 font-heading font-bold text-sm px-7 py-3.5 rounded-xl hover:border-white/30 hover:text-white transition-all">
                    <Send className="w-4 h-4" /> Candidature spontanée
                  </a>
                </motion.div>
              </div>

              {/* Photo grid */}
              <motion.div variants={fadeUp} custom={3} className="grid grid-cols-3 gap-2">
                {TEAM_PHOTOS.map((photo, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                    className={`relative overflow-hidden group cursor-default ${i === 0 ? "col-span-2 row-span-2" : ""}`}
                  >
                    <div className={`${i === 0 ? "aspect-square" : "aspect-square"} bg-obsidian/50`}>
                      <img src={photo.src} alt={photo.label}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="font-heading text-xs font-bold text-white leading-tight">{photo.label}</p>
                        <p className="font-body text-[9px] text-white/60 mt-0.5">{photo.role}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── PDG QUOTE ── */}
      <section className="bg-white/[0.03] border-y border-white/[0.06] py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-6 border-2 border-gmo-green/40">
              <img src="https://gmobfaso.com/assets/img/a-propos/a-propos-1.jpg" alt="PDG" className="w-full h-full object-cover object-top" />
            </div>
            <blockquote className="font-body text-lg text-concrete/70 italic leading-relaxed mb-6 max-w-2xl mx-auto">
              "Je suis ravi de vous souhaiter la bienvenue au sein de GMO. Notre entreprise est engagée dans l'excellence et l'innovation. Nous sommes convaincus que vous trouverez ici un environnement stimulant où votre talent sera valorisé."
            </blockquote>
            <p className="font-heading text-sm font-bold text-concrete">Hama TRAORE</p>
            <p className="font-body text-xs text-gmo-green/70 uppercase tracking-widest mt-1">PDG — Groupe Madina Oumarou</p>
          </motion.div>
        </div>
      </section>

      {/* ── WHY GMO ── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <span className="font-body text-xs uppercase tracking-[0.3em] text-gmo-red block mb-3">Pourquoi nous rejoindre</span>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-concrete">CE QUI NOUS DISTINGUE</h2>
            <div className="w-14 h-[2px] bg-gmo-green mt-5" />
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {WHY_GMO.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="bg-white/[0.04] border border-white/8 rounded-2xl p-6 hover:border-gmo-green/30 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-gmo-green/10 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-gmo-green" />
                </div>
                <p className="font-heading text-sm font-bold text-concrete mb-2">{item.title}</p>
                <p className="font-body text-xs text-concrete/40 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── JOB OFFERS ── */}
      <section id="offres" className="bg-white/[0.02] border-t border-white/[0.06] py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <span className="font-body text-xs uppercase tracking-[0.3em] text-gmo-red block mb-3">Postes disponibles</span>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-concrete">NOS OFFRES D'EMPLOI</h2>
            <div className="w-14 h-[2px] bg-gmo-green mt-5" />
            <p className="font-body text-sm text-concrete/40 mt-4">{JOB_OFFERS.length} postes à pourvoir</p>
          </motion.div>

          <div className="space-y-3 mb-14">
            {JOB_OFFERS.map((job, i) => (
              <motion.div
                key={job.title}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                className="bg-white/[0.04] border border-white/8 hover:border-gmo-green/40 rounded-2xl transition-all duration-300"
              >
                <button
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  className="w-full flex items-center gap-4 p-5 text-left"
                >
                  <div className="text-2xl flex-shrink-0 w-10 text-center">{job.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <p className="font-heading text-sm font-bold text-concrete">{job.title}</p>
                      {job.urgent && (
                        <span className="text-[9px] font-heading uppercase tracking-widest text-gmo-red bg-gmo-red/10 border border-gmo-red/20 px-2 py-0.5 rounded-full animate-pulse">
                          🔴 Urgent
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-[11px] text-concrete/40 font-body">{job.department}</span>
                      <span className="flex items-center gap-1 text-[11px] text-concrete/35 font-body">
                        <MapPin className="w-3 h-3" />{job.location}
                      </span>
                      <span className={`text-[10px] font-heading border px-2.5 py-0.5 rounded-full ${TYPE_COLORS[job.type] || TYPE_COLORS.CDI}`}>{job.type}</span>
                    </div>
                  </div>
                  <motion.div animate={{ rotate: expanded === i ? 90 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronRight className="w-4 h-4 text-concrete/30 flex-shrink-0" />
                  </motion.div>
                </button>

                {expanded === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-5 pb-6 border-t border-white/8 pt-5"
                  >
                    <p className="font-body text-sm text-concrete/55 leading-relaxed mb-5">{job.description}</p>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {job.skills.map(s => (
                        <span key={s} className="text-[11px] font-body text-concrete/60 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                    <a
                      href={`mailto:rh@gmoburkina.com?subject=Candidature — ${job.title}`}
                      className="inline-flex items-center gap-2 bg-gmo-green text-white font-heading font-bold text-xs px-6 py-3 rounded-xl btn-glow-green hover:bg-gmo-green/80 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" /> Postuler maintenant
                    </a>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Spontaneous */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden bg-gradient-to-br from-gmo-green/15 via-gmo-green/8 to-transparent border border-gmo-green/25 rounded-2xl p-8 lg:p-10 flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div className="absolute right-0 top-0 w-48 h-48 bg-gmo-green/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <p className="font-heading text-xl font-bold text-concrete mb-2">Candidature spontanée</p>
              <p className="font-body text-sm text-concrete/50 max-w-md">Votre profil ne correspond pas aux offres actuelles ? Envoyez-nous votre CV, nous gardons les profils intéressants pour nos prochains recrutements.</p>
            </div>
            <a
              href="mailto:rh@gmoburkina.com?subject=Candidature Spontanée — GMO Burkina"
              className="relative z-10 flex-shrink-0 flex items-center gap-2 bg-gmo-green text-white font-heading font-bold text-sm px-7 py-4 rounded-xl btn-glow-green"
            >
              <Briefcase className="w-4 h-4" /> Envoyer mon CV
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}