import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { CheckCircle2, XCircle, Clock, CreditCard, TrendingUp, Package, Eye, ChevronDown, ChevronUp, User, Plus } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import InitiateResellerOrderModal from "./InitiateResellerOrderModal";

const APPROVAL_LABELS = {
  pending_pdg_approval: { label: "En attente PDG", cls: "text-amber-600 bg-amber-50 border-amber-200" },
  approved: { label: "Approuvée", cls: "text-green-700 bg-green-50 border-green-200" },
  rejected: { label: "Rejetée", cls: "text-red-600 bg-red-50 border-red-200" },
};

const STATUS_LABELS = {
  en_attente: "En attente",
  confirmee: "Confirmée",
  en_preparation: "En préparation",
  en_livraison: "En livraison",
  livree: "Livrée",
  annulee: "Annulée",
};

function OrderRow({ order, onApprove, onReject, approving }) {
  const [expanded, setExpanded] = useState(false);
  const approval = APPROVAL_LABELS[order.approval_status];

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
      <div className="flex items-center gap-4 p-4 cursor-pointer" onClick={() => setExpanded(e => !e)}>
        <div className="w-9 h-9 rounded-full bg-gmo-green/10 flex items-center justify-center text-gmo-green font-bold text-sm flex-shrink-0">
          {order.client_name?.charAt(0) || "R"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-heading text-sm font-bold text-obsidian">{order.client_name}</p>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-body ${approval?.cls || "text-gray-500 bg-gray-50 border-gray-200"}`}>
              {approval?.label || STATUS_LABELS[order.status]}
            </span>
          </div>
          <p className="text-[11px] text-obsidian/40 font-body mt-0.5">
            {order.order_number} · {new Date(order.created_date).toLocaleDateString("fr-FR")} · {order.items?.length || 0} article(s)
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-heading text-sm font-bold text-gmo-green">{(order.total_amount || 0).toLocaleString()} FCFA</p>
          <p className="text-[10px] text-obsidian/30 font-body">{order.delivery_mode === "livraison" ? "Livraison" : "Enlèvement"}</p>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-obsidian/30" /> : <ChevronDown className="w-4 h-4 text-obsidian/30" />}
      </div>

      {expanded && (
        <div className="border-t border-gray-50 px-4 pb-4 pt-3 space-y-3">
          {order.items?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {order.items.map((item, i) => (
                <span key={i} className="text-[11px] bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg font-body text-obsidian/60">
                  {item.name} ×{item.qty} — {((item.unit_price || 0) * item.qty).toLocaleString()} FCFA
                </span>
              ))}
            </div>
          )}
          {order.delivery_address && (
            <p className="text-[11px] text-obsidian/40 font-body">📍 {order.delivery_address}</p>
          )}
          {order.approval_status === "pending_pdg_approval" && (
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => onApprove(order)}
                disabled={approving === order.id}
                className="flex items-center gap-1.5 bg-gmo-green text-white text-xs font-heading font-bold px-4 py-2 rounded-xl hover:bg-gmo-green/90 transition-colors disabled:opacity-50"
              >
                {approving === order.id ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                Approuver
              </button>
              <button
                onClick={() => onReject(order)}
                disabled={approving === order.id}
                className="flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-200 text-xs font-heading font-bold px-4 py-2 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                <XCircle className="w-3.5 h-3.5" />
                Rejeter
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function RevendeurAdminTab({ orders, setOrders, clients, receivables, products = [] }) {
  const [approving, setApproving] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);

  const resellerOrders = useMemo(() =>
    orders.filter(o => o.client_type === "revendeur"),
    [orders]
  );

  const resellerClients = useMemo(() =>
    clients.filter(c => c.type === "revendeur"),
    [clients]
  );

  const filtered = useMemo(() => {
    if (filterStatus === "pending") return resellerOrders.filter(o => o.approval_status === "pending_pdg_approval");
    if (filterStatus === "approved") return resellerOrders.filter(o => o.approval_status === "approved");
    if (filterStatus === "rejected") return resellerOrders.filter(o => o.approval_status === "rejected");
    return resellerOrders;
  }, [resellerOrders, filterStatus]);

  const pendingCount = resellerOrders.filter(o => o.approval_status === "pending_pdg_approval").length;
  const approvedCA = resellerOrders.filter(o => o.approval_status === "approved").reduce((s, o) => s + (o.total_amount || 0), 0);

  const handleApprove = async (order) => {
    setApproving(order.id);
    await base44.functions.invoke("approveResellerOrder", { order_id: order.id });
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, approval_status: "approved", status: "confirmee" } : o));
    setApproving(null);
  };

  const handleReject = async (order) => {
    const reason = prompt("Motif du rejet (optionnel) :");
    setApproving(order.id);
    await base44.functions.invoke("rejectResellerOrder", { order_id: order.id, reason: reason || "Commande rejetée." });
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, approval_status: "rejected", status: "annulee" } : o));
    setApproving(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading text-2xl font-bold text-obsidian">Espace Revendeurs</h2>
        <p className="text-sm text-obsidian/40 font-body mt-0.5">Suivi des commandes et approbations revendeurs</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Revendeurs clients", value: resellerClients.length, icon: User, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "En attente PDG", value: pendingCount, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Commandes totales", value: resellerOrders.length, icon: Package, color: "text-gmo-green", bg: "bg-gmo-green/10" },
          { label: "CA approuvé (FCFA)", value: approvedCA.toLocaleString(), icon: TrendingUp, color: "text-gmo-green", bg: "bg-gmo-green/10" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className={`w-8 h-8 ${s.bg} rounded-lg flex items-center justify-center mb-3`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className="font-heading text-xl font-bold text-obsidian">{s.value}</p>
            <p className="text-[11px] text-obsidian/40 font-body mt-0.5 leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters & Action */}
      <div className="flex gap-2 flex-wrap justify-between items-center">
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "all", label: "Toutes" },
            { key: "pending", label: `En attente (${pendingCount})` },
            { key: "approved", label: "Approuvées" },
            { key: "rejected", label: "Rejetées" },
          ].map(f => (
            <button key={f.key} onClick={() => setFilterStatus(f.key)}
              className={`px-4 py-2 rounded-xl text-xs font-heading font-semibold border transition-all ${
                filterStatus === f.key
                  ? "bg-obsidian text-white border-obsidian"
                  : "bg-white text-obsidian/50 border-gray-200 hover:border-gray-300"
              }`}>
              {f.label}
            </button>
          ))}
        </div>
        <button onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 bg-gmo-green text-white font-heading font-bold text-xs px-4 py-2 rounded-xl hover:bg-gmo-green/90 transition-colors cursor-pointer">
          <Plus className="w-3.5 h-3.5" /> Initier une commande
        </button>
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Package className="w-10 h-10 text-obsidian/10 mx-auto mb-3" />
          <p className="text-sm text-obsidian/35 font-body">Aucune commande revendeur</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(order => (
            <OrderRow
              key={order.id}
              order={order}
              onApprove={handleApprove}
              onReject={handleReject}
              approving={approving}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <InitiateResellerOrderModal
            clients={resellerClients}
            products={products}
            onClose={() => setModalOpen(false)}
            onSuccess={() => {
              setModalOpen(false);
              // Recharger les commandes si nécessaire
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}