import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { CalendarRange, Lock, Unlock, Plus, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";

export default function FiscalYearManager({ years, setYears }) {
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [closing, setClosing] = useState(null);
  const [form, setForm] = useState({
    year: new Date().getFullYear(),
    label: `Exercice ${new Date().getFullYear()}`,
    start_date: `${new Date().getFullYear()}-01-01`,
    end_date: `${new Date().getFullYear()}-12-31`,
    status: "ouvert",
  });

  const openYear = years.find(y => y.status === "ouvert");

  const createYear = async () => {
    if (!form.year) return;
    setSaving(true);
    const r = await base44.entities.FiscalYear.create({ ...form, label: `Exercice ${form.year}` });
    setYears(prev => [r, ...prev]);
    setShowForm(false);
    setSaving(false);
  };

  const closeYear = async (yr) => {
    if (!confirm(`Clôturer l'exercice ${yr.label} ? Cette opération est irréversible.`)) return;
    setClosing(yr.id);
    const updated = await base44.entities.FiscalYear.update(yr.id, {
      status: "cloture",
      closed_at: new Date().toISOString().split("T")[0],
    });
    setYears(prev => prev.map(y => y.id === yr.id ? { ...y, ...updated } : y));
    setClosing(null);
  };

  const reopenYear = async (yr) => {
    if (!confirm(`Réouvrir l'exercice ${yr.label} ?`)) return;
    const updated = await base44.entities.FiscalYear.update(yr.id, { status: "ouvert", closed_at: null });
    setYears(prev => prev.map(y => y.id === yr.id ? { ...y, ...updated } : y));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-base font-bold text-obsidian">Exercices comptables</h3>
          <p className="text-xs text-obsidian/40 font-body mt-0.5">Ouverture et clôture des exercices SYSCOHADA</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-gmo-green text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-gmo-green/90 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Nouvel exercice
        </button>
      </div>

      {/* Active exercise banner */}
      {openYear && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gmo-green/10 flex items-center justify-center flex-shrink-0">
            <Unlock className="w-4 h-4 text-gmo-green" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm text-gmo-green">{openYear.label} — En cours</p>
            <p className="text-xs text-green-700/60 font-body">{openYear.start_date} → {openYear.end_date}</p>
          </div>
          <button
            onClick={() => closeYear(openYear)}
            disabled={closing === openYear.id}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-60 cursor-pointer">
            {closing === openYear.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
            Clôturer
          </button>
        </div>
      )}

      {!openYear && years.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-700 font-body">Aucun exercice ouvert. Créez ou réouvrez un exercice pour saisir des écritures.</p>
        </div>
      )}

      {/* Years list */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {years.length === 0 ? (
          <div className="py-12 text-center">
            <CalendarRange className="w-10 h-10 text-obsidian/10 mx-auto mb-3" />
            <p className="text-sm text-obsidian/30 font-body">Aucun exercice créé</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Exercice</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Période</th>
                <th className="text-center px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Statut</th>
                <th className="text-right px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {years.map(yr => (
                <tr key={yr.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-obsidian/5 flex items-center justify-center flex-shrink-0">
                        <CalendarRange className="w-4 h-4 text-obsidian/40" />
                      </div>
                      <div>
                        <p className="font-heading text-sm font-bold text-obsidian">{yr.label}</p>
                        <p className="text-[10px] text-obsidian/30 font-body">Exercice {yr.year}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-obsidian/50 font-body">
                    {yr.start_date} → {yr.end_date}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    {yr.status === "ouvert" ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
                        <Unlock className="w-2.5 h-2.5" /> Ouvert
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                        <Lock className="w-2.5 h-2.5" /> Clôturé{yr.closed_at ? ` le ${yr.closed_at}` : ""}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {yr.status === "ouvert" ? (
                      <button onClick={() => closeYear(yr)} disabled={closing === yr.id}
                        className="text-[11px] text-red-500 hover:text-red-700 font-semibold transition-colors cursor-pointer disabled:opacity-50">
                        {closing === yr.id ? "Clôture…" : "Clôturer"}
                      </button>
                    ) : (
                      <button onClick={() => reopenYear(yr)}
                        className="text-[11px] text-gmo-green hover:text-gmo-green/70 font-semibold transition-colors cursor-pointer">
                        Réouvrir
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="font-heading text-lg font-bold text-obsidian mb-5">Ouvrir un nouvel exercice</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Année</label>
                <input type="number" value={form.year} onChange={e => setForm(f => ({ ...f, year: +e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gmo-green" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Date début</label>
                  <input type="date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gmo-green" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Date fin</label>
                  <input type="date" value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gmo-green" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)}
                className="flex-1 border border-gray-200 text-sm font-semibold text-gray-600 py-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                Annuler
              </button>
              <button onClick={createYear} disabled={saving}
                className="flex-1 bg-gmo-green text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-gmo-green/90 transition-colors cursor-pointer disabled:opacity-60">
                {saving ? "Création…" : "Ouvrir l'exercice"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}