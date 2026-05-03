import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import EntityTable from "./EntityTable";
import EntityForm from "./EntityForm";
import InvoicePdfButton from "./InvoicePdfButton";
import { FileText } from "lucide-react";

const STATUS_STYLE = {
  brouillon: "bg-gray-100 text-obsidian/50",
  envoye: "bg-blue-50 text-blue-600 border border-blue-200",
  paye: "bg-green-50 text-green-700 border border-green-200",
  partiel: "bg-amber-50 text-amber-600 border border-amber-200",
  annule: "bg-red-50 text-red-600 border border-red-200",
};
const STATUS_LABELS = { brouillon: "Brouillon", envoye: "Envoyé", paye: "Payé", partiel: "Partiel", annule: "Annulé" };
const TYPE_LABELS = { facture: "Facture", proforma: "Proforma", devis: "Devis" };

const FIELDS = [
  { key: "type", label: "Type", type: "select", required: true, options: ["facture","proforma","devis"] },
  { key: "number", label: "Numéro" },
  { key: "client_name", label: "Client", required: true },
  { key: "date", label: "Date", type: "date" },
  { key: "due_date", label: "Date d'échéance", type: "date" },
  { key: "subtotal", label: "Sous-total (FCFA)", type: "number" },
  { key: "tax_rate", label: "TVA (%)", type: "number" },
  { key: "total", label: "Total TTC (FCFA)", type: "number" },
  { key: "status", label: "Statut", type: "select", options: ["brouillon","envoye","paye","partiel","annule"] },
  { key: "paid_amount", label: "Montant payé (FCFA)", type: "number" },
  { key: "notes", label: "Notes", type: "textarea" },
];

const COLUMNS = [
  { key: "number", label: "N°", render: (v, r) => <div><p className="font-heading text-xs font-bold text-obsidian">{v || "—"}</p><span className={`text-[9px] px-1.5 py-0.5 rounded font-body ${TYPE_LABELS[r.type] ? "bg-obsidian/5 text-obsidian/50" : ""}`}>{TYPE_LABELS[r.type] || r.type}</span></div> },
  { key: "client_name", label: "Client", render: v => <span className="text-xs text-obsidian/70 font-body">{v || "—"}</span> },
  { key: "date", label: "Date", render: v => <span className="text-xs text-obsidian/50 font-body">{v ? new Date(v).toLocaleDateString("fr-FR") : "—"}</span> },
  { key: "total", label: "Total", align: "right", render: v => v ? <span className="font-heading text-xs font-bold text-obsidian">{Number(v).toLocaleString()} FCFA</span> : <span className="text-obsidian/25">—</span> },
  { key: "paid_amount", label: "Payé", align: "right", render: v => v ? <span className="text-xs text-green-600 font-heading font-bold">{Number(v).toLocaleString()}</span> : <span className="text-obsidian/25 text-xs">—</span> },
  { key: "status", label: "Statut", align: "center", render: v => <span className={`text-[10px] px-2 py-0.5 rounded-full font-body ${STATUS_STYLE[v] || ""}`}>{STATUS_LABELS[v] || v}</span> },
  { key: "id", label: "PDF", align: "center", render: (v) => <InvoicePdfButton invoiceId={v} label="PDF" /> },
];

const EMPTY = { type: "facture", number: "", client_name: "", date: "", due_date: "", subtotal: 0, tax_rate: 18, total: 0, status: "brouillon", paid_amount: 0, notes: "" };

export default function InvoicesTab({ invoices, setInvoices }) {
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const openAdd = () => {
    const num = `FAC-${Date.now().toString().slice(-6)}`;
    setEditing(null);
    setForm({...EMPTY, number: num, date: new Date().toISOString().split("T")[0]});
  };
  const openEdit = r => { setEditing(r); setForm({...r}); };
  const onChange = (k, v) => setForm(f => {
    const nf = {...f, [k]: v};
    if (k === "subtotal" || k === "tax_rate") {
      const sub = parseFloat(nf.subtotal) || 0;
      const tax = parseFloat(nf.tax_rate) || 0;
      nf.total = +(sub * (1 + tax/100)).toFixed(0);
    }
    return nf;
  });

  const save = async () => {
    if (!form?.client_name) return;
    setSaving(true);
    const d = {...form, subtotal: +form.subtotal||0, tax_rate: +form.tax_rate||0, total: +form.total||0, paid_amount: +form.paid_amount||0};
    if (editing) {
      await base44.entities.Invoice.update(editing.id, d);
      setInvoices(prev => prev.map(i => i.id === editing.id ? {...i, ...d} : i));
    } else {
      const r = await base44.entities.Invoice.create(d);
      setInvoices(prev => [r, ...prev]);
    }
    setSaving(false); setForm(null); setEditing(null);
  };

  const del = async r => {
    if (!confirm(`Supprimer ${r.number || r.type} ?`)) return;
    await base44.entities.Invoice.delete(r.id);
    setInvoices(prev => prev.filter(i => i.id !== r.id));
  };

  return (
    <>
      <EntityTable title="Devis / Factures / Proforma" subtitle={`${invoices.length} documents`} columns={COLUMNS} rows={invoices} onAdd={openAdd} onEdit={openEdit} onDelete={del} addLabel="Nouveau document" />
      {form && <EntityForm title="Document commercial" fields={FIELDS} data={form} onChange={onChange} onSave={save} onClose={() => { setForm(null); setEditing(null); }} saving={saving} isEdit={!!editing} />}
    </>
  );
}