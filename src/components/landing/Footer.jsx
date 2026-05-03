import React from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

const NAV = ["Accueil", "Services", "À Propos", "Produits", "GMO Foot", "Galerie", "Contact"];
const scrollTo = (label) => {
  const map = { "À Propos": "apropos", "GMO Foot": "gmofoot", "Galerie": "galerie" };
  const id = map[label] || label.toLowerCase();
  document.querySelector(`#${id}`)?.scrollIntoView({ behavior: "smooth" });
};

export default function Footer() {
  return (
    <footer className="bg-obsidian overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-12 relative">
        <div className="grid md:grid-cols-3 gap-10 mb-16 relative z-10">
          {/* Col 1 */}
          <div>
            <img
              src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c7662a636_logo-gmo2x.png"
              alt="GMO Logo"
              className="h-12 w-auto object-contain mb-5 brightness-0 invert opacity-90"
            />
            <p className="font-body text-sm text-white/40 leading-relaxed mb-5">
              Groupe Madina Oumarou — Leader de la distribution au Burkina Faso. Entreprise citoyenne et socialement responsable.
            </p>
            <a
              href="https://wa.me/22676211633"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gmo-green/15 border border-gmo-green/30 text-gmo-green font-body text-xs px-4 py-2 rounded-full hover:bg-gmo-green hover:text-white transition-all duration-300"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp Commande
            </a>
          </div>

          {/* Col 2 */}
          <div>
            <p className="font-heading text-xs uppercase tracking-widest text-white/25 mb-5">Navigation</p>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
              {NAV.map((link) => (
                <button
                  key={link}
                  onClick={() => scrollTo(link)}
                  className="text-left font-body text-sm text-white/40 hover:text-gmo-green transition-colors duration-200"
                >
                  {link}
                </button>
              ))}
            </div>
          </div>

          {/* Col 3 */}
          <div>
            <p className="font-heading text-xs uppercase tracking-widest text-white/25 mb-5">Contact</p>
            <div className="space-y-3">
              {[
                { icon: MapPin, text: "Quartier Dapoya, Ouagadougou\n01 BP 3370, Burkina Faso" },
                { icon: Phone, text: "+226 25 33 19 00" },
                { icon: Mail, text: "infos@gmoburkina.com" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <Icon className="w-4 h-4 text-gmo-green flex-shrink-0 mt-0.5" />
                  <span className="font-body text-sm text-white/40 whitespace-pre-line leading-relaxed">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Giant GMOB */}
        <div className="text-center overflow-hidden -mb-6 select-none pointer-events-none">
          <span className="font-heading text-[100px] sm:text-[160px] lg:text-[220px] font-bold text-white/[0.025] leading-none">
            GMOB
          </span>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="font-body text-[11px] text-white/20 tracking-wider uppercase">
            © {new Date().getFullYear()} Groupe Madina Oumarou. Tous droits réservés.
          </p>
          <p className="font-body text-[11px] text-white/12 tracking-wider">OHADA · BURKINA FASO</p>
        </div>
      </div>
    </footer>
  );
}