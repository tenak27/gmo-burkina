import React, { useState, useEffect } from "react";
import RoleGuard from "@/components/auth/RoleGuard";
import { base44 } from "@/api/base44Client";
import { Users, Package, MapPin, BarChart2, Plus, RefreshCw } from "lucide-react";
import VendeursListTab from "@/components/vendeurs/VendeursListTab";
import StockVendeursTab from "@/components/vendeurs/StockVendeursTab";
import CarteVendeursTab from "@/components/vendeurs/CarteVendeursTab";
import VentesVendeursTab from "@/components/vendeurs/VentesVendeursTab";

const TABS = [
  { id: "vendeurs", label: "Vendeurs", icon: Users },
  { id: "stock", label: "Stock / Assignation", icon: Package },
  { id: "ventes", label: "Ventes", icon: BarChart2 },
  { id: "carte", label: "Carte GPS", icon: MapPin },
];

function VendeursAdminDashboard() {
  const [tab, setTab] = useState("vendeurs");
  const [vendeurs, setVendeurs] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [ventes, setVentes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const [v, s, vt] = await Promise.allSettled([
      base44.entities.Vendeur.list("-created_date", 100),
      base44.entities.StockVendeur.list("-created_date", 200),
      base44.entities.VenteVendeur.list("-created_date", 200),
    ]);
    setVendeurs(v.value || []);
    setStocks(s.value || []);
    setVentes(vt.value || []);
    setLoading(false);
  };

  // Real-time
  useEffect(() => {
    const u1 = base44.entities.StockVendeur.subscribe(e => {
      setStocks(prev => {
        if (e.type === "create") return [e.data, ...prev];
        if (e.type === "update") return prev.map(s => s.id === e.id ? e.data : s);
        if (e.type === "delete") return prev.filter(s => s.id !== e.id);
        return prev;
      });
    });
    const u2 = base44.entities.VenteVendeur.subscribe(e => {
      setVentes(prev => {
        if (e.type === "create") return [e.data, ...prev];
        if (e.type === "update") return prev.map(v => v.id === e.id ? e.data : v);
        if (e.type === "delete") return prev.filter(v => v.id !== e.id);
        return prev;
      });
    });
    return () => { u1(); u2(); };
  }, []);

  const kpis = [
    { label: "Vendeurs actifs", value: vendeurs.filter(v => v.is_active).length, color: "text-gmo-green" },
    { label: "Stocks en attente", value: stocks.filter(s => s.status === "en_attente_validation").length, color: "text-amber-500" },
    { label: "Ventes aujourd'hui", value: ventes.filter(v => v.date_vente === new Date().toISOString().slice(0,10)).length, color: "text-blue-600" },
    { label: "CA du jour (FCFA)", value: ventes.filter(v => v.date_vente === new Date().toISOString().slice(0,10)).reduce((s,v) => s + (v.montant_total||0), 0).toLocaleString(), color: "text-purple-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gmo-red flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-heading text-base font-bold text-obsidian leading-none">Vendeurs Cigarettes</h1>
              <p className="text-[10px] text-obsidian/40 font-body uppercase tracking-widest">GMO Burkina</p>
            </div>
          </div>
          <button onClick={loadData} className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 text-xs font-body text-obsidian/60 hover:border-gmo-green hover:text-gmo-green transition-colors">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Actualiser
          </button>
        </div>
        {/* Nav tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-0 border-t border-gray-100">
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-body font-semibold border-b-2 transition-colors ${
                  tab === t.id ? "border-gmo-red text-gmo-red" : "border-transparent text-obsidian/40 hover:text-obsidian"
                }`}>
                <Icon className="w-3.5 h-3.5" />{t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* KPI */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {kpis.map(k => (
            <div key={k.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <p className={`font-heading text-2xl font-black ${k.color}`}>{k.value}</p>
              <p className="text-[11px] text-obsidian/45 font-body mt-1 leading-tight">{k.label}</p>
            </div>
          ))}
        </div>

        {/* Content */}
        {tab === "vendeurs" && <VendeursListTab vendeurs={vendeurs} setVendeurs={setVendeurs} stocks={stocks} ventes={ventes} />}
        {tab === "stock"   && <StockVendeursTab stocks={stocks} setStocks={setStocks} vendeurs={vendeurs} />}
        {tab === "ventes"  && <VentesVendeursTab ventes={ventes} vendeurs={vendeurs} />}
        {tab === "carte"   && <CarteVendeursTab vendeurs={vendeurs} />}
      </div>
    </div>
  );
}

export default function VendeursAdmin() {
  return (
    <RoleGuard roles={["pdg", "admin", "commercial", "magasinier"]}>
      <VendeursAdminDashboard />
    </RoleGuard>
  );
}