import React, { useState } from "react";
import { CheckCircle2, AlertTriangle, RefreshCw, X } from "lucide-react";

export default function RapprochementModule({ entries, invoices }) {
  const [bankBalance, setBankBalance] = useState("");
  const [reconciled, setReconciled] = useState(false);

  const comptaBalance = entries
    .filter(e=>e.account_code==="521"&&e.status==="valide")
    .reduce((s,e)=>s+(e.debit||0)-(e.credit||0),0);

  const diff = bankBalance ? +bankBalance - comptaBalance : null;
  const isOk = diff !== null && Math.abs(diff) < 1;

  // Unreconciled entries (journal 521 without pièce ref matching an invoice)
  const unreconciledEntries = entries.filter(e=>e.account_code==="521"&&e.status==="brouillon");

  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-heading text-base font-bold text-obsidian">Rapprochement bancaire</h3>
        <p className="text-xs text-obsidian/40 font-body mt-0.5">Vérification cohérence banque ↔ comptabilité (compte 521)</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-[10px] text-obsidian/40 uppercase tracking-wider font-body mb-1">Solde comptable (521 Banque)</p>
          <p className="font-heading text-2xl font-bold text-obsidian">{comptaBalance.toLocaleString("fr-FR")} FCFA</p>
          <p className="text-[11px] text-obsidian/30 font-body mt-1">D'après le journal des écritures</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-[10px] text-obsidian/40 uppercase tracking-wider font-body mb-1">Solde relevé bancaire</p>
          <input
            type="number"
            value={bankBalance}
            onChange={e=>setBankBalance(e.target.value)}
            placeholder="Saisir le solde du relevé…"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-heading font-bold text-obsidian focus:outline-none focus:border-gmo-green mt-1"
          />
        </div>
      </div>

      {diff !== null && (
        <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl border ${isOk?"bg-green-50 border-green-200":"bg-red-50 border-red-200"}`}>
          {isOk
            ? <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
            : <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
          }
          <div>
            <p className={`font-semibold text-sm ${isOk?"text-green-700":"text-red-700"}`}>
              {isOk ? "✓ Rapprochement équilibré" : `⚠️ Écart détecté : ${Math.abs(diff).toLocaleString("fr-FR")} FCFA`}
            </p>
            <p className={`text-xs mt-0.5 ${isOk?"text-green-600/70":"text-red-600/70"}`}>
              {isOk ? "Les soldes bancaire et comptable correspondent." : "Vérifier les écritures non validées ou les pièces manquantes."}
            </p>
          </div>
        </div>
      )}

      {unreconciledEntries.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-amber-50/50">
            <p className="text-xs font-bold text-amber-700">{unreconciledEntries.length} écriture(s) non validée(s) — compte 521</p>
          </div>
          <table className="w-full">
            <thead><tr className="bg-gray-50">
              {["Date","Libellé","Pièce","Débit","Crédit"].map(h=>(
                <th key={h} className="text-left px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {unreconciledEntries.map(e=>(
                <tr key={e.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-2.5 text-xs text-obsidian/60">{e.date?new Date(e.date).toLocaleDateString("fr-FR"):"—"}</td>
                  <td className="px-4 py-2.5 text-xs text-obsidian/80">{e.libelle}</td>
                  <td className="px-4 py-2.5 text-[11px] text-obsidian/40 font-mono">{e.piece_ref||"—"}</td>
                  <td className="px-4 py-2.5 text-xs font-bold text-blue-600">{e.debit>0?e.debit.toLocaleString("fr-FR"):"—"}</td>
                  <td className="px-4 py-2.5 text-xs font-bold text-red-500">{e.credit>0?e.credit.toLocaleString("fr-FR"):"—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}