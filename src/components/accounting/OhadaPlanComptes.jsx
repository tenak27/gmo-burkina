import React, { useState } from "react";
import { Search, Plus, ChevronRight, BookOpen } from "lucide-react";

const OHADA_DEFAULT_ACCOUNTS = [
  // CLASSE 1 - Comptes de ressources durables
  { code: "101", label: "Capital social", class: "1", type: "passif", nature: "bilan" },
  { code: "111", label: "Réserve légale", class: "1", type: "passif", nature: "bilan" },
  { code: "120", label: "Résultat net de l'exercice (bénéfice)", class: "1", type: "passif", nature: "bilan" },
  { code: "129", label: "Résultat net de l'exercice (perte)", class: "1", type: "actif", nature: "bilan" },
  { code: "161", label: "Emprunts et dettes financières", class: "1", type: "passif", nature: "bilan" },
  // CLASSE 2 - Comptes d'actif immobilisé
  { code: "211", label: "Terrains", class: "2", type: "actif", nature: "bilan" },
  { code: "221", label: "Bâtiments", class: "2", type: "actif", nature: "bilan" },
  { code: "232", label: "Matériel et outillage", class: "2", type: "actif", nature: "bilan" },
  { code: "244", label: "Matériel de transport", class: "2", type: "actif", nature: "bilan" },
  { code: "245", label: "Matériel informatique", class: "2", type: "actif", nature: "bilan" },
  { code: "281", label: "Amortissements terrains", class: "2", type: "passif", nature: "bilan" },
  // CLASSE 3 - Comptes de stocks
  { code: "301", label: "Marchandises", class: "3", type: "actif", nature: "bilan" },
  { code: "321", label: "Matières premières", class: "3", type: "actif", nature: "bilan" },
  { code: "381", label: "Marchandises en cours de route", class: "3", type: "actif", nature: "bilan" },
  // CLASSE 4 - Comptes de tiers
  { code: "401", label: "Fournisseurs", class: "4", type: "passif", nature: "bilan" },
  { code: "408", label: "Fournisseurs, factures non parvenues", class: "4", type: "passif", nature: "bilan" },
  { code: "411", label: "Clients", class: "4", type: "actif", nature: "bilan" },
  { code: "418", label: "Clients, produits non encore facturés", class: "4", type: "actif", nature: "bilan" },
  { code: "421", label: "Personnel — Rémunérations dues", class: "4", type: "passif", nature: "bilan" },
  { code: "431", label: "CNSS — Cotisations", class: "4", type: "passif", nature: "bilan" },
  { code: "441", label: "État, impôts sur bénéfices (BIC)", class: "4", type: "passif", nature: "bilan" },
  { code: "442", label: "État, TVA facturée", class: "4", type: "passif", nature: "bilan" },
  { code: "443", label: "État, TVA déductible", class: "4", type: "actif", nature: "bilan" },
  { code: "445", label: "État, TVA à décaisser", class: "4", type: "passif", nature: "bilan" },
  { code: "447", label: "État, autres impôts et taxes", class: "4", type: "passif", nature: "bilan" },
  // CLASSE 5 - Comptes de trésorerie
  { code: "521", label: "Banque — Compte courant", class: "5", type: "actif", nature: "bilan" },
  { code: "531", label: "Caisse siège", class: "5", type: "actif", nature: "bilan" },
  { code: "532", label: "Caisse agence", class: "5", type: "actif", nature: "bilan" },
  { code: "541", label: "Mobile Money (Orange/Moov)", class: "5", type: "actif", nature: "bilan" },
  // CLASSE 6 - Comptes de charges
  { code: "601", label: "Achats de marchandises", class: "6", type: "charge", nature: "résultat" },
  { code: "602", label: "Achats de matières premières", class: "6", type: "charge", nature: "résultat" },
  { code: "611", label: "Transports sur achats", class: "6", type: "charge", nature: "résultat" },
  { code: "621", label: "Personnels extérieurs", class: "6", type: "charge", nature: "résultat" },
  { code: "624", label: "Entretien et réparations", class: "6", type: "charge", nature: "résultat" },
  { code: "625", label: "Assurances", class: "6", type: "charge", nature: "résultat" },
  { code: "627", label: "Publicité, publications", class: "6", type: "charge", nature: "résultat" },
  { code: "631", label: "Frais bancaires", class: "6", type: "charge", nature: "résultat" },
  { code: "641", label: "Salaires et appointements", class: "6", type: "charge", nature: "résultat" },
  { code: "661", label: "Intérêts des emprunts", class: "6", type: "charge", nature: "résultat" },
  { code: "671", label: "Pertes sur créances", class: "6", type: "charge", nature: "résultat" },
  { code: "691", label: "Impôts sur les bénéfices (BIC)", class: "6", type: "charge", nature: "résultat" },
  // CLASSE 7 - Comptes de produits
  { code: "701", label: "Ventes de marchandises", class: "7", type: "produit", nature: "résultat" },
  { code: "702", label: "Ventes de produits finis", class: "7", type: "produit", nature: "résultat" },
  { code: "706", label: "Services vendus", class: "7", type: "produit", nature: "résultat" },
  { code: "707", label: "Rabais, remises, ristournes accordés", class: "7", type: "produit", nature: "résultat" },
  { code: "741", label: "Subventions d'exploitation", class: "7", type: "produit", nature: "résultat" },
  { code: "771", label: "Intérêts et produits financiers", class: "7", type: "produit", nature: "résultat" },
  // CLASSE 8 - Comptes des autres charges et produits
  { code: "811", label: "Charges HAO (Hors Activités Ordinaires)", class: "8", type: "charge", nature: "résultat" },
  { code: "821", label: "Produits HAO", class: "8", type: "produit", nature: "résultat" },
  { code: "831", label: "Plus-values sur cessions d'immobilisations", class: "8", type: "produit", nature: "résultat" },
];

