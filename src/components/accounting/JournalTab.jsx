import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Search, CheckCircle2, Loader2, BookOpen, FileText } from "lucide-react";

const JOURNALS = [
  { code: "VT", label: "Journal des Ventes" },
  { code: "AC", label: "Journal des Achats" },
  { code: "BQ", label: "Journal de Banque" },
  { code: "CS", label: "Journal de Caisse" },
  { code: "OD", label: "Opérations Diverses" },
  { code: "AN", label: "À-nouveaux" },
];

const JOURNAL_COLORS = {
  VT: "bg-green-50 text-green-700 border-green-200",
  AC: "bg-red-50 text-red-700 border-red-200",
  BQ: "bg-blue-50 text-blue-700 border-blue-200",
  CS: "bg-amber-50 text-amber-700 border-amber-200",
  OD: "bg-purple-50 text-purple-700 border-purple-200",
  AN: "bg-gray-50 text-gray-700 border-gray-200",
};

const EMPTY_LINE = { account_code: "", account_label: "", debit: 0, credit: 0 };

export default function JournalTab({ entries, setEntries, fiscalYears, invoices = [] }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [validating, setValidating] = useState(null);

  const openYear = fiscalYears?.find(y => y.status === "ouvert");

  const [form, setForm] = useState({
    journal_code: "VT",
    date: new Date().toISOString().split("T")[0],
    piece_ref: "",
    libelle: "",
    fiscal_year_id: openYear?.id || "",
    lines: [{ ...EMPTY_LINE }, { ...EMPTY_LINE }],
  });

  const filtered = useMemo(() => {
    let list = [...entries];
    if (filter !== "all") list = list.filter(e => e.journal_code === filter);
    if (search) list = list.filter(e =>
      e.account_code?.includes(search) || e.libelle?.toLowerCase().includes(search.toLowerCase()) || e.piece_ref?.includes(search)
    );
    return list.sort((a, b) => new Date(b.date || b.created_date) - new Date(a.date || a.created_date));
  }, [entries, filter, search]);

  const totalDebit = filtered.reduce((s, e) => s + (e.debit || 0), 0);
  const totalCredit = filtered.reduce((s, e) => s + (e.credit || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 1;

  const addLine = () => setForm(f => ({ ...f, lines: [...f.lines, { ...EMPTY_LINE }] }));
  const removeLine = (i) => setForm(f => ({ ...f, lines: f.lines.filter((_, idx) => idx !== i) }));
  const updateLine = (i, key, val) => setForm(f => ({ ...f, lines: f.lines.map((l, idx) => idx === i ? { ...l, [key]: val } : l) }));

  const formDebit = form.lines.reduce((s, l) => s + (+l.debit || 0), 0);
  const formCredit = form.lines.reduce((s, l) => s + (+l.credit || 0), 0);

  const saveEcriture = async () => {
    if (!form.libelle || !openYear) return;
    setSaving(true);
    const created = [];
    for (const line of form.lines) {
      if (!line.account_code) continue;
      const entry = await base44.entities.JournalEntry.create({
        journal_code: form.journal_code,
        date: form.date,
        piece_ref: form.piece_ref,
        libelle: form.libelle,
        fiscal_year_id: openYear.id,
        account_code: line.account_code,
        account_label: line.account_label,
        debit: +line.debit || 0,
        credit: +line.credit || 0,
        status: "brouillon",
      });
      created.push(entry);
    }
    setEntries(prev => [...created, ...prev]);
    setForm(f => ({ ...f, lines: [{ ...EMPTY_LINE }, { ...EMPTY_LINE }], libelle: "", piece_ref: "" }));
    setShowForm(false);
    setSaving(false);
  };

  const validateEntry = async (entry) => {
    setValidating(entry.id);
    await base44.entities.JournalEntry.update(entry.id, { status: "valide" });
    setEntries(prev => prev.map(e => e.id === entry.id ? { ...e, status: "valide" } : e));
    setValidating(null);
  };

  // Auto-generate journal entries from invoices
  const syncInvoices = async () => {
    if (!openYear) { alert("Ouvrez un exercice d'abord."); return; }
    const existingRefs = new Set(entries.map(e => e.piece_ref));
    let count = 0;
    for (const inv of invoices) {
      if (inv.type !== "facture" || inv.status === "annule") continue;
      const ref = inv.number || inv.id;
      if (existingRefs.has(ref)) continue;
      const ht = inv.subtotal || 0;
      const tva = inv.tax_amount || 0;
      const ttc = inv.total || 0;
      // 411 Clients (débit) / 701 Ventes (crédit) / 442 TVA (crédit)
      const date = inv.date || new Date().toISOString().split("T")[0];
      const libelle = `Facture ${ref} — ${inv.client_name || "Client"}`;
      await base44.entities.JournalEntry.create({ journal_code: "VT", date, piece_ref: ref, libelle, fiscal_year_id: openYear.id, account_code: "411", account_label: "Clients", debit: ttc, credit: 0, status: "valide", invoice_id: inv.id });
      await base44.entities.JournalEntry.create({ journal_code: "VT", date, piece_ref: ref, libelle, fiscal_year_id: openYear.id, account_code: "701", account_label: "Ventes de marchandises", debit: 0, credit: ht, status: "valide", invoice_id: inv.id });
      if (tva > 0) await base44.entities.JournalEntry.create({ journal_code: "VT", date, piece_ref: ref, libelle, fiscal_year_id: openYear.id, account_code: "442", account_label: "TVA facturée (18%)", debit: 0, credit: tva, status: "valide", invoice_id: inv.id });
      count++;
    }
    if (count > 0) {
      const fresh = await base44.entities.JournalEntry.list("-date", 500);
      setEntries(fresh);
      alert(`${count} facture(s) synchronisées dans le journal des ventes.`);
    } else {
      alert("Toutes les factures sont déjà synchronisées.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="font-heading text-base font-bold text-obsidian">Journal des écritures</h3>
          <p className="text-xs text-obsidian/40 font-body mt-0.5">
            {openYear ? `Exercice actif : ${openYear.label}` : "⚠️ Aucun exercice ouvert"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={syncInvoices}
            className="flex items-center gap-1.5 border border-gmo-green/30 bg-green-50 text-gmo-green text-xs font-semibold px-3 py-2 rounded-xl hover:bg-green-100 transition-colors cursor-pointer">
            <FileText className="w-3.5 h-3.5" /> Sync Factures
          </button>
          <button onClick={() => setShowForm(true)} disabled={!openYear}
            className="flex items-center gap-2 bg-gmo-green text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-gmo-green/90 transition-colors disabled:opacity-40 cursor-pointer">
            <Plus className="w-3.5 h-3.5" /> Nouvelle écriture
          </button>
        </div>
      </div>

      {/* Balance indicator */}
      <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${isBalanced ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
        <CheckCircle2 className={`w-4 h-4 ${isBalanced ? "text-green-600" : "text-red-500"}`} />
        <span className={`text-xs font-semibold ${isBalanced ? "text-green-700" : "text-red-600"}`}>
          {isBalanced ? "Balance équilibrée" : "⚠️ Déséquilibre détecté"}
          {" — "}Débit : {totalDebit.toLocaleString()} FCFA &nbsp;|&nbsp; Crédit : {totalCredit.toLocaleString()} FCFA
        </span>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher…"
            className="pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-gmo-green w-48" />
        </div>
        <div className="flex gap-1 flex-wrap">
          {[{ code: "all", label: "Tous" }, ...JOURNALS].map(j => (
            <button key={j.code} onClick={() => setFilter(j.code)}
              className={`text-[11px] px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${filter === j.code ? "bg-obsidian text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-obsidian/30"}`}>
              {j.code === "all" ? "Tous" : j.code}
            </button>
          ))}
        </div>
      </div>

      {/* Journal table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="text-left px-3 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Journal</th>
                <th className="text-left px-3 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pièce</th>
                <th className="text-left px-3 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Compte</th>
                <th className="text-left px-3 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Libellé</th>
                <th className="text-right px-3 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Débit</th>
                <th className="text-right px-3 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Crédit</th>
                <th className="text-center px-3 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="py-10 text-center text-sm text-obsidian/30 font-body">Aucune écriture</td></tr>
              ) : filtered.map((e, i) => (
                <tr key={e.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-2.5 text-xs text-obsidian/60 font-body whitespace-nowrap">
                    {e.date ? new Date(e.date).toLocaleDateString("fr-FR") : "—"}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${JOURNAL_COLORS[e.journal_code] || "bg-gray-50 text-gray-500 border-gray-200"}`}>
                      {e.journal_code}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-[11px] text-obsidian/50 font-mono">{e.piece_ref || "—"}</td>
                  <td className="px-3 py-2.5">
                    <span className="font-mono text-sm font-bold text-obsidian">{e.account_code}</span>
                    <span className="text-[10px] text-obsidian/40 ml-1 font-body">{e.account_label}</span>
                  </td>
                  <td className="px-3 py-2.5 text-xs text-obsidian/70 font-body max-w-[180px] truncate">{e.libelle}</td>
                  <td className="px-3 py-2.5 text-right font-heading text-sm font-bold text-blue-600">
                    {e.debit > 0 ? e.debit.toLocaleString() : "—"}
                  </td>
                  <td className="px-3 py-2.5 text-right font-heading text-sm font-bold text-red-500">
                    {e.credit > 0 ? e.credit.toLocaleString() : "—"}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    {e.status === "valide" ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200 font-body">Validé</span>
                    ) : (
                      <button onClick={() => validateEntry(e)} disabled={validating === e.id}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-body cursor-pointer hover:bg-amber-100">
                        {validating === e.id ? "…" : "Valider"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            {filtered.length > 0 && (
              <tfoot>
                <tr className="bg-obsidian/5 border-t border-gray-200">
                  <td colSpan={5} className="px-4 py-2.5 text-xs font-bold text-obsidian/60">Total ({filtered.length} lignes)</td>
                  <td className="px-3 py-2.5 text-right font-heading text-sm font-bold text-blue-600">{totalDebit.toLocaleString()}</td>
                  <td className="px-3 py-2.5 text-right font-heading text-sm font-bold text-red-500">{totalCredit.toLocaleString()}</td>
                  <td />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* New entry form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="font-heading text-lg font-bold text-obsidian mb-5">Nouvelle écriture comptable</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Journal</label>
                <select value={form.journal_code} onChange={e => setForm(f => ({ ...f, journal_code: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gmo-green">
                  {JOURNALS.map(j => <option key={j.code} value={j.code}>{j.code} — {j.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Date</label>
                <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gmo-green" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Référence pièce</label>
                <input value={form.piece_ref} onChange={e => setForm(f => ({ ...f, piece_ref: e.target.value }))} placeholder="N° facture, chèque…"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gmo-green" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Libellé *</label>
                <input value={form.libelle} onChange={e => setForm(f => ({ ...f, libelle: e.target.value }))} placeholder="Description de l'opération"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gmo-green" />
              </div>
            </div>

            {/* Lines */}
            <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">N° Compte</th>
                    <th className="text-left px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Libellé compte</th>
                    <th className="text-right px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Débit</th>
                    <th className="text-right px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Crédit</th>
                    <th className="w-8" />
                  </tr>
                </thead>
                <tbody>
                  {form.lines.map((line, i) => (
                    <tr key={i} className="border-t border-gray-100">
                      <td className="px-3 py-2"><input value={line.account_code} onChange={e => updateLine(i, "account_code", e.target.value)} placeholder="411"
                        className="w-full border border-gray-200 rounded px-2 py-1 text-sm font-mono focus:outline-none focus:border-gmo-green" /></td>
                      <td className="px-3 py-2"><input value={line.account_label} onChange={e => updateLine(i, "account_label", e.target.value)} placeholder="Clients"
                        className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-gmo-green" /></td>
                      <td className="px-3 py-2"><input type="number" value={line.debit || ""} onChange={e => updateLine(i, "debit", e.target.value)} placeholder="0"
                        className="w-full border border-gray-200 rounded px-2 py-1 text-sm text-right focus:outline-none focus:border-gmo-green" /></td>
                      <td className="px-3 py-2"><input type="number" value={line.credit || ""} onChange={e => updateLine(i, "credit", e.target.value)} placeholder="0"
                        className="w-full border border-gray-200 rounded px-2 py-1 text-sm text-right focus:outline-none focus:border-gmo-green" /></td>
                      <td className="px-2 py-2"><button onClick={() => removeLine(i)} className="text-red-400 hover:text-red-600 text-lg cursor-pointer">×</button></td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className={`border-t-2 ${Math.abs(formDebit - formCredit) < 1 ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"}`}>
                    <td colSpan={2} className="px-3 py-2 text-xs font-bold text-gray-600">
                      {Math.abs(formDebit - formCredit) < 1 ? "✓ Écriture équilibrée" : `⚠ Écart : ${Math.abs(formDebit - formCredit).toLocaleString()} FCFA`}
                    </td>
                    <td className="px-3 py-2 text-right text-sm font-bold text-blue-600">{formDebit.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right text-sm font-bold text-red-500">{formCredit.toLocaleString()}</td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
            <button onClick={addLine} className="text-xs text-gmo-green font-semibold hover:underline mb-4 cursor-pointer">+ Ajouter une ligne</button>

            <div className="flex gap-3">
              <button onClick={() => setShowForm(false)}
                className="flex-1 border border-gray-200 text-sm font-semibold text-gray-600 py-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                Annuler
              </button>
              <button onClick={saveEcriture} disabled={saving || Math.abs(formDebit - formCredit) >= 1}
                className="flex-1 bg-gmo-green text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-gmo-green/90 transition-colors cursor-pointer disabled:opacity-40">
                {saving ? "Enregistrement…" : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}