import React, { useMemo } from "react";
import { AlertTriangle, Package, TrendingDown, CheckCircle2, RefreshCw } from "lucide-react";

export default function StockAlertsView({ products, onRefresh, loading }) {
  const alerts = useMemo(() => {
    if (!products) return { critical: [], low: [], ok: [] };
    const critical = products.filter(p => p.is_active !== false && p.stock_quantity <= 0);
    const low = products.filter(p => p.is_active !== false && p.stock_quantity > 0 && p.stock_quantity <= (p.stock_alert || 10));
    const ok = products.filter(p => p.is_active !== false && p.stock_quantity > (p.stock_alert || 10));
    return { critical, low, ok };
  }, [products]);

  const total = alerts.critical.length + alerts.low.length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="font-heading text-xl font-bold text-obsidian">Alertes de Stock</h2>
          <p className="text-xs text-obsidian/40 font-body mt-0.5">
            {total === 0 ? "Tous les stocks sont suffisants" : `${total} produit(s) nécessitent un réapprovisionnement`}
          </p>
        </div>
        <button onClick={onRefresh} disabled={loading}
          className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2 text-xs font-body text-obsidian/60 hover:border-amber-400 hover:text-amber-600 transition-colors">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Actualiser
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
          <p className="font-heading text-3xl font-black text-red-600">{alerts.critical.length}</p>
          <p className="text-[11px] font-body text-red-500 mt-1 leading-tight">Rupture de stock</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
          <p className="font-heading text-3xl font-black text-amber-600">{alerts.low.length}</p>
          <p className="text-[11px] font-body text-amber-500 mt-1 leading-tight">Stock faible</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
          <p className="font-heading text-3xl font-black text-green-700">{alerts.ok.length}</p>
          <p className="text-[11px] font-body text-green-600 mt-1 leading-tight">Stock suffisant</p>
        </div>
      </div>

      {/* Critical — rupture */}
      {alerts.critical.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <p className="font-heading text-sm font-bold text-red-600 uppercase tracking-wide">Rupture de stock ({alerts.critical.length})</p>
          </div>
          <div className="space-y-2">
            {alerts.critical.map(p => (
              <div key={p.id} className="bg-white border border-red-200 rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading text-sm font-bold text-obsidian truncate">{p.name}</p>
                  <p className="text-[11px] text-obsidian/40 font-body">{p.category || "—"} · {p.unit || "unité"}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-heading text-lg font-black text-red-600">0</p>
                  <p className="text-[10px] text-red-400 font-body">en stock</p>
                </div>
                <div className="text-right flex-shrink-0 hidden sm:block">
                  <p className="text-[10px] text-obsidian/35 font-body">Seuil</p>
                  <p className="font-heading text-sm font-semibold text-obsidian/50">{p.stock_alert || 10}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Low stock */}
      {alerts.low.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <p className="font-heading text-sm font-bold text-amber-600 uppercase tracking-wide">Stock faible ({alerts.low.length})</p>
          </div>
          <div className="space-y-2">
            {alerts.low.map(p => {
              const pct = Math.min(100, Math.round((p.stock_quantity / (p.stock_alert || 10)) * 100));
              return (
                <div key={p.id} className="bg-white border border-amber-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <TrendingDown className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading text-sm font-bold text-obsidian truncate">{p.name}</p>
                      <p className="text-[11px] text-obsidian/40 font-body">{p.category || "—"} · {p.unit || "unité"}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-heading text-base font-black text-amber-600">{p.stock_quantity}</p>
                      <p className="text-[10px] text-amber-400 font-body">/ {p.stock_alert || 10} min</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-amber-400 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* All OK */}
      {total === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="font-heading text-lg font-bold text-green-700">Tous les stocks sont à niveau !</p>
          <p className="text-sm text-green-600/70 font-body mt-1">Aucun produit ne nécessite de réapprovisionnement.</p>
        </div>
      )}

      {/* OK products (collapsible summary) */}
      {alerts.ok.length > 0 && total > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <p className="font-heading text-sm font-bold text-green-700 uppercase tracking-wide">Stock suffisant ({alerts.ok.length})</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {alerts.ok.slice(0, 8).map(p => (
              <div key={p.id} className="bg-white border border-green-100 rounded-xl px-4 py-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Package className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm font-body text-obsidian truncate">{p.name}</span>
                </div>
                <span className="font-heading text-sm font-bold text-green-600 flex-shrink-0">{p.stock_quantity}</span>
              </div>
            ))}
            {alerts.ok.length > 8 && (
              <p className="text-xs text-obsidian/35 font-body col-span-full text-center py-2">+ {alerts.ok.length - 8} autres produits en stock suffisant</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}