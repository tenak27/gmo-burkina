import React, { useEffect, useRef, useState, useMemo } from "react";
import { X, Save, AlertCircle, CheckCircle2, Search, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

function ClientSelectField({ f, data, onChange, clients, invalid }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return (clients || []).filter(c => c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q)).slice(0, 8);
  }, [clients, search]);

  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-1.5">
        <span className={`text-sm font-semibold font-heading ${invalid ? "text-gmo-red" : "text-obsidian/70"}`}>{f.label}</span>
        {f.required && <span className="text-gmo-red text-sm font-bold">*</span>}
      </label>
      <div className="relative">
        <button type="button" onClick={() => setOpen(o => !o)}
          className={`w-full border rounded-xl px-4 py-3 text-base font-body text-left flex items-center justify-between transition-all ${
            invalid ? "border-red-300 bg-red-50/20" : "border-gray-300 hover:border-gray-400 focus:border-gmo-green"
          }`}>
          <span className={data[f.key] ? "text-obsidian" : "text-obsidian/35"}>
            {data[f.key] || "— Sélectionner un client —"}
          </span>
          <ChevronDown className="w-4 h-4 text-obsidian/30 flex-shrink-0" />
        </button>
        {open && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-30 overflow-hidden">
            <div className="p-2 border-b border-gray-100">
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <Search className="w-3.5 h-3.5 text-obsidian/30" />
                <input autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un client…"
                  className="flex-1 text-xs font-body bg-transparent focus:outline-none text-obsidian" />
              </div>
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filtered.length === 0
                ? <p className="text-xs text-obsidian/30 text-center py-4 font-body">Aucun client trouvé</p>
                : filtered.map(c => (
                  <button key={c.id} onMouseDown={() => { onChange(f.key, c.name); if (f.onSelectExtra) f.onSelectExtra(c); setOpen(false); setSearch(""); }}
                    className="w-full text-left px-4 py-2.5 hover:bg-gmo-green/5 flex items-center gap-3 transition-colors cursor-pointer">
                    <div className="w-7 h-7 rounded-full bg-gmo-green/15 flex items-center justify-center text-gmo-green font-bold text-xs flex-shrink-0">
                      {c.name?.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-heading font-bold text-obsidian truncate">{c.name}</p>
                      <p className="text-[10px] text-obsidian/40 font-body truncate">{c.email || c.phone || c.city || ""}</p>
                    </div>
                  </button>
                ))
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EntityForm({ title, fields, data, onChange, onSave, onClose, saving, isEdit, clients = [] }) {
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
    if (f.type === "client_select") {
      return <ClientSelectField key={f.key} f={f} data={data} onChange={onChange} clients={clients} invalid={invalid} />;
    }
    return (
      <div key={f.key} className="flex flex-col gap-2">
        <label className="flex items-center gap-1.5">
          <span className={`text-sm font-semibold font-heading ${invalid ? "text-gmo-red" : "text-obsidian/70"}`}>
            {f.label}
          </span>
          {f.required && <span className="text-gmo-red text-sm font-bold">*</span>}
        </label>

        {f.type === "select" ? (
          <select
            value={data[f.key] ?? ""}
            onChange={e => onChange(f.key, e.target.value)}
            className={`w-full border rounded-xl px-4 py-3 text-base font-body text-obsidian bg-white focus:outline-none transition-all ${
              invalid ? "border-red-300 bg-red-50/20 focus:border-gmo-red" : "border-gray-300 hover:border-gray-400 focus:border-gmo-green focus:ring-2 focus:ring-gmo-green/15"
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
            className={`w-full border rounded-xl px-4 py-3 text-base font-body text-obsidian focus:outline-none transition-all resize-none ${
              invalid ? "border-red-300 bg-red-50/20 focus:border-gmo-red" : "border-gray-300 hover:border-gray-400 focus:border-gmo-green focus:ring-2 focus:ring-gmo-green/15"
            }`}
          />

        ) : f.type === "checkbox" ? (
          <button
            type="button"
            onClick={() => onChange(f.key, !data[f.key])}
            className={`flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all ${
              data[f.key] ? "bg-gmo-green/5 border-gmo-green/40" : "bg-gray-50 border-gray-300 hover:border-gray-400"
            }`}
          >
            <div className={`rounded-full transition-colors duration-300 relative flex-shrink-0 ${data[f.key] ? "bg-gmo-green" : "bg-gray-300"}`}
              style={{ height: 24, width: 44 }}>
              <div className={`absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow transition-transform duration-300 ${data[f.key] ? "translate-x-[23px]" : "translate-x-[3px]"}`} />
            </div>
            <span className={`text-base font-body transition-colors ${data[f.key] ? "text-gmo-green font-medium" : "text-obsidian/60"}`}>
              {f.checkLabel || f.label}
            </span>
            {data[f.key] && <CheckCircle2 className="w-4 h-4 text-gmo-green ml-auto" />}
          </button>

        ) : (
          <div className="relative">
            <input
              type={f.type || "text"}
              value={data[f.key] ?? ""}
              onChange={e => onChange(f.key, e.target.value)}
              placeholder={f.placeholder || ""}
              className={`w-full border rounded-xl px-4 py-3 text-base font-body text-obsidian focus:outline-none transition-all ${
                invalid
                  ? "border-red-300 bg-red-50/20 focus:border-gmo-red pr-10"
                  : "border-gray-300 hover:border-gray-400 focus:border-gmo-green focus:ring-2 focus:ring-gmo-green/15"
              }`}
            />
            {invalid && (
              <AlertCircle className="w-5 h-5 text-gmo-red absolute right-3.5 top-1/2 -translate-y-1/2" />
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
        className="flex-1 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        ref={panelRef}
        initial={{ x: "100%", opacity: 0.6 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="w-full max-w-xl bg-white shadow-2xl flex flex-col h-full border-l border-gray-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 sticky top-0 bg-white z-10 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isEdit ? "bg-amber-100" : "bg-gmo-green/15"}`}>
              {isEdit
                ? <div className="w-4 h-4 rounded-full bg-amber-500" />
                : <div className="w-4 h-4 rounded-full bg-gmo-green" />
              }
            </div>
            <div>
              <p className="font-heading text-lg font-bold text-obsidian leading-tight">
                {isEdit ? `Modifier — ${title}` : `Nouveau — ${title}`}
              </p>
              <p className="text-xs text-obsidian/40 font-body mt-0.5">GMO Burkina ERP</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-obsidian/40 hover:text-obsidian hover:border-gray-300 hover:bg-gray-50 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Fields */}
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-5">
          {fieldGroups.map((group, gi) => (
            group.length === 2 ? (
              <div key={gi} className="grid grid-cols-2 gap-4">
                {group.map(f => renderField(f))}
              </div>
            ) : (
              <div key={gi}>{renderField(group[0])}</div>
            )
          ))}

          {hasRequired && !allValid && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3.5 mt-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700 font-body">Veuillez remplir tous les champs obligatoires.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-7 py-5 border-t border-gray-200 sticky bottom-0 bg-white">
          <div className="flex gap-3">
            <button
              onClick={onSave}
              disabled={saving || !allValid}
              className="flex-1 flex items-center justify-center gap-2 bg-gmo-green text-white font-heading font-bold text-base py-3.5 rounded-xl hover:bg-gmo-green/90 active:scale-[0.98] transition-all disabled:opacity-40 shadow-sm shadow-gmo-green/20"
            >
              {saving
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Save className="w-5 h-5" />}
              {saving ? "Enregistrement…" : (isEdit ? "Enregistrer les modifications" : "Créer")}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3.5 border border-gray-300 rounded-xl text-base font-body text-obsidian/60 hover:border-gray-400 hover:text-obsidian hover:bg-gray-50 active:scale-[0.98] transition-all"
            >
              Annuler
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}