import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";

const LOCATIONS = [
  { city: "Ouagadougou", status: "active" },
  { city: "Bobo Dioulasso", status: "active" },
  { city: "Ouahigouya", status: "active" },
  { city: "Dori", status: "active" },
  { city: "Boromo", status: "active" },
  { city: "Diebougou", status: "active" },
  { city: "Pô", status: "active" },
  { city: "Banfora", status: "coming" },
  { city: "Dédougou", status: "coming" },
  { city: "Orodara", status: "coming" },
];

export default function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", company: "", subject: "", message: "" });

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await base44.integrations.Core.SendEmail({
      to: "infos@gmoburkina.com",
      subject: `[Contact Site] ${form.subject} — ${form.name}`,
      body: `
<h2>Nouveau message depuis le site GMO Burkina</h2>
<p><strong>Nom :</strong> ${form.name}</p>
<p><strong>Entreprise :</strong> ${form.company || "—"}</p>
<p><strong>Email :</strong> ${form.email}</p>
<p><strong>Téléphone :</strong> ${form.phone || "—"}</p>
<p><strong>Sujet :</strong> ${form.subject}</p>
<hr/>
<p><strong>Message :</strong></p>
<p>${form.message.replace(/\n/g, "<br/>")}</p>
      `,
      from_name: "GMO Burkina — Site Web",
    });
    setSending(false);
    toast.success("Message envoyé ! Nous vous répondrons rapidement.");
    setForm({ name: "", phone: "", email: "", company: "", subject: "", message: "" });
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
                { icon: Phone, label: "Téléphone", value: "+226 25 33 19 00\n+226 70 21 38 31 (WhatsApp)" },
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
            className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100"
          >
            <p className="font-heading text-lg font-bold text-obsidian mb-1">Demande de devis / Contact</p>
            <p className="text-xs text-obsidian/45 font-body mb-6">Remplissez ce formulaire, notre équipe vous répond sous 24h.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-[10px] uppercase tracking-widest text-obsidian/45 block mb-2">Nom complet *</label>
                  <Input required name="name" value={form.name} onChange={handleChange} placeholder="Votre nom" className="h-12 rounded-xl border-gray-200 focus:border-gmo-green" />
                </div>
                <div>
                  <label className="font-body text-[10px] uppercase tracking-widest text-obsidian/45 block mb-2">Téléphone</label>
                  <Input name="phone" value={form.phone} onChange={handleChange} placeholder="+226 ..." className="h-12 rounded-xl border-gray-200 focus:border-gmo-green" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-[10px] uppercase tracking-widest text-obsidian/45 block mb-2">E-mail *</label>
                  <Input type="email" required name="email" value={form.email} onChange={handleChange} placeholder="votre@email.com" className="h-12 rounded-xl border-gray-200 focus:border-gmo-green" />
                </div>
                <div>
                  <label className="font-body text-[10px] uppercase tracking-widest text-obsidian/45 block mb-2">Entreprise</label>
                  <Input name="company" value={form.company} onChange={handleChange} placeholder="Nom de votre société" className="h-12 rounded-xl border-gray-200 focus:border-gmo-green" />
                </div>
              </div>
              <div>
                <label className="font-body text-[10px] uppercase tracking-widest text-obsidian/45 block mb-2">Objet de la demande *</label>
                <Input required name="subject" value={form.subject} onChange={handleChange} placeholder="Ex: Demande de devis transport, Partenariat distribution..." className="h-12 rounded-xl border-gray-200 focus:border-gmo-green" />
              </div>
              <div>
                <label className="font-body text-[10px] uppercase tracking-widest text-obsidian/45 block mb-2">Message *</label>
                <Textarea required name="message" value={form.message} onChange={handleChange} rows={5} placeholder="Décrivez votre besoin en détail : type de produits, volumes, zones de livraison, fréquence..." className="rounded-xl border-gray-200 focus:border-gmo-green resize-none" />
              </div>
              <Button
                type="submit"
                disabled={sending}
                className="w-full bg-gmo-green text-white hover:bg-gmo-green/90 font-heading font-bold text-sm h-12 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-gmo-green/25"
              >
                {sending ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Envoi en cours...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Envoyer la demande
                    <Send className="w-4 h-4" />
                  </span>
                )}
              </Button>
              <p className="text-[10px] text-obsidian/30 font-body text-center">
                En soumettant ce formulaire, vous acceptez d'être contacté par GMO Burkina.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}