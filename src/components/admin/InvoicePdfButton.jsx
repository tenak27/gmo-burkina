import React, { useState } from "react";
import { FileText, Printer, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { openPdfWindow } from "@/components/shared/PdfGenerator";

async function fetchInvoice(invoiceId) {
  const res = await base44.functions.invoke("generateInvoicePdf", { invoiceId });
  return res?.data?.invoice || null;
}

export default function InvoicePdfButton({ invoiceId, label = "PDF" }) {
  const [loading, setLoading] = useState(false);

  const handlePrint = async () => {
    if (loading) return;
    setLoading(true);
    const inv = await fetchInvoice(invoiceId);
    setLoading(false);
    if (inv) openPdfWindow(inv);
  };

  return (
    <div className="flex items-center gap-1">
      <button onClick={handlePrint} disabled={loading} title="Imprimer / PDF"
        className="flex items-center gap-1 text-[10px] font-body text-obsidian/40 hover:text-gmo-green transition-colors disabled:opacity-40 border border-gray-200 hover:border-gmo-green px-2 py-1 rounded-lg">
        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileText className="w-3 h-3" />}
        {label}
      </button>
      <button onClick={handlePrint} disabled={loading} title="Imprimer"
        className="flex items-center gap-1 text-[10px] font-body text-obsidian/40 hover:text-blue-600 transition-colors disabled:opacity-40 border border-gray-200 hover:border-blue-400 px-2 py-1 rounded-lg">
        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Printer className="w-3 h-3" />}
      </button>
    </div>
  );
}