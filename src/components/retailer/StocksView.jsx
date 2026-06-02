import React, { useState, useMemo } from "react";
import { Search, RefreshCw, Package, SlidersHorizontal } from "lucide-react";

const CATEGORIES = ["Tous", "alimentaire", "hygiene", "boisson", "cereale", "autre"];

export default function StocksView({ products, loadingProducts, onRefresh }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tous");
  const [filter, setFilter] = useState("tous"); // tous | dispo | faible | epuise

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.category || "").toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "Tous" || p.category === category;
      const low = p.stock_quantity <= (p.stock_alert || 0) && p.stock_quantity > 0;
      const matchFilter =
        filter === "tous" ? true :
        filter === "dispo" ? p.stock_quantity > (p.stock_alert || 0) :
        filter === "faible" ? low :
        filter === "epuise" ? p.stock_quantity === 0 : true;
      return matchSearch && matchCat && matchFilter;
    });
  }, [products, search, category, filter]);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="font-heading text-xl font-bold text-obsidian">Stocks disponibles</h2>
          <p className="text-xs text-obsidian/40 font-body mt-0.5">{filtered.length} produit(s) · Tarifs grossiste</p>
        </div>
        <button onClick={onRefresh}
          className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 text-xs text-obsidian/50 hover:border-gmo-red hover:text-gmo-red transition-colors self-end sm:self-auto">
          <RefreshCw className={`w-3.5 h-3.5 ${loadingProducts ? "animate-spin" : ""}`} />
          Actualiser
        </button>
      </div>

      {/* Search & filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 space-y-3">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-obsidian/30" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un produit..."
            className="w-full pl-10 pr-4 py-2.5 text-sm font-body border border-gray-200 rounded-xl focus:border-gmo-red focus:outline-none transition-colors"
          />
          {search && (
            <button onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-obsidian/30 hover:text-obsidian transition-colors text-xs font-body">
              ×
            </button>
          )}
        </div>

        {/* Category + status filters */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3 text-obsidian/30" />
          </div>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`text-[10px] font-body px-3 py-1 rounded-full border transition-all capitalize ${
                category === c
                  ? "border-gmo-red bg-gmo-red/8 text-gmo-red font-semibold"
                  : "border-gray-200 text-obsidian/40 hover:border-gray-300"
              }`}>
              {c}
            </button>
          ))}
          <span className="w-px h-4 bg-gray-200 self-center mx-1" />
          {[
            { key: "tous", label: "Tous" },
            { key: "dispo", label: "Dispo" },
            { key: "faible", label: "Faible" },
            { key: "epuise", label: "Épuisé" },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`text-[10px] font-body px-3 py-1 rounded-full border transition-all ${
                filter === f.key
                  ? "border-obsidian bg-obsidian text-white font-semibold"
                  : "border-gray-200 text-obsidian/40 hover:border-gray-300"
              }`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loadingProducts ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-gmo-red/30 border-t-gmo-red rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <Package className="w-8 h-8 text-obsidian/10 mx-auto mb-2" />
          <p className="text-sm text-obsidian/35 font-body">{search ? "Aucun résultat pour votre recherche" : "Aucun produit disponible"}</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-5 py-3 text-[10px] uppercase tracking-widest text-obsidian/40 font-heading">Produit</th>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-obsidian/40 font-heading hidden sm:table-cell">Catégorie</th>
                  <th className="text-right px-4 py-3 text-[10px] uppercase tracking-widest text-obsidian/40 font-heading">Prix grossiste</th>
                  <th className="text-right px-4 py-3 text-[10px] uppercase tracking-widest text-obsidian/40 font-heading hidden sm:table-cell">Stock</th>
                  <th className="text-center px-4 py-3 text-[10px] uppercase tracking-widest text-obsidian/40 font-heading">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(p => {
                  const low = p.stock_quantity <= (p.stock_alert || 0) && p.stock_quantity > 0;
                  const stockPct = p.stock_alert > 0 ? Math.min(100, Math.round((p.stock_quantity / (p.stock_alert * 3)) * 100)) : (p.stock_quantity > 0 ? 100 : 0);
                  return (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-heading text-sm font-semibold text-obsidian">{p.name}</p>
                        <p className="text-[11px] text-obsidian/40 font-body">{p.unit || "unité"}</p>
                        {/* Mini stock bar */}
                        <div className="mt-1.5 h-1 w-20 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              p.stock_quantity === 0 ? "bg-red-400" : low ? "bg-amber-400" : "bg-gmo-green"
                            }`}
                            style={{ width: `${stockPct}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <span className="text-[11px] text-obsidian/50 font-body capitalize">{p.category || "—"}</span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <p className="font-heading text-sm font-bold text-gmo-green">{(p.wholesale_price || p.unit_price || 0).toLocaleString()} FCFA</p>
                        {p.unit_price && p.wholesale_price && p.unit_price !== p.wholesale_price && (
                          <p className="text-[10px] text-obsidian/30 line-through">{p.unit_price.toLocaleString()}</p>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right hidden sm:table-cell">
                        <p className={`font-heading text-sm font-bold ${p.stock_quantity === 0 ? "text-red-500" : low ? "text-amber-500" : "text-obsidian"}`}>
                          {p.stock_quantity ?? "—"}
                        </p>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {p.stock_quantity === 0 ? (
                          <span className="text-[10px] text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full font-body">Épuisé</span>
                        ) : low ? (
                          <span className="text-[10px] text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-body">Faible</span>
                        ) : (
                          <span className="text-[10px] text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full font-body">Dispo</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}