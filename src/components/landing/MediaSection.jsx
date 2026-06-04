import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Newspaper, Video, Camera, Calendar, ChevronRight, ExternalLink, Tag, Clock } from "lucide-react";

const MEDIA_ITEMS = [
{
  type: "article",
  category: "Actualités",
  date: "15 mai 2026",
  title: "GMO Burkina renforce sa flotte logistique avec 10 nouveaux véhicules",
  summary: "Dans le cadre de sa stratégie d'expansion, le Groupe Madina Oumarou investit dans 10 camionnettes supplémentaires pour renforcer sa capacité de livraison dans les zones péri-urbaines.",
  image: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/1e2be0905_generated_51987d61.png",
  tag: "Logistique",
  tagColor: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  featured: true
},
{
  type: "communique",
  category: "Communiqué",
  date: "Bientôt",
  title: "Prochainement : Nouveaux produits Madina Oumarou",
  summary: "GMO prépare le lancement de sa nouvelle gamme de produits premium Madina Oumarou. Huiles végétales, condiments et essentiels culinaires fabriqués selon les plus hauts standards de qualité. À découvrir très bientôt chez vos revendeurs.",
  image: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/678f80d25_huile.jpg",
  tag: "Marques propres",
  tagColor: "text-gmo-green bg-gmo-green/10 border-gmo-green/20",
  featured: false
},
{
  type: "evenement",
  category: "Événement",
  date: "20 avril 2026",
  title: "GMO Foot — Finale régionale de l'Académie de football",
  summary: "Plus de 500 supporters ont assisté à la finale régionale de l'Académie GMO Foot. Une belle victoire pour nos jeunes talents et la promotion du football burkinabè.",
  image: "https://gmobfaso.com/assets/img/gmo-foot/gmo-foot-1.jpg",
  tag: "Sport",
  tagColor: "text-gmo-red bg-gmo-red/10 border-gmo-red/20",
  featured: false
},
{
  type: "article",
  category: "Partenariat",
  date: "10 avril 2026",
  title: "Nouveau partenariat stratégique avec SN CITEC",
  summary: "GMO Burkina renforce son portefeuille de produits alimentaires en signant un partenariat stratégique avec SN CITEC, leader régional de l'huile végétale.",
  image: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/e42dcdb07_generated_image.png",
  tag: "Partenariat",
  tagColor: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  featured: false,
  logos: [
  "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/dbd96d28b_logo-gmo2x-EVZXLeXs.png",
  "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/5455769ac_Logo-2025-taille-normale-300x91.jpg"]

},
{
  type: "evenement",
  category: "RSE",
  date: "25 mars 2026",
  title: "Journée RSE : Distribution de kits scolaires dans 5 écoles",
  summary: "Dans le cadre de ses engagements sociaux, GMO a distribué 300 kits scolaires complets à des élèves de 5 écoles primaires de Ouagadougou.",
  image: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/87ba94dd6_generated_image.png",
  tag: "RSE",
  tagColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  featured: false
},
{
  type: "article",
  category: "Innovation",
  date: "15 mars 2026",
  title: "GMO déploie son ERP pour une gestion 100% numérique",
  summary: "La mise en service de notre nouveau système ERP intégré marque une étape majeure dans la transformation digitale du groupe, couvrant ventes, stock, logistique et finance.",
  image: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/b416043e1_generated_image.png",
  tag: "Digital",
  tagColor: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  featured: false
}];


const TYPE_ICONS = {
  article: Newspaper,
  communique: Tag,
  evenement: Calendar,
  video: Video,
  photo: Camera
};

const FILTERS = ["Tous", "Actualités", "Communiqué", "Événement", "Partenariat", "RSE", "Innovation"];

