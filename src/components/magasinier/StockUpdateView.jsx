import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import {
  Search, Save, AlertTriangle, CheckCircle2, TrendingDown,
  Package, RefreshCw, Edit3, X, Plus, Minus
} from "lucide-react";

export default function StockUpdateView({ products, setProducts }) {
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState({}); // { [productId]: newQty }
  const [saving, setSaving] = useState({});
  const [saved, setSaved] = useState({});
  const [filterAlert, setFilterAlert] = useState("all");

  const filtered = useMemo(() => {
    let list = [...products].filter(p => p.is_active !== false);
    if (search) list = list.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()));
    if (filterAlert === "critical") list = list.filter(p => p.stock_quantity <= 0);
    if (filterAlert === "low") list = list.filter(p => p.stock_quantity > 0 && p.stock_quantity <= (p.stock_alert || 10));
    if (filterAlert === "ok") list = list.filter(p => p.stock_quantity > (p.stock_alert || 10));
    return list.sort((a, b) => a.stock_quantity - b.stock_quantity);
  }, [products, search, filterAlert]);

  const getStockStatus = (p) => {
    if (p.stock_quantity <= 0) return "critical";
    if (p.stock_quantity <= (p.stock_alert || 10)) return "low";
    return "ok";
  };

  const startEdit = (p) => {
    setEditing(prev => ({ ...prev, [p.id]: p.stock_quantity ?? 0 }));
  };

  const cancelEdit = (id) => {
    setEditing(prev => { const n = { ...prev }; delete n[id]; return n; });
  };

  const changeQty = (id, delta) => {
    setEditing(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] ?? 0) + delta)
    }));
  };

  const handleSave = async (product) => {
    const newQty = editing[product.id];
    if (newQty === undefined) return;
    setSaving(prev => ({ ...prev, [product.id]: true }));
    await base44.entities.Product.update(product.id, { stock_quantity: newQty });
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, stock_quantity: newQty } : p));
    setSaving(prev => { const n = { ...prev }; delete n[product.id]; return n; });
    setSaved(prev => ({ ...prev, [product.id]: true }));
    cancelEdit(product.id);
    setTimeout(() => setSaved(prev => { const n = { ...prev }; delete n[product.id]; return n; }), 2500);
  };

  const statusConfig = {
    critical: { label: "Rupture", bg: "bg-red-50", border: "border-red-200", text: "text-red-600", dot: "bg-red-500" },
    low:      { label: "Faible",  bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-600", dot: "bg-amber-400" },
    ok:       { label: "OK",      bg: "bg-green-50", border: "border-green-100", text: "text-green-600", dot: "bg-green-500" },
  };

  const counts = {
    critical: products.filter(p => p.is_active !== false && p.stock_quantity <= 0).length,
    low:      products.filter(p => p.is_active !== false && p.stock_quantity > 0 && p.stock_quantity <= (p.stock_alert || 10)).length,
    ok:       products.filter(p => p.is_active !== false && p.stock_quantity > (p.stock_alert || 10)).length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="font-heading text-xl font-bold text-obsidian">Mise à Jour des Stocks</h2>
          <p className="text-xs text-obsidian/40 font-body mt-0.5">Modifiez les quantités en temps réel pour chaque produit</p>
        </div>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[
          { key: "all",      label: "Tous",      count: products.filter(p => p.is_active !== false).length },
          { key: "critical", label: "Rupture",   count: counts.critical, color: "text-red-600 bg-red-50 border-red-200" },
          { key: "low",      label: "Faible",    count: counts.low,      color: "text-amber-600 bg-amber-50 border-amber-200" },
          { key: "ok",       label: "OK",        count: counts.ok,       color: "text-green-600 bg-green-50 border-green-200" },
        ].map(f => (
          <button key={f.key} onClick={() => setFilterAlert(f.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-body font-semibold border transition-all ${
              filterAlert === f.key
                ? "bg-obsidian text-white border-obsidian"
                : (f.color || "text-obsidian/60 bg-white border-gray-200 hover:border-obsidian/30")
            }`}>
            {f.label} <span className="ml-1 opacity-70">({f.count})</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian/30" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un produit..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-body text-obsidian placeholder:text-obsidian/30 focus:outline-none focus:ring-2 focus:ring-gmo-green/30 focus:border-gmo-green"
        />
      </div>

      {/* Products list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <Package className="w-8 h-8 text-obsidian/10 mx-auto mb-2" />
            <p className="text-sm text-obsidian/35 font-body">Aucun produit trouvé</p>
          </div>
        )}
        {filtered.map(product => {
          const status = getStockStatus(product);
          const cfg = statusConfig[status];
          const isEditing = editing[product.id] !== undefined;
          const isSaving = saving[product.id];
          const isSaved = saved[product.id];
          const editQty = editing[product.id] ?? product.stock_quantity ?? 0;
          const pct = status !== "ok" ? Math.min(100, Math.round(((product.stock_quantity || 0) / (product.stock_alert || 10)) * 100)) : 100;

          return (
            <div key={product.id} className={`bg-white border rounded-xl p-4 transition-all ${cfg.border} ${isEditing ? "ring-2 ring-gmo-green/30 shadow-sm" : ""}`}>
              <div className="flex items-center gap-3">
                {/* Indicator dot */}
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${cfg.dot}`} />

                {/* Product info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-heading text-sm font-bold text-obsidian">{product.name}</p>
                    <span className={`text-[10px] font-body uppercase tracking-widest px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-obsidian/40 font-body">{product.category || "—"} · {product.unit || "unité"}</p>

                  {/* Progress bar for low/critical */}
                  {status !== "ok" && (
                    <div className="mt-2 w-full bg-gray-100 rounded-full h-1">
                      <div
                        className={`h-1 rounded-full transition-all ${status === "critical" ? "bg-red-400" : "bg-amber-400"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Qty display / edit */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {isEditing ? (
                    <>
                      <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                        <button onClick={() => changeQty(product.id, -1)} className="px-2.5 py-1.5 text-obsidian/60 hover:bg-gray-200 hover:text-obsidian transition-colors">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={editQty}
                          onChange={e => setEditing(prev => ({ ...prev, [product.id]: Math.max(0, parseInt(e.target.value) || 0) }))}
                          className="w-14 text-center text-sm font-heading font-bold text-obsidian bg-transparent focus:outline-none"
                        />
                        <button onClick={() => changeQty(product.id, 1)} className="px-2.5 py-1.5 text-obsidian/60 hover:bg-gray-200 hover:text-obsidian transition-colors">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button onClick={() => handleSave(product)} disabled={isSaving}
                        className="flex items-center gap-1 bg-gmo-green text-white text-xs font-heading font-bold px-3 py-2 rounded-xl hover:bg-gmo-green/80 transition-colors disabled:opacity-60">
                        {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        {isSaving ? "..." : "Sauver"}
                      </button>
                      <button onClick={() => cancelEdit(product.id)} className="p-2 text-obsidian/40 hover:text-gmo-red transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="text-right">
                        {isSaved ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-xs font-body">Sauvegardé</span>
                          </div>
                        ) : (
                          <>
                            <p className={`font-heading text-lg font-black ${status === "critical" ? "text-red-600" : status === "low" ? "text-amber-600" : "text-green-700"}`}>
                              {product.stock_quantity ?? 0}
                            </p>
                            <p className="text-[10px] text-obsidian/30 font-body">seuil: {product.stock_alert || 10}</p>
                          </>
                        )}
                      </div>
                      <button onClick={() => startEdit(product)}
                        className="p-2 text-obsidian/30 hover:text-gmo-green hover:bg-gmo-green/10 rounded-xl transition-all">
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}