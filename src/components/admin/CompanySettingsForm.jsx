import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Building2, Upload, Save, CheckCircle2, Loader2, X, Image } from "lucide-react";

function Field({ label, value, onChange, type = "text", placeholder = "", required = false, hint = "" }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-gray-50/50 focus:outline-none focus:border-gmo-green focus:ring-1 focus:ring-gmo-green/20 transition-colors"
      />
      {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function NumField({ label, value, onChange, min = 0, max = 100 }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <input
          type="number" min={min} max={max}
          value={value || ""}
          onChange={e => onChange(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 pr-10 text-sm text-gray-800 bg-gray-50/50 focus:outline-none focus:border-gmo-green focus:ring-1 focus:ring-gmo-green/20 transition-colors"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
          <button type="button" onClick={() => onChange(Math.min(max, +(value||0)+1))}
            className="text-gray-400 hover:text-gray-600 leading-none cursor-pointer text-[10px]">▲</button>
          <button type="button" onClick={() => onChange(Math.max(min, +(value||0)-1))}
            className="text-gray-400 hover:text-gray-600 leading-none cursor-pointer text-[10px]">▼</button>
        </div>
      </div>
    </div>
  );
}

const EMPTY = {
  raison_sociale: "", sigle: "", capital_social: "", ifu: "", rccm: "", cnss: "",
  phone: "", email: "", website: "", address: "", city: "", bp: "", country: "Burkina Faso",
  regime_fiscal: "", direction_fiscale: "", tva_default: 18, taux_bic: 2,
  logo_url: "", bank_name: "", bank_account: "", bank_rib: "", invoice_footer: "",
  invoice_prefix: "FAC", devis_prefix: "DEV",
};

export default function CompanySettingsForm({ onClose }) {
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [existingId, setExistingId] = useState(null);
  const fileRef = useRef();

  useEffect(() => {
    base44.entities.CompanySettings.list("-created_date", 1).then(arr => {
      if (arr && arr.length > 0) {
        setForm({ ...EMPTY, ...arr[0] });
        setExistingId(arr[0].id);
      }
      setLoading(false);
    });
  }, []);

  const set = key => val => setForm(f => ({ ...f, [key]: val }));

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    set("logo_url")(file_url);
    setUploadingLogo(false);
  };

  const handleSave = async () => {
    if (!form.raison_sociale) return;
    setSaving(true);
    if (existingId) {
      await base44.entities.CompanySettings.update(existingId, form);
    } else {
      const r = await base44.entities.CompanySettings.create(form);
      setExistingId(r.id);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gmo-green/10 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-gmo-green" />
          </div>
          <div className="flex-1">
            <h2 className="font-heading text-base font-bold text-obsidian">
              {existingId ? "Modifier la société" : "Nouvelle société"}
            </h2>
            <p className="text-xs text-obsidian/40 font-body">Paramètres de la société et informations fiscales</p>
          </div>
          {onClose && <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X className="w-5 h-5" /></button>}
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Logo */}
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex items-center justify-center gap-4 cursor-pointer hover:border-gmo-green/40 hover:bg-green-50/20 transition-colors"
          >
            {form.logo_url ? (
              <>
                <img src={form.logo_url} alt="Logo" className="h-14 w-auto object-contain" onError={e => e.target.style.display="none"} />
                <div>
                  <p className="text-sm font-semibold text-gray-700">Logo actuel</p>
                  <p className="text-xs text-gray-400 mt-0.5">Cliquez pour changer</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Image className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  {uploadingLogo ? (
                    <div className="flex items-center gap-2"><Loader2 className="w-4 h-4 text-gmo-green animate-spin" /><span className="text-sm text-gray-600">Envoi en cours…</span></div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-sm text-gray-700">
                        <Upload className="w-4 h-4" /> Logo
                      </div>
                      <p className="text-xs text-gray-400 mt-1">PNG, SVG recommandé</p>
                    </>
                  )}
                </div>
              </>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
          </div>

          {/* Raison sociale */}
          <Field label="Raison sociale" value={form.raison_sociale} onChange={set("raison_sociale")} placeholder="Ex: VISTA INGENIERIA & OBRA-CIVIL" required />

          {/* Sigle + Capital */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Sigle" value={form.sigle} onChange={set("sigle")} placeholder="SA, SARL…" />
            <Field label="Capital social" value={form.capital_social} onChange={set("capital_social")} placeholder="10 000 000 FCFA" />
          </div>

          {/* IFU + RCCM */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="IFU" value={form.ifu} onChange={set("ifu")} placeholder="IFU…" />
            <Field label="RCCM" value={form.rccm} onChange={set("rccm")} placeholder="BF-OUA-2015-B-XXXXX" />
          </div>

          {/* CNSS + Téléphone */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="CNSS" value={form.cnss} onChange={set("cnss")} placeholder="N° CNSS…" />
            <Field label="Téléphone" value={form.phone} onChange={set("phone")} placeholder="+226 25 33 19 00" />
          </div>

          {/* Email + Site web */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Email" value={form.email} onChange={set("email")} type="email" placeholder="contact@societe.com" />
            <Field label="Site web" value={form.website} onChange={set("website")} placeholder="www.societe.com" />
          </div>

          {/* Adresse + Ville */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Adresse" value={form.address} onChange={set("address")} placeholder="Quartier, Rue, N°…" />
            <Field label="Ville" value={form.city} onChange={set("city")} placeholder="Ouagadougou" />
          </div>

          {/* Régime fiscal + Direction fiscale */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Régime fiscal" value={form.regime_fiscal} onChange={set("regime_fiscal")} placeholder="Réel normal, RSI…" />
            <Field label="Direction fiscale" value={form.direction_fiscale} onChange={set("direction_fiscale")} placeholder="DGE, DI…" />
          </div>

          {/* TVA + BIC */}
          <div className="grid grid-cols-2 gap-4">
            <NumField label="TVA par défaut (%)" value={form.tva_default} onChange={set("tva_default")} min={0} max={30} />
            <NumField label="Taux BIC (%)" value={form.taux_bic} onChange={set("taux_bic")} min={0} max={50} />
          </div>

          {/* Coordonnées bancaires */}
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Coordonnées bancaires</p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Banque" value={form.bank_name} onChange={set("bank_name")} placeholder="Coris Bank International" />
              <Field label="Numéro de compte" value={form.bank_account} onChange={set("bank_account")} placeholder="BF00 0000 0000 0000" />
              <Field label="RIB / IBAN" value={form.bank_rib} onChange={set("bank_rib")} placeholder="RIB…" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0">
          {onClose && (
            <button onClick={onClose}
              className="flex-1 border border-gray-200 text-sm font-semibold text-gray-600 py-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
              Annuler
            </button>
          )}
          <button onClick={handleSave} disabled={saving || !form.raison_sociale}
            className="flex-1 flex items-center justify-center gap-2 bg-gmo-green text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-gmo-green/90 transition-colors cursor-pointer disabled:opacity-60">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saving ? "Enregistrement…" : saved ? "Enregistré !" : existingId ? "Modifier la société" : "Créer la société"}
          </button>
        </div>
      </div>
    </div>
  );
}