import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown, Phone, LogIn, Menu, X, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";

const PANELS = [
  {
    img: "https://gmobfaso.com/assets/img/slides/slide-1.jpg",
    label: "DISTRIBUTION",
    sub: "Nationale & Internationale",
    tagline: "Livraisons partout au Burkina Faso",
    color: "#1A7A2E",
  },
  {
    img: "https://gmobfaso.com/assets/img/slides/slide-2.jpg",
    label: "TRANSPORT",
    sub: "Logistique de pointe",
    tagline: "Flotte moderne, délais garantis",
    color: "#CC1717",
  },
  {
    img: "https://gmobfaso.com/assets/img/slides/slide-3.jpg",
    label: "QUALITÉ",
    sub: "Produits locaux certifiés",
    tagline: "Excellence & responsabilité",
    color: "#F5C400",
  },
  {
    img: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/1e2be0905_generated_51987d61.png",
    label: "EXPANSION",
    sub: "Afrique de l'Ouest",
    tagline: "Côte d'Ivoire · Mali · Niger",
    color: "#1A7A2E",
  },
];

const TICKER = ["OUAGADOUGOU → BOBO DIOULASSO", "LOGISTIQUE 24/7", "DIEBOUGOU → OUAHIGOUYA", "DISTRIBUTION NATIONALE", "BURKINA FASO", "CÔTE D'IVOIRE · MALI · NIGER"];

const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "À Propos", href: "#apropos" },
  { label: "Produits", href: "#produits" },
  { label: "GMO Foot", href: "#gmofoot" },
  { label: "Contact", href: "#contact" },
];

