import React, { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function InvoicePdfButton({ invoiceId, orderId, label = "PDF" }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await base44.functions.invoke("generateInvoicePdf", { invoiceId, orderId });
      // response.data is the PDF blob — download it
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `GMO-${invoiceId || orderId || "document"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError("Erreur génération PDF");
    }
    setLoading(false);
  };

  return (
    <button
      onClick={generate}
      disabled={loading}
      title={error || "Télécharger en PDF avec QR code"}
      className="flex items-center gap-1 text-[10px] font-body text-obsidian/40 hover:text-gmo-green transition-colors disabled:opacity-40 border border-gray-200 hover:border-gmo-green px-2 py-1 rounded-lg"
    >
      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileDown className="w-3 h-3" />}
      {label}
    </button>
  );
}