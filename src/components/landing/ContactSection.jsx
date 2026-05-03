import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
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
    <section id="contact" className="bg-light-gray py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div ref={ref} className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              className="flex items-center gap-3 mb-4"
            >
              <div className="w-6 h-[2px] bg-gmo-green" />
              <span className="font-body text-xs uppercase tracking-[0.3em] text-gmo-green">Contactez-nous</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading text-4xl lg:text-5xl font-bold text-obsidian mb-4"
            >
              RESTONS EN
              <br />
              <span className="text-gmo-green">CONTACT</span>
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="h-1 w-20 bg-gradient-to-r from-gmo-green to-gmo-red mb-10 origin-left rounded-full"
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="space-y-5 mb-10"
            >
              {[
                { icon: MapPin, label: "Siège Social", value: "Quartier Dapoya — Parcelle 05, Lot 29, Section BI\n01 BP 3370, Ouagadougou, Burkina Faso" },
                { icon: Phone, label: "Téléphone", value: "+226 25 33 19 00\n+226 76 21 16 33 (WhatsApp)" },
                { icon: Mail, label: "E-mail", value: "infos@gmoburkina.com" },
                { icon: Clock, label: "Horaires", value: "Lun-Sam: 8h30-13h / 15h-18h\nVen: 8h30-12h30 / 15h-18h" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex gap-4 items-start p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gmo-green/20 transition-all duration-300"
                >
                  <div className="w-10 h-10 bg-gmo-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-gmo-green" />
                  </div>
                  <div>
                    <p className="font-heading text-xs uppercase tracking-widest text-obsidian/40 mb-1">{item.label}</p>
                    <p className="font-body text-sm text-obsidian/75 whitespace-pre-line leading-relaxed">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7 }}
            >
              <p className="font-heading text-xs uppercase tracking-widest text-obsidian/35 mb-4">Nos localités</p>
              <div className="flex flex-wrap gap-2">
                {LOCATIONS.map((loc) => (
                  <span
                    key={loc.city}
                    className={`font-body text-[11px] uppercase tracking-widest px-3 py-1.5 rounded-full border transition-all ${
                      loc.status === "active"
                        ? "text-gmo-green bg-gmo-green/8 border-gmo-green/20"
                        : "text-obsidian/30 bg-gray-50 border-gray-200"
                    }`}
                  >
                    {loc.city}
                    {loc.status === "coming" && <span className="ml-1 text-[9px]">· BIENTÔT</span>}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
          >
            <p className="font-heading text-lg font-bold text-obsidian mb-6">Envoyez-nous un message</p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-[10px] uppercase tracking-widest text-obsidian/45 block mb-2">Nom complet</label>
                  <Input required placeholder="Votre nom" className="h-12 rounded-xl border-gray-200 focus:border-gmo-green focus:ring-gmo-green/20" />
                </div>
                <div>
                  <label className="font-body text-[10px] uppercase tracking-widest text-obsidian/45 block mb-2">Téléphone</label>
                  <Input placeholder="+226 ..." className="h-12 rounded-xl border-gray-200 focus:border-gmo-green" />
                </div>
              </div>
              <div>
                <label className="font-body text-[10px] uppercase tracking-widest text-obsidian/45 block mb-2">E-mail</label>
                <Input type="email" required placeholder="votre@email.com" className="h-12 rounded-xl border-gray-200 focus:border-gmo-green" />
              </div>
              <div>
                <label className="font-body text-[10px] uppercase tracking-widest text-obsidian/45 block mb-2">Sujet</label>
                <Input required placeholder="Objet de votre message" className="h-12 rounded-xl border-gray-200 focus:border-gmo-green" />
              </div>
              <div>
                <label className="font-body text-[10px] uppercase tracking-widest text-obsidian/45 block mb-2">Message</label>
                <Textarea required rows={4} placeholder="Décrivez votre besoin..." className="rounded-xl border-gray-200 focus:border-gmo-green resize-none" />
              </div>
              <Button
                type="submit"
                disabled={sending}
                className="w-full bg-gmo-green text-white hover:bg-gmo-green/90 font-heading font-bold text-sm h-13 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-gmo-green/25 hover:-translate-y-0.5"
              >
                {sending ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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