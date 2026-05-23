/**
 * DevisPdfButton — Bouton de téléchargement PDF pour un devis/facture
 * Usage: <DevisPdfButton invoiceId={inv.id} number={inv.number} type={inv.type} />
 */
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Download, Loader2, FileText } from "lucide-react";

export default function DevisPdfButton({ invoiceId, devisId, number, type = "devis", variant = "icon", className = "" }) {
  const [loading, setLoading] = useState(false);
  const docId = invoiceId || devisId;

  const handleDownload = async () => {
    if (!docId || loading) return;
    setLoading(true);
    const res = await base44.functions.invoke("generateDevisPdf", { devisId: docId });
    setLoading(false);
    if (res?.data) {
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `GMO-${type?.toUpperCase() || "DEVIS"}-${number || docId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  if (variant === "full") {
    return (
      <button
        onClick={handleDownload}
        disabled={loading}
        className={`flex items-center gap-2 bg-gmo-green text-white font-heading font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-gmo-green/90 transition-colors disabled:opacity-60 ${className}`}
      >
        {loading
          ? <Loader2 className="w-4 h-4 animate-spin" />
          : <Download className="w-4 h-4" />}
        {loading ? "Génération…" : "Télécharger PDF"}
      </button>
    );
  }

  if (variant === "outlined") {
    return (
      <button
        onClick={handleDownload}
        disabled={loading}
        className={`flex items-center gap-2 border border-gmo-green text-gmo-green font-heading font-bold text-xs px-4 py-2 rounded-xl hover:bg-gmo-green hover:text-white transition-all disabled:opacity-60 ${className}`}
      >
        {loading
          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
          : <FileText className="w-3.5 h-3.5" />}
        {loading ? "PDF…" : "PDF Devis"}
      </button>
    );
  }

  // Default: icon only
  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      title={`Télécharger le PDF — ${number || docId}`}
      className={`p-2 rounded-lg border border-gray-200 text-obsidian/40 hover:border-gmo-green hover:text-gmo-green transition-colors disabled:opacity-50 cursor-pointer ${className}`}
    >
      {loading
        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
        : <Download className="w-3.5 h-3.5" />}
    </button>
  );
}