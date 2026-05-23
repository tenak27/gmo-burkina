import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { FileText, Loader2, Printer } from "lucide-react";
import { openPdfWindow } from "@/components/shared/PdfGenerator";

export default function DevisPdfButton({ invoiceId, devisId, number, type = "devis", variant = "icon", className = "" }) {
  const [loading, setLoading] = useState(false);
  const docId = invoiceId || devisId;

  const handlePdf = async () => {
    if (!docId || loading) return;
    setLoading(true);
    const res = await base44.functions.invoke("generateDevisPdf", { devisId: docId, returnJson: true });
    setLoading(false);
    if (res?.data?.invoice) {
      openPdfWindow(res.data.invoice);
    }
  };

  if (variant === "full") {
    return (
      <button onClick={handlePdf} disabled={loading}
        className={`flex items-center gap-2 bg-gmo-green text-white font-heading font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-gmo-green/90 transition-colors disabled:opacity-60 ${className}`}>
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
        {loading ? "Chargement…" : "Imprimer / PDF"}
      </button>
    );
  }

  if (variant === "outlined") {
    return (
      <button onClick={handlePdf} disabled={loading}
        className={`flex items-center gap-2 border border-gmo-green text-gmo-green font-heading font-bold text-xs px-4 py-2 rounded-xl hover:bg-gmo-green hover:text-white transition-all disabled:opacity-60 ${className}`}>
        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
        {loading ? "PDF…" : "PDF / Imprimer"}
      </button>
    );
  }

  return (
    <button onClick={handlePdf} disabled={loading}
      title={`Imprimer / PDF — ${number || docId}`}
      className={`p-2 rounded-lg border border-gray-200 text-obsidian/40 hover:border-gmo-green hover:text-gmo-green transition-colors disabled:opacity-50 cursor-pointer ${className}`}>
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
    </button>
  );
}