export default function MediaSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [activeFilter, setActiveFilter] = useState("Tous");

  const filtered = activeFilter === "Tous" ?
  MEDIA_ITEMS :
  MEDIA_ITEMS.filter((item) => item.category === activeFilter);

  const featured = MEDIA_ITEMS.find((m) => m.featured);
  const others = filtered.filter((m) => !m.featured);

  return (
    <section id="medias" className="bg-obsidian overflow-hidden">
      <div className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Header */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-16">
            
            <span className="font-body text-xs uppercase tracking-[0.3em] text-gmo-red block mb-4">Espace Médias</span>
            <h2 className="font-heading text-3xl lg:text-5xl font-bold text-concrete leading-tight mb-6">
              ACTUALITÉS &
              <br />
              <span className="text-gmo-green">COMMUNICATIONS</span>
            </h2>
            <p className="font-body text-base text-concrete/45 max-w-2xl mx-auto leading-relaxed">
              Suivez la vie du Groupe Madina Oumarou : communiqués officiels, événements, partenariats et moments forts de notre aventure collective.
            </p>
            <div className="w-16 h-[2px] bg-gmo-red mx-auto mt-8" />
          </motion.div>

          {/* Featured article */}
          {featured && activeFilter === "Tous" &&
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="group mb-12 grid lg:grid-cols-2 gap-0 bg-white/[0.04] border border-white/10 hover:border-gmo-green/30 transition-all duration-500 overflow-hidden rounded-xl">
            
              <div className="aspect-video lg:aspect-auto overflow-hidden relative">
                <img src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/fb5adab03_Gemini_Generated_Image_7tq8x97tq8x97tq8.png"

              alt={featured.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              
                {featured.logos && featured.logos.length === 2 &&
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-4 bg-obsidian/80 backdrop-blur-sm p-3 rounded-lg">
                    <img src={featured.logos[0]} alt="GMO" className="h-8 w-auto object-contain brightness-0 invert" />
                    <span className="text-white/40 text-lg">+</span>
                    <img src={featured.logos[1]} alt="SN CITEC" className="h-8 w-auto object-contain" />
                  </div>
              }
              </div>
              <div className="p-8 lg:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-[10px] font-heading uppercase tracking-widest border px-2.5 py-1 rounded-full ${featured.tagColor}`}>{featured.tag}</span>
                  <span className="font-heading text-[10px] text-concrete/25 uppercase tracking-widest bg-gmo-green/10 border border-gmo-green/20 text-gmo-green px-2.5 py-1 rounded-full">À la une</span>
                </div>
                <h3 className="font-heading text-xl lg:text-2xl font-bold text-concrete mb-4 leading-snug">{featured.title}</h3>
                <p className="font-body text-sm text-concrete/50 leading-relaxed mb-6">{featured.summary}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-concrete/30 font-body">
                    <Clock className="w-3.5 h-3.5" />{featured.date}
                  </div>
                  <button className="flex items-center gap-1.5 text-xs font-heading font-bold text-gmo-green hover:text-gmo-green/80 transition-colors">
                    Lire la suite <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          }

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-2 mb-8">
            
            {FILTERS.map((f) =>
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`font-heading text-[11px] uppercase tracking-widest px-4 py-2 rounded-full border transition-all duration-200 ${
              activeFilter === f ?
              "bg-gmo-green text-white border-gmo-green" :
              "border-white/10 text-concrete/45 hover:border-gmo-green/40 hover:text-gmo-green"}`
              }>
              
                {f}
              </button>
            )}
          </motion.div>

          {/* Articles grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(activeFilter === "Tous" ? others : filtered).map((item, i) => {
              const TypeIcon = TYPE_ICONS[item.type] || Newspaper;
              return (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 25 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.07 }}
                  className="group bg-white/[0.04] border border-white/8 hover:border-gmo-green/30 rounded-xl overflow-hidden transition-all duration-400 hover:shadow-lg hover:shadow-gmo-green/5">
                  
                  <div className="aspect-video overflow-hidden relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 to-transparent" />
                    {item.logos && item.logos.length === 2 && (
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-3 bg-obsidian/80 backdrop-blur-sm p-2.5 rounded-lg">
                        <img src={item.logos[0]} alt="GMO" className="h-7 w-auto object-contain brightness-0 invert" />
                        <span className="text-white/40 font-bold">×</span>
                        <img src={item.logos[1]} alt="SN CITEC" className="h-7 w-auto object-contain" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className={`text-[9px] font-heading uppercase tracking-widest border px-2 py-0.5 rounded-full ${item.tagColor}`}>{item.tag}</span>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <div className="w-7 h-7 rounded-full bg-obsidian/60 backdrop-blur-sm flex items-center justify-center">
                        <TypeIcon className="w-3 h-3 text-concrete/70" />
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Clock className="w-3 h-3 text-concrete/25" />
                      <span className="font-body text-[10px] text-concrete/30">{item.date}</span>
                      <span className="text-concrete/15 mx-1">·</span>
                      <span className="font-body text-[10px] text-concrete/35">{item.category}</span>
                    </div>
                    <h4 className="font-heading text-sm font-bold text-concrete leading-snug mb-2 group-hover:text-gmo-green transition-colors">{item.title}</h4>
                    <p className="font-body text-xs text-concrete/40 leading-relaxed line-clamp-2">{item.summary}</p>
                    <button className="mt-3 flex items-center gap-1 text-[11px] text-gmo-green font-heading hover:text-gmo-green/70 transition-colors">
                      Lire <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </motion.article>);

            })}
          </div>

          {/* Press contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-white/8 pt-10">
            
            <div>
              <p className="font-heading text-sm font-bold text-concrete mb-1">Contact Presse & Médias</p>
              <p className="font-body text-xs text-concrete/40">Pour toute demande d'interview ou d'information presse, contactez notre service communication.</p>
            </div>
            <a
              href="mailto:communication@gmoburkina.com"
              className="flex-shrink-0 flex items-center gap-2 border border-gmo-green/30 text-gmo-green font-heading font-bold text-sm px-6 py-3 rounded-xl hover:bg-gmo-green hover:text-white transition-all duration-300">
              
              <ExternalLink className="w-4 h-4" /> Contact Presse
            </a>
          </motion.div>
        </div>
      </div>
    </section>);

}