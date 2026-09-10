import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, MapPin, TrendingUp, Calendar, Users, Store, Activity, BarChart3 } from "lucide-react";
import { base44 } from "@/api/base44Client";

function fmtDuration(s) {
  if (!s) return "—";
  const m = Math.floor(s / 60);
  const sec = s % 60;
  if (m >= 60) return `${Math.floor(m / 60)}h ${m % 60}min`;
  if (m > 0) return `${m}min ${sec}s`;
  return `${sec}s`;
}

export default function Performances() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("7"); // jours
  const [groupBy, setGroupBy] = useState("vendeur"); // vendeur | pdv

  useEffect(() => {
    (async () => {
      try {
        const data = await base44.entities.PdvVisit.filter(
          { status: "termine" },
          "-arrival_time",
          1000
        );
        setVisits(data || []);
      } catch {
        setVisits([]);
      }
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const days = parseInt(period);
    if (days <= 0) return visits;
    const limit = Date.now() - days * 24 * 60 * 60 * 1000;
    return visits.filter((v) => new Date(v.arrival_time).getTime() >= limit);
  }, [visits, period]);

  const stats = useMemo(() => {
    const groups = {};
    filtered.forEach((v) => {
      const key = groupBy === "vendeur" ? v.vendeur_nom || v.vendeur_id : v.pdv_nom || v.pdv_id;
      if (!groups[key]) {
        groups[key] = { name: key, count: 0, totalSeconds: 0, visits: [] };
      }
      groups[key].count += 1;
      groups[key].totalSeconds += v.duration_seconds || 0;
      groups[key].visits.push(v);
    });
    return Object.values(groups).sort((a, b) => b.totalSeconds - a.totalSeconds);
  }, [filtered, groupBy]);

  const totals = useMemo(() => {
    const totalSeconds = filtered.reduce((sum, v) => sum + (v.duration_seconds || 0), 0);
    const uniqueVendeurs = new Set(filtered.map((v) => v.vendeur_id).filter(Boolean)).size;
    const uniquePdvs = new Set(filtered.map((v) => v.pdv_id).filter(Boolean)).size;
    const avg = filtered.length ? totalSeconds / filtered.length : 0;
    return { totalSeconds, uniqueVendeurs, uniquePdvs, count: filtered.length, avg };
  }, [filtered]);

  const maxTotal = Math.max(1, ...stats.map((s) => s.totalSeconds));

  if (loading) {
    return (
      <div className="min-h-screen bg-concrete pt-20 flex items-center justify-center">
        <div className="text-obsidian/40 text-sm font-body">Chargement des statistiques…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-concrete pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <span className="font-body text-xs uppercase tracking-[0.3em] text-gmo-red block mb-2">
            Tableau de bord
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-obsidian mb-1">
            Performances Vendeurs Ambulants
          </h1>
          <p className="font-body text-sm text-obsidian/60">
            Temps passé dans les points de vente — statistiques de passage.
          </p>
        </motion.div>

        {/* Filtres */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-3 py-2">
            <Calendar className="w-4 h-4 text-obsidian/40" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="text-sm font-body text-obsidian bg-transparent focus:outline-none"
            >
              <option value="1">Aujourd'hui</option>
              <option value="7">7 jours</option>
              <option value="30">30 jours</option>
              <option value="90">90 jours</option>
              <option value="0">Tout l'historique</option>
            </select>
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-3 py-2">
            <BarChart3 className="w-4 h-4 text-obsidian/40" />
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="text-sm font-body text-obsidian bg-transparent focus:outline-none"
            >
              <option value="vendeur">Par vendeur</option>
              <option value="pdv">Par point de vente</option>
            </select>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { icon: Clock, label: "Temps total", value: fmtDuration(totals.totalSeconds), color: "text-gmo-green", bg: "bg-gmo-green/10" },
            { icon: Activity, label: "Passages", value: totals.count, color: "text-gmo-red", bg: "bg-gmo-red/10" },
            { icon: Users, label: "Vendeurs", value: totals.uniqueVendeurs, color: "text-obsidian", bg: "bg-gray-100" },
            { icon: Store, label: "PDV visités", value: totals.uniquePdvs, color: "text-amber-600", bg: "bg-amber-50" },
          ].map((k, i) => (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 p-4"
            >
              <div className={`w-9 h-9 rounded-xl ${k.bg} flex items-center justify-center mb-2`}>
                <k.icon className={`w-4 h-4 ${k.color}`} />
              </div>
              <p className="font-heading text-xl font-black text-obsidian leading-tight">{k.value}</p>
              <p className="text-[11px] uppercase tracking-widest font-heading text-obsidian/40">{k.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Durée moyenne */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gmo-green/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-gmo-green" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-widest font-heading text-obsidian/40">Durée moyenne / passage</p>
              <p className="font-heading text-lg font-bold text-obsidian">{fmtDuration(totals.avg)}</p>
            </div>
          </div>
          <p className="text-xs text-obsidian/40 font-body hidden sm:block">
            Sur {totals.count} passage{totals.count > 1 ? "s" : ""}
          </p>
        </div>

        {/* Ranking */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-heading text-sm font-bold text-obsidian mb-4">
            Classement {groupBy === "vendeur" ? "des vendeurs" : "des points de vente"}
          </h3>
          {stats.length === 0 ? (
            <p className="text-sm text-obsidian/40 font-body py-8 text-center">
              Aucune donnée sur la période sélectionnée.
            </p>
          ) : (
            <div className="space-y-3">
              {stats.map((s, i) => (
                <div key={s.name} className="">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-obsidian/5 flex items-center justify-center text-[11px] font-heading font-bold text-obsidian/60">
                        {i + 1}
                      </span>
                      <span className="text-sm font-heading font-bold text-obsidian">{s.name}</span>
                      <span className="text-[11px] text-obsidian/40 font-body">· {s.count} passage{s.count > 1 ? "s" : ""}</span>
                    </div>
                    <span className="text-sm font-heading font-bold text-gmo-green">{fmtDuration(s.totalSeconds)}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden ml-8">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(s.totalSeconds / maxTotal) * 100}%` }}
                      transition={{ duration: 0.6, delay: i * 0.05 }}
                      className="h-full bg-gradient-to-r from-gmo-green/70 to-gmo-green rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <a href="/pointage" className="text-xs font-heading font-bold text-gmo-green hover:underline">
            ← Retour au pointage
          </a>
        </div>
      </div>
    </div>
  );
}