import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, MapPin, ChevronRight, Star, TrendingUp,
  Heart, Send, GraduationCap, ArrowLeft, Users, CheckCircle,
  Upload, X, Phone, Mail, FileText, Clock, Award, Sparkles,
  ChevronDown
} from "lucide-react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

/* ── DATA ── */
const TEAM_PHOTOS = [
  { src: "https://gmobfaso.com/assets/img/a-propos/a-propos-1.jpg", label: "PDG Hama TRAORE", role: "Président Directeur Général" },
  { src: "https://gmobfaso.com/assets/img/a-propos/a-propos-3.jpg", label: "Équipe Commerciale", role: "Qualité & Service Client" },
  { src: "https://gmobfaso.com/assets/img/a-propos/a-propos-4.jpg", label: "RSE & Engagement", role: "Responsabilité Sociétale" },
  { src: "https://gmobfaso.com/assets/img/a-propos/a-propos-5.jpg", label: "Innovation & Logistique", role: "Digitalisation" },
  { src: "https://gmobfaso.com/assets/img/a-propos/a-propos-6.jpg", label: "Nos Valeurs", role: "Équité & Confiance" },
  { src: "https://gmobfaso.com/assets/img/a-propos/a-propos-2.jpg", label: "Siège Social GMO", role: "Ouagadougou, Burkina Faso" },
];

const JOB_OFFERS = [
  { title: "Commercial Terrain", department: "Commercial & Ventes", location: "Ouagadougou, BF", type: "CDI", icon: "💼", description: "Développement du portefeuille clients, prospection terrain et suivi des commandes dans votre zone géographique assignée.", skills: ["Négociation", "Connaissance terrain", "Rigueur", "Sens du service"], urgent: true },
  { title: "Chauffeur Livreur", department: "Logistique & Transport", location: "Ouagadougou / Bobo-Dioulasso", type: "CDI", icon: "🚛", description: "Livraison des commandes chez les clients dans le respect des délais, maintenance de premier niveau du véhicule.", skills: ["Permis C", "Ponctualité", "Sens du service", "Connaissance des routes"], urgent: true },
  { title: "Gestionnaire de Stock", department: "Entrepôts & Logistique", location: "Ouagadougou, BF", type: "CDD", icon: "📦", description: "Gestion des entrées/sorties de stock, inventaires périodiques et coordination avec les équipes commerciales.", skills: ["Gestion stocks", "ERP/Logiciels", "Organisation"], urgent: false },
  { title: "Comptable Junior", department: "Finance & Comptabilité", location: "Ouagadougou, BF", type: "CDI", icon: "📊", description: "Saisie comptable, rapprochements bancaires, participation aux clôtures mensuelles et déclarations fiscales.", skills: ["Comptabilité SYSCOHADA", "Excel", "Rigueur"], urgent: false },
  { title: "Stage Développement Web", department: "Informatique & Digital", location: "Ouagadougou, BF", type: "Stage", icon: "💻", description: "Participation au développement et à la maintenance des outils digitaux internes (ERP, site web, applications mobiles).", skills: ["React / JS", "HTML/CSS", "Dynamisme"], urgent: false },
  { title: "Assistant(e) RH", department: "Ressources Humaines", location: "Ouagadougou, BF", type: "CDD", icon: "👥", description: "Gestion administrative du personnel, suivi des présences, recrutement et participation à la formation interne.", skills: ["Droit du travail", "Communication", "Discrétion"], urgent: false },
];

const WHY_GMO = [
  { icon: TrendingUp, title: "Croissance rapide", desc: "Un groupe en pleine expansion avec des perspectives d'évolution réelles" },
  { icon: Heart, title: "Ambiance humaine", desc: "Culture d'entreprise fondée sur le respect, la solidarité et la bonne humeur" },
  { icon: GraduationCap, title: "Formation continue", desc: "Développez vos compétences grâce à nos programmes de formation interne" },
  { icon: Star, title: "Impact local", desc: "Contribuez à l'économie burkinabè et au rayonnement d'une entreprise citoyenne" },
  { icon: Users, title: "Équipe soudée", desc: "Plus de 50 collaborateurs unis autour d'une mission commune" },
  { icon: Award, title: "Avantages sociaux", desc: "CNSS, congés payés et couverture santé pour tous nos employés" },
];

