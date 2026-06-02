/**
 * Formulaire générique - Design Vuexy
 */
import React, { useEffect, useRef, useState, useMemo } from "react";
import { X, Save, ChevronDown, Search } from "lucide-react";
import { motion } from "framer-motion";
import { FieldLabel, FieldInput, FieldSelect, FieldTextarea, FieldToggle, FieldSearchableSelect, FieldAlert, FieldSection } from "./VuexyFormField";

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

    // Client select
    if (f.type === "client_select") {
      return (
        <div key={f.key}>
          <FieldLabel label={f.label} required={f.required} />
          <FieldSearchableSelect
            value={data[f.key]}
            options={clients || []}
            placeholder="Sélectionner un client…"
            searchPlaceholder="Rechercher un client…"
            onSelect={(client) => {
              onChange(f.key, client.name);
              if (f.onSelectExtra) f.onSelectExtra(client);
            }}
            renderOption={(client) => (
              <>
                <div className="w-7 h-7 rounded-full bg-gmo-green/15 flex items-center justify-center text-gmo-green font-bold text-xs flex-shrink-0">
                  {client.name?.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-heading font-bold text-obsidian truncate">{client.name}</p>
                  <p className="text-[10px] text-obsidian/40 font-body truncate">{client.email || client.phone || client.city || ""}</p>
                </div>
              </>
            )}
          />
        </div>
      );
    }

    // Select
    if (f.type === "select") {
      return (
        <div key={f.key}>
          <FieldLabel label={f.label} required={f.required} />
          <FieldSelect
            value={data[f.key]}
            onChange={e => onChange(f.key, e.target.value)}
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
            onChange={e => onChange(f.key, e.target.value)}
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
            onChange={val => onChange(f.key, val)}
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
          onChange={e => onChange(f.key, e.target.value)}
          placeholder={f.placeholder}
          required={f.required}
          invalid={invalid}
        />
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
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      <motion.div
        ref={panelRef}
        initial={{ scale: 0.92, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 24 }}
        transition={{ type: "spring", damping: 30, stiffness: 380 }}
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-[0_25px_80px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[85vh] border border-white/20"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#1E3A5F] to-[#2D4A6F] border-b border-white/10 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <p className="font-heading text-lg font-bold text-white tracking-tight">
              {isEdit ? `Modifier` : `Nouveau`} · {title}
            </p>
            <p className="text-[10px] text-white/50 font-body mt-0.5 uppercase tracking-wider">GMO Burkina ERP</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Fields */}
        <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
          <div className="max-w-3xl mx-auto space-y-3">
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
              <FieldAlert type="error" message="Champs obligatoires manquants." />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex items-center gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-200 rounded-xl text-sm font-body text-obsidian/60 hover:border-gray-300 hover:text-obsidian hover:bg-gray-50 transition-all cursor-pointer font-medium"
          >
            Annuler
          </button>
          <button
            onClick={onSave}
            disabled={saving || !allValid}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-gmo-green to-emerald-600 text-white font-heading font-bold text-sm py-3.5 rounded-xl hover:shadow-lg hover:shadow-gmo-green/25 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {saving
              ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <Save className="w-4 h-4" />}
            {saving ? "Enregistrement…" : (isEdit ? "Enregistrer les modifications" : "Créer")}
          </button>
        </div>
      </motion.div>
    </div>
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
      <label className="flex items-center gap-1 mb-2">
        <span className={`text-[10px] font-bold uppercase tracking-widest font-heading ${invalid ? "text-gmo-red" : "text-obsidian/40"}`}>
          {f.label}
        </span>
        {f.required && <span className="text-gmo-red text-xs leading-none">*</span>}
      </label>
      <div className="relative">
        <button type="button" onClick={() => setOpen(o => !o)}
          className={`w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-body text-obsidian placeholder:text-obsidian/30 focus:outline-none focus:bg-white focus:border-gmo-green focus:ring-2 focus:ring-gmo-green/10 transition-all flex items-center justify-between cursor-pointer ${invalid ? "border-red-300 bg-red-50 focus:border-gmo-red focus:ring-red-100" : ""}`}>
          <span className={data[f.key] ? "text-obsidian" : "text-obsidian/30"}>
            {data[f.key] || "Sélectionner un client…"}
          </span>
          <ChevronDown className="w-4 h-4 text-obsidian/30 flex-shrink-0" />
        </button>
        {open && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-30 overflow-hidden">
            <div className="p-3 border-b border-gray-50">
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <Search className="w-3.5 h-3.5 text-obsidian/30" />
                <input autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher…"
                  className="flex-1 text-xs font-body bg-transparent focus:outline-none text-obsidian" />
              </div>
            </div>
            <div className="max-h-44 overflow-y-auto">
              {filtered.length === 0
                ? <p className="text-xs text-obsidian/30 text-center py-3 font-body">Aucun résultat</p>
                : filtered.map(c => (
                  <button key={c.id} onMouseDown={() => { onChange(f.key, c.name); if (f.onSelectExtra) f.onSelectExtra(c); setOpen(false); setSearch(""); }}
                    className="w-full text-left px-4 py-2.5 hover:bg-gmo-green/5 flex items-center gap-3 transition-colors cursor-pointer border-b border-gray-50 last:border-0">
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