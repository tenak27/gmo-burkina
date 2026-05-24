import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/AuthContext";
import RoleGuard from "@/components/auth/RoleGuard";
import { base44 } from "@/api/base44Client";
import {
  Truck, MapPin, CheckCircle2, Clock, Package, LogOut,
  Phone, Navigation, AlertCircle, RefreshCw, ChevronRight, Globe, FileText,
  Satellite, WifiOff
} from "lucide-react";
import { Link } from "react-router-dom";
import DeliveryNoteCard from "@/components/driver/DeliveryNoteCard";

const STATUS_ORDER = {
  en_attente: { label: "En attente", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", next: "confirmee" },
  confirmee: { label: "Confirmée", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", next: "en_preparation" },
  en_preparation: { label: "En préparation", color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200", next: "en_livraison" },
  en_livraison: { label: "En livraison", color: "text-gmo-green", bg: "bg-green-50", border: "border-green-200", next: "livree" },
  livree: { label: "Livrée ✓", color: "text-green-700", bg: "bg-green-100", border: "border-green-300", next: null },
  annulee: { label: "Annulée", color: "text-red-600", bg: "bg-red-50", border: "border-red-200", next: null },
};

const NEXT_LABEL = {
  confirmee: "Marquer en préparation",
  en_preparation: "Démarrer la livraison",
  en_livraison: "Marquer comme livrée",
};

function OrderDeliveryCard({ order, onUpdateStatus }) {
  const cfg = STATUS_ORDER[order.status] || STATUS_ORDER.en_attente;
  const nextStatus = cfg.next;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Top color bar */}
      <div className={`h-1 ${order.status === "livree" ? "bg-gmo-green" : order.status === "en_livraison" ? "bg-gmo-green" : order.status === "annulee" ? "bg-gmo-red" : "bg-amber-400"}`} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <p className="font-heading text-base font-bold text-obsidian">{order.order_number || `CMD-${order.id?.slice(-6)}`}</p>
            <p className="text-xs text-obsidian/50 font-body">{new Date(order.created_date).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}</p>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full border font-body ${cfg.color} ${cfg.bg} ${cfg.border}`}>
            {cfg.label}
          </span>
        </div>

        {/* Client info */}
        <div className="bg-gray-50 rounded-xl p-3 mb-3 space-y-1.5">
          <div className="flex items-center gap-2">
            <Package className="w-3.5 h-3.5 text-obsidian/30" />
            <p className="text-sm font-heading font-semibold text-obsidian">{order.client_name}</p>
          </div>
          {order.client_phone && (
            <a href={`tel:${order.client_phone}`} className="flex items-center gap-2 text-gmo-green hover:text-gmo-green/80 transition-colors">
              <Phone className="w-3.5 h-3.5" />
              <span className="text-sm font-body">{order.client_phone}</span>
            </a>
          )}
          {order.delivery_address && (
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-obsidian/30 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-obsidian/60 font-body">{order.delivery_address}{order.delivery_city ? `, ${order.delivery_city}` : ""}</p>
            </div>
          )}
          {order.delivery_mode === "enlevement" && (
            <div className="flex items-center gap-2">
              <Navigation className="w-3.5 h-3.5 text-gmo-green" />
              <p className="text-xs text-gmo-green font-body font-medium">Enlèvement au dépôt GMO</p>
            </div>
          )}
        </div>

        {/* Items summary */}
        {order.items?.length > 0 && (
          <div className="mb-3">
            <p className="text-[10px] uppercase tracking-widest text-obsidian/35 font-heading mb-1.5">Articles ({order.items.length})</p>
            <div className="space-y-1">
              {order.items.slice(0, 3).map((item, i) => (
                <div key={i} className="flex justify-between text-xs font-body">
                  <span className="text-obsidian/60">{item.name} ×{item.qty}</span>
                </div>
              ))}
              {order.items.length > 3 && <p className="text-[10px] text-obsidian/35 font-body">+ {order.items.length - 3} article(s)...</p>}
            </div>
          </div>
        )}

        {order.total_amount && (
          <p className="font-heading text-sm font-bold text-gmo-green mb-3">{Number(order.total_amount).toLocaleString()} FCFA</p>
        )}

        {/* Action button */}
        {nextStatus && NEXT_LABEL[nextStatus] && (
          <button
            onClick={() => onUpdateStatus(order.id, nextStatus)}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-heading font-bold transition-all ${
              nextStatus === "livree"
                ? "bg-gmo-green text-white hover:bg-gmo-green/90 btn-glow-green"
                : nextStatus === "en_livraison"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-amber-500 text-white hover:bg-amber-600"
            }`}
          >
            <ChevronRight className="w-4 h-4" />
            {NEXT_LABEL[nextStatus]}
          </button>
        )}
        {order.status === "livree" && (
          <div className="flex items-center justify-center gap-2 py-3 bg-green-50 border border-green-200 rounded-xl">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-sm font-heading font-bold text-green-700">Livraison confirmée</span>
          </div>
        )}
      </div>
    </div>
  );
}