const PROCESS = [
  { step: "01", icon: FileText, title: "Candidature en ligne", desc: "Remplissez le formulaire et joignez votre CV directement sur cette page" },
  { step: "02", icon: Clock, title: "Étude du dossier", desc: "Notre équipe RH analyse votre profil sous 5 jours ouvrés" },
  { step: "03", icon: Phone, title: "Entretien RH", desc: "Un premier appel téléphonique pour mieux vous connaître" },
  { step: "04", icon: Users, title: "Entretien final", desc: "Rencontre avec le responsable du département concerné" },
  { step: "05", icon: CheckCircle, title: "Intégration", desc: "Bienvenue dans l'équipe ! Un programme d'onboarding vous attend" },
];

const TYPE_COLORS = {
  CDI: "text-gmo-green bg-gmo-green/10 border-gmo-green/25",
  CDD: "text-blue-400 bg-blue-500/10 border-blue-500/25",
  Stage: "text-amber-400 bg-amber-500/10 border-amber-500/25",
};

/* ── APPLICATION FORM ── */
function ApplicationModal({ job, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", cv_url: "" });
  const [cvFile, setCvFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCvFile(file.name);
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(f => ({ ...f, cv_url: file_url }));
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await base44.integrations.Core.SendEmail({
      to: "rh@gmoburkina.com",
      from_name: "GMO Carrières",
      subject: `Candidature — ${job?.title || "Candidature Spontanée"}`,
      body: `
Nouvelle candidature reçue via le site GMO.

Poste : ${job?.title || "Candidature spontanée"}
Nom : ${form.name}
Email : ${form.email}
Téléphone : ${form.phone}
Message : ${form.message}
CV : ${form.cv_url || "Non fourni"}
      `.trim(),
    });
    setSubmitting(false);
    setDone(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/80 backdrop-blur-sm p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 30 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="bg-[#141416] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-gmo-green/20 to-transparent border-b border-white/8 px-6 py-5 flex items-start justify-between">
          <div>
            <p className="font-body text-xs uppercase tracking-widest text-gmo-green mb-1">Postuler</p>
            <h3 className="font-heading text-lg font-bold text-concrete">{job?.title || "Candidature Spontanée"}</h3>
            {job && <p className="font-body text-xs text-concrete/40 mt-0.5">{job.department} · {job.location}</p>}
          </div>
          <button onClick={onClose} className="text-concrete/30 hover:text-white transition-colors mt-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {done ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 rounded-full bg-gmo-green/15 border border-gmo-green/30 flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-8 h-8 text-gmo-green" />
              </div>
              <h4 className="font-heading text-xl font-bold text-concrete mb-3">Candidature envoyée !</h4>
              <p className="font-body text-sm text-concrete/50 leading-relaxed mb-6">
                Merci <strong className="text-concrete/70">{form.name}</strong> ! Notre équipe RH vous contactera dans les 5 jours ouvrés.
              </p>
              <button onClick={onClose} className="bg-gmo-green text-white font-heading font-bold text-sm px-6 py-3 rounded-xl btn-glow-green">
                Fermer
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs text-concrete/50 block mb-1.5">Nom complet *</label>
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-concrete placeholder-concrete/25 focus:outline-none focus:border-gmo-green/50 transition-colors"
                    placeholder="Votre nom" />
                </div>
                <div>
                  <label className="font-body text-xs text-concrete/50 block mb-1.5">Téléphone *</label>
                  <input required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-concrete placeholder-concrete/25 focus:outline-none focus:border-gmo-green/50 transition-colors"
                    placeholder="+226 XX XX XX XX" />
                </div>
              </div>
              <div>
                <label className="font-body text-xs text-concrete/50 block mb-1.5">Adresse email *</label>
                <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-concrete placeholder-concrete/25 focus:outline-none focus:border-gmo-green/50 transition-colors"
                  placeholder="votre@email.com" />
              </div>
              <div>
                <label className="font-body text-xs text-concrete/50 block mb-1.5">Lettre de motivation</label>
                <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-concrete placeholder-concrete/25 focus:outline-none focus:border-gmo-green/50 transition-colors resize-none"
                  placeholder="Présentez-vous brièvement et expliquez votre motivation..." />
              </div>
              <div>
                <label className="font-body text-xs text-concrete/50 block mb-1.5">CV (PDF, Word)</label>
                <label className="flex items-center gap-3 bg-white/5 border border-dashed border-white/15 hover:border-gmo-green/40 rounded-xl px-4 py-3 cursor-pointer transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-gmo-green/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gmo-green/20 transition-colors">
                    {uploading ? (
                      <div className="w-4 h-4 border-2 border-gmo-green/30 border-t-gmo-green rounded-full animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 text-gmo-green" />
                    )}
                  </div>
                  <div>
                    <p className="font-body text-xs text-concrete/60 group-hover:text-concrete/80 transition-colors">
                      {cvFile || (uploading ? "Chargement..." : "Cliquez pour joindre votre CV")}
                    </p>
                    <p className="font-body text-[10px] text-concrete/25 mt-0.5">PDF, DOC, DOCX — max 5 Mo</p>
                  </div>
                  <input type="file" accept=".pdf,.doc,.docx" onChange={handleFile} className="hidden" />
                </label>
              </div>
              <button type="submit" disabled={submitting || uploading}
                className="w-full flex items-center justify-center gap-2 bg-gmo-green text-white font-heading font-bold text-sm py-3.5 rounded-xl btn-glow-green disabled:opacity-50 disabled:cursor-not-allowed transition-opacity">
                {submitting ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Envoi en cours...</>
                ) : (
                  <><Send className="w-4 h-4" /> Envoyer ma candidature</>
                )}
              </button>
              <p className="font-body text-[10px] text-concrete/25 text-center">
                Votre candidature sera examinée par notre équipe RH dans les 5 jours ouvrés.
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── MAIN PAGE ── */
export default function Careers() {
  const [expandedJob, setExpandedJob] = useState(null);
  const [applyJob, setApplyJob] = useState(undefined); // undefined = closed, null = spontaneous, object = specific job

  return (
    <div className="min-h-screen bg-obsidian overflow-x-hidden">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img src="https://gmobfaso.com/assets/img/a-propos/a-propos-2.jpg" alt="GMO"
            className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/85 to-obsidian/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian/40" />
        </div>

        {/* Animated blobs */}
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.06, 0.14, 0.06] }}
          transition={{ duration: 9, repeat: Infinity }}
          className="absolute top-32 right-0 w-[700px] h-[700px] bg-gmo-green rounded-full blur-[140px] pointer-events-none" />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.04, 0.09, 0.04] }}
          transition={{ duration: 11, repeat: Infinity, delay: 3 }}
          className="absolute bottom-0 left-10 w-[500px] h-[500px] bg-gmo-red rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 w-full">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <Link to="/" className="inline-flex items-center gap-2 text-concrete/30 hover:text-gmo-green transition-colors font-body text-sm mb-12">
              <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
            {/* Left: Text */}
            <div className="lg:col-span-3">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <div className="inline-flex items-center gap-2 bg-gmo-green/12 border border-gmo-green/25 text-gmo-green font-body text-xs uppercase tracking-[0.25em] px-4 py-2 rounded-full mb-8">
                  <Sparkles className="w-3.5 h-3.5" /> Nous recrutons
                </div>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}
                className="font-heading text-5xl lg:text-[5.5rem] font-bold text-concrete leading-[0.88] mb-8 tracking-tight">
                CONSTRUISEZ<br />
                VOTRE AVENIR<br />
                <span className="text-gmo-green">AVEC GMO</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                className="font-body text-base text-concrete/55 leading-[1.8] mb-10 max-w-lg">
                Leader de la distribution au Burkina Faso, GMO offre un environnement de travail stimulant, humain et porteur de sens. Rejoignez plus de <strong className="text-concrete/80">50 collaborateurs</strong> engagés chaque jour pour l'excellence.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
                className="flex flex-wrap gap-3">
                <button onClick={() => document.querySelector('#offres')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center gap-2 bg-gmo-green text-white font-heading font-bold text-sm px-7 py-4 rounded-xl btn-glow-green">
                  <Briefcase className="w-4 h-4" /> Voir les offres
                  <span className="bg-white/20 rounded-full text-xs w-5 h-5 flex items-center justify-center">{JOB_OFFERS.length}</span>
                </button>
                <button onClick={() => setApplyJob(null)}
                  className="flex items-center gap-2 border border-white/15 text-concrete/60 font-heading font-bold text-sm px-7 py-4 rounded-xl hover:border-gmo-green/40 hover:text-white transition-all">
                  <Send className="w-4 h-4" /> Candidature spontanée
                </button>
              </motion.div>

              {/* Stats */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                className="flex gap-8 mt-12 pt-10 border-t border-white/8">
                {[{ n: "50+", l: "Collaborateurs" }, { n: "6", l: "Postes ouverts" }, { n: "5j", l: "Délai de réponse" }].map(s => (
                  <div key={s.l}>
                    <p className="font-heading text-2xl font-bold text-concrete">{s.n}</p>
                    <p className="font-body text-xs text-concrete/35 mt-1">{s.l}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Mosaic */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
              className="lg:col-span-2 hidden lg:grid grid-cols-2 gap-2">
              {TEAM_PHOTOS.map((p, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  className={`relative overflow-hidden rounded-xl group ${i === 0 ? "col-span-2 aspect-[16/7]" : "aspect-square"}`}>
                  <img src={p.src} alt={p.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108" />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="font-heading text-xs font-bold text-white leading-tight">{p.label}</p>
                    <p className="font-body text-[9px] text-white/50">{p.role}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-concrete/20 z-10">
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </section>

      {/* ── PDG QUOTE ── */}
      <section className="bg-white/[0.025] border-y border-white/[0.06] py-16 overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center gap-8 md:gap-14">
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl overflow-hidden border-2 border-gmo-green/30">
                  <img src="https://gmobfaso.com/assets/img/a-propos/a-propos-1.jpg" alt="PDG" className="w-full h-full object-cover object-top" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gmo-green rounded-xl flex items-center justify-center">
                  <span className="text-white text-xs font-bold">"</span>
                </div>
              </div>
            </div>
            <div>
              <blockquote className="font-body text-base md:text-lg text-concrete/65 italic leading-relaxed mb-4">
                "Je suis ravi de vous souhaiter la bienvenue au sein de GMO. Notre entreprise est engagée dans l'excellence et l'innovation. Nous sommes convaincus que vous trouverez ici un environnement stimulant où votre talent sera valorisé et votre contribution reconnue."
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="h-[2px] w-8 bg-gmo-green" />
                <div>
                  <p className="font-heading text-sm font-bold text-concrete">Hama TRAORE</p>
                  <p className="font-body text-xs text-gmo-green/70 uppercase tracking-widest">PDG — Groupe Madina Oumarou</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── WHY GMO ── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14">
            <span className="font-body text-xs uppercase tracking-[0.3em] text-gmo-red block mb-3">Pourquoi GMO ?</span>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-concrete">CE QUI NOUS DISTINGUE</h2>
            <div className="w-14 h-[2px] bg-gmo-green mt-5" />
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {WHY_GMO.map((item, i) => (
              <motion.div key={item.title}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08 }} whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white/[0.04] border border-white/8 rounded-2xl p-5 lg:p-7 hover:border-gmo-green/30 hover:bg-white/[0.06] transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-gmo-green/12 flex items-center justify-center mb-5">
                  <item.icon className="w-5 h-5 text-gmo-green" />
                </div>
                <p className="font-heading text-sm font-bold text-concrete mb-2">{item.title}</p>
                <p className="font-body text-xs text-concrete/40 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="bg-white/[0.025] border-y border-white/[0.06] py-20 lg:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14">
            <span className="font-body text-xs uppercase tracking-[0.3em] text-gmo-red block mb-3">Étapes</span>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-concrete">NOTRE PROCESSUS</h2>
            <div className="w-14 h-[2px] bg-gmo-green mt-5" />
          </motion.div>
          <div className="relative">
            {/* Line */}
            <div className="hidden lg:block absolute top-10 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gmo-green/30 to-transparent" />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 lg:gap-4">
              {PROCESS.map((step, i) => (
                <motion.div key={step.step}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center text-center">
                  <div className="relative mb-5">
                    <div className="w-20 h-20 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center relative z-10">
                      <step.icon className="w-7 h-7 text-gmo-green" />
                    </div>
                    <span className="absolute -top-2 -right-2 font-heading text-xs font-bold text-gmo-green/60 bg-obsidian border border-gmo-green/25 rounded-full w-6 h-6 flex items-center justify-center text-[9px]">
                      {step.step}
                    </span>
                  </div>
                  <p className="font-heading text-sm font-bold text-concrete mb-2">{step.title}</p>
                  <p className="font-body text-xs text-concrete/35 leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── JOB OFFERS ── */}
      <section id="offres" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14">
            <span className="font-body text-xs uppercase tracking-[0.3em] text-gmo-red block mb-3">Postes disponibles</span>
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <h2 className="font-heading text-3xl lg:text-4xl font-bold text-concrete">NOS OFFRES D'EMPLOI</h2>
                <div className="w-14 h-[2px] bg-gmo-green mt-5" />
              </div>
              <p className="font-body text-sm text-concrete/35">{JOB_OFFERS.length} postes à pourvoir</p>
            </div>
          </motion.div>

          <div className="space-y-3 mb-14">
            {JOB_OFFERS.map((job, i) => (
              <motion.div key={job.title}
                initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className={`border rounded-2xl transition-all duration-300 overflow-hidden ${expandedJob === i ? "border-gmo-green/40 bg-white/[0.06]" : "border-white/8 bg-white/[0.03] hover:border-white/15"}`}>
                <button onClick={() => setExpandedJob(expandedJob === i ? null : i)}
                  className="w-full flex items-center gap-4 p-5 text-left">
                  <div className="text-2xl flex-shrink-0 w-10 text-center">{job.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <p className="font-heading text-base font-bold text-concrete">{job.title}</p>
                      {job.urgent && (
                        <span className="text-[9px] font-heading uppercase tracking-widest text-gmo-red bg-gmo-red/10 border border-gmo-red/20 px-2.5 py-0.5 rounded-full">
                          Urgent
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs text-concrete/40 font-body">{job.department}</span>
                      <span className="text-concrete/20">·</span>
                      <span className="flex items-center gap-1 text-xs text-concrete/35 font-body">
                        <MapPin className="w-3 h-3" />{job.location}
                      </span>
                      <span className={`text-[10px] font-heading border px-2.5 py-0.5 rounded-full ${TYPE_COLORS[job.type]}`}>{job.type}</span>
                    </div>
                  </div>
                  <motion.div animate={{ rotate: expandedJob === i ? 90 : 0 }} transition={{ duration: 0.25 }}>
                    <ChevronRight className="w-5 h-5 text-concrete/25" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {expandedJob === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 border-t border-white/8 pt-5">
                        <p className="font-body text-sm text-concrete/55 leading-relaxed mb-5">{job.description}</p>
                        <p className="font-body text-xs uppercase tracking-widest text-concrete/30 mb-3">Compétences recherchées</p>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {job.skills.map(s => (
                            <span key={s} className="inline-flex items-center gap-1.5 text-xs font-body text-gmo-green bg-gmo-green/8 border border-gmo-green/20 px-3 py-1.5 rounded-full">
                              <CheckCircle className="w-3 h-3" /> {s}
                            </span>
                          ))}
                        </div>
                        <button onClick={() => setApplyJob(job)}
                          className="inline-flex items-center gap-2 bg-gmo-green text-white font-heading font-bold text-sm px-7 py-3 rounded-xl btn-glow-green hover:bg-gmo-green/80 transition-colors">
                          <Send className="w-4 h-4" /> Postuler à ce poste
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Spontaneous */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative overflow-hidden bg-gradient-to-br from-gmo-green/12 to-gmo-green/4 border border-gmo-green/25 rounded-2xl p-8 lg:p-12">
            <div className="absolute right-0 top-0 w-64 h-64 bg-gmo-green/8 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8">
              <div className="max-w-lg">
                <div className="inline-flex items-center gap-2 bg-gmo-green/15 border border-gmo-green/25 text-gmo-green text-xs uppercase tracking-widest font-body px-3 py-1.5 rounded-full mb-4">
                  <Mail className="w-3 h-3" /> Candidature spontanée
                </div>
                <h3 className="font-heading text-2xl font-bold text-concrete mb-3">Votre profil nous intéresse !</h3>
                <p className="font-body text-sm text-concrete/50 leading-relaxed">
                  Vous ne trouvez pas de poste correspondant à votre profil ? Envoyez-nous votre CV, nous conservons les dossiers intéressants pour nos prochains besoins.
                </p>
              </div>
              <button onClick={() => setApplyJob(null)} className="flex-shrink-0 flex items-center gap-2 bg-gmo-green text-white font-heading font-bold text-sm px-8 py-4 rounded-xl btn-glow-green">
                <Briefcase className="w-4 h-4" /> Envoyer mon CV
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact RH */}
      <section className="border-t border-white/[0.06] py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-body text-sm text-concrete/35">Une question sur nos offres ?</p>
            <div className="flex gap-4 flex-wrap">
              <a href="mailto:rh@gmoburkina.com" className="flex items-center gap-2 font-body text-sm text-concrete/50 hover:text-gmo-green transition-colors">
                <Mail className="w-4 h-4" /> rh@gmoburkina.com
              </a>
              <a href="tel:+22625331900" className="flex items-center gap-2 font-body text-sm text-concrete/50 hover:text-gmo-green transition-colors">
                <Phone className="w-4 h-4" /> +226 25 33 19 00
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* Modal */}
      <AnimatePresence>
        {applyJob !== undefined && (
          <ApplicationModal job={applyJob} onClose={() => setApplyJob(undefined)} />
        )}
      </AnimatePresence>
    </div>
  );
}