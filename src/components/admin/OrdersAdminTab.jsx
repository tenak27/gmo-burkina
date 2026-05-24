import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import EntityTable from "./EntityTable";
import SaleOrderForm from "./SaleOrderForm";
import { LayoutGrid, List, ShoppingCart, Truck, Package, CheckCircle2, Clock, XCircle, MessageSquare, Home, Plus } from "lucide-react";
import { motion } from "framer-motion";

async function sendSmsForOrder(order, status) {
  if (!order.client_phone) return false;
  try {
    await base44.functions.invoke("sendSmsNotification", {
      phone: order.client_phone, order_number: order.order_number,
      status, client_name: order.client_name,
    });
    return true;
  } catch { return false; }
}

const STATUS_LABELS = {
  en_attente: "En attente", confirmee: "Confirmée", en_preparation: "En prép.",
  en_livraison: "En livraison", livree: "Livrée", annulee: "Annulée"
};
const STATUS_STYLE = {
  en_attente: "bg-amber-50 text-amber-600 border border-amber-200",
  confirmee: "bg-blue-50 text-blue-600 border border-blue-200",
  en_preparation: "bg-purple-50 text-purple-600 border border-purple-200",
  en_livraison: "bg-green-50 text-gmo-green border border-green-200",
  livree: "bg-green-100 text-green-700 border border-green-300",
  annulee: "bg-red-50 text-red-600 border border-red-200",
};
const STATUS_ICONS = {
  en_attente: Clock, confirmee: CheckCircle2, en_preparation: Package,
  en_livraison: Truck, livree: CheckCircle2, annulee: XCircle
};
const STATUS_ORDER = ["en_attente", "confirmee", "en_preparation", "en_livraison", "livree", "annulee"];

