/**
 * Formulaire Wizard par Étapes - Design Moderne
 */
import React, { useState } from "react";
import { X, Save, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { FieldLabel, FieldInput, FieldSelect, FieldTextarea, FieldToggle, FieldAlert, FieldSection } from "./VuexyFormField";

export default function WizardForm({
  title,
  subtitle,
  steps,
  data,
  onChange,
  onSave,
  onClose,
  saving,
  isEdit,
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [touched, setTouched] = useState({});

  const totalSteps = steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const currentStepData = steps[currentStep];
  const fields = currentStepData?.fields || [];

  const isEmpty = (f) => f.required && !data[f.key] && data[f.key] !== 0 && data[f.key] !== false;
  const allValid = !fields.some(isEmpty);
  const canProceed = allValid;

  const handleNext = () => {
    if (canProceed && currentStep < totalSteps - 1) {
      setCurrentStep(s => s + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(s => s - 1);
    }
  };

  const handleSubmit = async () => {
    if (allValid) {
      await onSave();
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.25 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.15 } },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 28, stiffness: 350 }}
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] border border-gray-100 my-4"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-obsidian/98 to-obsidian/95 border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-heading text-base font-bold text-white">
                {isEdit ? "Modifier" : "Nouveau"} · {title}
              </p>
              <p className="text-[10px] text-white/40 font-body mt-0.5">{subtitle || "GMO Burkina ERP"}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              {steps.map((step, idx) => {
                const Icon = step.icon || CheckCircle2;
                const isActive = idx === currentStep;
                const isCompleted = idx < currentStep;
                return (
                  <div key={idx} className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isActive
                          ? "bg-gmo-green text-white shadow-lg"
                          : isCompleted
                          ? "bg-gmo-green/30 text-white"
                          : "bg-white/10 text-white/40"
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[10px] font-body hidden sm:inline ${
                        isActive ? "text-white font-semibold" : "text-white/40"
                      }`}
                    >
                      {step.title}
                    </span>
                    {idx < steps.length - 1 && (
                      <div
                        className={`w-8 sm:w-12 h-0.5 mx-1 transition-all ${
                          isCompleted ? "bg-gmo-green" : "bg-white/10"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-gmo-green rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <motion.div
            key={currentStep}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={stepVariants}
            className="max-w-2xl mx-auto"
          >
            <div className="mb-6">
              <h3 className="font-heading text-lg font-bold text-obsidian mb-1">{currentStepData?.title}</h3>
              {currentStepData?.description && (
                <p className="text-sm text-obsidian/50 font-body">{currentStepData.description}</p>
              )}
            </div>

            <div className="space-y-5">
              {fields.map((f, idx) => {
                const invalid = f.required && !data[f.key] && data[f.key] !== 0 && data[f.key] !== false;

                // Select
                if (f.type === "select") {
                  return (
                    <div key={f.key}>
                      <FieldLabel label={f.label} required={f.required} />
                      <FieldSelect
                        value={data[f.key]}
                        onChange={(e) => onChange(f.key, e.target.value)}
                        options={f.options}
                        required={f.required}
                        invalid={invalid}
                      />
                    </div>
                  );
                }

                // Textarea
                if (f.type === "textarea") {
                  return (
                    <div key={f.key}>
                      <FieldLabel label={f.label} required={f.required} />
                      <FieldTextarea
                        value={data[f.key]}
                        onChange={(e) => onChange(f.key, e.target.value)}
                        placeholder={f.placeholder}
                        rows={3}
                        invalid={invalid}
                      />
                    </div>
                  );
                }

                // Checkbox
                if (f.type === "checkbox") {
                  return (
                    <div key={f.key}>
                      <FieldLabel label={f.label} required={f.required} />
                      <FieldToggle
                        checked={!!data[f.key]}
                        onChange={(val) => onChange(f.key, val)}
                        label={f.checkLabel || f.label}
                      />
                    </div>
                  );
                }

                // Default input
                return (
                  <div key={f.key}>
                    <FieldLabel label={f.label} required={f.required} />
                    <FieldInput
                      type={f.type || "text"}
                      value={data[f.key]}
                      onChange={(e) => onChange(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      required={f.required}
                      invalid={invalid}
                    />
                  </div>
                );
              })}
            </div>

            {fields.some(f => f.required && !data[f.key] && data[f.key] !== 0 && data[f.key] !== false) && (
              <div className="mt-6">
                <FieldAlert type="error" message="Veuillez remplir tous les champs obligatoires." />
              </div>
            )}
          </motion.div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-xl text-sm font-body text-obsidian/50 hover:border-gray-300 hover:text-obsidian hover:bg-gray-50 transition-all disabled:opacity-30 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Précédent
          </button>

          <div className="flex items-center gap-3">
            <span className="text-xs text-obsidian/40 font-body">
              Étape {currentStep + 1} sur {totalSteps}
            </span>
            {currentStep === totalSteps - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={saving || !canProceed}
                className="flex items-center gap-2 bg-gmo-green text-white font-heading font-bold text-sm px-6 py-3 rounded-xl hover:bg-gmo-green/90 active:scale-95 transition-all disabled:opacity-40 cursor-pointer"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? "Enregistrement…" : (isEdit ? "Enregistrer" : "Créer")}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!canProceed}
                className="flex items-center gap-2 bg-gmo-green text-white font-heading font-bold text-sm px-6 py-3 rounded-xl hover:bg-gmo-green/90 active:scale-95 transition-all disabled:opacity-40 cursor-pointer"
              >
                Suivant
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}