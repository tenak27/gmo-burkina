import React, { useState } from "react";
import { Building2, Phone, Mail, MapPin, Globe, FileText, Save, CheckCircle2, Palette, CreditCard, Shield } from "lucide-react";

const SECTIONS = [
  { id: "company", label: "Société", icon: Building2 },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "contact", label: "Contact & Adresse", icon: MapPin },
  { id: "system", label: "Système", icon: Shield },
];

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-5">
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
        <h3 className="font-semibold text-sm text-gray-800">{title}</h3>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder = "", hint = "" }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
      {type === "textarea" ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 resize-none" />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
      )}
      {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

export default function SettingsTab() {
  const [activeSection, setActiveSection] = useState("company");
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    // Company
    company_name: "Groupe Madina Oumarou",
    company_short: "GMO Burkina",
    rccm: "BF-OUA-2015-B-XXXXX",
    ifu: "00000000000",
    logo_url: "https://gmobfaso.com/assets/img/logo.png",
    website: "www.gmobfaso.com",
    // Contact
    address: "Quartier Dapoya, Parcelle 05, Lot 29, Section BI",
    bp: "01 BP 3370",
    city: "Ouagadougou",
    country: "Burkina Faso",
    phone: "+226 25 33 19 00",
    whatsapp: "+226 76 21 16 33",
    email: "infos@gmoburkina.com",
    // Documents
    invoice_prefix: "FAC",
    devis_prefix: "DEV",
    proforma_prefix: "PRO",
    default_tax: "18",
    devis_validity: "30",
    invoice_footer: "Merci pour votre confiance. Paiement à réception de facture.",
    bank_name: "",
    bank_account: "",
    bank_rib: "",
    // System
    currency: "FCFA",
    language: "fr",
    date_format: "DD/MM/YYYY",
  });

  const set = (key) => (val) => setSettings(s => ({ ...s, [key]: val }));

  const handleSave = () => {
    // In a real app, this would save to the database / entity
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-sm text-gray-500 mt-0.5">Configuration de la société et de l'ERP</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar nav */}
        <div className="w-48 flex-shrink-0">
          <nav className="space-y-0.5">
            {SECTIONS.map(s => {
              const Icon = s.icon;
              return (
                <button key={s.id} onClick={() => setActiveSection(s.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-sm transition-all cursor-pointer ${
                    activeSection === s.id
                      ? "bg-green-50 text-green-700 font-semibold border-l-2 border-green-600"
                      : "text-gray-600 hover:bg-gray-50 border-l-2 border-transparent"
                  }`}>
                  <Icon className={`w-4 h-4 ${activeSection === s.id ? "text-green-600" : "text-gray-400"}`} />
                  {s.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeSection === "company" && (
            <>
              <Section title="Identité de la société">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Raison sociale" value={settings.company_name} onChange={set("company_name")} placeholder="Groupe Madina Oumarou" />
                  <Field label="Nom court / Commercial" value={settings.company_short} onChange={set("company_short")} placeholder="GMO Burkina" />
                  <Field label="RCCM" value={settings.rccm} onChange={set("rccm")} placeholder="BF-OUA-2015-B-XXXXX" />
                  <Field label="IFU / NIF" value={settings.ifu} onChange={set("ifu")} placeholder="00000000000" />
                  <Field label="Site Web" value={settings.website} onChange={set("website")} placeholder="www.gmobfaso.com" />
                </div>
              </Section>
              <Section title="Logo">
                <Field label="URL du Logo" value={settings.logo_url} onChange={set("logo_url")} placeholder="https://..." hint="L'URL doit pointer vers une image accessible publiquement (PNG ou SVG recommandé)." />
                {settings.logo_url && (
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <img src={settings.logo_url} alt="Logo" className="h-12 w-auto object-contain" onError={e => e.target.style.display = "none"} />
                    <div>
                      <p className="text-xs font-semibold text-gray-600">Aperçu du logo</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">Ce logo apparaîtra sur les documents PDF</p>
                    </div>
                  </div>
                )}
              </Section>
            </>
          )}

          {activeSection === "contact" && (
            <Section title="Coordonnées">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Adresse" value={settings.address} onChange={set("address")} placeholder="Rue, Quartier, Parcelle…" />
                <Field label="Boîte postale" value={settings.bp} onChange={set("bp")} placeholder="01 BP 3370" />
                <Field label="Ville" value={settings.city} onChange={set("city")} placeholder="Ouagadougou" />
                <Field label="Pays" value={settings.country} onChange={set("country")} placeholder="Burkina Faso" />
                <Field label="Téléphone fixe" value={settings.phone} onChange={set("phone")} placeholder="+226 25 33 19 00" />
                <Field label="WhatsApp" value={settings.whatsapp} onChange={set("whatsapp")} placeholder="+226 76 21 16 33" />
                <Field label="Email" value={settings.email} onChange={set("email")} type="email" placeholder="infos@gmoburkina.com" />
              </div>
            </Section>
          )}

          {activeSection === "documents" && (
            <>
              <Section title="Numérotation des documents">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field label="Préfixe Facture" value={settings.invoice_prefix} onChange={set("invoice_prefix")} placeholder="FAC" hint="Ex: FAC-2026-001" />
                  <Field label="Préfixe Devis" value={settings.devis_prefix} onChange={set("devis_prefix")} placeholder="DEV" hint="Ex: DEV-2026-001" />
                  <Field label="Préfixe Proforma" value={settings.proforma_prefix} onChange={set("proforma_prefix")} placeholder="PRO" hint="Ex: PRO-2026-001" />
                </div>
              </Section>
              <Section title="Paramètres financiers">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="TVA par défaut (%)" value={settings.default_tax} onChange={set("default_tax")} type="number" placeholder="18" />
                  <Field label="Validité devis (jours)" value={settings.devis_validity} onChange={set("devis_validity")} type="number" placeholder="30" />
                </div>
              </Section>
              <Section title="Coordonnées bancaires">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Nom de la banque" value={settings.bank_name} onChange={set("bank_name")} placeholder="Coris Bank International" />
                  <Field label="Numéro de compte" value={settings.bank_account} onChange={set("bank_account")} placeholder="BF00 0000 0000 0000 00" />
                  <Field label="RIB / IBAN" value={settings.bank_rib} onChange={set("bank_rib")} placeholder="RIB…" />
                </div>
              </Section>
              <Section title="Pied de page document">
                <Field label="Mention légale / pied de page" value={settings.invoice_footer} onChange={set("invoice_footer")} type="textarea" placeholder="Merci pour votre confiance…" />
              </Section>
            </>
          )}

          {activeSection === "system" && (
            <Section title="Préférences système">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Devise</label>
                  <select value={settings.currency} onChange={e => set("currency")(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-green-500">
                    <option value="FCFA">FCFA — Franc CFA</option>
                    <option value="EUR">EUR — Euro</option>
                    <option value="USD">USD — Dollar US</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Langue</label>
                  <select value={settings.language} onChange={e => set("language")(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-green-500">
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Format de date</label>
                  <select value={settings.date_format} onChange={e => set("date_format")(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-green-500">
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>

              <div className="mt-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs font-semibold text-amber-800 mb-1">ℹ️ Version ERP</p>
                <p className="text-[11px] text-amber-700">GMO ERP v2.0 — Développé par IAM Technology · 2026</p>
              </div>
            </Section>
          )}

          {/* Save button */}
          <div className="flex items-center gap-3 pt-2">
            <button onClick={handleSave}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors cursor-pointer">
              {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? "Enregistré !" : "Enregistrer les modifications"}
            </button>
            {saved && <span className="text-xs text-green-600 font-medium">Les paramètres ont été sauvegardés</span>}
          </div>
        </div>
      </div>
    </div>
  );
}