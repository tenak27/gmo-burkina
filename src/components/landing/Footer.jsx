import React from "react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-obsidian border-t border-concrete/5 relative overflow-hidden">
      {/* Giant text */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-16">
          <div className="grid md:grid-cols-3 gap-8 mb-16 relative z-10">
            {/* Col 1 */}
            <div>
              <img
                src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c7662a636_logo-gmo2x.png"
                alt="GMO Logo"
                className="h-12 w-auto object-contain mb-4"
              />
              <p className="font-body text-sm text-concrete/40 leading-relaxed">
                Groupe Madina Oumarou — Leader de la distribution au Burkina Faso. 
                Entreprise citoyenne et socialement responsable.
              </p>
            </div>

            {/* Col 2 */}
            <div>
              <p className="font-heading text-xs uppercase tracking-widest text-concrete/30 mb-4">
                Navigation
              </p>
              <div className="space-y-2">
                {["Accueil", "Services", "À Propos", "Produits", "Galerie", "Contact"].map((link) => (
                  <button
                    key={link}
                    onClick={() => {
                      const id = link.toLowerCase().replace("à propos", "apropos").replace(" ", "");
                      document.querySelector(`#${id === "accueil" ? "accueil" : id}`)?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="block font-body text-sm text-concrete/40 hover:text-gmo-green transition-colors"
                  >
                    {link}
                  </button>
                ))}
              </div>
            </div>

            {/* Col 3 */}
            <div>
              <p className="font-heading text-xs uppercase tracking-widest text-concrete/30 mb-4">
                Contact
              </p>
              <div className="space-y-2 font-body text-sm text-concrete/40">
                <p>01 BP 3370 Ouagadougou 01</p>
                <p>Burkina Faso</p>
                <p>+226 25 33 19 00</p>
                <a href="mailto:infos@gmoburkina.com" className="hover:text-gmo-green transition-colors block">
                  infos@gmoburkina.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Giant GMOB text */}
        <div className="text-center overflow-hidden -mb-4 lg:-mb-8">
          <span className="font-heading text-[120px] sm:text-[180px] lg:text-[250px] font-bold text-concrete/[0.03] leading-none select-none">
            GMOB
          </span>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-concrete/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-body text-[11px] text-concrete/25 tracking-wider uppercase">
            © {new Date().getFullYear()} Groupe Madina Oumarou. Tous droits réservés.
          </p>
          <p className="font-body text-[11px] text-concrete/15 tracking-wider">
            OHADA · BURKINA FASO
          </p>
        </div>
      </div>
    </footer>
  );
}