import React from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Phone, Mail, MapPin, MessageCircle, Facebook, Twitter, Linkedin, Youtube, Instagram, Shield, FileText } from "lucide-react";

const NAV = [
{ label: "Accueil", id: "accueil" },
{ label: "Services", id: "services" },
{ label: "À Propos", id: "apropos" },
{ label: "Notre Équipe", id: "equipe" },
{ label: "RSE", id: "rse" },
{ label: "Produits", id: "produits" },
{ label: "Projets", id: "projets" },
{ label: "Médias", id: "medias" },
{ label: "Carrières", href: "/carrieres" },
{ label: "Contact", href: "/contact" },
{ label: "GMO Foot", id: "gmofoot" },
{ label: "Contact", id: "contact" }];


const SOCIALS = [
{ icon: Facebook, href: "https://facebook.com/gmoburkina", label: "Facebook" },
{ icon: Instagram, href: "https://instagram.com/gmoburkina", label: "Instagram" },
{ icon: Twitter, href: "https://twitter.com/gmoburkina", label: "X" },
{ icon: Linkedin, href: "https://linkedin.com/company/gmoburkina", label: "LinkedIn" },
{ icon: Youtube, href: "https://youtube.com/@gmoburkina", label: "YouTube" }];


export default function Footer() {
  const scrollTo = (id) => document.querySelector(`#${id}`)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer className="bg-slate-900 border-t border-white/[0.05] overflow-hidden relative">
      {/* Glow accents */}
      <div className="absolute top-0 left-1/4 w-96 h-32 bg-gmo-green/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-24 bg-gmo-red/6 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-12 pb-6 relative z-10">
        {/* Main row */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div>
            <img src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/47050d727_logo-gmo2x-EVZXLeXs.png"
            alt="GMO" className="h-9 brightness-0 invert opacity-85 mb-4" />
            <p className="font-body text-xs text-white/35 leading-relaxed mb-4">
              Leader de la distribution au Burkina Faso. Transport, logistique, qualité.
            </p>
            <div className="flex items-center gap-1.5 mb-4">
              {SOCIALS.map((s) =>
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" title={s.label}
              className="w-7 h-7 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-white/30 hover:bg-gmo-green hover:border-gmo-green hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-gmo-green/30">
                  <s.icon className="w-3 h-3" />
                </a>
              )}
            </div>
            <a href="https://wa.me/+22601181717" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-gmo-green/12 border border-gmo-green/25 text-gmo-green text-xs px-3 py-2 rounded-full hover:bg-gmo-green hover:text-white transition-all duration-300 hover:shadow-md hover:shadow-gmo-green/20">
              <MessageCircle className="w-3 h-3" /> WhatsApp
            </a>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-heading text-[9px] uppercase tracking-[0.3em] text-white/20 mb-4">Navigation</p>
            <div className="space-y-2">
              {NAV.map((link) =>
              link.href ?
              <Link key={link.href} to={link.href} className="block text-xs font-body text-white/35 hover:text-gmo-green transition-colors duration-200">{link.label}</Link> :
              <button key={link.id} onClick={() => scrollTo(link.id)} className="block text-xs font-body text-white/35 hover:text-gmo-green transition-colors duration-200">{link.label}</button>
              )}
            </div>
          </div>

          {/* Portails */}
          <div>
           <p className="font-heading text-[9px] uppercase tracking-[0.3em] text-white/20 mb-4">Portails</p>
           <div className="space-y-2">
             <button onClick={() => base44.auth.redirectToLogin('/chauffeur', { locale: "fr" })}
              className="flex items-center gap-1.5 text-xs font-body text-white/35 hover:text-gmo-green transition-colors duration-200">
               <span className="w-1.5 h-1.5 rounded-full bg-gmo-green/50 flex-shrink-0" />
               Portail Chauffeurs
             </button>
             <button onClick={() => base44.auth.redirectToLogin('/vendeur', { locale: "fr" })}
              className="flex items-center gap-1.5 text-xs font-body text-white/35 hover:text-gmo-green transition-colors duration-200">
               <span className="w-1.5 h-1.5 rounded-full bg-gmo-green/50 flex-shrink-0" />
               Portail Ambulants
             </button>
           </div>
           <p className="font-heading text-[9px] uppercase tracking-[0.3em] text-white/20 mb-3 mt-5">Légal</p>
           <div className="space-y-1.5">
             {["Mentions légales", "Confidentialité", "CGV"].map((l) =>
              <a key={l} href="#" className="flex items-center gap-1.5 text-xs font-body text-white/25 hover:text-white/55 transition-colors">
                 <FileText className="w-2.5 h-2.5 opacity-50" />{l}
               </a>
              )}
           </div>
          </div>

          {/* Contact */}
          <div>
            <p className="font-heading text-[9px] uppercase tracking-[0.3em] text-white/20 mb-4">Contact</p>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-gmo-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-3 h-3 text-gmo-green" />
                </div>
                <p className="font-body text-xs text-white/35 leading-relaxed">Siège : Dapoya, Point de vente Kwame Kruma<br />Avenue Yennega, Ouagadougou, BF</p>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-gmo-green/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-3 h-3 text-gmo-green" />
                </div>
                <a href="tel:+22601181717" className="font-body text-xs text-white/35 hover:text-gmo-green transition-colors">+226 01 18 17 17</a>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-gmo-green/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-3 h-3 text-gmo-green" />
                </div>
                <a href="mailto:infos@gmoburkina.com" className="font-body text-xs text-white/35 hover:text-gmo-green transition-colors">infos@gmoburkina.com</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.05] pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-[10px] text-white/15">
            © {new Date().getFullYear()} Groupe <Link to="/admin" className="text-white/15 hover:text-gmo-green/60 transition-colors">Madina</Link> Oumarou · <button onClick={() => base44.auth.redirectToLogin('/client', { locale: "fr" })} className="text-white/15 cursor-default" title="Connexion cachée">T</button><button onClick={() => base44.auth.redirectToLogin('/admin', { locale: "fr" })} className="text-white/15 cursor-default hover:text-white/20 transition-colors" title="Espace employé">ous droits réservés</button>
          </p>
          <div className="flex items-center gap-2">
            <Shield className="w-3 h-3 text-gmo-green/40" />
            <p className="font-body text-[10px] text-white/15">
              Conçu par <a href="https://iamtechnology.store" target="_blank" rel="noopener noreferrer" className="text-gmo-green/55 font-semibold hover:text-gmo-green transition-colors">IAM TECHNOLOGY</a> · <span className="text-white/25">Armand Olivier KONATE</span>
            </p>
          </div>
        </div>
      </div>
    </footer>);

}