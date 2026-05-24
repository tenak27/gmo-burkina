import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Users2, Mail, Phone, FileText, ExternalLink, CheckCircle2, XCircle, Clock, Eye, MoreHorizontal, Briefcase } from "lucide-react";

const STATUS_CONFIG = {
  nouveau: { label: "Nouveau", color: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
  en_cours: { label: "En cours", color: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
  entretien: { label: "Entretien", color: "bg-purple-100 text-purple-700", dot: "bg-purple-500" },
  refuse: { label: "Refusé", color: "bg-red-100 text-red-700", dot: "bg-red-500" },
  accepte: { label: "Accepté", color: "bg-green-100 text-green-700", dot: "bg-green-500" },
};

function ApplicationCard({ app, onStatusChange }) {
  const [open, setOpen] = useState(false);
  const s = STATUS_CONFIG[app.status] || STATUS_CONFIG.nouveau;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <p className="font-heading font-bold text-sm text-gray-900">{app.name}</p>
            {app.is_spontaneous && (
              <span className="text-[9px] uppercase tracking-widest bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Spontanée</span>
            )}
          </div>
          <p className="text-xs text-gmo-green font-semibold truncate">{app.job_title || "Candidature spontanée"}</p>
          {app.department && <p className="text-xs text-gray-400">{app.department}</p>}
        </div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 ${s.color}`}>{s.label}</span>
      </div>

      <div className="flex gap-3 text-xs text-gray-500 mb-3">
        <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{app.email}</span>
        <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{app.phone}</span>
      </div>

      {app.message && (
        <p className="text-xs text-gray-600 bg-gray-50 rounded p-2 mb-3 line-clamp-2">{app.message}</p>
      )}

      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-1">
          {app.cv_url && (
            <a href={app.cv_url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 border border-blue-200 bg-blue-50 px-2 py-1 rounded transition-colors">
              <FileText className="w-3 h-3" /> CV
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
          <p className="text-[10px] text-gray-400 self-center ml-1">
            {app.created_date ? new Date(app.created_date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }) : ""}
          </p>
        </div>
        <select
          value={app.status || "nouveau"}
          onChange={e => onStatusChange(app.id, e.target.value)}
          className="text-xs border border-gray-200 rounded px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-gmo-green/30"
        >
          {Object.entries(STATUS_CONFIG).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default function ApplicationsTab({ applications, setApplications }) {
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (id, status) => {
    await base44.entities.Application.update(id, { status });
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const counts = {
    all: applications.length,
    nouveau: applications.filter(a => a.status === "nouveau").length,
    en_cours: applications.filter(a => a.status === "en_cours").length,
    entretien: applications.filter(a => a.status === "entretien").length,
    refuse: applications.filter(a => a.status === "refuse").length,
    accepte: applications.filter(a => a.status === "accepte").length,
  };

  const filtered = filter === "all" ? applications : applications.filter(a => a.status === filter);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold text-gray-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-gmo-green" /> Candidatures RH
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">{applications.length} candidature(s) reçue(s)</p>
        </div>
      </div>

      {/* KPI bar */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
        {[
          { key: "all", label: "Toutes", grad: "from-slate-400 to-slate-500" },
          { key: "nouveau", label: "Nouvelles", grad: "from-blue-500 to-indigo-600" },
          { key: "en_cours", label: "En cours", grad: "from-orange-400 to-amber-500" },
          { key: "entretien", label: "Entretien", grad: "from-violet-500 to-purple-600" },
          { key: "refuse", label: "Refusés", grad: "from-red-500 to-rose-600" },
          { key: "accepte", label: "Acceptés", grad: "from-green-500 to-emerald-600" },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`bg-gradient-to-br ${f.grad} rounded-xl p-3 text-center cursor-pointer transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 relative overflow-hidden ${filter === f.key ? "ring-2 ring-white/40 shadow-lg" : "opacity-80 hover:opacity-100"}`}>
            <div className="absolute top-0 right-1 text-white/15 text-2xl select-none pointer-events-none">○</div>
            <p className="font-heading text-xl font-bold text-white">{counts[f.key]}</p>
            <p className="text-[10px] font-body text-white/80">{f.label}</p>
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-body text-sm">Aucune candidature</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map(app => (
            <ApplicationCard key={app.id} app={app} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}
    </div>
  );
}