export default function HeroSection() {
  const [hovered, setHovered] = useState(null);
  const [autoIdx, setAutoIdx] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (hovered !== null) return;
    const t = setInterval(() => setAutoIdx(i => (i + 1) % PANELS.length), 3500);
    return () => clearInterval(t);
  }, [hovered]);

  const activeIdx = hovered !== null ? hovered : autoIdx;
  const active = PANELS[activeIdx];

  const scrollTo = (href) => {
    setMobileMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const getDashboardLink = () => {
    if (!user) return null;
    if (user.role === "admin") return { to: "/admin", label: "Dashboard" };
    if (user.role === "detaillant") return { to: "/detaillant", label: "Mon Espace" };
    return { to: "/client", label: "Mon Espace" };
  };
  const dashLink = getDashboardLink();

  return (
    <section id="accueil" className="relative bg-obsidian overflow-hidden" style={{ height: "100svh", minHeight: 620 }}>

      {/* BG transitions */}
      <AnimatePresence mode="sync">
        <motion.div key={activeIdx} className="absolute inset-0"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img src={active.img} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(105deg, rgba(20,20,22,0.97) 0%, rgba(20,20,22,0.84) 36%, rgba(20,20,22,0.28) 68%, rgba(20,20,22,0.10) 100%)"
          }} />
        </motion.div>
      </AnimatePresence>

      {/* ── EMBEDDED NAVBAR (visible only on hero) ── */}
      <div className="absolute top-0 left-0 right-0 z-30">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <img
                src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c7662a636_logo-gmo2x.png"
                alt="GMO"
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </motion.div>

            {/* Desktop nav */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="hidden lg:flex items-center gap-7"
            >
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="font-body text-sm text-white/60 hover:text-white transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-white/60 group-hover:w-full transition-all duration-300 rounded-full" />
                </button>
              ))}
            </motion.div>

            {/* Right actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="hidden lg:flex items-center gap-3"
            >
              {isAuthenticated && dashLink ? (
                <>
                  <Link
                    to={dashLink.to}
                    className="flex items-center gap-2 text-white/65 font-heading font-semibold text-sm hover:text-white border border-white/20 px-4 py-2 rounded-lg hover:border-white/50 hover:bg-white/8 transition-all"
                  >
                    <User className="w-3.5 h-3.5" />
                    {dashLink.label}
                  </Link>
                  <button
                    onClick={() => logout()}
                    className="font-body text-xs text-white/30 hover:text-white/70 transition-colors"
                  >
                    Déco.
                  </button>
                </>
              ) : (
                <button
                  onClick={() => base44.auth.redirectToLogin(window.location.href)}
                  className="flex items-center gap-2 text-white/65 font-heading font-bold text-sm border border-white/20 px-4 py-2 rounded-lg hover:border-white/50 hover:text-white hover:bg-white/8 transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Connexion
                </button>
              )}
              <a
                href="tel:+22625331900"
                className="flex items-center gap-2 bg-gmo-green text-white font-heading font-bold text-sm px-5 py-2.5 rounded-lg btn-glow-green"
              >
                <Phone className="w-4 h-4" />
                Appeler
              </a>
            </motion.div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-white p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 bg-obsidian/95 backdrop-blur-md flex flex-col items-center justify-center gap-6"
          >
            {NAV_LINKS.map((link, i) => (
              <motion.button
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => scrollTo(link.href)}
                className="font-heading text-3xl font-bold text-white/80 hover:text-white"
              >
                {link.label}
              </motion.button>
            ))}
            {isAuthenticated && dashLink && (
              <Link to={dashLink.to} onClick={() => setMobileMenuOpen(false)}
                className="font-heading text-3xl font-bold text-gmo-green">
                {dashLink.label}
              </Link>
            )}
            <a href="tel:+22625331900"
              className="mt-4 flex items-center gap-2 bg-gmo-green text-white font-heading font-bold text-base px-8 py-4 rounded-xl">
              <Phone className="w-5 h-5" /> Appeler
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CONTENT ── */}
      <div className="relative z-10 h-full flex flex-col lg:flex-row">

        {/* LEFT — text (50%) */}
        <div className="flex flex-col justify-center px-4 sm:px-8 lg:px-12 xl:px-16 pt-20 pb-16 lg:py-0 w-full lg:w-1/2 flex-shrink-0">

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-5 h-[2px] bg-gmo-green" />
            <span className="font-body text-[10px] uppercase tracking-[0.3em] text-gmo-green whitespace-nowrap">
              Groupe Madina Oumarou · BF
            </span>
          </motion.div>

          {/* Animated title */}
          <div className="mb-7" style={{ minHeight: "10rem" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -18, filter: "blur(4px)" }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <h1
                  className="font-heading font-black leading-none tracking-tight mb-4 drop-shadow-lg"
                  style={{ fontSize: "clamp(3rem, 5.5vw, 6rem)", color: active.color, textShadow: "0 2px 20px rgba(0,0,0,0.6)" }}
                >
                  {active.label}
                </h1>
                <p className="font-heading text-white font-bold text-xl mb-2 leading-snug drop-shadow-md">
                  {active.sub}
                </p>
                <p className="font-body text-white/75 text-sm tracking-wide drop-shadow">
                  {active.tagline}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress dots */}
          <div className="flex items-center gap-2 mb-8">
            {PANELS.map((p, i) => (
              <button
                key={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => { setAutoIdx(i); }}
                className="transition-all duration-500 rounded-full flex-shrink-0 focus:outline-none"
                style={{
                  width: i === activeIdx ? 32 : 8,
                  height: 8,
                  background: i === activeIdx ? p.color : "rgba(255,255,255,0.18)",
                }}
              />
            ))}
            <span className="ml-2 font-body text-[10px] text-white/25 tracking-widest">
              {String(activeIdx + 1).padStart(2, "0")} / {String(PANELS.length).padStart(2, "0")}
            </span>
          </div>

          <p className="font-body text-sm text-white/80 leading-relaxed max-w-xs mb-8">
            <span className="text-white font-semibold">GMO Burkina</span> — votre partenaire de confiance pour la distribution, le transport et la logistique au Burkina Faso et en Afrique de l'Ouest. Plus de <span className="text-gmo-green font-semibold">15 ans</span> d'expertise au service de vos approvisionnements.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => scrollTo("#contact")}
              className="group bg-gmo-green text-white font-heading font-bold text-sm px-7 py-3.5 rounded-lg flex items-center gap-2 btn-glow-green"
            >
              Demander un devis
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => scrollTo("#services")}
              className="border border-white/15 text-white/60 font-heading font-medium text-sm px-7 py-3.5 rounded-lg hover:border-white/40 hover:text-white hover:bg-white/5 transition-all duration-300"
            >
              Nos services
            </button>
          </div>

          <motion.div
            className="hidden lg:flex items-center gap-2 mt-12 text-white/20"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-4 h-4" />
            <span className="font-body text-[10px] uppercase tracking-widest">Défiler</span>
          </motion.div>
        </div>

        {/* RIGHT — vertical accordion panels (50%) */}
        <div className="hidden lg:flex w-1/2 min-w-0 gap-[6px] py-4 pr-4">
          {PANELS.map((panel, i) => {
            const isActive = i === activeIdx;
            return (
              <motion.div
                key={panel.label}
                className="relative overflow-hidden rounded-2xl cursor-pointer"
                animate={{ flex: isActive ? 5.5 : 1 }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Image */}
                <motion.img
                  src={panel.img}
                  alt={panel.label}
                  className="absolute inset-0 w-full h-full object-cover"
                  animate={{ scale: isActive ? 1.12 : 1.02 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />

                {/* Overlay */}
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    background: isActive
                      ? `linear-gradient(175deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.2) 40%, ${panel.color}CC 100%)`
                      : "linear-gradient(to top, rgba(10,10,12,0.90) 0%, rgba(10,10,12,0.50) 60%, rgba(10,10,12,0.08) 100%)",
                  }}
                  transition={{ duration: 0.65 }}
                />

                {/* Top accent line */}
                <motion.div
                  className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl"
                  style={{ background: panel.color }}
                  animate={{ opacity: isActive ? 1 : 0.2, scaleX: isActive ? 1 : 0.6 }}
                  transition={{ duration: 0.4 }}
                  style={{ background: panel.color, transformOrigin: "left" }}
                />

                {/* Panel number */}
                <div className="absolute top-5 right-5 font-heading text-[11px] text-white/15 tracking-[0.3em]">
                  {String(i + 1).padStart(2, "0")}
                </div>

                {/* Collapsed state */}
                <AnimatePresence>
                  {!isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 flex flex-col items-center justify-end pb-10 gap-4"
                    >
                      <div className="w-px h-14 rounded-full" style={{ background: panel.color, opacity: 0.6 }} />
                      <p
                        className="font-heading font-black text-white text-[0.7rem] tracking-[0.45em] uppercase"
                        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                      >
                        {panel.label}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Expanded content */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 32 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.5, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 flex flex-col justify-end p-8"
                    >
                      <motion.div
                        className="h-[2px] rounded-full mb-5 bg-white/50"
                        initial={{ width: 0 }}
                        animate={{ width: 48 }}
                        transition={{ duration: 0.55, delay: 0.32 }}
                      />
                      <p
                        className="font-heading font-black text-white leading-none tracking-tight mb-2 drop-shadow-2xl"
                        style={{ fontSize: "clamp(2.2rem, 3.8vw, 4rem)" }}
                      >
                        {panel.label}
                      </p>
                      <p className="font-body text-white/65 text-sm uppercase tracking-[0.22em] mb-1.5">
                        {panel.sub}
                      </p>
                      <p className="font-body text-white/35 text-xs tracking-wide">
                        {panel.tagline}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Ticker */}
      <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/6 bg-black/20 backdrop-blur-sm">
        <div className="overflow-hidden py-3">
          <div className="animate-ticker flex whitespace-nowrap">
            {[...TICKER, ...TICKER].map((item, i) => (
              <span key={i} className="font-body text-[10px] uppercase tracking-[0.28em] text-white/60 mx-10">
                {item}<span className="ml-10 text-gmo-red/50">●</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}