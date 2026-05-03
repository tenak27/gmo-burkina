import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import EntityTable from "./EntityTable";
import { LayoutGrid, List, ShoppingCart, Truck, Package, CheckCircle2, Clock, XCircle, MessageSquare, Home, MapPin } from "lucide-react";
import { motion } from "framer-motion";

async function sendSmsForOrder(order, status) {
  if (!order.client_phone) return false;
  try {
    await base44.functions.invoke("sendSmsNotification", {
      phone: order.client_phone,
      order_number: order.order_number,
      status,
      client_name: order.client_name,
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

function KanbanCard({ order, onStatusChange }) {
  const Icon = STATUS_ICONS[order.status] || Clock;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <p className="font-heading text-xs font-bold text-obsidian truncate">{order.order_number || `CMD-${order.id?.slice(-6)}`}</p>
          <p className="text-[10px] text-obsidian/45 font-body truncate">{order.client_name || "—"}</p>
        </div>
        <span className={`text-[9px] px-1.5 py-0.5 rounded font-body flex-shrink-0 ${order.client_type === "detaillant" ? "bg-gmo-red/10 text-gmo-red" : "bg-gray-100 text-obsidian/40"}`}>
          {order.client_type || "client"}
        </span>
      </div>
      {order.total_amount && (
        <p className="font-heading text-sm font-bold text-gmo-green mb-1">{Number(order.total_amount).toLocaleString()} FCFA</p>
      )}
      <div className="flex items-center gap-1.5 mb-2">
        {order.delivery_mode === "enlevement"
          ? <span className="text-[9px] bg-gmo-green/10 text-gmo-green px-1.5 py-0.5 rounded font-body flex items-center gap-1"><Home className="w-2.5 h-2.5" />Enlèvement</span>
          : <span className="text-[9px] bg-blue-50 text-blue-500 px-1.5 py-0.5 rounded font-body flex items-center gap-1"><Truck className="w-2.5 h-2.5" />Livraison</span>
        }
        {order.client_phone && <span className="text-[9px] bg-purple-50 text-purple-500 px-1.5 py-0.5 rounded font-body flex items-center gap-1"><MessageSquare className="w-2.5 h-2.5" />SMS</span>}
      </div>
      <p className="text-[10px] text-obsidian/30 font-body mb-2">{new Date(order.created_date).toLocaleDateString("fr-FR")}</p>
      <select
        value={order.status}
        onChange={e => onStatusChange(order, e.target.value)}
        className="w-full text-[10px] font-body text-obsidian/60 border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-gmo-green cursor-pointer bg-gray-50/50 transition-colors"
      >
        {Object.entries(STATUS_LABELS).map(([k, lbl]) => (
          <option key={k} value={k}>{lbl}</option>
        ))}
      </select>
    </motion.div>
  );
}

function KanbanColumn({ status, orders, onStatusChange }) {
  const Icon = STATUS_ICONS[status] || Clock;
  return (
    <div className="flex-1 min-w-[200px] max-w-[260px]">
      <div className={`flex items-center gap-2 mb-3 px-3 py-2 rounded-xl ${STATUS_STYLE[status]}`}>
        <Icon className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="text-[10px] font-heading font-bold uppercase tracking-wider flex-1">{STATUS_LABELS[status]}</span>
        <span className="bg-white/70 text-[9px] font-bold font-heading px-1.5 py-0.5 rounded-full">{orders.length}</span>
      </div>
      <div className="space-y-2 min-h-[60px]">
        {orders.map(o => (
          <KanbanCard key={o.id} order={o} onStatusChange={onStatusChange} />
        ))}
        {orders.length === 0 && (
          <div className="border-2 border-dashed border-gray-100 rounded-xl p-4 text-center">
            <p className="text-[10px] text-obsidian/20 font-body">Aucune commande</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrdersAdminTab({ orders, setOrders }) {
  const [view, setView] = useState("kanban");

  const updateStatus = async (order, status) => {
    await base44.entities.Order.update(order.id, { status });
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status } : o));
    // Auto SMS if client has phone
    if (order.client_phone) sendSmsForOrder(order, status);
  };

  const COLUMNS = [
    {
      key: "order_number", label: "N° Commande",
      render: (v, r) => (
        <div>
          <p className="font-heading text-xs font-bold text-obsidian">{v || `CMD-${r.id?.slice(-6)}`}</p>
          <span className={`text-[9px] px-1.5 py-0.5 rounded font-body ${r.client_type === "detaillant" ? "bg-gmo-red/10 text-gmo-red" : "bg-gray-100 text-obsidian/40"}`}>
            {r.client_type || "client"}
          </span>
        </div>
      )
    },
    {
      key: "client_name", label: "Client",
      render: (v, r) => (
        <div>
          <p className="text-xs text-obsidian/70 font-body">{v || "—"}</p>
          <p className="text-[10px] text-obsidian/35 font-body">{r.client_email}</p>
        </div>
      )
    },
    { key: "created_date", label: "Date", render: v => <span className="text-xs text-obsidian/50 font-body">{v ? new Date(v).toLocaleDateString("fr-FR") : "—"}</span> },
    { key: "total_amount", label: "Montant", align: "right", render: v => v ? <span className="font-heading text-xs font-bold text-obsidian">{Number(v).toLocaleString()} FCFA</span> : <span className="text-obsidian/25">—</span> },
    { key: "status", label: "Statut", align: "center", render: v => <span className={`text-[10px] px-2 py-0.5 rounded-full font-body ${STATUS_STYLE[v] || ""}`}>{STATUS_LABELS[v] || v}</span> },
    {
      key: "status", label: "Changer", align: "center",
      render: (v, r) => (
        <select value={v} onChange={e => updateStatus(r, e.target.value)}
          className="text-[10px] font-body text-obsidian/60 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-gmo-green cursor-pointer">
          {Object.entries(STATUS_LABELS).map(([k, lbl]) => <option key={k} value={k}>{lbl}</option>)}
        </select>
      )
    },
  ];

  const pending = orders.filter(o => o.status === "en_attente").length;
  const delivered = orders.filter(o => o.status === "livree").length;
  const inProgress = orders.filter(o => ["confirmee","en_preparation","en_livraison"].includes(o.status)).length;
  const revenue = orders.filter(o => o.status === "livree").reduce((s, o) => s + (o.total_amount || 0), 0);

  return (
    <div className="space-y-4 animate-fade-up">
      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "En attente", value: pending, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", icon: Clock },
          { label: "En cours", value: inProgress, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", icon: Package },
          { label: "Livrées", value: delivered, color: "text-green-700", bg: "bg-green-50", border: "border-green-200", icon: CheckCircle2 },
          { label: "CA livré", value: `${(revenue / 1000).toFixed(0)}k FCFA`, color: "text-gmo-green", bg: "bg-green-50/50", border: "border-green-100", icon: ShoppingCart },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4 flex items-center gap-3`}>
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div>
              <p className={`font-heading text-lg font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-obsidian/40 font-body">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* View toggle */}
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-bold text-obsidian">
          Commandes <span className="text-obsidian/30 font-normal text-base">({orders.length})</span>
        </h2>
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
          <button onClick={() => setView("kanban")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-body transition-all ${view === "kanban" ? "bg-white shadow-sm text-obsidian font-semibold" : "text-obsidian/40 hover:text-obsidian"}`}>
            <LayoutGrid className="w-3.5 h-3.5" /> Kanban
          </button>
          <button onClick={() => setView("table")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-body transition-all ${view === "table" ? "bg-white shadow-sm text-obsidian font-semibold" : "text-obsidian/40 hover:text-obsidian"}`}>
            <List className="w-3.5 h-3.5" /> Table
          </button>
        </div>
      </div>

      {/* Kanban */}
      {view === "kanban" && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-3 min-w-max">
            {STATUS_ORDER.map(status => (
              <KanbanColumn
                key={status}
                status={status}
                orders={orders.filter(o => o.status === status)}
                onStatusChange={updateStatus}
              />
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      {view === "table" && (
        <EntityTable
          title=""
          subtitle={`${orders.length} commandes · temps réel`}
          columns={COLUMNS}
          rows={orders}
          loading={false}
        />
      )}
    </div>
  );
}