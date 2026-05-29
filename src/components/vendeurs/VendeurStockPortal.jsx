import React from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Package, CheckCircle2, Clock, AlertCircle } from "lucide-react";

const STATUS_CONFIG = {
  en_attente_validation: { label: "En attente", color: "text-amber-600 bg-amber-50 border-amber-200", icon: Clock },
  valide: { label: "Validé", color: "text-green-700 bg-green-50 border-green-200", icon: CheckCircle2 },
  epuise: { label: "Épuisé", color: "text-gray-500 bg-gray-50 border-gray-200", icon: Package },
};

export default function VendeurStockPortal({ stocks, setStocks, vendeur }) {
  const { user } = useAuth();

  const handleValiderReception = async (stock) => {
    const updated = await base44.entities.StockVendeur.update(stock.id, {
      valide_par_vendeur: user?.full_name || user?.id,
      date_validation_vendeur: new Date().toISOString(),
      status: "valide",
    });
    setStocks(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  const stocksEnAttente = stocks.filter(s => s.valide_par_magasinier && !s.valide_par_vendeur && s.status === "en_attente_validation");
  const stocksActifs = stocks.filter(s => s.status === "valide");
  const stocksEpuises = stocks.filter(s => s.status === "epuise");

  return (
    <div className="space-y-4">
      <h2 className="font-heading text-lg font-bold text-obsidian">Mon Stock</h2>

      {/* À confirmer */}
      {stocksEnAttente.length > 0 && (
        <div>
          <p className="text-[11px] uppercase tracking-widest text-amber-600 font-heading mb-2 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" /> À confirmer ({stocksEnAttente.length})
          </p>
          {stocksEnAttente.map(s => (
            <div key={s.id} className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 mb-3">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <p className="font-heading text-sm font-bold text-obsidian">{s.produit_nom}</p>
                  <p className="text-[11px] text-obsidian/50 font-body">Assigné par {s.assignee_par_nom}</p>
                  <p className="text-[11px] text-obsidian/35 font-body">{s.date_assignation ? new Date(s.date_assignation).toLocaleString("fr-FR") : "—"}</p>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border text-amber-600 bg-amber-100 border-amber-300">
                  À confirmer
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-white rounded-xl p-2.5 text-center">
                  <p className="font-heading text-xl font-black text-gmo-red">{s.cartouches_assignees}</p>
                  <p className="text-[9px] text-obsidian/40 font-body">Cartouches</p>
                </div>
                <div className="bg-white rounded-xl p-2.5 text-center">
                  <p className="font-heading text-xl font-black text-amber-500">{s.paquets_assignes || 0}</p>
                  <p className="text-[9px] text-obsidian/40 font-body">Paquets sup.</p>
                </div>
                <div className="bg-white rounded-xl p-2.5 text-center">
                  <p className="font-heading text-xl font-black text-blue-600">
                    {(s.cartouches_assignees * 10) + (s.paquets_assignes || 0)}
                  </p>
                  <p className="text-[9px] text-obsidian/40 font-body">Total paquets</p>
                </div>
              </div>
              <button onClick={() => handleValiderReception(s)}
                className="w-full flex items-center justify-center gap-2 bg-gmo-green text-white text-sm font-heading font-bold py-3 rounded-xl hover:bg-gmo-green/80 transition-colors">
                <CheckCircle2 className="w-4 h-4" /> Confirmer la réception
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Stocks actifs */}
      {stocksActifs.length > 0 && (
        <div>
          <p className="text-[11px] uppercase tracking-widest text-gmo-green font-heading mb-2">Stock actif ({stocksActifs.length})</p>
          {stocksActifs.map(s => {
            const totalPaquets = (s.cartouches_disponibles || 0) * 10 + (s.paquets_disponibles || 0);
            const totalInit = (s.cartouches_assignees || 0) * 10 + (s.paquets_assignes || 0);
            const pct = totalInit > 0 ? Math.round((totalPaquets / totalInit) * 100) : 0;
            return (
              <div key={s.id} className="bg-white border border-gray-100 rounded-2xl p-4 mb-3 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-heading text-sm font-bold text-obsidian">{s.produit_nom}</p>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border text-green-700 bg-green-50 border-green-200">
                    Validé ✓
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                    <p className="font-heading text-xl font-black text-gmo-red">{s.cartouches_disponibles ?? 0}</p>
                    <p className="text-[9px] text-obsidian/40 font-body">Cartouches</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                    <p className="font-heading text-xl font-black text-amber-500">{s.paquets_disponibles ?? 0}</p>
                    <p className="text-[9px] text-obsidian/40 font-body">Paquets</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                    <p className="font-heading text-xl font-black text-blue-600">{totalPaquets}</p>
                    <p className="text-[9px] text-obsidian/40 font-body">Total</p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-[10px] text-obsidian/40 font-body mb-1">
                    <span>Stock restant</span><span>{pct}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${pct > 50 ? "bg-gmo-green" : pct > 20 ? "bg-amber-400" : "bg-gmo-red"}`}
                      style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {stocks.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 py-14 text-center">
          <Package className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="font-heading text-sm text-obsidian/40">Aucun stock assigné</p>
          <p className="text-xs text-obsidian/25 font-body mt-1">Attendez qu'un commercial vous assigne du stock</p>
        </div>
      )}
    </div>
  );
}