import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";

const NAV_LINKS = [
  { label: "Accueil", href: "#accueil" },
  { label: "Services", href: "#services" },
  { label: "À Propos", href: "#apropos" },
  { label: "Produits", href: "#produits" },
  { label: "GMO Foot", href: "#gmofoot" },
  { label: "Galerie", href: "#galerie" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <button onClick={() => scrollTo("#accueil")} className="flex items-center gap-3">
              <img
                src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c7662a636_logo-gmo2x.png"
                alt="GMO Logo"
                className={`h-10 w-auto object-contain transition-all duration-300 ${!scrolled ? "brightness-0 invert" : ""}`}
              />
            </button>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-7">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className={`font-body text-sm transition-colors duration-300 tracking-wide relative group ${
                    scrolled ? "text-obsidian/60 hover:text-gmo-green" : "text-white/70 hover:text-white"
                  }`}
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-gmo-green group-hover:w-full transition-all duration-300 rounded-full" />
                </button>
              ))}
              <a
                href="tel:+22625331900"
                className="ml-2 flex items-center gap-2 bg-gmo-green text-white font-heading font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-gmo-green/90 hover:shadow-lg hover:shadow-gmo-green/25 hover:-translate-y-0.5 transition-all duration-300"
              >
                <Phone className="w-4 h-4" />
                Appeler
              </a>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2 transition-colors ${scrolled ? "text-obsidian" : "text-white"}`}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-8 overflow-y-auto"
          >
            <div className="flex flex-col gap-5">
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => scrollTo(link.href)}
                  className="font-heading text-2xl text-obsidian/80 hover:text-gmo-green text-left transition-colors border-b border-gray-100 pb-4"
                >
                  {link.label}
                </motion.button>
              ))}
              <a
                href="tel:+22625331900"
                className="mt-4 flex items-center justify-center gap-2 bg-gmo-green text-white font-heading font-bold text-base px-6 py-4 rounded-xl"
              >
                <Phone className="w-5 h-5" />
                +226 25 33 19 00
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}