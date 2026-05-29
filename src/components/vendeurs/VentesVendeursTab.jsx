import React, { useState } from "react";
import { TrendingUp, ShoppingBag, Package, Calendar, Filter } from "lucide-react";

export default function VentesVendeursTab({ ventes, vendeurs }) {
  const [filterVendeur, setFilterVendeur] = useState("all");
  const [filterDate, setFilterDate] = useState("");

  const filtered = ventes.filter(v => {
    const matchV = filterVendeur === "all" || v.vendeur_id === filterVendeur;
    const matchD = !filterDate || v.date_vente === filterDate;
    return matchV && matchD;
  });

  const totalCA = filtered.reduce((s, v) => s + (v.montant_total || 0), 0);
  const totalCartouches = filtered.reduce((s, v) => s + (v.cartouches_vendues || 0), 0);
  const totalPaquets = filtered.reduce((s, v) => s + (v.paquets_vendus || 0), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="font-heading text-lg font-bold text-obsidian">Ventes ({filtered.length})</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <select value={filterVendeur} onChange={e => setFilterVendeur(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-xs font-body focus:outline-none">
            <option value="all">Tous les vendeurs</option>
            {vendeurs.map(v => <option key={v.id} value={v.id}>{v.prenom} {v.nom}</option>)}
          </select>
          <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-xs font-body focus:outline-none" />
          {filterDate && <button onClick={() => setFilterDate("")} className="text-xs text-gmo-red font-body hover:underline">Effacer date</button>}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <TrendingUp className="w-4 h-4 text-gmo-green mx-auto mb-1" />
          <p className="font-heading text-xl font-black text-obsidian">{totalCA.toLocaleString()}</p>
          <p className="text-[10px] text-obsidian/40 font-body">FCFA total</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <Package className="w-4 h-4 text-gmo-red mx-auto mb-1" />
          <p className="font-heading text-xl font-black text-obsidian">{totalCartouches}</p>
          <p className="text-[10px] text-obsidian/40 font-body">Cartouches</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <ShoppingBag className="w-4 h-4 text-blue-600 mx-auto mb-1" />
          <p className="font-heading text-xl font-black text-obsidian">{totalPaquets}</p>
          <p className="text-[10px] text-obsidian/40 font-body">Paquets</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Vendeur</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Point de vente</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Produit</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Cartouches</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Paquets</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Montant</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(v => (
              <tr key={v.id} className="hover:bg-gray-50/50">
                <td className="px-4 py-3 text-sm font-body text-obsidian">{v.vendeur_nom || "—"}</td>
                <td className="px-4 py-3 text-sm font-body text-obsidian/70">{v.point_de_vente_nom || "—"}</td>
                <td className="px-4 py-3">
                  <span className="text-[11px] bg-gmo-red/10 text-gmo-red font-body font-semibold px-2 py-0.5 rounded-full">{v.produit_nom}</span>
                </td>
                <td className="px-4 py-3 text-sm font-heading font-bold text-gmo-red">{v.cartouches_vendues || 0}</td>
                <td className="px-4 py-3 text-sm font-heading font-bold text-amber-500">{v.paquets_vendus || 0}</td>
                <td className="px-4 py-3 text-sm font-heading font-bold text-obsidian">{(v.montant_total || 0).toLocaleString()} FCFA</td>
                <td className="px-4 py-3 text-xs text-obsidian/40 font-body">{v.date_vente ? new Date(v.date_vente).toLocaleDateString("fr-FR") : "—"}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-obsidian/30 font-body">Aucune vente trouvée</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}