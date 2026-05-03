import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import EntityTable from "./EntityTable";

const STATUS_LABELS = { en_attente: "En attente", confirmee: "Confirmée", en_preparation: "En prép.", en_livraison: "En livraison", livree: "Livrée", annulee: "Annulée" };
const STATUS_STYLE = {
  en_attente: "bg-amber-50 text-amber-600 border border-amber-200",
  confirmee: "bg-blue-50 text-blue-600 border border-blue-200",
  en_preparation: "bg-purple-50 text-purple-600 border border-purple-200",
  en_livraison: "bg-green-50 text-gmo-green border border-green-200",
  livree: "bg-green-100 text-green-700 border border-green-300",
  annulee: "bg-red-50 text-red-600 border border-red-200",
};

export default function OrdersAdminTab({ orders, setOrders }) {
  const updateStatus = async (order, status) => {
    await base44.entities.Order.update(order.id, { status });
    setOrders(prev => prev.map(o => o.id === order.id ? {...o, status} : o));
  };

  const COLUMNS = [
    { key: "order_number", label: "N° Commande", render: (v, r) => <div><p className="font-heading text-xs font-bold text-obsidian">{v || `CMD-${r.id?.slice(-6)}`}</p><span className={`text-[9px] px-1.5 py-0.5 rounded font-body ${r.client_type === "detaillant" ? "bg-gmo-red/10 text-gmo-red" : "bg-gray-100 text-obsidian/40"}`}>{r.client_type || "client"}</span></div> },
    { key: "client_name", label: "Client", render: (v, r) => <div><p className="text-xs text-obsidian/70 font-body">{v || "—"}</p><p className="text-[10px] text-obsidian/35 font-body">{r.client_email}</p></div> },
    { key: "created_date", label: "Date", render: v => <span className="text-xs text-obsidian/50 font-body">{v ? new Date(v).toLocaleDateString("fr-FR") : "—"}</span> },
    { key: "total_amount", label: "Montant", align: "right", render: v => v ? <span className="font-heading text-xs font-bold text-obsidian">{Number(v).toLocaleString()} FCFA</span> : <span className="text-obsidian/25">—</span> },
    { key: "status", label: "Statut", align: "center", render: v => <span className={`text-[10px] px-2 py-0.5 rounded-full font-body ${STATUS_STYLE[v] || ""}`}>{STATUS_LABELS[v] || v}</span> },
    { key: "status", label: "Changer statut", align: "center", render: (v, r) => (
      <select value={v} onChange={e => updateStatus(r, e.target.value)}
        className="text-[10px] font-body text-obsidian/60 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-gmo-green cursor-pointer">
        {Object.entries(STATUS_LABELS).map(([k, lbl]) => <option key={k} value={k}>{lbl}</option>)}
      </select>
    )},
  ];

  const pending = orders.filter(o => o.status === "en_attente").length;
  const delivered = orders.filter(o => o.status === "livree").length;
  const revenue = orders.filter(o => o.status === "livree").reduce((s,o) => s+(o.total_amount||0), 0);

  return (
    <>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: "En attente", value: pending, color: "text-amber-600" },
          { label: "Livrées", value: delivered, color: "text-green-600" },
          { label: "CA livré", value: `${(revenue/1000).toFixed(0)}k FCFA`, color: "text-gmo-green" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <p className={`font-heading text-lg font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-obsidian/40 font-body">{s.label}</p>
          </div>
        ))}
      </div>
      <EntityTable title="Commandes clients" subtitle={`${orders.length} commandes · temps réel`} columns={COLUMNS} rows={orders} loading={false} />
    </>
  );
}