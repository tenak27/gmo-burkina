import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Linkedin, Mail } from "lucide-react";

const EXECUTIVE_BOARD = [
{
  name: "Hama TRAORE",
  title: "Président Directeur Général",
  role: "PDG",
  description: "Fondateur et visionnaire du Groupe Madina Oumarou, Hama TRAORE pilote la stratégie de croissance du groupe depuis sa création.",
  image: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/9e31bba75_home-innovation-pdg.jpg",
  accent: "gmo-green"
},
{
  name: "Direction Commerciale",
  title: "Directeur Commercial",
  role: "DC",
  description: "En charge du développement des ventes, de la relation client et de l'expansion du réseau de distribution à travers le Burkina Faso.",
  image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop",
  accent: "gmo-red"
},
{
  name: "Direction Financière",
  title: "Directeur Administratif & Financier",
  role: "DAF",
  description: "Garant de la santé financière du groupe, il supervise la comptabilité, la trésorerie et les relations avec les institutions bancaires.",
  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
  accent: "gold"
},
{
  name: "Direction Logistique",
  title: "Directeur des Opérations",
  role: "DOL",
  description: "Pilote l'ensemble de la chaîne logistique, des entrepôts à la livraison finale, en garantissant efficacité et respect des délais.",
  image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop",
  accent: "gmo-green"
}];


const OPERATIONAL_TEAM = [
{ dept: "Commercial & Ventes", icon: "💼", count: "12+", desc: "Commerciaux terrain couvrant l'ensemble du territoire" },
{ dept: "Logistique & Transport", icon: "🚛", count: "25+", desc: "Chauffeurs et agents logistiques dédiés à la livraison" },
{ dept: "Entrepôts & Stock", icon: "📦", count: "8+", desc: "Magasiniers et gestionnaires de stock qualifiés" },
{ dept: "Finance & Comptabilité", icon: "📊", count: "5+", desc: "Experts financiers et comptables certifiés" },
{ dept: "Ressources Humaines", icon: "👥", count: "3+", desc: "Spécialistes RH au service des collaborateurs" },
{ dept: "Informatique & Digital", icon: "💻", count: "4+", desc: "Ingénieurs et développeurs pour la transformation digitale" }];


export default function TeamSection() {
  const ref = useRef(null);
  const teamRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const teamInView = useInView(teamRef, { once: true, margin: "-80px" });

  return (
    <section id="equipe" className="bg-concrete overflow-hidden">
      {/* Executive Board */}
      



















































      

      {/* Operational Team */}
      <div ref={teamRef} className="bg-obsidian py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={teamInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-14">
            
            <span className="font-body text-xs uppercase tracking-[0.3em] text-gmo-green/70 block mb-4">Les équipes</span>
            <h3 className="font-heading text-3xl lg:text-4xl font-bold text-concrete">
              ÉQUIPE <span className="text-gmo-green">OPÉRATIONNELLE</span>
            </h3>
            <p className="font-body text-sm text-concrete/40 mt-4 max-w-xl mx-auto">
              Plus de 60 collaborateurs passionnés au service de votre satisfaction, chaque jour.
            </p>
            <div className="w-16 h-[2px] bg-gmo-red mx-auto mt-6" />
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {OPERATIONAL_TEAM.map((dept, i) =>
            <motion.div
              key={dept.dept}
              initial={{ opacity: 0, y: 20 }}
              animate={teamInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08 }}
              className="group bg-white/[0.04] border border-white/8 hover:border-gmo-green/40 hover:bg-white/7 rounded-xl p-6 transition-all duration-300">
              
                <div className="flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0">{dept.icon}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-heading text-sm font-bold text-concrete">{dept.dept}</p>
                      <span className="font-heading text-[10px] text-gmo-green bg-gmo-green/10 border border-gmo-green/20 px-2 py-0.5 rounded-full">{dept.count}</span>
                    </div>
                    <p className="font-body text-xs text-concrete/40 leading-relaxed">{dept.desc}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>);

}