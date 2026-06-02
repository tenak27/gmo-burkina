import React, { useMemo } from "react";
import { TrendingUp, TrendingDown, Scale } from "lucide-react";

// OHADA account class to balance sheet mapping
const ACTIF_CLASSES = ["2", "3", "4", "5"]; // Immobilisations, stocks, créances, tréso
const PASSIF_CLASSES = ["1"];

function getClass(code) { return code?.[0] || ""; }

function SectionRow({ label, amount, indent = 0 }) {
  return (
    <tr className={indent > 0 ? "text-xs" : "text-sm font-semibold"}>
      <td className={`py-1.5 font-body text-obsidian/${indent > 0 ? "60" : "90"}`} style={{ paddingLeft: `${12 + indent * 16}px` }}>{label}</td>
      <td className={`py-1.5 text-right pr-4 font-heading font-bold ${amount >= 0 ? "text-obsidian/80" : "text-red-500"}`}>
        {amount !== 0 ? amount.toLocaleString() : "—"}
      </td>
    </tr>
  );
}

export default function BalanceSheet({ entries, invoices = [], fiscalYear }) {
  const { actif, passif, charges, produits } = useMemo(() => {
    const accts = {};
    for (const e of entries) {
      const code = e.account_code || "";
      if (!accts[code]) accts[code] = { code, label: e.account_label || code, debit: 0, credit: 0 };
      accts[code].debit += e.debit || 0;
      accts[code].credit += e.credit || 0;
    }

    const actifItems = []; const passifItems = []; const chargesItems = []; const produitsItems = [];

    for (const a of Object.values(accts)) {
      const cls = getClass(a.code);
      const solde = a.debit - a.credit;
      if (cls === "1") passifItems.push({ ...a, solde: a.credit - a.debit });
      else if (cls === "2" || cls === "3" || cls === "5") actifItems.push({ ...a, solde });
      else if (cls === "4") {
        if (parseInt(a.code) >= 400 && parseInt(a.code) < 450) {
          if (a.code[1] === "0") passifItems.push({ ...a, solde: a.credit - a.debit }); // Fournisseurs
          else actifItems.push({ ...a, solde }); // Clients
        }
      } else if (cls === "6") chargesItems.push({ ...a, solde: a.debit });
      else if (cls === "7") produitsItems.push({ ...a, solde: a.credit });
    }

    return {
      actif: actifItems.sort((a, b) => a.code.localeCompare(b.code)),
      passif: passifItems.sort((a, b) => a.code.localeCompare(b.code)),
      charges: chargesItems.sort((a, b) => a.code.localeCompare(b.code)),
      produits: produitsItems.sort((a, b) => a.code.localeCompare(b.code)),
    };
  }, [entries]);

  const totalActif = actif.reduce((s, a) => s + (a.solde || 0), 0);
  const totalPassif = passif.reduce((s, a) => s + (a.solde || 0), 0);
  const totalCharges = charges.reduce((s, a) => s + (a.solde || 0), 0);
  const totalProduits = produits.reduce((s, a) => s + (a.solde || 0), 0);
  const resultat = totalProduits - totalCharges;

  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-heading text-base font-bold text-obsidian">États financiers OHADA</h3>
        <p className="text-xs text-obsidian/40 font-body mt-0.5">
          {fiscalYear ? `${fiscalYear.label}` : "Tous exercices"} — Système Normal SYSCOHADA
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Actif", val: totalActif, color: "text-blue-600", bg: "from-blue-50" },
          { label: "Total Passif", val: totalPassif, color: "text-purple-600", bg: "from-purple-50" },
          { label: "Chiffre d'affaires", val: totalProduits, color: "text-gmo-green", bg: "from-green-50" },
          { label: "Résultat net", val: resultat, color: resultat >= 0 ? "text-gmo-green" : "text-red-500", bg: resultat >= 0 ? "from-green-50" : "from-red-50" },
        ].map(kpi => (
          <div key={kpi.label} className={`bg-gradient-to-br ${kpi.bg} to-white rounded-2xl border border-gray-100 p-4 shadow-sm`}>
            <p className="text-[10px] text-obsidian/40 font-body uppercase tracking-wider mb-1">{kpi.label}</p>
            <p className={`font-heading text-lg font-bold ${kpi.color}`}>{kpi.val.toLocaleString()}</p>
            <p className="text-[10px] text-obsidian/30 font-body">FCFA</p>
          </div>
        ))}
      </div>

      {/* Bilan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ACTIF */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-blue-600 px-5 py-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-white" />
            <h4 className="font-heading text-sm font-bold text-white">ACTIF</h4>
            <span className="ml-auto font-heading text-sm font-bold text-white/80">{totalActif.toLocaleString()} FCFA</span>
          </div>
          <table className="w-full">
            <tbody>
              {actif.length === 0 ? (
                <tr><td className="py-8 text-center text-sm text-obsidian/30 font-body">Aucune donnée</td></tr>
              ) : actif.map(a => <SectionRow key={a.code} label={`${a.code} — ${a.label}`} amount={a.solde} indent={1} />)}
            </tbody>
            <tfoot>
              <tr className="bg-blue-50 border-t border-blue-200">
                <td className="px-3 py-2.5 text-sm font-bold text-blue-700">TOTAL ACTIF</td>
                <td className="text-right pr-4 py-2.5 font-heading text-sm font-bold text-blue-700">{totalActif.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* PASSIF */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-purple-600 px-5 py-3 flex items-center gap-2">
            <Scale className="w-4 h-4 text-white" />
            <h4 className="font-heading text-sm font-bold text-white">PASSIF</h4>
            <span className="ml-auto font-heading text-sm font-bold text-white/80">{(totalPassif + resultat).toLocaleString()} FCFA</span>
          </div>
          <table className="w-full">
            <tbody>
              {passif.map(a => <SectionRow key={a.code} label={`${a.code} — ${a.label}`} amount={a.solde} indent={1} />)}
              <SectionRow label="Résultat de l'exercice" amount={resultat} indent={1} />
            </tbody>
            <tfoot>
              <tr className="bg-purple-50 border-t border-purple-200">
                <td className="px-3 py-2.5 text-sm font-bold text-purple-700">TOTAL PASSIF</td>
                <td className="text-right pr-4 py-2.5 font-heading text-sm font-bold text-purple-700">{(totalPassif + resultat).toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Compte de Résultat */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-obsidian px-5 py-3 flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-white" />
          <h4 className="font-heading text-sm font-bold text-white">COMPTE DE RÉSULTAT</h4>
        </div>
        <div className="grid grid-cols-2 divide-x divide-gray-100">
          {/* Charges */}
          <div>
            <div className="px-5 py-2 bg-red-50 border-b border-red-100">
              <p className="text-xs font-bold text-red-700 uppercase tracking-wider">Charges — {totalCharges.toLocaleString()} FCFA</p>
            </div>
            <table className="w-full">
              <tbody>{charges.map(a => <SectionRow key={a.code} label={`${a.code} — ${a.label}`} amount={a.solde} indent={1} />)}</tbody>
            </table>
          </div>
          {/* Produits */}
          <div>
            <div className="px-5 py-2 bg-green-50 border-b border-green-100">
              <p className="text-xs font-bold text-green-700 uppercase tracking-wider">Produits — {totalProduits.toLocaleString()} FCFA</p>
            </div>
            <table className="w-full">
              <tbody>{produits.map(a => <SectionRow key={a.code} label={`${a.code} — ${a.label}`} amount={a.solde} indent={1} />)}</tbody>
            </table>
          </div>
        </div>
        <div className={`px-5 py-3 border-t-2 ${resultat >= 0 ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"} flex items-center justify-between`}>
          <span className={`font-heading text-sm font-bold ${resultat >= 0 ? "text-gmo-green" : "text-red-600"}`}>
            {resultat >= 0 ? "BÉNÉFICE NET" : "PERTE NETTE"}
          </span>
          <span className={`font-heading text-lg font-bold ${resultat >= 0 ? "text-gmo-green" : "text-red-600"}`}>
            {Math.abs(resultat).toLocaleString()} FCFA
          </span>
        </div>
      </div>
    </div>
  );
}