import React, { useState, useMemo } from "react";
import { Search, ChevronRight } from "lucide-react";

export default function GrandLivre({ entries }) {
  const [search, setSearch] = useState("");
  const [expandedAccount, setExpandedAccount] = useState(null);

  // Group entries by account_code
  const byAccount = useMemo(() => {
    const map = {};
    for (const e of entries) {
      const code = e.account_code || "???";
      if (!map[code]) map[code] = { code, label: e.account_label || "", lines: [], debit: 0, credit: 0 };
      map[code].lines.push(e);
      map[code].debit += e.debit || 0;
      map[code].credit += e.credit || 0;
    }
    return Object.values(map).sort((a, b) => a.code.localeCompare(b.code));
  }, [entries]);

  const filtered = byAccount.filter(a =>
    !search || a.code.includes(search) || a.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="font-heading text-base font-bold text-obsidian">Grand Livre</h3>
          <p className="text-xs text-obsidian/40 font-body mt-0.5">Mouvements par compte SYSCOHADA</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un compte…"
            className="pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-gmo-green w-52" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 py-12 text-center">
          <p className="text-sm text-obsidian/30 font-body">Aucune donnée</p>
        </div>
      ) : filtered.map(acct => {
        const solde = acct.debit - acct.credit;
        const isExpanded = expandedAccount === acct.code;
        return (
          <div key={acct.code} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <button onClick={() => setExpandedAccount(isExpanded ? null : acct.code)}
              className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <span className="font-mono text-base font-bold text-obsidian w-14">{acct.code}</span>
                <span className="text-sm font-semibold text-obsidian/70">{acct.label}</span>
                <span className="text-[10px] text-obsidian/30 font-body">{acct.lines.length} mouvement(s)</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[10px] text-blue-600/60 font-body">Débit</p>
                  <p className="font-heading text-sm font-bold text-blue-600">{acct.debit.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-red-500/60 font-body">Crédit</p>
                  <p className="font-heading text-sm font-bold text-red-500">{acct.credit.toLocaleString()}</p>
                </div>
                <div className="text-right min-w-[90px]">
                  <p className="text-[10px] text-obsidian/40 font-body">Solde</p>
                  <p className={`font-heading text-sm font-bold ${solde >= 0 ? "text-gmo-green" : "text-red-500"}`}>
                    {solde >= 0 ? "+" : ""}{solde.toLocaleString()}
                  </p>
                </div>
                <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
              </div>
            </button>
            {isExpanded && (
              <div className="border-t border-gray-100">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-5 py-2 text-[10px] font-bold text-gray-400 uppercase">Date</th>
                      <th className="text-left px-4 py-2 text-[10px] font-bold text-gray-400 uppercase">Pièce</th>
                      <th className="text-left px-4 py-2 text-[10px] font-bold text-gray-400 uppercase">Libellé</th>
                      <th className="text-right px-4 py-2 text-[10px] font-bold text-gray-400 uppercase">Débit</th>
                      <th className="text-right px-5 py-2 text-[10px] font-bold text-gray-400 uppercase">Crédit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {acct.lines.map((line, i) => (
                      <tr key={line.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}>
                        <td className="px-5 py-2 text-xs text-obsidian/60 font-body">{line.date ? new Date(line.date).toLocaleDateString("fr-FR") : "—"}</td>
                        <td className="px-4 py-2 text-[11px] text-obsidian/40 font-mono">{line.piece_ref || "—"}</td>
                        <td className="px-4 py-2 text-xs text-obsidian/70 font-body">{line.libelle}</td>
                        <td className="px-4 py-2 text-right font-heading text-sm font-bold text-blue-600">{line.debit > 0 ? line.debit.toLocaleString() : "—"}</td>
                        <td className="px-5 py-2 text-right font-heading text-sm font-bold text-red-500">{line.credit > 0 ? line.credit.toLocaleString() : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}