function GpsTracker({ user }) {
  const [gpsActive, setGpsActive] = useState(false);
  const [gpsStatus, setGpsStatus] = useState("idle"); // idle | active | error
  const [locationRecord, setLocationRecord] = useState(null);
  const watchRef = useRef(null);

  const startGps = () => {
    if (!navigator.geolocation) {
      setGpsStatus("error");
      return;
    }
    setGpsStatus("active");
    setGpsActive(true);
    watchRef.current = navigator.geolocation.watchPosition(
      async (pos) => {
        const payload = {
          driver_id: user.id,
          driver_name: user.full_name,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          speed: pos.coords.speed,
          is_active: true,
          last_update: new Date().toISOString(),
        };
        if (locationRecord) {
          await base44.entities.DriverLocation.update(locationRecord.id, payload);
        } else {
          // Check if record exists for this driver
          const existing = await base44.entities.DriverLocation.filter({ driver_id: user.id });
          if (existing && existing.length > 0) {
            setLocationRecord(existing[0]);
            await base44.entities.DriverLocation.update(existing[0].id, payload);
          } else {
            const r = await base44.entities.DriverLocation.create(payload);
            setLocationRecord(r);
          }
        }
      },
      () => setGpsStatus("error"),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );
  };

  const stopGps = async () => {
    if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current);
    setGpsActive(false);
    setGpsStatus("idle");
    if (locationRecord) {
      await base44.entities.DriverLocation.update(locationRecord.id, { is_active: false });
    }
  };

  useEffect(() => {
    return () => { if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current); };
  }, []);

  return (
    <div className={`rounded-2xl border p-4 mb-4 transition-all ${gpsActive ? "bg-blue-50 border-blue-200" : "bg-white border-gray-100"} shadow-sm`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${gpsActive ? "bg-blue-100" : "bg-gray-100"}`}>
            <Satellite className={`w-5 h-5 ${gpsActive ? "text-blue-600" : "text-gray-400"}`} />
          </div>
          <div>
            <p className="font-heading text-sm font-bold text-obsidian">Suivi GPS</p>
            {gpsStatus === "active" && (
              <p className="text-[11px] text-blue-600 font-body flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse inline-block" />
                Position envoyée en temps réel
              </p>
            )}
            {gpsStatus === "idle" && <p className="text-[11px] text-obsidian/40 font-body">Activez pour être suivi par l'admin</p>}
            {gpsStatus === "error" && (
              <p className="text-[11px] text-red-500 font-body flex items-center gap-1">
                <WifiOff className="w-3 h-3" /> GPS non disponible sur cet appareil
              </p>
            )}
          </div>
        </div>
        <button
          onClick={gpsActive ? stopGps : startGps}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-heading font-bold transition-all cursor-pointer ${
            gpsActive
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          <Navigation className="w-4 h-4" />
          {gpsActive ? "Désactiver" : "Activer GPS"}
        </button>
      </div>
    </div>
  );
}

function DriverDashboard() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [deliveryNotes, setDeliveryNotes] = useState([]);
  const [filter, setFilter] = useState("active");
  const [view, setView] = useState("orders"); // "orders" | "bons"
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = async () => {
    setRefreshing(true);
    const [all, allNotes] = await Promise.all([
      base44.entities.Order.list("-created_date", 100),
      base44.entities.DeliveryNote.list("-created_date", 50),
    ]);
    const mine = (all || []).filter(o =>
      o.driver_name === user.full_name ||
      o.driver_id === user.id
    );
    const myNotes = (allNotes || []).filter(n =>
      n.driver === user.full_name ||
      n.driver === user.email
    );
    setOrders(mine);
    setDeliveryNotes(myNotes);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { loadOrders(); }, [user]);

  // Real-time updates
  useEffect(() => {
    const unsub = base44.entities.Order.subscribe(event => {
      const ismine = event.data?.driver_name === user?.full_name || event.data?.driver_id === user?.id;
      setOrders(prev => {
        if (event.type === "create" && ismine) return [event.data, ...prev];
        if (event.type === "update") return prev.map(o => o.id === event.id ? event.data : o);
        if (event.type === "delete") return prev.filter(o => o.id !== event.id);
        return prev;
      });
    });
    return unsub;
  }, [user]);

  const updateStatus = async (id, status) => {
    await base44.entities.Order.update(id, { status });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const active = orders.filter(o => !["livree", "annulee"].includes(o.status));
  const done = orders.filter(o => o.status === "livree");

  const displayed = filter === "active" ? active : filter === "done" ? done : orders;

  if (loading) return (
    <div className="min-h-screen bg-[#F2F4F7] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gmo-green/20 border-t-gmo-green rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F2F4F7]">
      {/* Header */}
      <header className="bg-[#111113] sticky top-0 z-40 border-b border-white/[0.07]">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c7662a636_logo-gmo2x.png" alt="GMO" className="h-7 brightness-0 invert opacity-90" />
            <div>
              <span className="text-[9px] text-gmo-green uppercase tracking-widest font-body">Chauffeur</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gmo-green flex items-center justify-center text-white text-xs font-bold">
              {user?.full_name?.charAt(0) || "C"}
            </div>
            <span className="hidden sm:block text-xs text-white/50 font-body">{user?.full_name}</span>
            <button onClick={() => logout()} className="text-white/25 hover:text-red-400 transition-colors ml-1">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* GPS Tracker */}
        <GpsTracker user={user} />

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: "En cours", value: active.length, icon: Truck, color: "text-gmo-green" },
            { label: "Livrées", value: done.length, icon: CheckCircle2, color: "text-green-700" },
            { label: "Total", value: orders.length, icon: Package, color: "text-blue-600" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <s.icon className={`w-4 h-4 ${s.color} mb-2`} />
              <p className="font-heading text-xl font-bold text-obsidian">{s.value}</p>
              <p className="text-[11px] text-obsidian/40 font-body mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* View switcher */}
        <div className="flex items-center gap-2 mb-4 bg-white border border-gray-100 rounded-xl p-1 shadow-sm w-fit">
          <button onClick={() => setView("orders")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body transition-all ${view === "orders" ? "bg-gmo-green text-white font-semibold" : "text-obsidian/50 hover:text-obsidian"}`}>
            <Truck className="w-3.5 h-3.5" /> Livraisons
          </button>
          <button onClick={() => setView("bons")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body transition-all ${view === "bons" ? "bg-gmo-green text-white font-semibold" : "text-obsidian/50 hover:text-obsidian"}`}>
            <FileText className="w-3.5 h-3.5" /> Bons ({deliveryNotes.length})
          </button>
        </div>

        {view === "orders" && (
          <>
            {/* Filters + refresh */}
            <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
              <div className="flex items-center gap-1 bg-white border border-gray-100 rounded-xl p-1 shadow-sm">
                {[
                  { id: "active", label: `En cours (${active.length})` },
                  { id: "done", label: `Livrées (${done.length})` },
                  { id: "all", label: "Tout" },
                ].map(f => (
                  <button key={f.id} onClick={() => setFilter(f.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-body transition-all whitespace-nowrap ${
                      filter === f.id ? "bg-obsidian text-white font-semibold" : "text-obsidian/50 hover:text-obsidian"
                    }`}>
                    {f.label}
                  </button>
                ))}
              </div>
              <button onClick={loadOrders} disabled={refreshing}
                className="flex items-center gap-1.5 text-xs text-obsidian/50 border border-gray-200 rounded-xl px-3 py-2 hover:border-gmo-green hover:text-gmo-green transition-colors">
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
                Actualiser
              </button>
            </div>
            {displayed.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
                {filter === "active"
                  ? <><Truck className="w-10 h-10 text-obsidian/10 mx-auto mb-3" /><p className="font-heading text-base font-semibold text-obsidian/40">Aucune livraison en cours</p><p className="text-sm text-obsidian/25 font-body mt-1">Vos livraisons assignées apparaîtront ici</p></>
                  : <><CheckCircle2 className="w-10 h-10 text-obsidian/10 mx-auto mb-3" /><p className="font-heading text-base font-semibold text-obsidian/40">Aucune livraison terminée</p></>
                }
              </div>
            ) : (
              <div className="space-y-4">
                {displayed.map(o => (
                  <OrderDeliveryCard key={o.id} order={o} onUpdateStatus={updateStatus} />
                ))}
              </div>
            )}
          </>
        )}

        {view === "bons" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="font-heading text-sm font-bold text-obsidian">{deliveryNotes.length} bon(s) assigné(s)</p>
              <button onClick={loadOrders} disabled={refreshing}
                className="flex items-center gap-1.5 text-xs text-obsidian/50 border border-gray-200 rounded-xl px-3 py-2 hover:border-gmo-green hover:text-gmo-green transition-colors">
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} /> Actualiser
              </button>
            </div>
            {deliveryNotes.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
                <FileText className="w-10 h-10 text-obsidian/10 mx-auto mb-3" />
                <p className="font-heading text-base font-semibold text-obsidian/40">Aucun bon assigné</p>
                <p className="text-sm text-obsidian/25 font-body mt-1">Vos bons de livraison apparaîtront ici</p>
              </div>
            ) : (
              <div className="space-y-3">
                {deliveryNotes.map(n => (
                  <DeliveryNoteCard key={n.id} note={n} />
                ))}
              </div>
            )}
          </div>
        )}

        <p className="text-center text-[11px] text-obsidian/20 font-body mt-8">
          <Link to="/" className="hover:text-gmo-green transition-colors">← Retour au site</Link>
        </p>
      </main>
    </div>
  );
}

export default function DriverSpace() {
  return (
    <RoleGuard roles={["chauffeur", "pdg"]}>
      <DriverDashboard />
    </RoleGuard>
  );
}