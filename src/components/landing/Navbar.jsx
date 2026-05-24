import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, LogIn, User, ChevronDown } from "lucide-react";
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

const CATEGORY_MAP = {
  "hamilton": "Cigarettes",
  "excellence": "Cigarettes",
  "dunhill": "Cigarettes",
  "farine gmf": "Alimentaire",
  "farine": "Alimentaire",
  "huile sn citec": "Alimentaire",
  "huile savor": "Alimentaire",
  "sucre": "Alimentaire",
  "savon citec": "Hygiène",
  "savon n°": "Hygiène",
  "cobifa": "Alimentaire",
  "tourteaux": "Embauche",
  "betail": "Embauche",
};

const getCategoryForProduct = (name) => {
  const normalized = name.toLowerCase();
  for (const [key, cat] of Object.entries(CATEGORY_MAP)) {
    if (normalized.includes(key)) return cat;
  }
  return "Alimentaire";
};

export default function Navbar({ heroHeight }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    base44.entities.Product.list("name", 200).then(data => {
      const products = (data || []).filter(p => p.show_on_vitrine && p.is_active !== false);
      const cats = new Set();
      products.forEach(p => cats.add(getCategoryForProduct(p.name)));
      setCategories(["Tous", ...Array.from(cats)]);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const threshold = heroHeight || window.innerHeight * 0.85;
    const handleScroll = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [heroHeight]);

  const scrollTo = (href) => {
    setMobileOpen(false);
    // If not on home page, navigate there first then scroll
    if (window.location.pathname !== "/") {
      window.location.href = "/" + href;
      return;
    }
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      // Try after a short delay in case page is still loading
      setTimeout(() => {
        const el2 = document.querySelector(href);
        if (el2) el2.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
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
            {/* Hamburger - Left side */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-obsidian"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo - Centered */}
            <button 
              onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="flex-shrink-0"
            >
              <img
                src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/dbd96d28b_logo-gmo2x-EVZXLeXs.png"
                alt="GMO"
                className="h-[100px] w-auto object-contain"
              />
            </button>

            {/* Client Space / Login - Right side */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to={dashLink?.to || "/client"}
                    className="font-heading text-sm font-bold text-gmo-green hover:text-gmo-green/70 transition-colors"
                  >
                    {dashLink?.label || "Mon Espace"}
                  </Link>
                  <button
                    onClick={() => logout()}
                    className="font-heading text-sm font-bold text-gmo-red hover:text-gmo-red/70 transition-colors"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <button
                  onClick={() => base44.auth.redirectToLogin(window.location.href)}
                  className="font-heading text-sm font-bold text-obsidian hover:text-gmo-green transition-colors"
                >
                  Connexion
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 z-50 w-full max-w-sm h-full bg-white shadow-2xl overflow-y-auto"
          >
            {/* Navigation links - ALL menu items in hamburger */}
            <div className="px-6 py-4 space-y-1">
              {NAV_LINKS.map((link, i) => (
                link.label === "Produits" ? (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-gray-100"
                  >
                    <button
                      onClick={() => setCategoriesOpen(!categoriesOpen)}
                      className="w-full py-4 flex items-center justify-between text-left"
                    >
                      <span className="font-heading text-lg text-obsidian hover:text-gmo-green transition-colors">
                        {link.label}
                      </span>
                      <ChevronDown className={`w-5 h-5 text-obsidian/40 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {/* Categories dropdown */}
                    <AnimatePresence>
                      {categoriesOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden bg-gray-50 rounded-xl mb-3"
                        >
                          <div className="px-4 py-3 space-y-2">
                            {categories.map((cat) => (
                              <button
                                key={cat}
                                onClick={() => {
                                  scrollTo("#produits");
                                  setMobileOpen(false);
                                }}
                                className="block w-full text-left font-body text-sm text-obsidian/70 hover:text-gmo-green hover:bg-white px-3 py-2 rounded-lg transition-colors"
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : link.isPage ? (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-gray-100"
                  >
                    <Link
                      to={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block py-4 font-heading text-lg text-gmo-green hover:text-gmo-green/70 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-gray-100"
                  >
                    <button
                      onClick={() => {
                        scrollTo(link.href);
                        setMobileOpen(false);
                      }}
                      className="w-full py-4 font-heading text-lg text-obsidian hover:text-gmo-green transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  </motion.div>
                )
              ))}

              {/* Dashboard link for authenticated users */}
              {isAuthenticated && dashLink && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="border-b border-gray-100"
                >
                  <Link
                    to={dashLink.to}
                    onClick={() => setMobileOpen(false)}
                    className="block py-4 font-heading text-lg text-gmo-green hover:text-gmo-green/70 transition-colors"
                  >
                    {dashLink.label}
                  </Link>
                </motion.div>
              )}

              {/* Login/Logout */}
              {isAuthenticated ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 }}
                  className="border-b border-gray-100"
                >
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="w-full py-4 font-heading text-lg text-gmo-red hover:text-gmo-red/70 transition-colors text-left"
                  >
                    Déconnexion
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 }}
                  className="border-b border-gray-100"
                >
                  <button
                    onClick={() => {
                      base44.auth.redirectToLogin(window.location.href);
                      setMobileOpen(false);
                    }}
                    className="w-full py-4 font-heading text-lg text-obsidian hover:text-gmo-green transition-colors text-left"
                  >
                    Connexion
                  </button>
                </motion.div>
              )}

              {/* WhatsApp button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="pt-4 pb-8"
              >
                <a
                  href="https://wa.me/+22670213831"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20BA5A] text-white font-heading font-bold text-base px-6 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
                  title="+226 70 21 38 31"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M17.6 6.4C16 4.9 13.9 4 11.8 4 7.3 4 3.6 7.7 3.6 12.2c0 1.7.4 3.3 1.3 4.8L4 20l5.2-1.3c1.4.8 3 1.2 4.6 1.2 4.5 0 8.2-3.7 8.2-8.2 0-2.1-.9-4.2-2.4-5.7zm-5.8 12.9c-1.4 0-2.9-.4-4.1-1.1l-.3-.2-3.1.8.8-3.1-.2-.3c-.8-1.2-1.2-2.7-1.2-4.1 0-3.8 3.1-6.9 6.9-6.9 1.9 0 3.6.8 4.9 2 1.3 1.3 2 3 2 4.9 0 3.8-3.1 6.9-6.9 6.9z"/>
                  </svg>
                  <span>WhatsApp +226 70 21 38 31</span>
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}