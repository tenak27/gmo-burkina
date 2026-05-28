import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, LogIn, User, ChevronDown, MessageCircle } from "lucide-react";
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
{ label: "Rejoindre GMO", href: "/carrieres", isPage: true }];


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
  "betail": "Embauche"
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
    base44.entities.Product.list("name", 200).then((data) => {
      const products = (data || []).filter((p) => p.show_on_vitrine && p.is_active !== false);
      const cats = new Set();
      products.forEach((p) => cats.add(getCategoryForProduct(p.name)));
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
    if (window.location.pathname !== "/") {
      window.location.href = "/" + href;
      return;
    }
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
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

  return (
    <>
      <motion.nav
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-md shadow-sm border-b border-gray-100"
        style={{ pointerEvents: "auto" }}>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-18 py-3">
            {/* Hamburger - Left side */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-obsidian">
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Desktop Logo - Centered with seamless infinite ticker */}
            <button
              onClick={() => {window.scrollTo({ top: 0, behavior: "smooth" });}}
              className="flex-1 mx-6 relative overflow-hidden hidden sm:flex items-center"
              style={{ maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)", WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)" }}>
              
              {/* Track: 4 copies for a perfectly seamless loop */}
              <div
                className="flex items-center gap-8 shrink-0"
                style={{
                  width: "max-content",
                  animation: "navTicker 28s linear infinite"
                }}>
                {[0, 1, 2, 3].map((n) =>
                <React.Fragment key={n}>
                    <img
                    src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c6a35848c_Capturedcran2026-05-25112724AM.png"
                    alt="GMO"
                    className="h-[70px] sm:h-[90px] lg:h-[110px] w-auto object-contain flex-shrink-0" />
                    <span className="text-gmo-red font-body italic text-xs sm:text-sm lg:text-base font-semibold flex-shrink-0 flex items-center whitespace-nowrap">
                      Consommer local, c'est booster l'économie nationale !
                    </span>
                  </React.Fragment>
                )}
              </div>
            </button>
            
            {/* Mobile Logo */}
            <motion.button
              onClick={() => {window.scrollTo({ top: 0, behavior: "smooth" });}}
              className="flex-1 mx-3 sm:hidden flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}>
              <img
                src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c7662a636_logo-gmo2x.png"
                alt="GMO"
                className="h-8 w-auto object-contain" />
            </motion.button>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {isAuthenticated && dashLink &&
              <>
                  <Link
                  to={dashLink.to}
                  className="hidden sm:inline-flex items-center gap-1.5 bg-gmo-green/10 hover:bg-gmo-green/20 text-gmo-green font-heading text-xs font-bold px-3.5 py-2 rounded-xl transition-all">
                    <User className="w-3.5 h-3.5" />
                    {dashLink.label}
                  </Link>
                  <button
                  onClick={() => logout()}
                  className="hidden sm:inline-flex items-center gap-1.5 bg-gmo-red/10 hover:bg-gmo-red/20 text-gmo-red font-heading text-xs font-bold px-3.5 py-2 rounded-xl transition-all">
                    <LogIn className="w-3.5 h-3.5 rotate-180" />
                    Déconnexion
                  </button>
                </>
              }
              <a
                href="https://wa.me/+22670213831"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20BA5A] text-white font-heading text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-md">
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="hidden md:inline">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen &&
        <>
            {/* Backdrop to close menu on click */}
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm cursor-pointer" />
          
            <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 left-0 z-50 w-full max-w-sm h-full bg-white shadow-2xl overflow-y-auto pt-20">
            
              {/* Enhanced header with logo */}
              <div className="bg-gradient-to-r from-gmo-green/5 to-gmo-red/5 border-b border-gray-100 px-6 py-5 fixed top-0 left-0 right-0 max-w-sm z-50">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-heading text-lg font-black text-obsidian">MENU</span>
                  <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-obsidian/50 hover:text-gmo-red hover:bg-gmo-red/10 rounded-xl transition-all cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <img
                src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c7662a636_logo-gmo2x.png"
                alt="GMO"
                className="h-8 w-auto object-contain mx-auto" />
              </div>

              {/* Navigation links with enhanced styling */}
              <div className="px-4 py-2 space-y-1">
              {NAV_LINKS.map((link, i) =>
              link.label === "Produits" ?
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="mb-2">
                
                    <button
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  className="w-full px-4 py-3.5 flex items-center justify-between bg-gradient-to-r from-gmo-green/5 to-transparent rounded-xl hover:from-gmo-green/10 transition-all">
                      <div className="flex items-center gap-3">
                        <span className="w-1 h-4 bg-gmo-green rounded-full" />
                        <span className="font-heading text-base font-bold text-obsidian">
                          {link.label}
                        </span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-gmo-green transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {/* Categories dropdown */}
                    <AnimatePresence>
                      {categoriesOpen &&
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden mt-2 ml-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
                          <div className="px-4 py-3 space-y-1.5">
                            {categories.map((cat, idx) =>
                      <motion.button
                        key={cat}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        onClick={() => {
                          scrollTo("#produits");
                          setMobileOpen(false);
                        }}
                        className="block w-full text-left font-body text-sm text-obsidian/70 hover:text-gmo-green hover:bg-gmo-green/5 px-3 py-2.5 rounded-lg transition-all">
                                <span className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 bg-gmo-green rounded-full" />
                                  {cat}
                                </span>
                              </motion.button>
                      )}
                          </div>
                        </motion.div>
                  }
                    </AnimatePresence>
                  </motion.div> :
              link.isPage ?
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="mb-2">
                    <Link
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3.5 font-heading text-base font-bold text-obsidian hover:text-gmo-green bg-gradient-to-r from-transparent to-gmo-green/5 rounded-xl transition-all">
                      <div className="flex items-center gap-3">
                        <span className="w-1 h-4 bg-gmo-red rounded-full" />
                        {link.label}
                      </div>
                    </Link>
                  </motion.div> :

              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="mb-2">
                    <button
                  onClick={() => {
                    scrollTo(link.href);
                    setMobileOpen(false);
                  }}
                  className="w-full px-4 py-3.5 font-heading text-base font-bold text-obsidian hover:text-gmo-green bg-gradient-to-r from-transparent to-gmo-green/5 rounded-xl transition-all text-left">
                      <div className="flex items-center gap-3">
                        <span className="w-1 h-4 bg-gmo-green rounded-full" />
                        {link.label}
                      </div>
                    </button>
                  </motion.div>
              )}

              {/* Dashboard link for authenticated users */}
              {isAuthenticated && dashLink &&
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-2">
                







                
              </motion.div>
              }

              {/* Auth section — connexion jamais visible */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="mt-4 pt-4 border-t border-gray-100 hidden">
                
                {isAuthenticated ? null :










                <button
                  onClick={() => {
                    base44.auth.redirectToLogin(window.location.href);
                    setMobileOpen(false);
                  }}
                  className="w-full px-4 py-3.5 font-heading text-base font-bold text-obsidian bg-gradient-to-r from-obsidian/10 to-transparent rounded-xl hover:from-obsidian/15 transition-all text-left flex items-center gap-3">
                  <LogIn className="w-4 h-4 text-obsidian" />
                    Connexion
                  </button>
                }
              </motion.div>

              {/* WhatsApp button - Enhanced */}
              
















              
            </div>
          </motion.div>
          </>
        }
      </AnimatePresence>
    </>);

}