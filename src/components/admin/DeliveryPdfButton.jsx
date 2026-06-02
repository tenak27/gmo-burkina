import React, { useState } from "react";
import { FileDown, Printer, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

async function fetchPdfBlob(deliveryId) {
  const response = await base44.functions.invoke("generateDeliveryPdf", { deliveryId });
  return new Blob([response.data], { type: "application/pdf" });
}

export default function DeliveryPdfButton({ deliveryId, number }) {
  const [loading, setLoading] = useState(null);

  const download = async () => {
    setLoading("download");
    const blob = await fetchPdfBlob(deliveryId);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `GMO-BON-${number || deliveryId}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    setLoading(null);
  };

  const print = async () => {
    setLoading("print");
    const blob = await fetchPdfBlob(deliveryId);
    const url = URL.createObjectURL(blob);
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    document.body.appendChild(iframe);
    iframe.onload = () => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => { document.body.removeChild(iframe); URL.revokeObjectURL(url); }, 2000);
    };
    setLoading(null);
  };

  return (
    <div className="flex items-center gap-1">
      <button onClick={download} disabled={!!loading} title="Télécharger PDF"
        className="flex items-center gap-1 text-[10px] font-body text-obsidian/40 hover:text-gmo-green transition-colors disabled:opacity-40 border border-gray-200 hover:border-gmo-green px-2 py-1 rounded-lg">
        {loading === "download" ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileDown className="w-3 h-3" />}
        PDF
      </button>
      <button onClick={print} disabled={!!loading} title="Imprimer"
        className="flex items-center gap-1 text-[10px] font-body text-obsidian/40 hover:text-blue-600 transition-colors disabled:opacity-40 border border-gray-200 hover:border-blue-400 px-2 py-1 rounded-lg">
        {loading === "print" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Printer className="w-3 h-3" />}
      </button>
    </div>
  );
}