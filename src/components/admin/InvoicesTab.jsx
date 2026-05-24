import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import EntityTable from "./EntityTable";
import InvoiceForm from "./InvoiceForm";
import InvoicePdfButton from "./InvoicePdfButton";
import { FileText, Plus, TrendingUp, Clock, CheckCircle2, AlertCircle } from "lucide-react";

const STATUS_STYLE = {
  brouillon: "bg-gray-100 text-obsidian/50",
  envoye: "bg-blue-50 text-blue-600 border border-blue-200",
  paye: "bg-green-50 text-green-700 border border-green-200",
  partiel: "bg-amber-50 text-amber-600 border border-amber-200",
  annule: "bg-red-50 text-red-600 border border-red-200",
};
const STATUS_LABELS = { brouillon: "Brouillon", envoye: "Envoyé", paye: "Payé", partiel: "Partiel", annule: "Annulé" };
const TYPE_LABELS = { facture: "Facture", proforma: "Proforma", devis: "Devis" };
const TYPE_COLORS = {
  facture: "bg-gmo-green/10 text-gmo-green",
  proforma: "bg-blue-50 text-blue-600",
  devis: "bg-purple-50 text-purple-600",
};

const COLUMNS = [
  { key: "number", label: "N°", render: (v, r) => (
    <div>
      <p className="font-heading text-xs font-bold text-obsidian">{v || "—"}</p>
      <span className={`text-[9px] px-1.5 py-0.5 rounded font-body ${TYPE_COLORS[r.type] || "bg-gray-100 text-obsidian/40"}`}>
        {TYPE_LABELS[r.type] || r.type}
      </span>
    </div>
  )},
  { key: "client_name", label: "Client", render: v => <span className="text-xs text-obsidian/70 font-body">{v || "—"}</span> },
  { key: "date", label: "Date", render: v => <span className="text-xs text-obsidian/50 font-body">{v ? new Date(v).toLocaleDateString("fr-FR") : "—"}</span> },
  { key: "due_date", label: "Échéance", render: v => {
    if (!v) return <span className="text-obsidian/20 text-xs">—</span>;
    const late = new Date(v) < new Date();
    return <span className={`text-xs font-body ${late ? "text-gmo-red font-semibold" : "text-obsidian/50"}`}>{new Date(v).toLocaleDateString("fr-FR")}{late ? " ⚠" : ""}</span>;
  }},
  { key: "subtotal", label: "HT", align: "right", render: v => v ? <span className="text-xs text-obsidian/50 font-body">{Number(v).toLocaleString()}</span> : <span className="text-obsidian/20">—</span> },
  { key: "total", label: "TTC", align: "right", render: v => v ? <span className="font-heading text-xs font-bold text-obsidian">{Number(v).toLocaleString()} FCFA</span> : <span className="text-obsidian/25">—</span> },
  { key: "paid_amount", label: "Payé", align: "right", render: (v, r) => {
    const reste = (r.total || 0) - (v || 0);
    return (
      <div className="text-right">
        <p className="text-xs text-green-600 font-heading font-bold">{Number(v || 0).toLocaleString()}</p>
        {reste > 0 && <p className="text-[9px] text-gmo-red font-body">-{Number(reste).toLocaleString()}</p>}
      </div>
    );
  }},
  { key: "status", label: "Statut", align: "center", render: v => <span className={`text-[10px] px-2 py-0.5 rounded-full font-body ${STATUS_STYLE[v] || ""}`}>{STATUS_LABELS[v] || v}</span> },
  { key: "id", label: "PDF", align: "center", render: (v) => <InvoicePdfButton invoiceId={v} label="PDF" /> },
];

export default function InvoicesTab({ invoices, setInvoices, clients = [], products = [] }) {
  const [formInv, setFormInv] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  const openAdd = () => { setFormInv(null); setFormOpen(true); };
  const openEdit = r => { setFormInv(r); setFormOpen(true); };

  const handleSaved = (result) => {
    if (formInv) {
      setInvoices(prev => prev.map(i => i.id === formInv.id ? { ...i, ...result } : i));
    } else {
      setInvoices(prev => [result, ...prev]);
    }
    setFormOpen(false);
  };

  const del = async r => {
    if (!confirm(`Supprimer ${r.number || r.type} ?`)) return;
    await base44.entities.Invoice.delete(r.id);
    setInvoices(prev => prev.filter(i => i.id !== r.id));
  };

  const totalCA = invoices.filter(i => i.status === "paye").reduce((s, i) => s + (i.total || 0), 0);
  const totalPending = invoices.filter(i => ["envoye", "partiel"].includes(i.status)).reduce((s, i) => s + ((i.total || 0) - (i.paid_amount || 0)), 0);
  const countBrouillon = invoices.filter(i => i.status === "brouillon").length;
  const countLate = invoices.filter(i => i.due_date && new Date(i.due_date) < new Date() && i.status !== "paye" && i.status !== "annule").length;

  return (
    <div className="space-y-4 animate-fade-up">
      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "CA facturé", value: `${(totalCA/1000).toFixed(0)}k FCFA`, color: "text-gmo-green", bg: "from-green-50 to-green-50/20", border: "border-green-100", icon: TrendingUp },
          { label: "En attente de paiement", value: `${(totalPending/1000).toFixed(0)}k FCFA`, color: "text-amber-500", bg: "from-amber-50 to-amber-50/20", border: "border-amber-100", icon: Clock },
          { label: "Brouillons", value: countBrouillon, color: "text-obsidian/50", bg: "from-gray-50 to-gray-50/20", border: "border-gray-100", icon: FileText },
          { label: "En retard", value: countLate, color: countLate > 0 ? "text-gmo-red" : "text-green-600", bg: countLate > 0 ? "from-red-50 to-red-50/20" : "from-green-50 to-green-50/20", border: countLate > 0 ? "border-red-100" : "border-green-100", icon: AlertCircle },
        ].map(k => (
          <div key={k.label} className={`bg-gradient-to-br ${k.bg} border ${k.border} rounded-2xl p-4 flex items-center gap-3`}>
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
              <k.icon className={`w-4 h-4 ${k.color}`} />
            </div>
            <div>
              <p className={`font-heading text-lg font-bold ${k.color}`}>{k.value}</p>
              <p className="text-[10px] text-obsidian/40 font-body">{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      <EntityTable
        title="Devis / Factures / Proforma"
        subtitle={`${invoices.length} documents`}
        columns={COLUMNS} rows={invoices}
        onAdd={openAdd} onEdit={openEdit} onDelete={del}
        addLabel="Nouveau document"
      />

      {formOpen && (
        <InvoiceForm
          invoice={formInv}
          onSave={handleSaved}
          onClose={() => setFormOpen(false)}
          clients={clients}
          products={products}
        />
      )}
    </div>
  );
}