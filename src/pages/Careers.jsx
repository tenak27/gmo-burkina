import React, { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, MapPin, ChevronRight, Star, TrendingUp, Users, Heart, Send, GraduationCap, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const JOB_OFFERS = [
  {
    title: "Commercial Terrain",
    department: "Commercial & Ventes",
    location: "Ouagadougou, BF",
    type: "CDI",
    level: "Junior / Confirmé",
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
    level: "Expérimenté",
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
    level: "Confirmé",
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
    level: "Junior",
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
    level: "Étudiant",
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
    level: "Junior",
    icon: "👥",
    description: "Gestion administrative du personnel, suivi des présences, recrutement et participation à la formation interne.",
    skills: ["Droit du travail", "Communication", "Discrétion"],
    urgent: false,
  },
];

const WHY_GMO = [
  { icon: TrendingUp, title: "Croissance rapide", desc: "Rejoignez un groupe en pleine expansion avec des perspectives d'évolution réelles" },
  { icon: Heart, title: "Ambiance humaine", desc: "Une culture d'entreprise fondée sur le respect, la solidarité et la bonne humeur" },
  { icon: GraduationCap, title: "Formation continue", desc: "Développez vos compétences grâce à nos programmes de formation interne" },
  { icon: Star, title: "Impact local", desc: "Contribuez à l'économie burkinabè et au rayonnement d'une entreprise citoyenne" },
];

const TYPE_COLORS = {
  CDI: "text-gmo-green bg-gmo-green/10 border-gmo-green/20",
  CDD: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  Stage: "text-amber-500 bg-amber-500/10 border-amber-500/20",
};

export default function Careers() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="min-h-screen bg-obsidian">
      <Navbar />

      {/* Hero banner */}
      <div className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gmo-green/10 via-transparent to-gmo-red/5 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gmo-green/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-concrete/40 hover:text-gmo-green transition-colors font-body text-sm mb-8">
            <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
          </Link>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="font-body text-xs uppercase tracking-[0.3em] text-gmo-red block mb-4">Recrutement</span>
            <h1 className="font-heading text-4xl lg:text-6xl font-bold text-concrete leading-tight mb-6">
              REJOINDRE
              <br />
              <span className="text-gmo-green">L'ÉQUIPE GMO</span>
            </h1>
            <p className="font-body text-base text-concrete/50 max-w-2xl leading-relaxed">
              Vous êtes ambitieux, dynamique et souhaitez contribuer au développement d'un groupe leader en Afrique de l'Ouest ? Découvrez nos opportunités de carrière.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-24">
        {/* Why GMO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16"
        >
          {WHY_GMO.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="bg-white/[0.04] border border-white/8 rounded-xl p-5 text-center hover:border-gmo-green/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-gmo-green/10 flex items-center justify-center mx-auto mb-3">
                <item.icon className="w-5 h-5 text-gmo-green" />
              </div>
              <p className="font-heading text-sm font-bold text-concrete mb-1.5">{item.title}</p>
              <p className="font-body text-[11px] text-concrete/40 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Job offers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-gmo-green/70 mb-6">
            Offres d'emploi actuelles ({JOB_OFFERS.length})
          </p>
          <div className="space-y-3">
            {JOB_OFFERS.map((job, i) => (
              <motion.div
                key={job.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.07 }}
                className="bg-white/[0.04] border border-white/8 hover:border-gmo-green/30 rounded-xl transition-all duration-300"
              >
                <button
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  className="w-full flex items-center gap-4 p-5 text-left"
                >
                  <div className="text-2xl flex-shrink-0">{job.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-heading text-sm font-bold text-concrete">{job.title}</p>
                      {job.urgent && (
                        <span className="text-[9px] font-heading uppercase tracking-widest text-gmo-red bg-gmo-red/10 border border-gmo-red/20 px-2 py-0.5 rounded-full">Urgent</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-[11px] text-concrete/40 font-body">{job.department}</span>
                      <span className="flex items-center gap-1 text-[11px] text-concrete/35 font-body">
                        <MapPin className="w-3 h-3" />{job.location}
                      </span>
                      <span className={`text-[10px] font-heading border px-2 py-0.5 rounded-full ${TYPE_COLORS[job.type] || TYPE_COLORS.CDI}`}>{job.type}</span>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-concrete/30 transition-transform flex-shrink-0 ${expanded === i ? "rotate-90" : ""}`} />
                </button>
                {expanded === i && (
                  <div className="px-5 pb-5 border-t border-white/8 pt-4">
                    <p className="font-body text-xs text-concrete/55 leading-relaxed mb-4">{job.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.map(s => (
                        <span key={s} className="text-[10px] font-body text-concrete/60 bg-white/5 border border-white/8 px-3 py-1 rounded-full">{s}</span>
                      ))}
                    </div>
                    <a
                      href={`mailto:rh@gmoburkina.com?subject=Candidature — ${job.title}`}
                      className="inline-flex items-center gap-2 bg-gmo-green text-white font-heading font-bold text-xs px-5 py-2.5 rounded-lg btn-glow-green"
                    >
                      <Send className="w-3.5 h-3.5" /> Postuler maintenant
                    </a>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Spontaneous application */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-gmo-green/15 to-gmo-green/5 border border-gmo-green/25 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div>
            <p className="font-heading text-lg font-bold text-concrete mb-1">Candidature spontanée</p>
            <p className="font-body text-sm text-concrete/50">Votre profil ne correspond pas aux offres actuelles ? Envoyez-nous votre CV.</p>
          </div>
          <a
            href="mailto:rh@gmoburkina.com?subject=Candidature Spontanée — GMO Burkina"
            className="flex-shrink-0 flex items-center gap-2 bg-gmo-green text-white font-heading font-bold text-sm px-6 py-3 rounded-xl btn-glow-green"
          >
            <Briefcase className="w-4 h-4" /> Envoyer mon CV
          </a>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}