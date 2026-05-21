import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import RoleGuard from "@/components/auth/RoleGuard";
import { base44 } from "@/api/base44Client";
import { ShoppingCart, FileText, Users, UserCheck, Truck, LogOut, Globe, Menu, X } from "lucide-react";
import OrdersAdminTab from "@/components/admin/OrdersAdminTab";
import InvoicesTab from "@/components/admin/InvoicesTab";
import ClientsTab from "@/components/admin/ClientsTab";
import SuppliersTab from "@/components/admin/SuppliersTab";
import DeliveryTab from "@/components/admin/DeliveryTab";
import { Link } from "react-router-dom";

const TABS = [
  { id: "orders", label: "Commandes", icon: ShoppingCart, badge: true },
  { id: "invoices", label: "Factures", icon: FileText },
  { id: "clients", label: "Clients", icon: Users },
  { id: "suppliers", label: "Fournisseurs", icon: UserCheck },
  { id: "delivery", label: "Livraisons", icon: Truck },
];

function CommercialDashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("orders");
  const [mobileOpen, setMobileOpen] = useState(false);

  const [orders, setOrders] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.Order.list("-created_date", 100),
      base44.entities.Invoice.list("-created_date", 100),
      base44.entities.Client.list("-created_date", 100),
      base44.entities.Supplier.list("-created_date", 50),
      base44.entities.DeliveryNote.list("-created_date", 50),
      base44.entities.Driver.list("last_name", 50),
      base44.entities.Product.list("name", 100),
    ]).then(([o, inv, c, sup, del, drv, p]) => {
      setOrders(o || []);
      setInvoices(inv || []);
      setClients(c || []);
      setSuppliers(sup || []);
      setDeliveries(del || []);
      setDrivers(drv || []);
      setProducts(p || []);
      setLoading(false);
    });
  }, []);

  // Real-time order updates
  useEffect(() => {
    const unsub = base44.entities.Order.subscribe(event => {
      setOrders(prev => {
        if (event.type === "create") return [event.data, ...prev];
        if (event.type === "update") return prev.map(o => o.id === event.id ? event.data : o);
        if (event.type === "delete") return prev.filter(o => o.id !== event.id);
        return prev;
      });
    });
    return unsub;
  }, []);

  const pendingOrders = orders.filter(o => o.status === "en_attente").length;

  if (loading) return (
    <div className="min-h-screen bg-[#F2F4F7] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gmo-green/20 border-t-gmo-green rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F2F4F7] flex flex-col lg:flex-row">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex flex-col w-60 bg-gradient-to-b from-obsidian to-obsidian/98 border-r border-white/[0.06] h-screen sticky top-0">
        <div className="px-5 py-5 flex items-center gap-3 border-b border-white/10">
          <img src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c7662a636_logo-gmo2x.png" alt="GMO" className="h-7 brightness-0 invert" />
          <div>
            <p className="text-xs font-heading font-bold text-white">GMO Burkina</p>
            <p className="text-[9px] text-blue-400 uppercase tracking-[0.25em] font-body">Commercial</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {TABS.map(t => {
            const Icon = t.icon;
            const showBadge = t.badge && pendingOrders > 0;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all relative ${
                  tab === t.id ? "bg-blue-600 text-white shadow-sm" : "text-white/55 hover:text-white hover:bg-white/8"
                }`}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-body flex-1">{t.label}</span>
                {showBadge && <span className="bg-gmo-red text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">{pendingOrders}</span>}
              </button>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-3">
          <div className="flex items-center gap-3 bg-white/8 hover:bg-white/12 rounded-xl px-3 py-2.5 transition-colors">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">{user?.full_name?.charAt(0) || "C"}</div>
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
      <div className="lg:hidden bg-gradient-to-b from-obsidian to-obsidian/98 border-b border-white/[0.06] sticky top-0 z-50 flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="text-white/60 hover:text-white"><Menu className="w-5 h-5" /></button>
          <img src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c7662a636_logo-gmo2x.png" alt="GMO" className="h-7 brightness-0 invert opacity-90" />
          <span className="text-[9px] text-blue-400 uppercase tracking-widest font-body">Commercial</span>
        </div>
        <button onClick={() => logout()} className="text-white/30 hover:text-red-400"><LogOut className="w-4 h-4" /></button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-obsidian/85 backdrop-blur-md" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-obsidian to-obsidian/98 flex flex-col animate-slide-in-left">
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
              <span className="text-sm font-heading font-bold text-white">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="text-white/50"><X className="w-5 h-5" /></button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
              {TABS.map(t => {
                const Icon = t.icon;
                return (
                  <button key={t.id} onClick={() => { setTab(t.id); setMobileOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left ${tab === t.id ? "bg-blue-600 text-white" : "text-white/55 hover:text-white hover:bg-white/8"}`}>
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
          {tab === "orders"    && <OrdersAdminTab orders={orders} setOrders={setOrders} clients={clients} products={products} drivers={drivers} />}
          {tab === "invoices"  && <InvoicesTab invoices={invoices} setInvoices={setInvoices} clients={clients} products={products} />}
          {tab === "clients"   && <ClientsTab clients={clients} setClients={setClients} />}
          {tab === "suppliers" && <SuppliersTab suppliers={suppliers} setSuppliers={setSuppliers} />}
          {tab === "delivery"  && <DeliveryTab deliveries={deliveries} setDeliveries={setDeliveries} />}
        </div>
      </main>
    </div>
  );
}

export default function CommercialSpace() {
  return (
    <RoleGuard roles={["commercial", "pdg"]}>
      <CommercialDashboard />
    </RoleGuard>
  );
}