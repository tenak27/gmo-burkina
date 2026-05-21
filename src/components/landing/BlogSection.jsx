import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Calendar, ArrowRight, Tag } from "lucide-react";

const ARTICLES = [
  {
    tag: "Expansion",
    date: "15 Avril 2025",
    title: "GMO Burkina renforce sa présence à Bobo-Dioulasso",
    excerpt: "Un nouveau hub logistique ouvre ses portes dans la capitale économique du Burkina Faso, permettant d'accélérer nos délais de livraison dans l'Ouest du pays.",
    img: "https://gmobfaso.com/assets/img/a-propos/a-propos-2.jpg",
    color: "bg-gmo-green",
  },
  {
    tag: "Partenariat",
    date: "02 Mars 2025",
    title: "Nouveau partenariat stratégique avec SN CITEC",
    excerpt: "GMO Burkina consolide sa collaboration avec SN CITEC pour la distribution de l'huile MADINA et des produits d'hygiène à travers le réseau national.",
    img: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/678f80d25_huile.jpg",
    color: "bg-gmo-red",
  },
  {
    tag: "Innovation",
    date: "10 Janvier 2025",
    title: "Lancement prochain de notre application mobile",
    excerpt: "Commandez et suivez vos livraisons directement depuis votre smartphone. L'application GMO Burkina sera disponible sur iOS et Android dès le second trimestre 2025.",
    img: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/9e31bba75_home-innovation-pdg.jpg",
    color: "bg-gold",
  },
];

function ArticleCard({ article, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-gmo-green/20 transition-all duration-400 flex flex-col"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[16/9]">
        <img
          src={article.img}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
        />
        <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/10 transition-all duration-500" />
        <span className={`absolute top-3 left-3 ${article.color} text-white font-body text-[10px] uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1.5`}>
          <Tag className="w-2.5 h-2.5" />
          {article.tag}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-3.5 h-3.5 text-obsidian/30" />
          <span className="font-body text-xs text-obsidian/40">{article.date}</span>
        </div>
        <h3 className="font-heading text-lg font-bold text-obsidian leading-snug mb-3 group-hover:text-gmo-green transition-colors duration-300">
          {article.title}
        </h3>
        <p className="font-body text-sm text-obsidian/55 leading-relaxed flex-1 mb-5">
          {article.excerpt}
        </p>
        <div className="flex items-center gap-2 text-gmo-green font-heading text-xs font-bold uppercase tracking-widest group-hover:gap-3 transition-all duration-300">
          Lire la suite
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="h-[3px] bg-gradient-to-r from-gmo-green to-gmo-red w-0 group-hover:w-full transition-all duration-500" />
    </motion.article>
  );
}

export default function BlogSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="actualites" className="bg-gradient-to-b from-white via-white/98 to-white/95 py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div ref={ref} className="mb-14">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-6 h-[2px] bg-gmo-red" />
            <span className="font-body text-xs uppercase tracking-[0.3em] text-gmo-red">Actualités</span>
          </motion.div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="font-heading text-4xl lg:text-5xl font-bold text-obsidian"
              >
                DERNIÈRES
                <br />
                <span className="text-gmo-green">NOUVELLES</span>
              </motion.h2>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="h-1 w-20 bg-gradient-to-r from-gmo-green to-gmo-red mt-5 origin-left rounded-full"
              />
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
              className="font-body text-sm text-obsidian/45 max-w-xs leading-relaxed"
            >
              Restez informés des dernières actualités et annonces du Groupe Madina Oumarou.
            </motion.p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ARTICLES.map((article, i) => (
            <ArticleCard key={article.title} article={article} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}