import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, LogIn, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";

const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "À Propos", href: "#apropos" },
  { label: "Produits", href: "#produits" },
  { label: "GMO Foot", href: "#gmofoot" },
  { label: "Galerie", href: "#galerie" },
  { label: "Contact", href: "#contact" },
  { label: "Rejoindre GMO", href: "/carrieres", isPage: true },
];

export default function Navbar({ heroHeight }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const threshold = heroHeight || window.innerHeight * 0.85;
    const handleScroll = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [heroHeight]);

  const scrollTo = (href) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const getDashboardLink = () => {
    if (!user) return null;
    if (user.role === "admin") return { to: "/admin", label: "Dashboard Admin" };
    if (user.role === "detaillant") return { to: "/detaillant", label: "Espace Détaillant" };
    return { to: "/client", label: "Mon Espace" };
  };

  const dashLink = getDashboardLink();

  // Hidden while on hero, slides in after
  return (
    <>
      <motion.nav
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-md shadow-sm border-b border-gray-100"
        style={{ pointerEvents: "auto" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-18 py-3">
            {/* Logo */}
            <button onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); }}>
              <img
                src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/dbd96d28b_logo-gmo2x-EVZXLeXs.png"
                alt="GMO"
                className="h-14 w-auto object-contain"
              />
            </button>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                link.isPage ? (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="font-body text-sm font-semibold text-gmo-green hover:text-gmo-green/70 transition-colors relative group border border-gmo-green/30 px-3 py-1 rounded-full hover:bg-gmo-green/8"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <button
                    key={link.href}
                    onClick={() => scrollTo(link.href)}
                    className="font-body text-sm text-obsidian/55 hover:text-gmo-green transition-colors relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-gmo-green group-hover:w-full transition-all duration-300 rounded-full" />
                  </button>
                )
              ))}
            </div>

            {/* Right CTAs */}
            <div className="hidden lg:flex items-center gap-3">
              {isAuthenticated && dashLink ? (
                <>
                  <Link
                    to={dashLink.to}
                    className="flex items-center gap-2 font-heading font-bold text-sm text-obsidian/70 hover:text-gmo-green transition-colors px-4 py-2 rounded-lg hover:bg-gmo-green/8"
                  >
                    <User className="w-4 h-4" />
                    {dashLink.label}
                  </Link>
                  <button
                    onClick={() => logout()}
                    className="font-body text-xs text-obsidian/35 hover:text-gmo-red transition-colors"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <button
                  onClick={() => base44.auth.redirectToLogin(window.location.href)}
                  className="flex items-center gap-2 border border-gray-200 text-obsidian/60 font-heading font-bold text-sm px-4 py-2 rounded-lg hover:border-gmo-green hover:text-gmo-green transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  Connexion
                </button>
              )}
              <a
                href="https://wa.me/+22670213831"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-heading font-bold text-sm px-5 py-2.5 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M17.6 6.4C16 4.9 13.9 4 11.8 4 7.3 4 3.6 7.7 3.6 12.2c0 1.7.4 3.3 1.3 4.8L4 20l5.2-1.3c1.4.8 3 1.2 4.6 1.2 4.5 0 8.2-3.7 8.2-8.2 0-2.1-.9-4.2-2.4-5.7zm-5.8 12.9c-1.4 0-2.9-.4-4.1-1.1l-.3-.2-3.1.8.8-3.1-.2-.3c-.8-1.2-1.2-2.7-1.2-4.1 0-3.8 3.1-6.9 6.9-6.9 1.9 0 3.6.8 4.9 2 1.3 1.3 2 3 2 4.9 0 3.8-3.1 6.9-6.9 6.9z"/>
                </svg>
                WhatsApp
              </a>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-obsidian"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && scrolled && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-white pt-20 px-8 overflow-y-auto"
          >
            <div className="flex flex-col gap-5 py-6">
              {NAV_LINKS.map((link, i) => (
                link.isPage ? (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-heading text-2xl text-gmo-green text-left border-b border-gray-100 pb-4"
                  >
                    {link.label} →
                  </Link>
                ) : (
                  <motion.button
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    onClick={() => scrollTo(link.href)}
                    className="font-heading text-2xl text-obsidian/80 hover:text-gmo-green text-left border-b border-gray-100 pb-4"
                  >
                    {link.label}
                  </motion.button>
                )
              ))}
              {isAuthenticated && dashLink && (
                <Link
                  to={dashLink.to}
                  onClick={() => setMobileOpen(false)}
                  className="font-heading text-2xl text-gmo-green text-left border-b border-gray-100 pb-4"
                >
                  {dashLink.label}
                </Link>
              )}
              <a
                href="https://wa.me/+22670213831"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 bg-emerald-500 text-white font-heading font-bold text-base px-6 py-4 rounded-xl"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M17.6 6.4C16 4.9 13.9 4 11.8 4 7.3 4 3.6 7.7 3.6 12.2c0 1.7.4 3.3 1.3 4.8L4 20l5.2-1.3c1.4.8 3 1.2 4.6 1.2 4.5 0 8.2-3.7 8.2-8.2 0-2.1-.9-4.2-2.4-5.7zm-5.8 12.9c-1.4 0-2.9-.4-4.1-1.1l-.3-.2-3.1.8.8-3.1-.2-.3c-.8-1.2-1.2-2.7-1.2-4.1 0-3.8 3.1-6.9 6.9-6.9 1.9 0 3.6.8 4.9 2 1.3 1.3 2 3 2 4.9 0 3.8-3.1 6.9-6.9 6.9z"/>
                </svg>
                WhatsApp +226 70 21 38 31
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}