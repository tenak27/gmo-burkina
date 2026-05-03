import React from "react";
import { X, Save } from "lucide-react";

/**
 * Generic sliding form panel
 * fields: [{ key, label, type?, options?, required?, placeholder? }]
 */
export default function EntityForm({ title, fields, data, onChange, onSave, onClose, saving, isEdit }) {
  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      {/* Panel */}
      <div className="w-full max-w-md bg-white shadow-2xl overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div>
            <p className="font-heading text-base font-bold text-obsidian">{isEdit ? `Modifier` : `Nouveau`} — {title}</p>
            <p className="text-[11px] text-obsidian/35 font-body mt-0.5">IAM TECHNOLOGY · GMO Burkina</p>
          </div>
          <button onClick={onClose} className="text-obsidian/30 hover:text-obsidian transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Fields */}
        <div className="flex-1 px-6 py-5 space-y-4">
          {fields.map(f => (
            <div key={f.key}>
              <label className="block text-[10px] uppercase tracking-widest text-obsidian/45 font-heading mb-1.5">
                {f.label}{f.required && <span className="text-gmo-red ml-0.5">*</span>}
              </label>
              {f.type === "select" ? (
                <select
                  value={data[f.key] ?? ""}
                  onChange={e => onChange(f.key, e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-body text-obsidian focus:border-gmo-green focus:outline-none"
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
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-body text-obsidian focus:border-gmo-green focus:outline-none resize-none"
                />
              ) : f.type === "checkbox" ? (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!data[f.key]}
                    onChange={e => onChange(f.key, e.target.checked)}
                    className="w-4 h-4 accent-gmo-green"
                  />
                  <span className="text-sm font-body text-obsidian/70">{f.checkLabel || f.label}</span>
                </label>
              ) : (
                <input
                  type={f.type || "text"}
                  value={data[f.key] ?? ""}
                  onChange={e => onChange(f.key, e.target.value)}
                  placeholder={f.placeholder || ""}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-body text-obsidian focus:border-gmo-green focus:outline-none"
                />
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 sticky bottom-0 bg-white">
          <button
            onClick={onSave}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 bg-gmo-green text-white font-heading font-bold text-sm py-2.5 rounded-lg hover:bg-gmo-green/90 transition-colors disabled:opacity-40"
          >
            {saving
              ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <Save className="w-4 h-4" />}
            {saving ? "Enregistrement..." : (isEdit ? "Enregistrer" : "Créer")}
          </button>
          <button onClick={onClose} className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-body text-obsidian/50 hover:border-gray-300 hover:text-obsidian transition-colors">
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}