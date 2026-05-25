import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import {
  Plus, Download, CheckCircle2, XCircle, Clock, Search,
  X, Wallet, TrendingDown, FileText, Upload, Save
} from "lucide-react";
import { motion } from "framer-motion";
import { FieldLabel, FieldInput, FieldSelect, FieldTextarea, FieldAlert, FieldSection } from "./VuexyFormField";

const CATEGORIES = [
  "Carburant / véhicules", "Fournitures de bureau", "Alimentation / restauration",
  "Transport / déplacement", "Communication", "Entretien / réparation",
  "Frais bancaires", "Salaires / avances", "Autre"
];

const STATUS_CFG = {
  en_attente: { label: "En attente", cls: "text-amber-600 bg-amber-50 border-amber-200", Icon: Clock },
  valide:     { label: "Validé",     cls: "text-green-700 bg-green-50 border-green-200",  Icon: CheckCircle2 },
  rejete:     { label: "Rejeté",     cls: "text-red-600 bg-red-50 border-red-200",         Icon: XCircle },
};

function genRef() {
  return "DCH-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}



// ── Expense Form Modal ──
function ExpenseFormModal({ expense, onSave, onClose }) {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState(expense || {
    reference: genRef(), date: today, category: "Autre",
    motif: "", amount: "", payment_method: "Espèces",
    beneficiary_nom: "", beneficiary_prenom: "", beneficiary_phone: "",
    beneficiary_id_type: "CNIB", beneficiary_id_number: "",
    beneficiary_id_date: today, notes: "", status: "en_attente",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    set("receipt_url", file_url);
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.motif || !form.amount || !form.date) return;
    setSaving(true);
    const data = { ...form, amount: Number(form.amount) };
    let saved;
    if (expense?.id) {
      saved = await base44.entities.CashExpense.update(expense.id, data);
    } else {
      saved = await base44.entities.CashExpense.create(data);
    }
    onSave(saved);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 28, stiffness: 350 }}
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] border border-gray-100 my-4"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#1E3A5F] to-[#2D4A6F] border-b border-white/10 px-6 py-5 flex items-center justify-between">
          <div>
            <p className="font-heading text-lg font-bold text-white tracking-tight">
              {expense ? "Modifier" : "Nouvelle"} Décharge
            </p>
            <p className="text-[10px] text-white/50 font-body mt-0.5 uppercase tracking-wider">{form.reference}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="max-w-3xl mx-auto space-y-4">
          <FieldSection title="Opération comptable">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel label="Catégorie de dépense" />
                <FieldSelect
                  value={form.category}
                  onChange={e => set("category", e.target.value)}
                  options={CATEGORIES}
                />
              </div>
              <div>
                <FieldLabel label="Date" required />
                <FieldInput
                  type="date"
                  value={form.date}
                  onChange={e => set("date", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel label="Montant TTC (FCFA)" required />
                <FieldInput
                  type="number"
                  value={form.amount}
                  onChange={e => set("amount", e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <FieldLabel label="Mode de paiement" required />
                <FieldSelect
                  value={form.payment_method}
                  onChange={e => set("payment_method", e.target.value)}
                  options={["Espèces", "Mobile Money", "Chèque", "Virement"]}
                />
              </div>
            </div>
            <div>
              <FieldLabel label="Motif / Objet" required />
              <FieldTextarea
                value={form.motif}
                onChange={e => set("motif", e.target.value)}
                placeholder="Objet de la dépense..."
                rows={2}
              />
            </div>
          </FieldSection>

          <FieldSection title="Bénéficiaire">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel label="Nom" />
                <FieldInput
                  value={form.beneficiary_nom}
                  onChange={e => set("beneficiary_nom", e.target.value)}
                  placeholder="Nom de famille"
                />
              </div>
              <div>
                <FieldLabel label="Prénom(s)" />
                <FieldInput
                  value={form.beneficiary_prenom}
                  onChange={e => set("beneficiary_prenom", e.target.value)}
                  placeholder="Prénom(s)"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel label="Type de pièce" />
                <FieldSelect
                  value={form.beneficiary_id_type}
                  onChange={e => set("beneficiary_id_type", e.target.value)}
                  options={["CNIB", "Passeport", "Permis de conduire", "Carte professionnelle"]}
                />
              </div>
              <div>
                <FieldLabel label="N° Pièce d'identité" />
                <FieldInput
                  value={form.beneficiary_id_number}
                  onChange={e => set("beneficiary_id_number", e.target.value)}
                  placeholder="Numéro"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel label="Date de délivrance" />
                <FieldInput
                  type="date"
                  value={form.beneficiary_id_date}
                  onChange={e => set("beneficiary_id_date", e.target.value)}
                />
              </div>
              <div>
                <FieldLabel label="Téléphone" />
                <FieldInput
                  value={form.beneficiary_phone}
                  onChange={e => set("beneficiary_phone", e.target.value)}
                  placeholder="+226..."
                />
              </div>
            </div>
          </FieldSection>

          <FieldSection title="Justificatif">
            <div>
              <FieldLabel label="Notes" />
              <FieldTextarea
                value={form.notes}
                onChange={e => set("notes", e.target.value)}
                placeholder="Remarques éventuelles..."
                rows={2}
              />
            </div>
            <div>
              <FieldLabel label="Justificatif / Reçu (photo ou scan)" />
              {form.receipt_url ? (
                <FieldAlert
                  type="success"
                  message="Justificatif uploadé"
                  icon={CheckCircle2}
                />
              ) : (
                <label className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-gray-300 rounded-xl text-sm text-obsidian/50 hover:border-gmo-green hover:text-gmo-green transition-colors cursor-pointer w-fit">
                  <Upload className="w-4 h-4" />
                  {uploading ? "Upload en cours…" : "Uploader un justificatif"}
                  <input type="file" className="hidden" accept="image/*,application/pdf" onChange={handleUpload} disabled={uploading} />
                </label>
              )}
            </div>
          </FieldSection>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-5 flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-200 rounded-xl text-sm font-body text-obsidian/60 hover:border-gray-300 hover:text-obsidian hover:bg-gray-50 transition-all cursor-pointer font-medium"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !form.motif || !form.amount}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-gmo-green to-emerald-600 text-white font-heading font-bold text-sm py-3.5 rounded-xl hover:shadow-lg hover:shadow-gmo-green/25 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {saving
              ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <Save className="w-4 h-4" />}
            {saving ? "Enregistrement…" : (expense ? "Mettre à jour" : "Créer")}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main Tab ──
export default function CaisseTab({ expenses, setExpenses }) {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [downloading, setDownloading] = useState(null);

  const filtered = useMemo(() =>
    expenses.filter(e => {
      const matchSearch = !search || [e.reference, e.motif, e.beneficiary_nom, e.beneficiary_prenom, e.category]
        .some(v => String(v || "").toLowerCase().includes(search.toLowerCase()));
      const matchStatus = filterStatus === "all" || e.status === filterStatus;
      return matchSearch && matchStatus;
    }),
    [expenses, search, filterStatus]
  );

  const totalEspeces = expenses.filter(e => e.status !== "rejete" && e.payment_method === "Espèces").reduce((s, e) => s + (e.amount || 0), 0);
  const totalMois = expenses.filter(e => {
    const d = new Date(e.date);
    const now = new Date();
    return e.status !== "rejete" && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce((s, e) => s + (e.amount || 0), 0);
  const pending = expenses.filter(e => e.status === "en_attente").length;

  const handleSave = (saved) => {
    setExpenses(prev => {
      const exists = prev.find(e => e.id === saved.id);
      return exists ? prev.map(e => e.id === saved.id ? saved : e) : [saved, ...prev];
    });
    setFormOpen(false);
    setEditing(null);
  };

  const handleApprove = async (exp) => {
    const updated = await base44.entities.CashExpense.update(exp.id, {
      status: "valide",
      approved_by: "PDG",
      approved_at: new Date().toISOString(),
    });
    setExpenses(prev => prev.map(e => e.id === exp.id ? updated : e));
  };

  const handleReject = async (exp) => {
    if (!confirm("Rejeter cette décharge ?")) return;
    const updated = await base44.entities.CashExpense.update(exp.id, { status: "rejete" });
    setExpenses(prev => prev.map(e => e.id === exp.id ? updated : e));
  };

  const handleDelete = async (exp) => {
    if (!confirm(`Supprimer la décharge ${exp.reference} ?`)) return;
    await base44.entities.CashExpense.delete(exp.id);
    setExpenses(prev => prev.filter(e => e.id !== exp.id));
  };

  const handleDownloadPdf = async (exp) => {
    setDownloading(exp.id);
    const res = await base44.functions.invoke("generateDechargePdf", { expenseId: exp.id });
    if (res.data) {
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const a = document.createElement("a"); a.href = url; a.download = `Decharge-${exp.reference}.pdf`; a.click();
    }
    setDownloading(null);
  };

  return (
    <div className="space-y-5 animate-fade-up">
      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total espèces", value: `${totalEspeces.toLocaleString()} FCFA`, icon: Wallet, grad: "from-emerald-500 to-green-600" },
          { label: "Ce mois-ci", value: `${totalMois.toLocaleString()} FCFA`, icon: TrendingDown, grad: "from-orange-400 to-red-500" },
          { label: "En attente", value: pending, icon: Clock, grad: "from-amber-400 to-amber-500" },
          { label: "Décharges totales", value: expenses.length, icon: FileText, grad: "from-blue-500 to-indigo-600" },
        ].map(s => (
          <div key={s.label} className={`bg-gradient-to-br ${s.grad} rounded-2xl p-5 flex items-center gap-4 shadow-md relative overflow-hidden`}>
            <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-heading text-2xl font-bold text-white">{s.value}</p>
              <p className="text-sm text-white/70 font-body mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-obsidian">
          Caisse / Décharges <span className="text-obsidian/30 font-normal text-lg">({expenses.length})</span>
        </h2>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-obsidian/40" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..."
              className="pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:border-gmo-green focus:outline-none w-44 font-body bg-white shadow-sm" />
          </div>
          {/* Status filter */}
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:border-gmo-green focus:outline-none font-body bg-white shadow-sm cursor-pointer">
            <option value="all">Tous statuts</option>
            <option value="en_attente">En attente</option>
            <option value="valide">Validé</option>
            <option value="rejete">Rejeté</option>
          </select>
          <button onClick={() => { setEditing(null); setFormOpen(true); }}
            className="flex items-center gap-2 bg-gmo-green text-white font-heading font-bold text-sm px-5 py-2.5 rounded-xl btn-glow-green shadow-sm">
            <Plus className="w-4 h-4" /> Nouvelle décharge
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden bg-white shadow-sm" style={{ border: "1px solid rgba(0,0,0,0.07)" }}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-obsidian/20" />
            </div>
            <p className="text-sm text-obsidian/40 font-body">Aucune décharge enregistrée</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  {["Référence", "Date", "Bénéficiaire", "Motif", "Montant", "Statut", "Actions"].map(h => (
                    <th key={h} className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-obsidian/50 font-heading text-left">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(exp => {
                  const st = STATUS_CFG[exp.status] || STATUS_CFG.en_attente;
                  const StIcon = st.Icon;
                  return (
                    <tr key={exp.id} className="hover:bg-gmo-green/[0.03] transition-colors group">
                      <td className="px-5 py-4">
                        <p className="font-heading text-sm font-bold text-obsidian">{exp.reference}</p>
                        <p className="text-[10px] text-obsidian/35 font-body">{exp.category}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-obsidian/70 font-body">{exp.date ? new Date(exp.date).toLocaleDateString("fr-FR") : "—"}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-body font-medium text-obsidian/80">{[exp.beneficiary_nom, exp.beneficiary_prenom].filter(Boolean).join(" ") || "—"}</p>
                        <p className="text-[10px] text-obsidian/35 font-body">{exp.beneficiary_phone || ""}</p>
                      </td>
                      <td className="px-5 py-4 max-w-[160px]">
                        <p className="text-sm text-obsidian/70 font-body truncate">{exp.motif}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-heading text-sm font-bold text-obsidian">{Number(exp.amount).toLocaleString()} FCFA</p>
                        <p className="text-[10px] text-obsidian/35 font-body">{exp.payment_method}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-body ${st.cls}`}>
                          <StIcon className="w-3 h-3" /> {st.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* PDF */}
                          <button onClick={() => handleDownloadPdf(exp)} disabled={downloading === exp.id}
                            title="Télécharger décharge PDF"
                            className="w-8 h-8 rounded-lg border border-transparent hover:border-gmo-green/40 hover:bg-gmo-green/8 flex items-center justify-center text-obsidian/40 hover:text-gmo-green transition-all">
                            {downloading === exp.id
                              ? <div className="w-3.5 h-3.5 border border-gmo-green/30 border-t-gmo-green rounded-full animate-spin" />
                              : <Download className="w-3.5 h-3.5" />}
                          </button>
                          {/* Approve */}
                          {exp.status === "en_attente" && (
                            <button onClick={() => handleApprove(exp)} title="Valider"
                              className="w-8 h-8 rounded-lg border border-transparent hover:border-green-300 hover:bg-green-50 flex items-center justify-center text-obsidian/40 hover:text-green-600 transition-all">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {/* Reject */}
                          {exp.status === "en_attente" && (
                            <button onClick={() => handleReject(exp)} title="Rejeter"
                              className="w-8 h-8 rounded-lg border border-transparent hover:border-red-200 hover:bg-red-50 flex items-center justify-center text-obsidian/40 hover:text-red-500 transition-all">
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {/* Edit */}
                          <button onClick={() => { setEditing(exp); setFormOpen(true); }} title="Modifier"
                            className="w-8 h-8 rounded-lg border border-transparent hover:border-gray-300 hover:bg-gray-50 flex items-center justify-center text-obsidian/40 hover:text-obsidian transition-all">
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          {/* Delete */}
                          <button onClick={() => handleDelete(exp)} title="Supprimer"
                            className="w-8 h-8 rounded-lg border border-transparent hover:border-red-200 hover:bg-red-50 flex items-center justify-center text-obsidian/40 hover:text-red-500 transition-all">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {formOpen && (
        <ExpenseFormModal
          expense={editing}
          onSave={handleSave}
          onClose={() => { setFormOpen(false); setEditing(null); }}
        />
      )}
    </div>
  );
}