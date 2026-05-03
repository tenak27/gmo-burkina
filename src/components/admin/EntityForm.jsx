import React, { useEffect, useRef } from "react";
import { X, Save, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function EntityForm({ title, fields, data, onChange, onSave, onClose, saving, isEdit }) {
  const panelRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const isEmpty = (f) => f.required && !data[f.key] && data[f.key] !== 0 && data[f.key] !== false;

  // Group fields into pairs for 2-column layout when both are short
  const fieldGroups = [];
  let i = 0;
  while (i < fields.length) {
    const f = fields[i];
    const isLong = f.type === "textarea" || f.type === "checkbox" || f.fullWidth;
    if (!isLong && fields[i + 1] && !fields[i + 1].fullWidth && fields[i + 1].type !== "textarea" && fields[i + 1].type !== "checkbox") {
      fieldGroups.push([f, fields[i + 1]]);
      i += 2;
    } else {
      fieldGroups.push([f]);
      i += 1;
    }
  }

  const renderField = (f) => {
    const invalid = isEmpty(f);
    return (
      <div key={f.key} className="flex flex-col gap-1.5">
        <label className="flex items-center gap-1">
          <span className={`text-[10px] uppercase tracking-widest font-heading ${invalid ? "text-gmo-red" : "text-obsidian/50"}`}>
            {f.label}
          </span>
          {f.required && <span className="text-gmo-red text-[10px]">*</span>}
        </label>

        {f.type === "select" ? (
          <select
            value={data[f.key] ?? ""}
            onChange={e => onChange(f.key, e.target.value)}
            className={`w-full border rounded-xl px-3 py-2.5 text-sm font-body text-obsidian bg-white focus:outline-none transition-all ${
              invalid ? "border-red-300 bg-red-50/20 focus:border-gmo-red" : "border-gray-200 hover:border-gray-300 focus:border-gmo-green focus:ring-2 focus:ring-gmo-green/10"
            }`}
          >
            {!f.required && <option value="">— Sélectionner —</option>}
            {f.options?.map(o => (
              <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
            ))}
          </select>

        ) : f.type === "textarea" ? (
          <textarea
            value={data[f.key] ?? ""}
            onChange={e => onChange(f.key, e.target.value)}
            placeholder={f.placeholder || ""}
            rows={3}
            className={`w-full border rounded-xl px-3 py-2.5 text-sm font-body text-obsidian focus:outline-none transition-all resize-none ${
              invalid ? "border-red-300 bg-red-50/20 focus:border-gmo-red" : "border-gray-200 hover:border-gray-300 focus:border-gmo-green focus:ring-2 focus:ring-gmo-green/10"
            }`}
          />

        ) : f.type === "checkbox" ? (
          <button
            type="button"
            onClick={() => onChange(f.key, !data[f.key])}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
              data[f.key] ? "bg-gmo-green/5 border-gmo-green/30" : "bg-gray-50 border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className={`w-10 h-5.5 rounded-full transition-colors duration-300 relative flex-shrink-0 ${data[f.key] ? "bg-gmo-green" : "bg-gray-300"}`}
              style={{ height: 22, width: 40 }}>
              <div className={`absolute top-[3px] w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${data[f.key] ? "translate-x-[20px]" : "translate-x-[3px]"}`} />
            </div>
            <span className={`text-sm font-body transition-colors ${data[f.key] ? "text-gmo-green font-medium" : "text-obsidian/60"}`}>
              {f.checkLabel || f.label}
            </span>
            {data[f.key] && <CheckCircle2 className="w-3.5 h-3.5 text-gmo-green ml-auto" />}
          </button>

        ) : (
          <div className="relative">
            <input
              type={f.type || "text"}
              value={data[f.key] ?? ""}
              onChange={e => onChange(f.key, e.target.value)}
              placeholder={f.placeholder || ""}
              className={`w-full border rounded-xl px-3 py-2.5 text-sm font-body text-obsidian focus:outline-none transition-all ${
                invalid
                  ? "border-red-300 bg-red-50/20 focus:border-gmo-red pr-8"
                  : "border-gray-200 hover:border-gray-300 focus:border-gmo-green focus:ring-2 focus:ring-gmo-green/10"
              }`}
            />
            {invalid && (
              <AlertCircle className="w-4 h-4 text-gmo-red absolute right-3 top-1/2 -translate-y-1/2" />
            )}
          </div>
        )}
      </div>
    );
  };

  const hasRequired = fields.some(f => f.required);
  const allValid = !fields.some(isEmpty);

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex-1 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        ref={panelRef}
        initial={{ x: "100%", opacity: 0.6 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="w-full max-w-lg bg-white shadow-2xl flex flex-col h-full border-l border-gray-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 sticky top-0 bg-white z-10 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isEdit ? "bg-amber-50" : "bg-gmo-green/10"}`}>
              {isEdit
                ? <div className="w-3 h-3 rounded-full bg-amber-400" />
                : <div className="w-3 h-3 rounded-full bg-gmo-green" />
              }
            </div>
            <div>
              <p className="font-heading text-sm font-bold text-obsidian leading-tight">
                {isEdit ? `Modifier — ${title}` : `Nouveau — ${title}`}
              </p>
              <p className="text-[10px] text-obsidian/30 font-body">GMO Burkina ERP</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl border border-gray-100 flex items-center justify-center text-obsidian/30 hover:text-obsidian hover:border-gray-300 hover:bg-gray-50 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Fields */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {fieldGroups.map((group, gi) => (
            group.length === 2 ? (
              <div key={gi} className="grid grid-cols-2 gap-3">
                {group.map(f => renderField(f))}
              </div>
            ) : (
              <div key={gi}>{renderField(group[0])}</div>
            )
          ))}

          {hasRequired && !allValid && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mt-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-xs text-red-600 font-body">Veuillez remplir tous les champs obligatoires.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 sticky bottom-0 bg-white/98 backdrop-blur-sm">
          <div className="flex gap-3">
            <button
              onClick={onSave}
              disabled={saving || !allValid}
              className="flex-1 flex items-center justify-center gap-2 bg-gmo-green text-white font-heading font-bold text-sm py-3 rounded-xl hover:bg-gmo-green/90 active:scale-[0.98] transition-all disabled:opacity-40 shadow-sm shadow-gmo-green/20"
            >
              {saving
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Save className="w-4 h-4" />}
              {saving ? "Enregistrement…" : (isEdit ? "Enregistrer les modifications" : "Créer")}
            </button>
            <button
              onClick={onClose}
              className="px-5 py-3 border border-gray-200 rounded-xl text-sm font-body text-obsidian/50 hover:border-gray-300 hover:text-obsidian hover:bg-gray-50 active:scale-[0.98] transition-all"
            >
              Annuler
            </button>
          </div>
          <p className="text-center text-[9px] text-obsidian/20 font-body mt-3">
            Appuyer sur <kbd className="bg-gray-100 px-1 py-0.5 rounded text-[9px]">ESC</kbd> pour fermer
          </p>
        </div>
      </motion.div>
    </div>
  );
}