import React, { useEffect, useRef } from "react";
import { X, Save, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function EntityForm({ title, fields, data, onChange, onSave, onClose, saving, isEdit }) {
  const panelRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const isEmpty = (f) => f.required && !data[f.key] && data[f.key] !== 0 && data[f.key] !== false;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex-1 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sliding panel */}
      <motion.div
        ref={panelRef}
        initial={{ x: "100%", opacity: 0.5 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="w-full max-w-md bg-white shadow-2xl overflow-y-auto flex flex-col h-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <div className={`w-2 h-2 rounded-full ${isEdit ? "bg-amber-400" : "bg-gmo-green"}`} />
              <p className="font-heading text-sm font-bold text-obsidian">
                {isEdit ? "Modifier" : "Créer"} — {title}
              </p>
            </div>
            <p className="text-[10px] text-obsidian/30 font-body pl-4">GMO Burkina · IAM TECHNOLOGY</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-gray-100 flex items-center justify-center text-obsidian/30 hover:text-obsidian hover:border-gray-200 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Fields */}
        <div className="flex-1 px-6 py-5 space-y-4">
          {fields.map(f => {
            const invalid = isEmpty(f);
            return (
              <div key={f.key}>
                <label className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-heading mb-1.5">
                  <span className={invalid ? "text-gmo-red" : "text-obsidian/50"}>{f.label}</span>
                  {f.required && <span className="text-gmo-red">*</span>}
                </label>

                {f.type === "select" ? (
                  <select
                    value={data[f.key] ?? ""}
                    onChange={e => onChange(f.key, e.target.value)}
                    className={`w-full border rounded-xl px-3 py-2.5 text-sm font-body text-obsidian focus:outline-none transition-colors ${
                      invalid ? "border-red-300 bg-red-50/30 focus:border-gmo-red" : "border-gray-200 focus:border-gmo-green"
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
                    className={`w-full border rounded-xl px-3 py-2.5 text-sm font-body text-obsidian focus:outline-none transition-colors resize-none ${
                      invalid ? "border-red-300 bg-red-50/30 focus:border-gmo-red" : "border-gray-200 focus:border-gmo-green"
                    }`}
                  />

                ) : f.type === "checkbox" ? (
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-10 h-6 rounded-full transition-colors duration-300 relative flex-shrink-0 ${data[f.key] ? "bg-gmo-green" : "bg-gray-200"}`}
                      onClick={() => onChange(f.key, !data[f.key])}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${data[f.key] ? "translate-x-5" : "translate-x-1"}`} />
                    </div>
                    <span className="text-sm font-body text-obsidian/70 group-hover:text-obsidian transition-colors">
                      {f.checkLabel || f.label}
                    </span>
                  </label>

                ) : (
                  <div className="relative">
                    <input
                      type={f.type || "text"}
                      value={data[f.key] ?? ""}
                      onChange={e => onChange(f.key, e.target.value)}
                      placeholder={f.placeholder || ""}
                      className={`w-full border rounded-xl px-3 py-2.5 text-sm font-body text-obsidian focus:outline-none transition-colors ${
                        invalid ? "border-red-300 bg-red-50/30 focus:border-gmo-red pr-8" : "border-gray-200 focus:border-gmo-green"
                      }`}
                    />
                    {invalid && (
                      <AlertCircle className="w-4 h-4 text-gmo-red absolute right-3 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 sticky bottom-0 bg-white/95 backdrop-blur-sm">
          <button
            onClick={onSave}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 bg-gmo-green text-white font-heading font-bold text-sm py-3 rounded-xl hover:bg-gmo-green/90 active:scale-95 transition-all disabled:opacity-40 shadow-sm shadow-gmo-green/20"
          >
            {saving
              ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <Save className="w-4 h-4" />}
            {saving ? "Enregistrement…" : (isEdit ? "Enregistrer" : "Créer")}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-3 border border-gray-200 rounded-xl text-sm font-body text-obsidian/50 hover:border-gray-300 hover:text-obsidian active:scale-95 transition-all"
          >
            Annuler
          </button>
        </div>
      </motion.div>
    </div>
  );
}