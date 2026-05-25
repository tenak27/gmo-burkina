/**
 * Composants de champs de formulaire partagés — style GMO ERP unifié
 */
import React from "react";
import { AlertCircle } from "lucide-react";

export const fieldCls = (invalid = false, extra = "") =>
  `w-full bg-gray-50 border ${invalid ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-gmo-green focus:ring-gmo-green/10"} rounded-lg px-3 py-2 text-sm font-body text-obsidian placeholder:text-obsidian/30 focus:outline-none focus:ring-2 focus:bg-white transition-all ${extra}`;

export function FieldLabel({ label, required, error }) {
  return (
    <label className="flex items-center gap-1 mb-1">
      <span className={`text-[10px] font-bold uppercase tracking-wide font-heading ${error ? "text-red-500" : "text-obsidian/45"}`}>
        {label}
      </span>
      {required && <span className="text-red-400 text-xs leading-none">*</span>}
    </label>
  );
}

export function FormInput({ label, required, error, className = "", ...props }) {
  return (
    <div className={className}>
      {label && <FieldLabel label={label} required={required} error={error} />}
      <div className="relative">
        <input className={fieldCls(!!error)} {...props} />
        {error && <AlertCircle className="w-3.5 h-3.5 text-red-400 absolute right-2.5 top-1/2 -translate-y-1/2" />}
      </div>
    </div>
  );
}

export function FormSelect({ label, required, error, children, className = "", ...props }) {
  return (
    <div className={className}>
      {label && <FieldLabel label={label} required={required} error={error} />}
      <select className={fieldCls(!!error)} {...props}>
        {children}
      </select>
    </div>
  );
}

export function FormTextarea({ label, required, error, rows = 3, className = "", ...props }) {
  return (
    <div className={className}>
      {label && <FieldLabel label={label} required={required} error={error} />}
      <textarea rows={rows} className={fieldCls(!!error, "resize-none")} {...props} />
    </div>
  );
}

export function SectionTitle({ children }) {
  return (
    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-obsidian/35 font-heading border-b border-gray-100 pb-1.5 mb-3">
      {children}
    </p>
  );
}

export function FormDivider() {
  return <div className="h-px bg-gray-100 my-1" />;
}