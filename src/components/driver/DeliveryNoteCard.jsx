import React, { useState } from "react";
import { FileText, Package, MapPin, User, Truck, ChevronDown, ChevronUp, CheckCircle2, Clock } from "lucide-react";

const STATUS_LABELS = {
  brouillon: { label: "Brouillon", color: "text-gray-500", bg: "bg-gray-50", border: "border-gray-200" },
  valide:    { label: "Validé",    color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  livre:     { label: "Livré ✓",  color: "text-green-700", bg: "bg-green-50", border: "border-green-300" },
  annule:    { label: "Annulé",   color: "text-red-600",   bg: "bg-red-50",   border: "border-red-200" },
};

export default function DeliveryNoteCard({ note }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_LABELS[note.status] || STATUS_LABELS.brouillon;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className={`h-1 ${note.status === "livre" ? "bg-gmo-green" : note.status === "valide" ? "bg-blue-500" : note.status === "annule" ? "bg-red-500" : "bg-gray-300"}`} />
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gmo-green/10 flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-gmo-green" />
            </div>
            <div className="min-w-0">
              <p className="font-heading text-sm font-bold text-obsidian">{note.number || `BL-${note.id?.slice(-6)}`}</p>
              <p className="text-[11px] text-obsidian/40 font-body">{note.date ? new Date(note.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long" }) : "—"}</p>
            </div>
          </div>
          <span className={`text-[11px] px-2.5 py-1 rounded-full border font-body flex-shrink-0 ${cfg.color} ${cfg.bg} ${cfg.border}`}>
            {cfg.label}
          </span>
        </div>

        <div className="space-y-1.5 mb-3">
          {note.client_name && (
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-obsidian/30 flex-shrink-0" />
              <span className="text-sm font-body text-obsidian">{note.client_name}</span>
            </div>
          )}
          {note.warehouse_name && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-obsidian/30 flex-shrink-0" />
              <span className="text-xs font-body text-obsidian/60">{note.warehouse_name}</span>
            </div>
          )}
          {note.vehicle && (
            <div className="flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 text-obsidian/30 flex-shrink-0" />
              <span className="text-xs font-body text-obsidian/60">{note.vehicle}</span>
            </div>
          )}
        </div>

        {note.items?.length > 0 && (
          <>
            <button onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-[11px] text-gmo-green font-body hover:underline mb-1">
              <Package className="w-3 h-3" />
              {note.items.length} article(s)
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            {expanded && (
              <div className="bg-gray-50 rounded-xl p-3 space-y-1 mt-2">
                {note.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-xs font-body">
                    <span className="text-obsidian/70">{item.product_name || item.name || `Article ${i+1}`}</span>
                    <span className="font-semibold text-obsidian">×{item.quantity || item.qty || 1}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {note.notes && (
          <p className="mt-2 text-[11px] text-obsidian/50 font-body bg-gray-50 rounded-lg px-3 py-2">
            📝 {note.notes}
          </p>
        )}
      </div>
    </div>
  );
}