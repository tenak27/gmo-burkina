/**
 * Démo du Design System Vuexy
 * Page de démonstration de tous les composants de formulaire
 */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  FieldLabel, 
  FieldInput, 
  FieldSelect, 
  FieldTextarea, 
  FieldToggle, 
  FieldSearchableSelect,
  FieldAlert,
  FieldSection
} from "@/components/admin/VuexyFormField";
import { CheckCircle2, Info, AlertTriangle, AlertCircle } from "lucide-react";

export default function VuexyFormDemo() {
  const [formData, setFormData] = useState({
    text: "",
    email: "",
    number: "",
    date: "",
    select: "",
    textarea: "",
    toggle: false,
    searchable: "",
  });

  const set = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  const sampleClients = [
    { id: "1", name: "Jean Ouédraogo", email: "jean@example.com", phone: "+226 70 00 00 00" },
    { id: "2", name: "Marie Sawadogo", email: "marie@example.com", phone: "+226 71 00 00 00" },
    { id: "3", name: "Pierre Traoré", email: "pierre@example.com", phone: "+226 72 00 00 00" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-obsidian/98 to-obsidian/95 rounded-2xl p-6 text-white">
          <h1 className="font-heading text-2xl font-bold mb-2">Design System Vuexy</h1>
          <p className="text-sm text-white/60 font-body">Composants de formulaire unifiés pour GMO ERP</p>
        </div>

        {/* Section 1: Basic Inputs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <FieldSection title="Inputs de base">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel label="Texte simple" required />
                <FieldInput
                  value={formData.text}
                  onChange={e => set("text", e.target.value)}
                  placeholder="Entrez du texte..."
                />
              </div>
              <div>
                <FieldLabel label="Email" required />
                <FieldInput
                  type="email"
                  value={formData.email}
                  onChange={e => set("email", e.target.value)}
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <FieldLabel label="Nombre" />
                <FieldInput
                  type="number"
                  value={formData.number}
                  onChange={e => set("number", e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <FieldLabel label="Date" />
                <FieldInput
                  type="date"
                  value={formData.date}
                  onChange={e => set("date", e.target.value)}
                />
              </div>
            </div>
          </FieldSection>
        </div>

        {/* Section 2: Select & Textarea */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <FieldSection title="Sélecteurs et texte long">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <FieldLabel label="Select simple" required />
                <FieldSelect
                  value={formData.select}
                  onChange={e => set("select", e.target.value)}
                  options={[
                    { value: "opt1", label: "Option 1" },
                    { value: "opt2", label: "Option 2" },
                    { value: "opt3", label: "Option 3" },
                  ]}
                  placeholder="Choisir une option..."
                />
              </div>
              <div className="sm:col-span-2">
                <FieldLabel label="Zone de texte" />
                <FieldTextarea
                  value={formData.textarea}
                  onChange={e => set("textarea", e.target.value)}
                  placeholder="Écrivez votre message ici..."
                  rows={4}
                />
              </div>
            </div>
          </FieldSection>
        </div>

        {/* Section 3: Toggle & Searchable */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <FieldSection title="Composants avancés">
            <div className="space-y-4">
              <div>
                <FieldLabel label="Toggle switch" />
                <FieldToggle
                  checked={formData.toggle}
                  onChange={val => set("toggle", val)}
                  label="Activer les notifications"
                />
              </div>
              <div>
                <FieldLabel label="Select avec recherche" required />
                <FieldSearchableSelect
                  value={formData.searchable}
                  options={sampleClients}
                  placeholder="Sélectionner un client..."
                  searchPlaceholder="Rechercher un client..."
                  onSelect={client => set("searchable", client.name)}
                  renderOption={(client) => (
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-gmo-green/15 flex items-center justify-center text-gmo-green font-bold text-xs">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-heading font-bold text-obsidian">{client.name}</p>
                        <p className="text-[10px] text-obsidian/40 font-body">{client.email}</p>
                      </div>
                    </div>
                  )}
                />
              </div>
            </div>
          </FieldSection>
        </div>

        {/* Section 4: Alerts */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <FieldSection title="Alertes">
            <div className="space-y-3">
              <FieldAlert
                type="success"
                message="Opération réussie ! Les données ont été enregistrées."
                icon={CheckCircle2}
              />
              <FieldAlert
                type="warning"
                message="Attention : certains champs obligatoires sont manquants."
                icon={AlertTriangle}
              />
              <FieldAlert
                type="error"
                message="Erreur : une erreur s'est produite lors de l'enregistrement."
                icon={AlertCircle}
              />
              <FieldAlert
                type="info"
                message="Information : cette fonctionnalité est en cours de développement."
                icon={Info}
              />
            </div>
          </FieldSection>
        </div>

        {/* Section 5: Validation States */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <FieldSection title="États de validation">
            <div className="space-y-4">
              <div>
                <FieldLabel label="Champ valide" />
                <FieldInput value="Valeur correcte" onChange={() => {}} />
              </div>
              <div>
                <FieldLabel label="Champ invalide" required />
                <FieldInput 
                  value="" 
                  onChange={() => {}} 
                  invalid={true}
                  placeholder="Ce champ est requis"
                />
              </div>
            </div>
          </FieldSection>
        </div>

        {/* Code Example */}
        <div className="bg-obsidian rounded-2xl p-6 text-white">
          <h3 className="font-heading text-sm font-bold mb-3">Exemple d'utilisation</h3>
          <pre className="text-[10px] text-white/70 font-mono overflow-x-auto">
{`<FieldSection title="Client">
  <div className="grid grid-cols-2 gap-4">
    <div>
      <FieldLabel label="Nom" required />
      <FieldInput
        value={data.name}
        onChange={e => setData({...data, name: e.target.value})}
      />
    </div>
    <div>
      <FieldLabel label="Email" required />
      <FieldInput
        type="email"
        value={data.email}
        onChange={e => setData({...data, email: e.target.value})}
      />
    </div>
  </div>
</FieldSection>`}
          </pre>
        </div>

      </div>
    </div>
  );
}