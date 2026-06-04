import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, ArrowLeft, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";

const HORAIRES = [
  { jour: "Lundi – Jeudi", matin: "8h30 – 13h00", apresmidi: "15h00 – 18h00" },
  { jour: "Vendredi", matin: "8h30 – 12h30", apresmidi: "15h00 – 18h00" },
  { jour: "Samedi", matin: "8h30 – 13h00", apresmidi: "Fermé" },
  { jour: "Dimanche", matin: "Fermé", apresmidi: "" },
];

const INFOS = [
  { icon: MapPin, label: "Adresse", value: "Dapoya, Point de vente Kwame Kruma\nAvenue Yennega, Ouagadougou, BF" },
  { icon: Phone, label: "Téléphone", value: "+226 01 18 17 17", href: "tel:+22601181717" },
  { icon: Mail, label: "E-mail", value: "infos@gmoburkina.com", href: "mailto:infos@gmoburkina.com" },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await base44.integrations.Core.SendEmail({
      to: "infos@gmoburkina.com",
      subject: `[Contact] ${form.subject} — ${form.name}`,
      body: `<h2>Message depuis la page Contact GMO</h2>
<p><strong>Nom :</strong> ${form.name}</p>
<p><strong>Email :</strong> ${form.email}</p>
<p><strong>Téléphone :</strong> ${form.phone || "—"}</p>
<p><strong>Sujet :</strong> ${form.subject}</p>
<hr/>
<p>${form.message.replace(/\n/g, "<br/>")}</p>`,
      from_name: "GMO Burkina — Site Web",
    });
    setSending(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-concrete font-body">
      {/* Header */}
      <div className="bg-obsidian text-white py-14 px-6">
        <div className="max-w-5xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm mb-8">
            <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-6 h-[2px] bg-gmo-green" />
            <span className="text-[11px] uppercase tracking-[0.3em] text-gmo-green font-heading">Groupe Madina Oumarou</span>
          </div>
          <h1 className="font-heading text-4xl lg:text-5xl font-black mb-3">
            CONTACTEZ-NOUS
          </h1>
          <p className="text-white/55 text-sm max-w-md leading-relaxed">
            Notre équipe est disponible pour répondre à toutes vos demandes de devis, partenariats ou informations.
          </p>
        </div>
      </div>

      {/* WhatsApp CTA */}
      <div className="bg-[#25D366] py-4 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-white">
            <MessageCircle className="w-5 h-5 flex-shrink-0" />
            <span className="font-heading font-bold text-sm">Besoin d'une réponse rapide ? Contactez-nous sur WhatsApp</span>
          </div>
          <a
            href="https://wa.me/+22601181717?text=Bonjour%20GMO%2C%20j%27ai%20une%20question%20!"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 bg-white text-[#25D366] font-heading font-black text-sm px-5 py-2.5 rounded-xl hover:bg-green-50 transition-colors shadow-md flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Écrire sur WhatsApp
          </a>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-6 py-14 grid lg:grid-cols-5 gap-10">

        {/* Left: Infos + Horaires */}
        <div className="lg:col-span-2 space-y-6">

          {/* Coordonnées */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="font-heading text-xs uppercase tracking-[0.25em] text-obsidian/40 mb-5">Coordonnées</p>
            <div className="space-y-4">
              {INFOS.map((info) => (
                <div key={info.label} className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-gmo-green/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <info.icon className="w-4 h-4 text-gmo-green" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-obsidian/35 font-heading mb-0.5">{info.label}</p>
                    {info.href ? (
                      <a href={info.href} className="text-sm text-obsidian/80 hover:text-gmo-green transition-colors whitespace-pre-line leading-relaxed">
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-sm text-obsidian/80 whitespace-pre-line leading-relaxed">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Horaires */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <Clock className="w-4 h-4 text-gmo-green" />
              <p className="font-heading text-xs uppercase tracking-[0.25em] text-obsidian/40">Horaires d'ouverture</p>
            </div>
            <div className="space-y-3">
              {HORAIRES.map((h) => {
                const isFerme = h.matin === "Fermé";
                return (
                  <div key={h.jour} className={`flex items-start justify-between gap-2 py-2.5 px-3 rounded-xl ${isFerme ? "bg-gray-50" : "bg-gmo-green/4 border border-gmo-green/10"}`}>
                    <span className={`text-sm font-heading font-semibold ${isFerme ? "text-obsidian/35" : "text-obsidian"}`}>
                      {h.jour}
                    </span>
                    <div className="text-right flex-shrink-0">
                      {isFerme ? (
                        <span className="text-xs text-obsidian/30 font-body">Fermé</span>
                      ) : (
                        <>
                          <p className="text-xs text-gmo-green font-semibold">{h.matin}</p>
                          {h.apresmidi !== "Fermé" && h.apresmidi !== "" && (
                            <p className="text-xs text-gmo-green/70">{h.apresmidi}</p>
                          )}
                          {h.apresmidi === "Fermé" && (
                            <p className="text-xs text-obsidian/30">Après-midi fermé</p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl">
              <p className="text-[11px] text-amber-700 font-body leading-relaxed">
                ⚡ Pour les urgences, contactez-nous directement sur WhatsApp au <strong>+226 01 18 17 17</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
            {sent ? (
              <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                <div className="w-16 h-16 bg-gmo-green/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-gmo-green" />
                </div>
                <h3 className="font-heading text-xl font-black text-obsidian">Message envoyé !</h3>
                <p className="text-sm text-obsidian/55 max-w-xs leading-relaxed">
                  Merci pour votre message. Notre équipe vous répondra dans les plus brefs délais.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", phone: "", email: "", subject: "", message: "" }); }}
                  className="mt-2 text-sm text-gmo-green font-heading font-semibold hover:underline"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <>
                <p className="font-heading text-xl font-black text-obsidian mb-1">Envoyez-nous un message</p>
                <p className="text-xs text-obsidian/40 font-body mb-6">Réponse sous 24h ouvrées.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-obsidian/45 font-heading block mb-1.5">Nom complet *</label>
                      <Input required name="name" value={form.name} onChange={handleChange} placeholder="Votre nom" className="h-11 rounded-xl border-gray-200 focus:border-gmo-green" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-obsidian/45 font-heading block mb-1.5">Téléphone</label>
                      <Input name="phone" value={form.phone} onChange={handleChange} placeholder="+226 ..." className="h-11 rounded-xl border-gray-200 focus:border-gmo-green" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-obsidian/45 font-heading block mb-1.5">E-mail *</label>
                    <Input type="email" required name="email" value={form.email} onChange={handleChange} placeholder="votre@email.com" className="h-11 rounded-xl border-gray-200 focus:border-gmo-green" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-obsidian/45 font-heading block mb-1.5">Objet *</label>
                    <Input required name="subject" value={form.subject} onChange={handleChange} placeholder="Ex: Demande de devis, Partenariat..." className="h-11 rounded-xl border-gray-200 focus:border-gmo-green" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-obsidian/45 font-heading block mb-1.5">Message *</label>
                    <Textarea required name="message" value={form.message} onChange={handleChange} rows={6} placeholder="Décrivez votre demande en détail..." className="rounded-xl border-gray-200 focus:border-gmo-green resize-none" />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <Button
                      type="submit"
                      disabled={sending}
                      className="flex-1 bg-gmo-green text-white hover:bg-gmo-green/90 font-heading font-bold text-sm h-12 rounded-xl"
                    >
                      {sending ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Envoi...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="w-4 h-4" /> Envoyer
                        </span>
                      )}
                    </Button>
                    <a
                      href="https://wa.me/+22601181717?text=Bonjour%20GMO%2C%20j%27ai%20une%20question%20!"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white font-heading font-bold text-sm px-6 h-12 rounded-xl transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" /> WhatsApp
                    </a>
                  </div>
                  <p className="text-[10px] text-obsidian/30 font-body text-center">
                    En soumettant ce formulaire, vous acceptez d'être contacté par GMO Burkina.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}