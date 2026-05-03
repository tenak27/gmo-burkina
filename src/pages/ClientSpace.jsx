import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import RoleGuard from "@/components/auth/RoleGuard";
import { base44 } from "@/api/base44Client";
import {
  Package, Clock, MapPin, ShoppingBag, Phone, LogOut,
  ChevronRight, Truck, CheckCircle2, Circle, AlertCircle, RefreshCw, Plus
} from "lucide-react";
import DeliveryProgress from "@/components/client/DeliveryProgress";

const STATUS_CONFIG = {
  en_attente:     { label: "En attente",     color: "text-amber-600",  bg: "bg-amber-50",   border: "border-amber-200",  icon: Circle },
  confirmee:      { label: "Confirmée",      color: "text-blue-600",   bg: "bg-blue-50",    border: "border-blue-200",   icon: CheckCircle2 },
  en_preparation: { label: "En préparation", color: "text-purple-600", bg: "bg-purple-50",  border: "border-purple-200", icon: Package },
  en_livraison:   { label: "En livraison",   color: "text-gmo-green",  bg: "bg-green-50",   border: "border-green-200",  icon: Truck },
  livree:         { label: "Livrée",         color: "text-green-700",  bg: "bg-green-100",  border: "border-green-300",  icon: CheckCircle2 },
  annulee:        { label: "Annulée",        color: "text-red-600",    bg: "bg-red-50",     border: "border-red-200",    icon: AlertCircle },
};

const TABS = [
  { id: "accueil", label: "Accueil" },
  { id: "commandes", label: "Commandes" },
  { id: "catalogue", label: "Catalogue" },
];

const SAMPLE_PRODUCTS = [
  { name: "Huile MADINA", cat: "Alimentaire", price: "3 500 FCFA", unit: "bidon", img: "https://gmobfaso.com/assets/img/produits/huile-madina.jpg" },
  { name: "Sucre GAZELLE", cat: "Alimentaire", price: "1 200 FCFA", unit: "sac 2kg", img: "https://gmobfaso.com/assets/img/produits/sucre-gazelle.jpg" },
  { name: "Farine Blé du Sahel", cat: "Alimentaire", price: "2 800 FCFA", unit: "sac", img: "https://gmobfaso.com/assets/img/produits/farine.jpg" },
  { name: "Savon BURKINA", cat: "Hygiène", price: "4 500 FCFA", unit: "carton", img: "https://gmobfaso.com/assets/img/produits/savon.jpg" },
  { name: "Lait Condensé", cat: "Alimentaire", price: "950 FCFA", unit: "boîte", img: "" },
  { name: "Tomate Concentrée", cat: "Alimentaire", price: "750 FCFA", unit: "boîte", img: "" },
];

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.en_attente;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${cfg.color} ${cfg.bg} ${cfg.border}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

function ClientDashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("accueil");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (tab === "commandes" && user) fetchOrders();
  }, [tab, user]);

  // Real-time subscription
  useEffect(() => {
    if (!user) return;
    const unsub = base44.entities.Order.subscribe((event) => {
      if (event.data?.client_email === user.email) {
        setOrders(prev => {
          if (event.type === "create") return [event.data, ...prev];
          if (event.type === "update") return prev.map(o => o.id === event.id ? event.data : o);
          if (event.type === "delete") return prev.filter(o => o.id !== event.id);
          return prev;
        });
      }
    });
    return unsub;
  }, [user]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    const data = await base44.entities.Order.filter({ client_email: user.email }, "-created_date", 20);
    setOrders(data || []);
    setLoadingOrders(false);
  };

  const activeOrders = orders.filter(o => !["livree","annulee"].includes(o.status));
  const doneOrders = orders.filter(o => ["livree","annulee"].includes(o.status));

  return (
    <div className="min-h-screen bg-[#F8F8F6]">
      {/* Header */}
      <header className="bg-[#1C1C1E] sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c7662a636_logo-gmo2x.png" alt="GMO" className="h-7 brightness-0 invert opacity-90" />
            <span className="hidden sm:block text-[10px] text-white/30 uppercase tracking-[0.2em] font-body">Client</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gmo-green flex items-center justify-center text-white text-[11px] font-bold font-heading">
              {user?.full_name?.charAt(0) || "C"}
            </div>
            <span className="hidden sm:block text-xs text-white/50 font-body">{user?.full_name}</span>
            <button onClick={() => logout()} className="ml-2 text-white/25 hover:text-red-400 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
        <nav className="max-w-5xl mx-auto px-4 sm:px-6 flex gap-0 border-t border-white/5">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-[11px] font-body uppercase tracking-widest border-b-2 transition-colors ${
                tab === t.id ? "border-gmo-green text-gmo-green" : "border-transparent text-white/30 hover:text-white/60"
              }`}
            >{t.label}</button>
          ))}
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">

        {/* ── ACCUEIL ── */}
        {tab === "accueil" && (
          <div>
            {/* Welcome */}
            <div className="bg-gradient-to-r from-[#1C1C1E] to-[#1A7A2E]/80 rounded-2xl p-6 mb-6 text-white">
              <p className="text-[11px] text-white/40 uppercase tracking-widest font-body mb-1">Bienvenue</p>
              <h1 className="font-heading text-2xl font-bold mb-1">{user?.full_name || "Cher Client"} 👋</h1>
              <p className="text-sm text-white/45 font-body">Gérez vos commandes depuis votre espace personnel.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a href="https://wa.me/22676211633" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gmo-green text-white text-xs font-heading font-bold px-4 py-2 rounded-lg hover:bg-gmo-green/90">
                  <ShoppingBag className="w-3.5 h-3.5" /> Commander via WhatsApp
                </a>
                <button onClick={() => setTab("commandes")}
                  className="inline-flex items-center gap-2 border border-white/20 text-white/60 text-xs font-body px-4 py-2 rounded-lg hover:border-white/40 hover:text-white transition-colors">
                  <Clock className="w-3.5 h-3.5" /> Voir mes commandes
                </button>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: "Commandes actives", value: activeOrders.length || "—", icon: Truck, color: "text-gmo-green" },
                { label: "Livrées", value: doneOrders.filter(o => o.status === "livree").length || "—", icon: CheckCircle2, color: "text-blue-600" },
                { label: "Total commandes", value: orders.length || "—", icon: Package, color: "text-purple-600" },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <s.icon className={`w-4 h-4 ${s.color} mb-2`} />
                  <p className="font-heading text-xl font-bold text-obsidian">{s.value}</p>
                  <p className="text-[11px] text-obsidian/40 font-body mt-0.5 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Recent orders */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <p className="font-heading text-sm font-bold text-obsidian">Commandes récentes</p>
                <button onClick={() => setTab("commandes")} className="text-xs text-gmo-green font-body hover:underline flex items-center gap-1">
                  Tout voir <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              {orders.length === 0 ? (
                <div className="py-10 text-center">
                  <Package className="w-8 h-8 text-obsidian/10 mx-auto mb-2" />
                  <p className="text-sm text-obsidian/35 font-body">Aucune commande pour l'instant</p>
                  <a href="https://wa.me/22676211633" target="_blank" rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 text-xs text-gmo-green font-body hover:underline">
                    <Plus className="w-3 h-3" /> Passer une commande
                  </a>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {orders.slice(0, 3).map(o => (
                    <div key={o.id} className="px-5 py-3.5 flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-heading text-sm font-semibold text-obsidian">{o.order_number || `CMD-${o.id?.slice(-6)}`}</p>
                        <p className="text-[11px] text-obsidian/40 font-body">{new Date(o.created_date).toLocaleDateString("fr-FR")}</p>
                      </div>
                      {o.total_amount && <p className="text-sm font-bold text-obsidian font-heading whitespace-nowrap">{o.total_amount.toLocaleString()} FCFA</p>}
                      <StatusBadge status={o.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contact */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-heading text-sm font-bold text-obsidian mb-0.5">Besoin d'aide ?</p>
                <p className="text-xs text-obsidian/45 font-body">Lun–Sam 8h30–18h</p>
              </div>
              <a href="tel:+22625331900" className="flex items-center gap-2 bg-gmo-green text-white text-xs font-heading font-bold px-5 py-2.5 rounded-lg hover:bg-gmo-green/90 transition-colors flex-shrink-0">
                <Phone className="w-3.5 h-3.5" /> Appeler
              </a>
            </div>
          </div>
        )}

        {/* ── COMMANDES ── */}
        {tab === "commandes" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-heading text-xl font-bold text-obsidian">Mes commandes</h2>
                <p className="text-xs text-obsidian/40 font-body mt-0.5">Suivi en temps réel</p>
              </div>
              <button onClick={fetchOrders} disabled={loadingOrders}
                className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2 text-xs font-body text-obsidian/60 hover:border-gmo-green hover:text-gmo-green transition-colors">
                <RefreshCw className={`w-3.5 h-3.5 ${loadingOrders ? "animate-spin" : ""}`} /> Actualiser
              </button>
            </div>

            {loadingOrders ? (
              <div className="flex justify-center py-16">
                <div className="w-6 h-6 border-2 border-gmo-green/30 border-t-gmo-green rounded-full animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
                <Package className="w-10 h-10 text-obsidian/10 mx-auto mb-3" />
                <p className="font-heading text-base font-semibold text-obsidian/40 mb-1">Aucune commande</p>
                <p className="text-sm text-obsidian/25 font-body mb-4">Votre historique apparaîtra ici</p>
                <a href="https://wa.me/22676211633" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gmo-green text-white text-xs font-heading font-bold px-5 py-2.5 rounded-lg">
                  <ShoppingBag className="w-3.5 h-3.5" /> Commander maintenant
                </a>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Active */}
                {activeOrders.length > 0 && (
                  <>
                    <p className="text-[10px] uppercase tracking-widest text-obsidian/35 font-heading mb-2">En cours ({activeOrders.length})</p>
                    {activeOrders.map(o => <OrderCard key={o.id} order={o} />)}
                  </>
                )}
                {/* Done */}
                {doneOrders.length > 0 && (
                  <>
                    <p className="text-[10px] uppercase tracking-widest text-obsidian/35 font-heading mt-5 mb-2">Historique ({doneOrders.length})</p>
                    {doneOrders.map(o => <OrderCard key={o.id} order={o} />)}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── CATALOGUE ── */}
        {tab === "catalogue" && (
          <div>
            <div className="mb-5">
              <h2 className="font-heading text-xl font-bold text-obsidian">Catalogue produits</h2>
              <p className="text-xs text-obsidian/40 font-body mt-0.5">Disponibles à la commande</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {SAMPLE_PRODUCTS.map(p => (
                <div key={p.name} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-gray-50 overflow-hidden">
                    {p.img ? (
                      <img src={p.img} alt={p.name} className="w-full h-full object-cover" onError={e => { e.target.style.display="none"; }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-obsidian/10" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-heading text-xs font-bold text-obsidian">{p.name}</p>
                    <p className="text-[10px] text-obsidian/35 font-body">{p.cat} · {p.unit}</p>
                    <p className="font-heading text-sm font-bold text-gmo-green mt-1.5">{p.price}</p>
                    <a href="https://wa.me/22676211633" target="_blank" rel="noopener noreferrer"
                      className="mt-2 w-full flex justify-center items-center gap-1.5 bg-obsidian text-white text-[10px] font-heading font-bold py-1.5 rounded-lg hover:bg-gmo-green transition-colors">
                      Commander
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-[11px] text-obsidian/20 font-body mt-8">
          <Link to="/" className="hover:text-gmo-green transition-colors">← Retour au site</Link>
        </p>
      </main>
    </div>
  );
}

function OrderCard({ order }) {
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.en_attente;
  const Icon = cfg.icon;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="font-heading text-sm font-bold text-obsidian">{order.order_number || `CMD-${order.id?.slice(-6)}`}</p>
          <p className="text-[11px] text-obsidian/40 font-body mt-0.5">
            {new Date(order.created_date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <DeliveryProgress status={order.status} />
      </div>

      <div className="flex items-center justify-between">
        {order.delivery_city && (
          <div className="flex items-center gap-1.5 text-xs text-obsidian/45 font-body">
            <MapPin className="w-3.5 h-3.5" /> {order.delivery_city}
          </div>
        )}
        {order.total_amount && (
          <p className="font-heading text-sm font-bold text-obsidian ml-auto">{order.total_amount.toLocaleString()} FCFA</p>
        )}
      </div>
      {order.estimated_delivery && (
        <p className="text-[11px] text-obsidian/35 font-body mt-1.5 flex items-center gap-1">
          <Truck className="w-3 h-3" /> Livraison estimée : {new Date(order.estimated_delivery).toLocaleDateString("fr-FR")}
        </p>
      )}
    </div>
  );
}

export default function ClientSpace() {
  return (
    <RoleGuard roles={["user", "client", "admin"]}>
      <ClientDashboard />
    </RoleGuard>
  );
}