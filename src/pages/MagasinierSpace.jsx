import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import RoleGuard from "@/components/auth/RoleGuard";
import { base44 } from "@/api/base44Client";
import { Package, Warehouse, BarChart2, Truck, LogOut, Globe, Menu, X, AlertTriangle, Edit3 } from "lucide-react";
import ProductsTab from "@/components/admin/ProductsTab";
import WarehousesTab from "@/components/admin/WarehousesTab";
import StockTab from "@/components/admin/StockTab";
import DeliveryTab from "@/components/admin/DeliveryTab";
import StockAlertsView from "@/components/magasinier/StockAlertsView";
import StockUpdateView from "@/components/magasinier/StockUpdateView";
import { Link } from "react-router-dom";

const TABS = [
  { id: "alerts",    label: "Alertes Stock",   icon: AlertTriangle },
  { id: "stockedit", label: "Màj Stocks",       icon: Edit3 },
  { id: "products",  label: "Produits",         icon: Package },
  { id: "warehouses",label: "Entrepôts",        icon: Warehouse },
  { id: "stock",     label: "Mouvements",       icon: BarChart2 },
  { id: "delivery",  label: "Bons livraison",   icon: Truck },
];

function MagasinierDashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("alerts");
  const [mobileOpen, setMobileOpen] = useState(false);

  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [movements, setMovements] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.Product.list("name", 100),
      base44.entities.Warehouse.list("name", 50),
      base44.entities.StockMovement.list("-created_date", 100),
      base44.entities.DeliveryNote.list("-created_date", 50),
    ]).then(([p, w, m, d]) => {
      setProducts(p || []);
      setWarehouses(w || []);
      setMovements(m || []);
      setDeliveries(d || []);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#F2F4F7] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gmo-green/20 border-t-gmo-green rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F2F4F7] flex flex-col lg:flex-row">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex flex-col w-60 bg-[#111113] border-r border-white/[0.07] h-screen sticky top-0">
        <div className="px-5 py-5 flex items-center gap-3 border-b border-white/8">
          <img src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c7662a636_logo-gmo2x.png" alt="GMO" className="h-7 brightness-0 invert" />
          <div>
            <p className="text-xs font-heading font-bold text-white">GMO Burkina</p>
            <p className="text-[9px] text-amber-400 uppercase tracking-[0.25em] font-body">Magasinier</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                  tab === t.id ? "bg-amber-500 text-white shadow-sm" : "text-white/55 hover:text-white hover:bg-white/8"
                }`}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-body">{t.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="border-t border-white/8 p-3">
          <div className="flex items-center gap-3 bg-white/6 rounded-xl px-3 py-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold">{user?.full_name?.charAt(0) || "M"}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white font-heading font-semibold truncate">{user?.full_name}</p>
              <p className="text-[9px] text-white/40 font-body truncate">{user?.email}</p>
            </div>
            <Link to="/" className="text-white/25 hover:text-white/70 transition-colors"><Globe className="w-3.5 h-3.5" /></Link>
            <button onClick={() => logout()} className="text-white/25 hover:text-red-400 transition-colors"><LogOut className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden bg-[#111113] border-b border-white/[0.07] sticky top-0 z-50 flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="text-white/60 hover:text-white"><Menu className="w-5 h-5" /></button>
          <img src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c7662a636_logo-gmo2x.png" alt="GMO" className="h-7 brightness-0 invert opacity-90" />
          <span className="text-[9px] text-amber-400 uppercase tracking-widest font-body">Magasinier</span>
        </div>
        <button onClick={() => logout()} className="text-white/30 hover:text-red-400"><LogOut className="w-4 h-4" /></button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-[#111113] flex flex-col animate-slide-in-left">
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/8">
              <span className="text-sm font-heading font-bold text-white">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="text-white/50"><X className="w-5 h-5" /></button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
              {TABS.map(t => {
                const Icon = t.icon;
                return (
                  <button key={t.id} onClick={() => { setTab(t.id); setMobileOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left ${tab === t.id ? "bg-amber-500 text-white" : "text-white/55 hover:text-white hover:bg-white/8"}`}>
                    <Icon className="w-4 h-4" /><span className="text-sm font-body">{t.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 min-w-0 px-4 sm:px-6 py-5">
        <div key={tab} className="page-enter">
          {tab === "alerts"     && <StockAlertsView products={products} onRefresh={() => base44.entities.Product.list("name", 100).then(p => setProducts(p || []))} loading={loading} />}
          {tab === "stockedit"  && <StockUpdateView products={products} setProducts={setProducts} />}
          {tab === "products"   && <ProductsTab products={products} setProducts={setProducts} />}
          {tab === "warehouses" && <WarehousesTab warehouses={warehouses} setWarehouses={setWarehouses} />}
          {tab === "stock"      && <StockTab movements={movements} setMovements={setMovements} />}
          {tab === "delivery"   && <DeliveryTab deliveries={deliveries} setDeliveries={setDeliveries} />}
        </div>
      </main>
    </div>
  );
}

export default function MagasinierSpace() {
  return (
    <RoleGuard roles={["magasinier", "pdg"]}>
      <MagasinierDashboard />
    </RoleGuard>
  );
}