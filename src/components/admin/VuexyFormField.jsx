/**
 * Composants de champ unifiés - Design System Vuexy
 * Inspiré de https://demos.pixinvent.com/vuexy-html-admin-template/
 */
import React, { useState, useMemo } from "react";
import { Search, ChevronDown, AlertCircle, CheckCircle2, X } from "lucide-react";

// ── Classes utilitaires ──
export const fieldBaseClass = "w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-body text-obsidian placeholder:text-obsidian/30 focus:outline-none focus:bg-white focus:border-gmo-green focus:ring-2 focus:ring-gmo-green/10 transition-all";

export const labelClass = "text-[10px] font-bold uppercase tracking-widest font-heading text-obsidian/40 mb-2";

// ── Label avec indicateur requis ──
export function FieldLabel({ label, required, className = "" }) {
  return (
    <label className={`flex items-center gap-1 mb-2 ${className}`}>
      <span className={`text-[10px] font-bold uppercase tracking-widest font-heading ${labelClass}`}>
        {label}
      </span>
      {required && <span className="text-gmo-red text-xs leading-none">*</span>}
    </label>
  );
}

// ── Input texte/number/date ──
export function FieldInput({ value, onChange, placeholder, type = "text", required, invalid, icon: Icon, ...props }) {
  return (
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian/30 pointer-events-none">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <input
        type={type}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        className={`${fieldBaseClass} ${invalid ? "border-red-300 bg-red-50 focus:border-gmo-red focus:ring-red-100" : ""} ${Icon ? "pl-10" : ""}`}
        {...props}
      />
      {invalid && (
        <AlertCircle className="w-4 h-4 text-gmo-red absolute right-3 top-1/2 -translate-y-1/2" />
      )}
    </div>
  );
}

// ── Select ──
export function FieldSelect({ value, onChange, options, placeholder = "Sélectionner…", required, invalid }) {
  return (
    <div className="relative">
      <select
        value={value ?? ""}
        onChange={onChange}
        className={`${fieldBaseClass} appearance-none cursor-pointer ${invalid ? "border-red-300 bg-red-50" : ""}`}
      >
        {!required && <option value="">{placeholder}</option>}
        {options?.map(o => (
          <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
        ))}
      </select>
      <ChevronDown className="w-4 h-4 text-obsidian/30 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
}

// ── Textarea ──
export function FieldTextarea({ value, onChange, placeholder, rows = 3, required, invalid }) {
  return (
    <textarea
      value={value ?? ""}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`${fieldBaseClass} resize-none ${invalid ? "border-red-300 bg-red-50 focus:border-gmo-red focus:ring-red-100" : ""}`}
    />
  );
}

// ── Checkbox toggle ──
export function FieldToggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl border transition-all ${
        checked ? "bg-gmo-green/5 border-gmo-green/30" : "bg-gray-50 border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className={`rounded-full transition-colors duration-200 relative flex-shrink-0 ${checked ? "bg-gmo-green" : "bg-gray-300"}`}
        style={{ height: 20, width: 36 }}>
        <div className={`absolute top-[2px] w-[16px] h-[16px] rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-[18px]" : "translate-x-[2px]"}`} />
      </div>
      <span className={`text-sm font-body ${checked ? "text-gmo-green font-medium" : "text-obsidian/50"}`}>
        {label}
      </span>
      {checked && <CheckCircle2 className="w-4 h-4 text-gmo-green ml-auto" />}
    </button>
  );
}

// ── Searchable Select (dropdown) ──
export function FieldSearchableSelect({ value, onChange, options, placeholder, searchPlaceholder, onSelect, renderOption }) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    if (!search) return options?.slice(0, 8) || [];
    return (options || []).filter(o => {
      const label = o.label ?? o;
      return label.toLowerCase().includes(search.toLowerCase());
    }).slice(0, 8);
  }, [options, search]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`${fieldBaseClass} flex items-center justify-between`}
      >
        <span className={value ? "text-obsidian" : "text-obsidian/30"}>
          {value || placeholder}
        </span>
        <ChevronDown className="w-4 h-4 text-obsidian/30 flex-shrink-0" />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-30 overflow-hidden">
          <div className="p-3 border-b border-gray-50">
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
              <Search className="w-3.5 h-3.5 text-obsidian/30" />
              <input
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={searchPlaceholder || "Rechercher…"}
                className="flex-1 text-xs font-body bg-transparent focus:outline-none text-obsidian"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-obsidian/30 hover:text-obsidian cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-44 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-xs text-obsidian/30 text-center py-3 font-body">Aucun résultat</p>
            ) : (
              filtered.map((opt, idx) => {
                const label = opt.label ?? opt;
                const val = opt.value ?? opt;
                return (
                  <button
                    key={idx}
                    onMouseDown={() => {
                      onSelect ? onSelect(opt) : onChange(val);
                      setOpen(false);
                      setSearch("");
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-gmo-green/5 flex items-center gap-3 transition-colors cursor-pointer border-b border-gray-50 last:border-0"
                  >
                    {renderOption ? renderOption(opt) : (
                      <span className="text-xs font-heading font-bold text-obsidian">{label}</span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Alert box ──
export function FieldAlert({ type = "warning", message, icon }) {
  const config = {
    warning: { bg: "bg-amber-50", border: "border-amber-100", text: "text-amber-700", Icon: AlertCircle },
    error: { bg: "bg-red-50", border: "border-red-100", text: "text-red-600", Icon: AlertCircle },
    success: { bg: "bg-green-50", border: "border-green-100", text: "text-green-700", Icon: CheckCircle2 },
  }[type];

  const DisplayIcon = icon || config.Icon;

  return (
    <div className={`flex items-center gap-3 ${config.bg} ${config.border} rounded-xl px-4 py-3`}>
      <DisplayIcon className={`w-4 h-4 flex-shrink-0 ${config.text}`} />
      <p className={`text-xs font-body ${config.text}`}>{message}</p>
    </div>
  );
}

// ── Section header ──
export function FieldSection({ title, children }) {
  return (
    <div className="space-y-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-obsidian/40 font-heading border-b border-gray-100 pb-2">
        {title}
      </p>
      {children}
    </div>
  );
}