const CLASS_LABELS = {
  "1": "Classe 1 — Comptes de ressources durables",
  "2": "Classe 2 — Comptes d'actif immobilisé",
  "3": "Classe 3 — Comptes de stocks",
  "4": "Classe 4 — Comptes de tiers",
  "5": "Classe 5 — Comptes de trésorerie",
  "6": "Classe 6 — Comptes de charges",
  "7": "Classe 7 — Comptes de produits",
  "8": "Classe 8 — Comptes HAO",
};

const TYPE_COLORS = {
  actif: "bg-blue-50 text-blue-700 border-blue-200",
  passif: "bg-purple-50 text-purple-700 border-purple-200",
  charge: "bg-red-50 text-red-700 border-red-200",
  produit: "bg-green-50 text-green-700 border-green-200",
  résultat: "bg-amber-50 text-amber-700 border-amber-200",
};

export default function OhadaPlanComptes({ customAccounts = [] }) {
  const [search, setSearch] = useState("");
  const [expandedClass, setExpandedClass] = useState("4");

  const allAccounts = [...OHADA_DEFAULT_ACCOUNTS, ...customAccounts];
  const filtered = allAccounts.filter(a =>
    !search || a.code.includes(search) || a.label.toLowerCase().includes(search.toLowerCase())
  );

  const byClass = filtered.reduce((acc, a) => {
    const cls = a.class || a.code[0];
    if (!acc[cls]) acc[cls] = [];
    acc[cls].push(a);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un compte (code ou libellé)…"
            className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gmo-green"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-obsidian/40 font-body">
          <BookOpen className="w-3.5 h-3.5" />
          SYSCOHADA révisé — {allAccounts.length} comptes
        </div>
      </div>

      {Object.entries(byClass).sort(([a],[b]) => a.localeCompare(b)).map(([cls, accounts]) => (
        <div key={cls} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <button
            onClick={() => setExpandedClass(expandedClass === cls ? null : cls)}
            className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-gmo-green/10 flex items-center justify-center">
                <span className="text-xs font-bold text-gmo-green">{cls}</span>
              </div>
              <span className="text-sm font-semibold text-obsidian">{CLASS_LABELS[cls] || `Classe ${cls}`}</span>
              <span className="text-xs text-obsidian/30 font-body">{accounts.length} comptes</span>
            </div>
            <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${expandedClass === cls ? "rotate-90" : ""}`} />
          </button>
          {expandedClass === cls && (
            <div className="border-t border-gray-100">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-5 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Code</th>
                    <th className="text-left px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Libellé</th>
                    <th className="text-center px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="text-center px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nature</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((a, i) => (
                    <tr key={a.code} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}>
                      <td className="px-5 py-2.5 font-mono text-sm font-bold text-obsidian">{a.code}</td>
                      <td className="px-4 py-2.5 text-sm text-obsidian/70 font-body">{a.label}</td>
                      <td className="px-4 py-2.5 text-center">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-body ${TYPE_COLORS[a.type] || "bg-gray-50 text-gray-500 border-gray-200"}`}>{a.type}</span>
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <span className="text-[10px] text-obsidian/30 font-body">{a.nature}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}