function KanbanCard({ order, onStatusChange, onEdit }) {
return (
  <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
    className="rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
  >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <button onClick={() => onEdit(order)} className="font-heading text-sm font-bold text-white/80 truncate hover:text-gmo-green transition-colors cursor-pointer block">
            {order.order_number || `CMD-${order.id?.slice(-6)}`}
          </button>
          <p className="text-xs text-white/40 font-body truncate mt-0.5">{order.client_name || "—"}</p>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded font-body flex-shrink-0 ${order.client_type === "detaillant" ? "bg-gmo-red/10 text-gmo-red" : "bg-gray-100 text-obsidian/50"}`}>
          {order.client_type || "client"}
        </span>
      </div>
      {order.total_amount && (
        <p className="font-heading text-base font-bold text-gmo-green mb-1.5">{Number(order.total_amount).toLocaleString()} FCFA</p>
      )}
      {order.items?.length > 0 && (
        <p className="text-xs text-obsidian/45 font-body mb-1.5">{order.items.length} article(s)</p>
      )}
      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
        {order.delivery_mode === "enlevement"
          ? <span className="text-xs bg-gmo-green/10 text-gmo-green px-2 py-0.5 rounded font-body flex items-center gap-1"><Home className="w-3 h-3" />Enlèvement</span>
          : <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-body flex items-center gap-1"><Truck className="w-3 h-3" />Livraison</span>
        }
        {order.driver_name && <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded font-body truncate max-w-[90px]">{order.driver_name}</span>}
      </div>
      <p className="text-xs text-white/30 font-body mb-2.5">{new Date(order.created_date).toLocaleDateString("fr-FR")}</p>
      <select value={order.status} onChange={e => onStatusChange(order, e.target.value)}
        className="w-full text-sm font-body text-white/70 rounded-lg px-2.5 py-2 focus:outline-none focus:border-gmo-green cursor-pointer transition-colors"
        style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.15)" }}>
        {Object.entries(STATUS_LABELS).map(([k, lbl]) => <option key={k} value={k}>{lbl}</option>)}
      </select>
    </motion.div>
  );
}

function KanbanColumn({ status, orders, onStatusChange, onEdit }) {
  const Icon = STATUS_ICONS[status] || Clock;
  return (
    <div className="flex-1 min-w-[230px] max-w-[280px]">
      <div className={`flex items-center gap-2 mb-3 px-3 py-2.5 rounded-xl ${STATUS_STYLE[status]}`}>
        <Icon className="w-4 h-4 flex-shrink-0" />
        <span className="text-xs font-heading font-bold uppercase tracking-wider flex-1">{STATUS_LABELS[status]}</span>
        <span className="bg-white/80 text-xs font-bold font-heading px-2 py-0.5 rounded-full">{orders.length}</span>
      </div>
      <div className="space-y-2.5 min-h-[60px]">
        {orders.map(o => (
          <KanbanCard key={o.id} order={o} onStatusChange={onStatusChange} onEdit={onEdit} />
        ))}
        {orders.length === 0 && (
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center">
            <p className="text-sm text-obsidian/25 font-body">Aucune commande</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrdersAdminTab({ orders, setOrders, clients = [], products = [], drivers = [] }) {
  const [view, setView] = useState("kanban");
  const [formOrder, setFormOrder] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  const updateStatus = async (order, status) => {
    await base44.entities.Order.update(order.id, { status });
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status } : o));
    if (order.client_phone) sendSmsForOrder(order, status);
  };

  const openNew = () => { setFormOrder(null); setFormOpen(true); };
  const openEdit = (order) => { setFormOrder(order); setFormOpen(true); };

  const handleSaved = (data) => {
    if (formOrder) {
      setOrders(prev => prev.map(o => o.id === formOrder.id ? { ...o, ...data } : o));
    } else {
      // Will be synced via realtime subscription in AdminSpace
      setOrders(prev => [{ ...data, created_date: new Date().toISOString() }, ...prev]);
    }
    setFormOpen(false);
  };

  const del = async (r) => {
    if (!confirm(`Supprimer la commande ${r.order_number} ?`)) return;
    await base44.entities.Order.delete(r.id);
    setOrders(prev => prev.filter(o => o.id !== r.id));
  };

  const COLUMNS = [
    { key: "order_number", label: "N° Commande", render: (v, r) => (
      <div>
        <button onClick={() => openEdit(r)} className="font-heading text-sm font-bold text-obsidian hover:text-gmo-green transition-colors cursor-pointer">{v || `CMD-${r.id?.slice(-6)}`}</button>
        <span className={`block text-xs px-2 py-0.5 rounded font-body w-fit mt-1 ${r.client_type === "detaillant" ? "bg-gmo-red/10 text-gmo-red" : "bg-gray-100 text-obsidian/50"}`}>
          {r.client_type || "client"}
        </span>
      </div>
    )},
    { key: "client_name", label: "Client", render: (v, r) => (
      <div>
        <p className="text-sm text-obsidian/80 font-body font-medium">{v || "—"}</p>
        <p className="text-xs text-obsidian/45 font-body mt-0.5">{r.client_phone || r.client_email}</p>
      </div>
    )},
    { key: "items", label: "Articles", render: v => <span className="text-sm text-obsidian/60 font-body">{Array.isArray(v) ? `${v.length} article(s)` : "—"}</span> },
    { key: "created_date", label: "Date", render: v => <span className="text-sm text-obsidian/60 font-body">{v ? new Date(v).toLocaleDateString("fr-FR") : "—"}</span> },
    { key: "total_amount", label: "Montant", align: "right", render: v => v ? <span className="font-heading text-sm font-bold text-obsidian">{Number(v).toLocaleString()} FCFA</span> : <span className="text-obsidian/25">—</span> },
    { key: "status", label: "Statut", align: "center", render: v => <span className={`text-xs px-2.5 py-1 rounded-full font-semibold font-body ${STATUS_STYLE[v] || ""}`}>{STATUS_LABELS[v] || v}</span> },
    { key: "status", label: "Changer", align: "center", render: (v, r) => (
      <select value={v} onChange={e => updateStatus(r, e.target.value)}
        className="text-sm font-body text-obsidian/70 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-gmo-green cursor-pointer bg-white">
        {Object.entries(STATUS_LABELS).map(([k, lbl]) => <option key={k} value={k}>{lbl}</option>)}
      </select>
    )},
  ];

  const pending = orders.filter(o => o.status === "en_attente").length;
  const delivered = orders.filter(o => o.status === "livree").length;
  const inProgress = orders.filter(o => ["confirmee","en_preparation","en_livraison"].includes(o.status)).length;
  const revenue = orders.filter(o => o.status === "livree").reduce((s, o) => s + (o.total_amount || 0), 0);

  return (
    <div className="space-y-4 animate-fade-up">
      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "En attente", value: pending, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", icon: Clock },
          { label: "En cours", value: inProgress, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", icon: Package },
          { label: "Livrées", value: delivered, color: "text-green-700", bg: "bg-green-50", border: "border-green-200", icon: CheckCircle2 },
          { label: "CA livré", value: `${(revenue / 1000).toFixed(0)}k FCFA`, color: "text-gmo-green", bg: "bg-green-50/50", border: "border-green-100", icon: ShoppingCart },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-5 flex items-center gap-4`}>
            <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className={`font-heading text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-sm text-obsidian/50 font-body mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="font-heading text-2xl font-bold text-white">
          Commandes <span className="text-white/30 font-normal text-xl">({orders.length})</span>
        </h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <button onClick={() => setView("kanban")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-body transition-all ${view === "kanban" ? "bg-gmo-green text-white font-semibold shadow-lg" : "text-white/40 hover:text-white"}`}>
              <LayoutGrid className="w-4 h-4" /> Kanban
            </button>
            <button onClick={() => setView("table")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-body transition-all ${view === "table" ? "bg-gmo-green text-white font-semibold shadow-lg" : "text-white/40 hover:text-white"}`}>
              <List className="w-4 h-4" /> Table
            </button>
          </div>
          <button onClick={openNew} className="flex items-center gap-2 bg-gmo-green text-white font-heading font-bold text-sm px-5 py-2.5 rounded-xl btn-glow-green cursor-pointer">
            <Plus className="w-4 h-4" /> Nouvelle commande
          </button>
        </div>
      </div>

      {/* Kanban */}
      {view === "kanban" && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-3 min-w-max">
            {STATUS_ORDER.map(status => (
              <KanbanColumn key={status} status={status}
                orders={orders.filter(o => o.status === status)}
                onStatusChange={updateStatus} onEdit={openEdit} />
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      {view === "table" && (
        <EntityTable title="" subtitle={`${orders.length} commandes · temps réel`}
          columns={COLUMNS} rows={orders} loading={false}
          onAdd={openNew} onEdit={openEdit} onDelete={del} addLabel="Nouvelle commande"
        />
      )}

      {formOpen && (
        <SaleOrderForm
          order={formOrder}
          onSave={handleSaved}
          onClose={() => setFormOpen(false)}
          clients={clients}
          products={products}
          drivers={drivers}
        />
      )}
    </div>
  );
}