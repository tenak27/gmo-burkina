import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import EntityTable from "./EntityTable";
import EntityForm from "./EntityForm";
import DeliveryPdfButton from "./DeliveryPdfButton";

const TYPE_LABELS = { bon_livraison: "Bon de Livraison", bon_enlevement: "Bon d'Enlèvement", bon_commande: "Bon de Commande" };
const STATUS_STYLE = {
  brouillon: "bg-gray-100 text-obsidian/50",
  valide: "bg-blue-50 text-blue-600 border border-blue-200",
  livre: "bg-green-50 text-green-700 border border-green-200",
  annule: "bg-red-50 text-red-600 border border-red-200",
};

const FIELDS = [
  { key: "type", label: "Type de bon", type: "select", required: true, options: [{value:"bon_livraison",label:"Bon de Livraison"},{value:"bon_enlevement",label:"Bon d'Enlèvement"},{value:"bon_commande",label:"Bon de Commande"}] },
  { key: "number", label: "Numéro" },
  { key: "date", label: "Date", type: "date" },
  { key: "client_name", label: "Client / Destinataire" },
  { key: "supplier_name", label: "Fournisseur (si applicable)" },
  { key: "warehouse_name", label: "Entrepôt" },
  { key: "driver", label: "Chauffeur" },
  { key: "vehicle", label: "Véhicule / Immatriculation" },
  { key: "status", label: "Statut", type: "select", options: [{value:"brouillon",label:"Brouillon"},{value:"valide",label:"Validé"},{value:"livre",label:"Livré"},{value:"annule",label:"Annulé"}] },
  { key: "notes", label: "Notes", type: "textarea" },
];

const COLUMNS = [
  { key: "number", label: "N°", render: (v, r) => <div><p className="font-heading text-xs font-bold text-obsidian">{v || "—"}</p><span className="text-[9px] text-obsidian/40 font-body">{TYPE_LABELS[r.type] || r.type}</span></div> },
  { key: "date", label: "Date", render: v => <span className="text-xs text-obsidian/50 font-body">{v ? new Date(v).toLocaleDateString("fr-FR") : "—"}</span> },
  { key: "client_name", label: "Client / Dest.", render: v => <span className="text-xs text-obsidian/70 font-body">{v || "—"}</span> },
  { key: "driver", label: "Chauffeur", render: v => <span className="text-xs text-obsidian/50 font-body">{v || "—"}</span> },
  { key: "vehicle", label: "Véhicule", render: v => <span className="text-xs text-obsidian/50 font-body">{v || "—"}</span> },
  { key: "status", label: "Statut", align: "center", render: v => <span className={`text-[10px] px-2 py-0.5 rounded-full font-body ${STATUS_STYLE[v] || "bg-gray-100 text-obsidian/40"}`}>{{brouillon:"Brouillon",valide:"Validé",livre:"Livré",annule:"Annulé"}[v]||v}</span> },
  { key: "id", label: "PDF", align: "center", render: (v, r) => <DeliveryPdfButton deliveryId={v} number={r.number} /> },
];

const EMPTY = { type: "bon_livraison", number: "", date: "", client_name: "", supplier_name: "", warehouse_name: "", driver: "", vehicle: "", status: "brouillon", notes: "" };

export default function DeliveryTab({ deliveries, setDeliveries }) {
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const openAdd = () => { setEditing(null); setForm({...EMPTY, number: `BON-${Date.now().toString().slice(-6)}`, date: new Date().toISOString().split("T")[0]}); };
  const openEdit = r => { setEditing(r); setForm({...r}); };
  const onChange = (k, v) => setForm(f => ({...f, [k]: v}));

  const save = async () => {
    setSaving(true);
    if (editing) {
      await base44.entities.DeliveryNote.update(editing.id, form);
      setDeliveries(prev => prev.map(d => d.id === editing.id ? {...d, ...form} : d));
    } else {
      const r = await base44.entities.DeliveryNote.create(form);
      setDeliveries(prev => [r, ...prev]);
    }
    setSaving(false); setForm(null); setEditing(null);
  };

  const del = async r => {
    if (!confirm(`Supprimer ${r.number || "ce bon"} ?`)) return;
    await base44.entities.DeliveryNote.delete(r.id);
    setDeliveries(prev => prev.filter(d => d.id !== r.id));
  };

  return (
    <>
      <EntityTable title="Bons de livraison / enlèvement / commande" subtitle={`${deliveries.length} bons`} columns={COLUMNS} rows={deliveries} onAdd={openAdd} onEdit={openEdit} onDelete={del} addLabel="Nouveau bon" />
      {form && <EntityForm title="Bon de transport" fields={FIELDS} data={form} onChange={onChange} onSave={save} onClose={() => { setForm(null); setEditing(null); }} saving={saving} isEdit={!!editing} />}
    </>
  );
}