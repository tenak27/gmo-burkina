import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, Send, CheckCircle2, Bell, Shield, Zap } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function NewsletterSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    await base44.integrations.Core.SendEmail({
      to: "infos@gmoburkina.com",
      subject: `Inscription Newsletter — ${name || email}`,
      body: `Nouvelle inscription à la newsletter GMO Burkina.\n\nNom : ${name || "Non renseigné"}\nEmail : ${email}\nDate : ${new Date().toLocaleString("fr-FR")}`
    });
    setSuccess(true);
    setLoading(false);
    setEmail("");
    setName("");
  };

  const PERKS = [
    { icon: Bell, text: "Actualités & communiqués en avant-première" },
    { icon: Zap, text: "Offres exclusives et promotions réservées" },
    { icon: Shield, text: "Aucun spam · Désabonnement en 1 clic" },
  ];

  return (
    <section id="newsletter" className="bg-obsidian overflow-hidden relative">
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[500px] h-[300px] bg-gmo-green/6 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[200px] bg-gmo-red/5 rounded-full blur-[60px]" />
      </div>

      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-32 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-gmo-green/10 border border-gmo-green/20 rounded-full px-4 py-2 mb-6">
              <Mail className="w-3.5 h-3.5 text-gmo-green" />
              <span className="font-body text-xs text-gmo-green uppercase tracking-widest">Newsletter</span>
            </div>
            <h2 className="font-heading text-3xl lg:text-5xl font-bold text-concrete leading-tight mb-4">
              RESTEZ CONNECTÉS
              <br />
              <span className="text-gmo-green">À L'ESSENTIEL</span>
            </h2>
            <p className="font-body text-base text-concrete/45 max-w-xl mx-auto leading-relaxed">
              Rejoignez la communauté GMO et recevez nos actualités, offres exclusives et communications directement dans votre boîte mail.
            </p>
          </motion.div>

          {/* Perks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-6 mb-12"
          >
            {PERKS.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gmo-green/15 flex items-center justify-center flex-shrink-0">
                  <p.icon className="w-3 h-3 text-gmo-green" />
                </div>
                <span className="font-body text-xs text-concrete/55">{p.text}</span>
              </div>
            ))}
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="bg-white/[0.04] border border-white/10 rounded-2xl p-8 md:p-10"
          >
            {success ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-gmo-green/15 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-gmo-green" />
                </div>
                <p className="font-heading text-xl font-bold text-concrete mb-2">Inscription confirmée !</p>
                <p className="font-body text-sm text-concrete/45">Merci de rejoindre la communauté GMO. Vous recevrez prochainement nos actualités.</p>
                <button onClick={() => setSuccess(false)} className="mt-6 font-body text-xs text-gmo-green hover:underline">S'inscrire avec un autre email</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-[11px] uppercase tracking-widest text-concrete/35 block mb-2">Nom complet</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Votre nom"
                      className="w-full bg-white/6 border border-white/10 rounded-xl px-4 py-3 font-body text-sm text-concrete placeholder:text-concrete/25 focus:outline-none focus:border-gmo-green/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="font-body text-[11px] uppercase tracking-widest text-concrete/35 block mb-2">Email <span className="text-gmo-red">*</span></label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      required
                      className="w-full bg-white/6 border border-white/10 rounded-xl px-4 py-3 font-body text-sm text-concrete placeholder:text-concrete/25 focus:outline-none focus:border-gmo-green/50 transition-colors"
                    />
                  </div>
                </div>
                {error && <p className="font-body text-xs text-gmo-red">{error}</p>}
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full flex items-center justify-center gap-2.5 bg-gmo-green text-white font-heading font-bold text-sm py-3.5 rounded-xl btn-glow-green disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      S'inscrire à la Newsletter
                    </>
                  )}
                </button>
                <p className="font-body text-[10px] text-concrete/25 text-center">
                  En vous inscrivant, vous acceptez de recevoir nos communications. Désabonnement possible à tout moment.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}