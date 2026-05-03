import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";

const NAV_LINKS = [
  { label: "Accueil", href: "#accueil" },
  { label: "Services", href: "#services" },
  { label: "À Propos", href: "#apropos" },
  { label: "Produits", href: "#produits" },
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
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-obsidian/95 backdrop-blur-md shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <button onClick={() => scrollTo("#accueil")} className="flex items-center gap-3">
              <span className="font-heading text-2xl font-bold text-gold tracking-tight">
                GMOB
              </span>
              <span className="hidden sm:block w-px h-6 bg-gold/30" />
              <span className="hidden sm:block font-body text-xs text-concrete/60 uppercase tracking-widest">
                Groupe Madina Oumarou
              </span>
            </button>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="font-body text-sm text-concrete/70 hover:text-gold transition-colors duration-300 tracking-wide uppercase"
                >
                  {link.label}
                </button>
              ))}
              <a
                href="tel:+22625331900"
                className="ml-4 flex items-center gap-2 bg-gold text-obsidian font-heading font-bold text-sm px-5 py-2.5 hover:bg-amber transition-colors duration-300"
              >
                <Phone className="w-4 h-4" />
                Appeler
              </a>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-concrete p-2"
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
            className="fixed inset-0 z-40 bg-obsidian/98 backdrop-blur-lg pt-24 px-8"
          >
            <div className="flex flex-col gap-6">
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => scrollTo(link.href)}
                  className="font-heading text-3xl text-concrete/90 hover:text-gold text-left transition-colors"
                >
                  {link.label}
                </motion.button>
              ))}
              <a
                href="tel:+22625331900"
                className="mt-6 flex items-center justify-center gap-2 bg-gold text-obsidian font-heading font-bold text-lg px-6 py-4"
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