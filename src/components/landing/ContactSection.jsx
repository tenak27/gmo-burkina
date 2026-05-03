import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const LOCATIONS = [
  { city: "Ouagadougou", status: "active" },
  { city: "Bobo Dioulasso", status: "active" },
  { city: "Diebougou", status: "active" },
  { city: "Ouahigouya", status: "active" },
  { city: "Banfora", status: "coming" },
  { city: "Dedougou", status: "coming" },
  { city: "Orodara", status: "coming" },
];

export default function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Message envoyé avec succès !");
      e.target.reset();
    }, 1500);
  };

  return (
    <section id="contact" className="bg-obsidian py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div ref={ref} className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left: Contact Info */}
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              className="font-body text-xs uppercase tracking-[0.3em] text-gold/60 block mb-4"
            >
              Contactez-nous
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="font-heading text-4xl lg:text-5xl font-bold text-concrete mb-8"
            >
              RESTONS EN
              <br />
              <span className="text-gold">CONTACT</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="space-y-6 mb-12"
            >
              {[
                { icon: MapPin, label: "Siège", value: "01 BP 3370 OUAGADOUGOU 01\nBURKINA FASO" },
                { icon: Phone, label: "Téléphone", value: "+226 25 33 19 00" },
                { icon: Mail, label: "E-mail", value: "infos@gmoburkina.com" },
                { icon: Clock, label: "Horaires", value: "Lun-Sam: 8h30-13h / 15h-18h\nVen: 8h30-12h30 / 15h-18h" },
              ].map((item) => (
                <div key={item.label} className="flex gap-4">
                  <div className="w-10 h-10 bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <p className="font-heading text-xs uppercase tracking-widest text-concrete/40 mb-1">
                      {item.label}
                    </p>
                    <p className="font-body text-sm text-concrete/80 whitespace-pre-line leading-relaxed">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Locations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
            >
              <p className="font-heading text-xs uppercase tracking-widest text-concrete/30 mb-4">
                Nos localités
              </p>
              <div className="flex flex-wrap gap-2">
                {LOCATIONS.map((loc) => (
                  <span
                    key={loc.city}
                    className={`font-body text-[11px] uppercase tracking-widest px-3 py-1.5 border ${
                      loc.status === "active"
                        ? "text-gold/80 border-gold/20"
                        : "text-concrete/25 border-concrete/10"
                    }`}
                  >
                    {loc.city}
                    {loc.status === "coming" && (
                      <span className="ml-1 text-[9px]">·BIENTÔT</span>
                    )}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="font-body text-[10px] uppercase tracking-widest text-concrete/40 block mb-2">
                    Nom complet
                  </label>
                  <Input
                    required
                    placeholder="Votre nom"
                    className="bg-concrete/5 border-concrete/15 text-concrete placeholder:text-concrete/25 font-body h-12 rounded-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="font-body text-[10px] uppercase tracking-widest text-concrete/40 block mb-2">
                    Téléphone
                  </label>
                  <Input
                    placeholder="+226 ..."
                    className="bg-concrete/5 border-concrete/15 text-concrete placeholder:text-concrete/25 font-body h-12 rounded-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="font-body text-[10px] uppercase tracking-widest text-concrete/40 block mb-2">
                  E-mail
                </label>
                <Input
                  type="email"
                  required
                  placeholder="votre@email.com"
                  className="bg-concrete/5 border-concrete/15 text-concrete placeholder:text-concrete/25 font-body h-12 rounded-none focus:border-gold"
                />
              </div>

              <div>
                <label className="font-body text-[10px] uppercase tracking-widest text-concrete/40 block mb-2">
                  Sujet
                </label>
                <Input
                  required
                  placeholder="Objet de votre message"
                  className="bg-concrete/5 border-concrete/15 text-concrete placeholder:text-concrete/25 font-body h-12 rounded-none focus:border-gold"
                />
              </div>

              <div>
                <label className="font-body text-[10px] uppercase tracking-widest text-concrete/40 block mb-2">
                  Message
                </label>
                <Textarea
                  required
                  rows={5}
                  placeholder="Décrivez votre besoin..."
                  className="bg-concrete/5 border-concrete/15 text-concrete placeholder:text-concrete/25 font-body rounded-none resize-none focus:border-gold"
                />
              </div>

              <Button
                type="submit"
                disabled={sending}
                className="w-full bg-gold text-obsidian hover:bg-amber font-heading font-bold text-sm h-14 rounded-none transition-colors duration-300"
              >
                {sending ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-obsidian/30 border-t-obsidian rounded-full animate-spin" />
                    Envoi en cours...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Envoyer le message
                    <Send className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}