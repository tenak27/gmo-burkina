import React, { useEffect, useRef, useState, useMemo } from "react";
import { X, Save, AlertCircle, CheckCircle2, Search, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const fieldBase = "w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-body text-obsidian focus:outline-none focus:bg-white focus:border-gmo-green focus:ring-2 focus:ring-gmo-green/10 transition-all placeholder:text-obsidian/30";
const fieldError = "bg-red-50 border-red-300 focus:border-gmo-red focus:ring-red-100";

function Label({ f, invalid }) {
  return (
    <label className="flex items-center gap-1 mb-1">
      <span className={`text-[11px] font-semibold uppercase tracking-wide font-heading ${invalid ? "text-gmo-red" : "text-obsidian/50"}`}>
        {f.label}
      </span>
      {f.required && <span className="text-gmo-red text-xs leading-none">*</span>}
    </label>
  );
}

function ClientSelectField({ f, data, onChange, clients, invalid }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return (clients || []).filter(c => c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q)).slice(0, 8);
  }, [clients, search]);

  return (
    <div>
      <Label f={f} invalid={invalid} />
      <div className="relative">
        <button type="button" onClick={() => setOpen(o => !o)}
          className={`${fieldBase} ${invalid ? fieldError : ""} flex items-center justify-between`}>
          <span className={data[f.key] ? "text-obsidian" : "text-obsidian/30"}>
            {data[f.key] || "Sélectionner un client…"}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-obsidian/30 flex-shrink-0" />
        </button>
        {open && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-30 overflow-hidden">
            <div className="p-2 border-b border-gray-100">
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5">
                <Search className="w-3 h-3 text-obsidian/30" />
                <input autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher…"
                  className="flex-1 text-xs font-body bg-transparent focus:outline-none text-obsidian" />
              </div>
            </div>
            <div className="max-h-44 overflow-y-auto">
              {filtered.length === 0
                ? <p className="text-xs text-obsidian/30 text-center py-3 font-body">Aucun résultat</p>
                : filtered.map(c => (
                  <button key={c.id} onMouseDown={() => { onChange(f.key, c.name); if (f.onSelectExtra) f.onSelectExtra(c); setOpen(false); setSearch(""); }}
                    className="w-full text-left px-3 py-2 hover:bg-gmo-green/5 flex items-center gap-2.5 transition-colors cursor-pointer">
                    <div className="w-6 h-6 rounded-full bg-gmo-green/15 flex items-center justify-center text-gmo-green font-bold text-[10px] flex-shrink-0">
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
      <div key={f.key}>
        <Label f={f} invalid={invalid} />
        {f.type === "select" ? (
          <select
            value={data[f.key] ?? ""}
            onChange={e => onChange(f.key, e.target.value)}
            className={`${fieldBase} ${invalid ? fieldError : ""}`}
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
            className={`${fieldBase} ${invalid ? fieldError : ""} resize-none`}
          />

        ) : f.type === "checkbox" ? (
          <button
            type="button"
            onClick={() => onChange(f.key, !data[f.key])}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg border transition-all ${
              data[f.key] ? "bg-gmo-green/5 border-gmo-green/30" : "bg-gray-50 border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className={`rounded-full transition-colors duration-200 relative flex-shrink-0 ${data[f.key] ? "bg-gmo-green" : "bg-gray-300"}`}
              style={{ height: 20, width: 36 }}>
              <div className={`absolute top-[2px] w-[16px] h-[16px] rounded-full bg-white shadow transition-transform duration-200 ${data[f.key] ? "translate-x-[18px]" : "translate-x-[2px]"}`} />
            </div>
            <span className={`text-sm font-body ${data[f.key] ? "text-gmo-green font-medium" : "text-obsidian/50"}`}>
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
              className={`${fieldBase} ${invalid ? fieldError + " pr-8" : ""}`}
            />
            {invalid && (
              <AlertCircle className="w-3.5 h-3.5 text-gmo-red absolute right-3 top-1/2 -translate-y-1/2" />
            )}
          </div>
        )}
      </div>
    );
  };

  const hasRequired = fields.some(f => f.required);
  const allValid = !fields.some(isEmpty);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        ref={panelRef}
        initial={{ scale: 0.97, opacity: 0, y: 8 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.97, opacity: 0, y: 8 }}
        transition={{ type: "spring", damping: 30, stiffness: 350 }}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-xl flex flex-col max-h-[88vh] border border-gray-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <p className="font-heading text-sm font-bold text-obsidian">
              {isEdit ? `Modifier · ${title}` : `Nouveau · ${title}`}
            </p>
            <p className="text-[10px] text-obsidian/30 font-body mt-0.5">GMO Burkina ERP</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-obsidian/30 hover:text-obsidian hover:bg-gray-100 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Fields */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3.5">
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
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
              <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
              <p className="text-xs text-red-600 font-body">Champs obligatoires manquants.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-gray-100 flex gap-2.5">
          <button
            onClick={onSave}
            disabled={saving || !allValid}
            className="flex-1 flex items-center justify-center gap-2 bg-gmo-green text-white font-heading font-bold text-sm py-2.5 rounded-xl hover:bg-gmo-green/90 active:scale-[0.98] transition-all disabled:opacity-40"
          >
            {saving
              ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <Save className="w-3.5 h-3.5" />}
            {saving ? "Enregistrement…" : (isEdit ? "Enregistrer" : "Créer")}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-body text-obsidian/50 hover:border-gray-300 hover:text-obsidian hover:bg-gray-50 active:scale-[0.98] transition-all"
          >
            Annuler
          </button>
        </div>
      </motion.div>
    </div>
  );
}