import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Award, CheckCircle2, ChevronRight, Star, TrendingUp, Package, Truck, Users } from "lucide-react";

const PROJECTS = [
  {
    category: "Distribution",
    icon: Package,
    title: "Réseau de distribution national",
    client: "Marché burkinabè",
    year: "2020 — Présent",
    image: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/7fb80f92d_generated_bc5a0082.png",
    description: "Mise en place d'un réseau de distribution couvrant l'ensemble du territoire burkinabè avec plus de 500 points de vente actifs dans 13 régions.",
    results: ["500+ points de vente", "13 régions couvertes", "Livraison J+1 en zone urbaine"],
    featured: true,
  },
  {
    category: "Logistique",
    icon: Truck,
    title: "Plateforme logistique multimodale",
    client: "Opérations internes",
    year: "2022 — Présent",
    image: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/1e2be0905_generated_51987d61.png",
    description: "Construction et opération d'un hub logistique de 2 000 m² à Ouagadougou intégrant stockage, préparation de commandes et dispatch.",
    results: ["2 000 m² d'entrepôt", "Capacité 5 000 palettes", "Dispatch 24h/7j"],
    featured: true,
  },
  {
    category: "Marques Propres",
    icon: Star,
    title: "Développement marques propres GMO",
    client: "Groupe Madina Oumarou",
    year: "2021 — Présent",
    image: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c233f6983_generated_cd287a08.png",
    description: "Lancement et développement de marques agroalimentaires propres (Huile MADINA, Sucre GAZELLE, Farine du Sahel) distribuées sur l'ensemble du territoire.",
    results: ["3 marques lancées", "Produits 100% locaux", "Certification qualité"],
    featured: false,
  },
  {
    category: "Digital",
    icon: TrendingUp,
    title: "Transformation digitale ERP",
    client: "Opérations internes GMO",
    year: "2024 — Présent",
    image: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/b71c07b21_generated_f4cdf466.png",
    description: "Déploiement d'un système ERP complet intégrant gestion commerciale, logistique, comptabilité et RH pour piloter l'ensemble des opérations en temps réel.",
    results: ["ERP intégré 5 modules", "Reporting temps réel", "App mobile collaborateurs"],
    featured: false,
  },
  {
    category: "Partenariats",
    icon: Users,
    title: "Partenariats fournisseurs stratégiques",
    client: "Réseau de fournisseurs",
    year: "2019 — Présent",
    image: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/1a49d0a18_generated_1a2588b5.png",
    description: "Établissement de partenariats durables avec plus de 30 fournisseurs locaux et internationaux garantissant qualité, disponibilité et prix compétitifs.",
    results: ["30+ fournisseurs partenaires", "Qualité certifiée", "Approvisionnement sécurisé"],
    featured: false,
  },
  {
    category: "Sport & RSE",
    icon: Award,
    title: "GMO Foot — Académie sportive",
    client: "Jeunesse burkinabè",
    year: "2018 — Présent",
    image: "https://gmobfaso.com/assets/img/gmo-foot/gmo-foot-1.jpg",
    description: "Création et financement d'une académie de football professionnel formant les jeunes talents burkinabè tout en véhiculant les valeurs du groupe.",
    results: ["100+ jeunes formés/an", "Équipe professionnelle", "Valeurs citoyennes"],
    featured: false,
  },
];

const STATS = [
  { value: "15+", label: "Années d'existence" },
  { value: "30+", label: "Projets majeurs" },
  { value: "500+", label: "Clients références" },
  { value: "99%", label: "Taux de satisfaction" },
];

export default function ProjectsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [activeFilter, setActiveFilter] = useState("Tous");

  const categories = ["Tous", ...Array.from(new Set(PROJECTS.map(p => p.category)))];
  const filtered = activeFilter === "Tous" ? PROJECTS : PROJECTS.filter(p => p.category === activeFilter);

  return (
    <section id="projets" className="bg-concrete overflow-hidden">
      <div className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Header */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-16"
          >
            <span className="font-body text-xs uppercase tracking-[0.3em] text-gmo-red block mb-4">Références & Réalisations</span>
            <h2 className="font-heading text-3xl lg:text-5xl font-bold text-obsidian leading-tight mb-6">
              NOS PROJETS
              <br />
              <span className="text-gmo-green">MAJEURS</span>
            </h2>
            <p className="font-body text-base text-obsidian/55 max-w-2xl mx-auto leading-relaxed">
              Des projets concrets, des résultats mesurables. Découvrez comment GMO a construit sa position de leader de la distribution au Burkina Faso.
            </p>
            <div className="w-16 h-[2px] bg-gmo-red mx-auto mt-8" />
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                className="bg-obsidian text-center p-6"
              >
                <p className="font-heading text-3xl lg:text-4xl font-black text-gmo-green mb-2">{s.value}</p>
                <p className="font-body text-[11px] text-concrete/40 uppercase tracking-wider">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-2 mb-10"
          >
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`font-heading text-[11px] uppercase tracking-widest px-4 py-2 rounded-full border transition-all duration-200 ${
                  activeFilter === cat
                    ? "bg-gmo-green text-white border-gmo-green shadow-lg shadow-gmo-green/20"
                    : "border-obsidian/20 text-obsidian/55 hover:border-gmo-green hover:text-gmo-green"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {/* Projects grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project, i) => {
              const Icon = project.icon;
              return (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.08 }}
                  className="group bg-white border border-gray-100 hover:shadow-xl transition-all duration-500 overflow-hidden"
                >
                  <div className="aspect-video overflow-hidden relative">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 to-transparent" />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="font-heading text-[9px] uppercase tracking-widest text-concrete bg-obsidian/70 backdrop-blur-sm border border-white/10 px-2.5 py-1 rounded-full">
                        {project.category}
                      </span>
                      {project.featured && (
                        <span className="font-heading text-[9px] uppercase tracking-widest text-gmo-green bg-gmo-green/20 border border-gmo-green/30 px-2.5 py-1 rounded-full">
                          Phare
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <span className="font-body text-[10px] text-white/60">{project.year}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-9 h-9 bg-gmo-green/10 flex items-center justify-center flex-shrink-0 rounded-lg">
                        <Icon className="w-4 h-4 text-gmo-green" />
                      </div>
                      <div>
                        <h4 className="font-heading text-sm font-bold text-obsidian leading-tight">{project.title}</h4>
                        <p className="font-body text-[11px] text-obsidian/40">{project.client}</p>
                      </div>
                    </div>
                    <p className="font-body text-xs text-obsidian/55 leading-relaxed mb-4">{project.description}</p>
                    <div className="space-y-1.5">
                      {project.results.map((r, j) => (
                        <div key={j} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-gmo-green flex-shrink-0" />
                          <span className="font-body text-[11px] text-obsidian/65">{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 h-[2px] bg-gmo-green w-0 group-hover:w-full transition-all duration-500" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}