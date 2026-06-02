import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import {
  Users, Store, CheckCircle, ArrowRight, LogOut,
  Building2, Phone, MapPin, Mail, User, ChevronRight, ChevronLeft
} from 'lucide-react';

export default function UserNotRegisteredError() {
  const [step, setStep] = useState(1); // 1=choix rôle, 2=formulaire détaillant
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const [form, setForm] = useState({
    company_name: '', contact_name: '', phone: '', email: '',
    address: '', city: '', country: 'Burkina Faso',
    business_type: 'epicerie', tax_id: '',
  });

  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleNext = () => {
    if (selected === 'detaillant') setStep(2);
    else handleRegister('client');
  };

  const handleRegister = async (role) => {
    if (saving) return;
    setSaving(true);
    const roleToSave = role || selected;
    const extra = roleToSave === 'detaillant' ? {
      company_name: form.company_name,
      phone: form.phone,
      address: form.address,
      city: form.city,
      country: form.country,
      business_type: form.business_type,
      tax_id: form.tax_id,
    } : {};
    await base44.auth.updateMe({ role: roleToSave, ...extra });
    setDone(true);
    setTimeout(() => window.location.reload(), 1500);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Inscription réussie !</h2>
          <p className="text-sm text-gray-500">Redirection en cours…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Bienvenue sur GMO Burkina</h1>
        <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
          {step === 1 ? "Choisissez votre profil pour accéder à votre espace." : "Complétez votre profil professionnel de détaillant."}
        </p>
      </div>

      {/* Step 1 — Choix rôle */}
      {step === 1 && (
        <>
          <div className="grid sm:grid-cols-2 gap-4 w-full max-w-2xl mb-8">
            {[
              {
                id: 'client', label: 'Client', icon: Users, color: 'green',
                description: 'Passez des commandes, suivez vos livraisons et consultez vos factures.',
                features: ['Passer des commandes', 'Suivi des livraisons', 'Consulter factures', 'Support client'],
              },
              {
                id: 'detaillant', label: 'Détaillant / Revendeur', icon: Store, color: 'amber',
                description: 'Accédez aux tarifs grossiste, gérez vos commandes professionnelles.',
                features: ['Tarifs grossiste', 'Devis automatiques', 'Factures officielles', 'Bons de livraison'],
              },
            ].map(role => {
              const Icon = role.icon;
              const isSelected = selected === role.id;
              const isGreen = role.color === 'green';
              return (
                <button key={role.id} onClick={() => setSelected(role.id)}
                  className={`text-left p-6 rounded-2xl border-2 transition-all cursor-pointer
                    ${isSelected
                      ? isGreen ? "border-green-600 bg-green-50 shadow-md" : "border-amber-500 bg-amber-50 shadow-md"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center
                      ${isSelected ? isGreen ? "bg-green-600" : "bg-amber-500" : "bg-gray-100"}`}>
                      <Icon className={`w-6 h-6 ${isSelected ? "text-white" : "text-gray-500"}`} />
                    </div>
                    {isSelected && (
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isGreen ? "bg-green-600" : "bg-amber-500"}`}>
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">{role.label}</h3>
                  <p className="text-sm text-gray-500 mb-4 leading-relaxed">{role.description}</p>
                  <ul className="space-y-1.5">
                    {role.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isGreen ? "bg-green-500" : "bg-amber-400"}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>
          <button onClick={handleNext} disabled={!selected || saving}
            className={`flex items-center gap-2 font-semibold text-sm px-8 py-3 rounded-xl transition-all cursor-pointer
              ${selected ? "bg-green-600 hover:bg-green-700 text-white shadow-md" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
            {saving ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Inscription…</>
            ) : (
              <><ArrowRight className="w-4 h-4" /> Continuer</>
            )}
          </button>
        </>
      )}

      {/* Step 2 — Formulaire Détaillant */}
      {step === 2 && (
        <div className="w-full max-w-2xl bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setStep(1)} className="text-gray-400 hover:text-gray-700 cursor-pointer">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Informations du détaillant</h2>
              <p className="text-xs text-gray-500">Ces informations figureront sur vos documents officiels.</p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Entreprise */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Entreprise / Commerce</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Nom du commerce / entreprise *</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input value={form.company_name} onChange={e => setF('company_name', e.target.value)}
                      placeholder="Ex: Épicerie Madame Fatou"
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Type de commerce</label>
                  <select value={form.business_type} onChange={e => setF('business_type', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 transition-colors">
                    <option value="epicerie">Épicerie / Alimentaire</option>
                    <option value="superette">Supérette</option>
                    <option value="grossiste">Grossiste</option>
                    <option value="restauration">Restauration</option>
                    <option value="autre">Autre commerce</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">IFU / N° Contribuable</label>
                  <input value={form.tax_id} onChange={e => setF('tax_id', e.target.value)}
                    placeholder="Numéro fiscal (optionnel)"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 transition-colors" />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* Contact */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Contact</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Téléphone principal *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input value={form.phone} onChange={e => setF('phone', e.target.value)}
                      placeholder="+226 XX XX XX XX"
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 transition-colors" />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* Adresse */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Adresse</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Adresse / Quartier *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input value={form.address} onChange={e => setF('address', e.target.value)}
                      placeholder="Ex: Quartier Dapoya, Rue 12"
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Ville *</label>
                  <input value={form.city} onChange={e => setF('city', e.target.value)}
                    placeholder="Ouagadougou"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Pays</label>
                  <input value={form.country} onChange={e => setF('country', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 transition-colors" />
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 flex gap-3">
            <button onClick={() => handleRegister('detaillant')}
              disabled={saving || !form.company_name || !form.phone || !form.address || !form.city}
              className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold text-sm py-3 rounded-xl cursor-pointer transition-all">
              {saving
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Inscription…</>
                : <><CheckCircle className="w-4 h-4" /> Créer mon compte Détaillant</>
              }
            </button>
          </div>
          <p className="text-xs text-gray-400 text-center mt-3">
            Ces informations apparaîtront sur vos devis, factures et bons de livraison.
          </p>
        </div>
      )}

      <button onClick={() => base44.auth.logout('/')}
        className="mt-5 flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
        <LogOut className="w-3.5 h-3.5" /> Se déconnecter
      </button>
    </div>
  );
}