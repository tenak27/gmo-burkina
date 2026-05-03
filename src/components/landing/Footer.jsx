import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, MessageCircle, Facebook, Twitter, Linkedin, Youtube, Instagram, Shield, FileText, ExternalLink } from "lucide-react";

const NAV = [
  { label: "Accueil", id: "accueil" },
  { label: "Services", id: "services" },
  { label: "À Propos", id: "apropos" },
  { label: "Produits", id: "produits" },
  { label: "GMO Foot", id: "gmofoot" },
  { label: "Galerie", id: "galerie" },
  { label: "Contact", id: "contact" },
];

const SOCIALS = [
  { icon: Facebook, href: "https://facebook.com/gmoburkina", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com/gmoburkina", label: "Instagram" },
  { icon: Twitter, href: "https://twitter.com/gmoburkina", label: "Twitter / X" },
  { icon: Linkedin, href: "https://linkedin.com/company/gmoburkina", label: "LinkedIn" },
  { icon: Youtube, href: "https://youtube.com/@gmoburkina", label: "YouTube" },
];

const LEGAL = [
  { label: "Mentions légales", href: "#" },
  { label: "Politique de confidentialité", href: "#" },
  { label: "CGV", href: "#" },
  { label: "Cookies", href: "#" },
];

export default function Footer() {
  const scrollTo = (id) => {
    document.querySelector(`#${id}`)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-obsidian overflow-hidden">
      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-10 relative">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14 relative z-10">

          {/* Col 1 — Brand */}
          <div className="lg:col-span-1">
            <img
              src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c7662a636_logo-gmo2x.png"
              alt="GMO Logo"
              className="h-11 w-auto object-contain mb-5 brightness-0 invert opacity-90"
            />
            <p className="font-body text-sm text-white/38 leading-relaxed mb-6">
              Groupe Madina Oumarou — Leader de la distribution au Burkina Faso.
              Entreprise citoyenne, socialement responsable depuis plus de 20 ans.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-2 mb-6">
              {SOCIALS.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" title={s.label}
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/35 hover:bg-gmo-green hover:border-gmo-green hover:text-white transition-all duration-300">
                  <s.icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
            <a href="https://wa.me/22676211633" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gmo-green/15 border border-gmo-green/30 text-gmo-green font-body text-xs px-4 py-2.5 rounded-full hover:bg-gmo-green hover:text-white transition-all duration-300">
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp · Commander
            </a>
          </div>

          {/* Col 2 — Navigation */}
          <div>
            <p className="font-heading text-[10px] uppercase tracking-[0.3em] text-white/25 mb-5">Navigation</p>
            <div className="space-y-2.5">
              {NAV.map(link => (
                <button key={link.id} onClick={() => scrollTo(link.id)}
                  className="block text-left font-body text-sm text-white/38 hover:text-gmo-green transition-colors duration-200">
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Col 3 — Espaces */}
          <div>
            <p className="font-heading text-[10px] uppercase tracking-[0.3em] text-white/25 mb-5">Espaces connectés</p>
            <div className="space-y-2.5">
              <Link to="/client" className="flex items-center gap-2 font-body text-sm text-white/38 hover:text-gmo-green transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-gmo-green/50 flex-shrink-0" />
                Espace Client
              </Link>
              <Link to="/detaillant" className="flex items-center gap-2 font-body text-sm text-white/38 hover:text-gmo-red transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-gmo-red/50 flex-shrink-0" />
                Espace Détaillant
              </Link>
              <Link to="/admin" className="flex items-center gap-2 font-body text-sm text-white/38 hover:text-white transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-white/20 flex-shrink-0" />
                Administration ERP
              </Link>
            </div>

            <p className="font-heading text-[10px] uppercase tracking-[0.3em] text-white/25 mt-8 mb-5">Mentions légales</p>
            <div className="space-y-2.5">
              {LEGAL.map(l => (
                <a key={l.label} href={l.href}
                  className="flex items-center gap-1.5 font-body text-sm text-white/30 hover:text-white/60 transition-colors">
                  <FileText className="w-3 h-3 flex-shrink-0 opacity-50" />
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          {/* Col 4 — Contact */}
          <div>
            <p className="font-heading text-[10px] uppercase tracking-[0.3em] text-white/25 mb-5">Contact</p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-gmo-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-gmo-green" />
                </div>
                <div>
                  <p className="font-body text-xs text-white/25 uppercase tracking-widest mb-0.5">Siège social</p>
                  <p className="font-body text-sm text-white/40 leading-relaxed">
                    Quartier Dapoya, Parcelle 05<br />Lot 29, Section BI<br />01 BP 3370 · Ouagadougou, BF
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-gmo-green/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-3.5 h-3.5 text-gmo-green" />
                </div>
                <div>
                  <p className="font-body text-xs text-white/25 uppercase tracking-widest mb-0.5">Téléphone</p>
                  <a href="tel:+22625331900" className="font-body text-sm text-white/40 hover:text-gmo-green transition-colors">+226 25 33 19 00</a>
                  <br />
                  <a href="https://wa.me/22676211633" target="_blank" rel="noopener noreferrer"
                    className="font-body text-sm text-white/40 hover:text-gmo-green transition-colors">+226 76 21 16 33 (WA)</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-gmo-green/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-3.5 h-3.5 text-gmo-green" />
                </div>
                <div>
                  <p className="font-body text-xs text-white/25 uppercase tracking-widest mb-0.5">Email</p>
                  <a href="mailto:infos@gmoburkina.com" className="font-body text-sm text-white/40 hover:text-gmo-green transition-colors">infos@gmoburkina.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Watermark */}
        <div className="text-center overflow-hidden -mb-5 select-none pointer-events-none">
          <span className="font-heading text-[70px] sm:text-[120px] lg:text-[160px] font-bold text-white/[0.022] leading-none">
            GMO BURKINA
          </span>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-body text-[11px] text-white/18 tracking-wider">
            © {new Date().getFullYear()} Groupe Madina Oumarou · Tous droits réservés
          </p>
          {/* IAM TECHNOLOGY credit */}
          <div className="flex items-center gap-2">
            <Shield className="w-3 h-3 text-gmo-green/50" />
            <p className="font-body text-[11px] text-white/18">
              Conçu & développé par{" "}
              <span className="text-gmo-green/70 font-semibold">IAM TECHNOLOGY</span>
              {" "}·{" "}
              <span className="text-white/30">Armand Olivier KONATE</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}