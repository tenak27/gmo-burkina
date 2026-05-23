import React, { useMemo } from "react";
import Chart from "react-apexcharts";

const MONTHS = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];

const ORDER_STATUS_LABELS = {
  en_attente: "En attente",
  confirmee: "Confirmée",
  en_preparation: "En préparation",
  en_livraison: "En livraison",
  livree: "Livrée",
  annulee: "Annulée",
};
const ORDER_STATUS_COLORS = ["#F59E0B","#3B82F6","#8B5CF6","#1A7A2E","#10B981","#EF4444"];

export default function StatsChartsPanel({ orders, movements }) {
  // Orders per day (last 14 days)
  const ordersPerDay = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date(now); d.setDate(now.getDate() - 13 + i);
      const label = `${d.getDate()}/${d.getMonth()+1}`;
      const count = (orders || []).filter(o => {
        const od = new Date(o.created_date);
        return od.toDateString() === d.toDateString();
      }).length;
      return { label, count };
    });
  }, [orders]);

  // Order status distribution
  const orderStatusData = useMemo(() => {
    const counts = {};
    (orders || []).forEach(o => { counts[o.status] = (counts[o.status] || 0) + 1; });
    return Object.entries(counts).map(([k, v], i) => ({
      name: ORDER_STATUS_LABELS[k] || k, value: v, color: ORDER_STATUS_COLORS[i % ORDER_STATUS_COLORS.length]
    }));
  }, [orders]);

  // Stock movements per month (last 6 months) — entrée vs sortie
  const stockByMonth = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      const m = d.getMonth(); const y = d.getFullYear();
      const entries = (movements || []).filter(mv => {
        const md = new Date(mv.date || mv.created_date);
        return md.getMonth() === m && md.getFullYear() === y && mv.type === "entree";
      }).reduce((s, mv) => s + (mv.quantity || 0), 0);
      const exits = (movements || []).filter(mv => {
        const md = new Date(mv.date || mv.created_date);
        return md.getMonth() === m && md.getFullYear() === y && mv.type === "sortie";
      }).reduce((s, mv) => s + (mv.quantity || 0), 0);
      return { month: MONTHS[m], entries, exits };
    });
  }, [movements]);

  // Charts config
  const ordersDayChart = {
    series: [{ name: "Commandes", data: ordersPerDay.map(d => d.count) }],
    options: {
      chart: { type: "bar", toolbar: { show: false } },
      colors: ["#1A7A2E"],
      plotOptions: { bar: { borderRadius: 4, columnWidth: "55%" } },
      xaxis: {
        categories: ordersPerDay.map(d => d.label),
        labels: { style: { fontSize: "10px", colors: "#9CA3AF" } },
        axisBorder: { show: false }, axisTicks: { show: false }
      },
      yaxis: { labels: { style: { fontSize: "10px", colors: "#9CA3AF" } } },
      grid: { borderColor: "#F3F4F6" },
      dataLabels: { enabled: false },
      tooltip: { y: { formatter: v => `${v} commande(s)` } }
    }
  };

  const ordersStatusChart = {
    series: orderStatusData.map(d => d.value),
    options: {
      chart: { type: "donut" },
      colors: orderStatusData.map(d => d.color),
      labels: orderStatusData.map(d => d.name),
      legend: { position: "bottom", fontSize: "11px", fontFamily: "Inter, sans-serif" },
      plotOptions: { pie: { donut: { size: "60%", labels: { show: true, total: { show: true, label: "Total", fontSize: "12px" } } } } },
      dataLabels: { enabled: false },
      tooltip: { y: { formatter: v => `${v} commande(s)` } }
    }
  };

  const stockChart = {
    series: [
      { name: "Entrées", data: stockByMonth.map(d => d.entries) },
      { name: "Sorties", data: stockByMonth.map(d => d.exits) }
    ],
    options: {
      chart: { type: "bar", toolbar: { show: false } },
      colors: ["#10B981", "#EF4444"],
      plotOptions: { bar: { borderRadius: 3, columnWidth: "60%", grouped: true } },
      xaxis: {
        categories: stockByMonth.map(d => d.month),
        labels: { style: { fontSize: "10px", colors: "#9CA3AF" } },
        axisBorder: { show: false }, axisTicks: { show: false }
      },
      yaxis: { labels: { style: { fontSize: "10px", colors: "#9CA3AF" } } },
      grid: { borderColor: "#F3F4F6" },
      dataLabels: { enabled: false },
      legend: { position: "top", horizontalAlign: "left", fontSize: "11px" },
      tooltip: { y: { formatter: v => `${v} unités` } }
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-heading text-xl font-bold text-gray-900">Statistiques en temps réel</h2>
        <p className="text-xs text-gray-500 mt-0.5">Commandes et mouvements de stock</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Orders per day */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <h3 className="font-heading text-sm font-bold text-gray-900 mb-1">Commandes — 14 derniers jours</h3>
          <p className="text-xs text-gray-400 mb-3">Volume journalier</p>
          <Chart type="bar" series={ordersDayChart.series} options={ordersDayChart.options} height={200} />
        </div>

        {/* Status donut */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <h3 className="font-heading text-sm font-bold text-gray-900 mb-1">Répartition statuts</h3>
          <p className="text-xs text-gray-400 mb-3">{(orders||[]).length} commandes</p>
          {orderStatusData.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-xs text-gray-400">Aucune donnée</div>
          ) : (
            <Chart type="donut" series={ordersStatusChart.series} options={ordersStatusChart.options} height={220} />
          )}
        </div>
      </div>

      {/* Stock movements */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
        <h3 className="font-heading text-sm font-bold text-gray-900 mb-1">Mouvements de stock — 6 derniers mois</h3>
        <p className="text-xs text-gray-400 mb-3">Entrées vs Sorties (unités)</p>
        <Chart type="bar" series={stockChart.series} options={stockChart.options} height={200} />
      </div>
    </div>
  );
}