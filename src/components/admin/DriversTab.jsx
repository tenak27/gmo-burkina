import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import EntityForm from "./EntityForm";
import DriverMapView from "./DriverMapView";
import {
  Truck, Phone, MapPin, CheckCircle2, Clock, XCircle,
  Plus, Edit2, Trash2, Zap, Navigation, Map
} from "lucide-react";

const STATUS_CONFIG = {
  disponible: {
    label: "Disponible",
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-400",
    glow: "",
    ring: "ring-emerald-200",
    icon: CheckCircle2,
  },
  en_livraison: {
    label: "En livraison",
    badge: "bg-blue-50 text-blue-700 border border-blue-200",
    dot: "bg-blue-500",
    glow: "",
    ring: "ring-blue-200",
    icon: Truck,
  },
  inactif: {
    label: "Inactif",
    badge: "bg-gray-100 text-gray-500 border border-gray-200",
    dot: "bg-gray-400",
    glow: "",
    ring: "ring-gray-200",
    icon: XCircle,
  },
};

const VEHICLE_ICONS = {
  moto: "🏍️", camionnette: "🚐", camion: "🚛", voiture: "🚗"
};

const FIELDS = [
  { key: "first_name", label: "Prénom", required: true },
  { key: "last_name", label: "Nom", required: true },
  { key: "phone", label: "Téléphone", required: true },
  { key: "vehicle_type", label: "Type de véhicule", type: "select", options: [
    {value:"moto",label:"Moto"},{value:"camionnette",label:"Camionnette"},
    {value:"camion",label:"Camion"},{value:"voiture",label:"Voiture"}
  ]},
  { key: "vehicle_plate", label: "Plaque d'immatriculation" },
  { key: "zone", label: "Zone de livraison" },
  { key: "status", label: "Statut", type: "select", options: [
    {value:"disponible",label:"Disponible"},{value:"en_livraison",label:"En livraison"},{value:"inactif",label:"Inactif"}
  ]},
  { key: "notes", label: "Notes", type: "textarea" },
  { key: "is_active", label: "Actif", type: "checkbox" },
];

const EMPTY = { first_name:"", last_name:"", phone:"", vehicle_type:"moto", vehicle_plate:"", zone:"", status:"disponible", notes:"", is_active:true };

function DriverCard({ driver, onEdit, onDelete, onStatusChange }) {
  const cfg = STATUS_CONFIG[driver.status] || STATUS_CONFIG.inactif;
  const Icon = cfg.icon;
  const [changing, setChanging] = useState(false);

  const changeStatus = async (newStatus) => {
    setChanging(true);
    await onStatusChange(driver, newStatus);
    setChanging(false);
  };

  const nextStatuses = Object.keys(STATUS_CONFIG).filter(s => s !== driver.status);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col gap-3 hover:shadow-md hover:border-gray-200 transition-all duration-200 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ring-2 ${cfg.ring} flex items-center justify-center font-heading font-bold text-sm text-white flex-shrink-0`}
            style={{ background: driver.status === "disponible" ? "#10B981" : driver.status === "en_livraison" ? "#3B82F6" : "#9CA3AF" }}>
            {(driver.first_name||"?").charAt(0)}{(driver.last_name||"").charAt(0)}
          </div>
          <div>
            <p className="font-heading text-sm font-bold text-obsidian">{driver.first_name} {driver.last_name}</p>
            <p className="text-[10px] text-obsidian/50 font-body flex items-center gap-1">
              <Phone className="w-2.5 h-2.5" />{driver.phone}
            </p>
          </div>
        </div>
        <span className={`flex items-center gap-1.5 text-[10px] font-body px-2.5 py-1 rounded-full flex-shrink-0 ${cfg.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
          {cfg.label}
        </span>
      </div>

      {/* Vehicle + Zone */}
      <div className="flex items-center gap-2 flex-wrap text-[11px] font-body">
        <span className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg text-obsidian/60">
          <span>{VEHICLE_ICONS[driver.vehicle_type] || "🚗"}</span>
          <span className="capitalize">{driver.vehicle_type}</span>
          {driver.vehicle_plate && <span className="text-obsidian/35 font-mono">· {driver.vehicle_plate}</span>}
        </span>
        {driver.zone && (
          <span className="flex items-center gap-1 text-obsidian/45">
            <MapPin className="w-3 h-3" />{driver.zone}
          </span>
        )}
      </div>

      {/* Quick status changer */}
      <div className="flex items-center gap-1.5">
        {nextStatuses.map(s => {
          const c = STATUS_CONFIG[s];
          return (
            <button
              key={s}
              onClick={() => changeStatus(s)}
              disabled={changing}
              className="flex-1 text-[9px] font-body uppercase tracking-wider border border-gray-200 hover:border-gmo-green hover:text-gmo-green text-obsidian/40 py-1.5 rounded-lg transition-all duration-150 disabled:opacity-40 cursor-pointer"
            >
              → {c.label}
            </button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-100">
        {driver.notes ? (
          <p className="text-[10px] text-obsidian/35 font-body truncate flex-1 mr-2 italic">{driver.notes}</p>
        ) : <span />}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={() => onEdit(driver)} className="w-7 h-7 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-obsidian/40 hover:text-obsidian transition-all cursor-pointer">
            <Edit2 className="w-3 h-3" />
          </button>
          <button onClick={() => onDelete(driver)} className="w-7 h-7 rounded-lg bg-gray-50 hover:bg-red-50 flex items-center justify-center text-obsidian/40 hover:text-gmo-red transition-all cursor-pointer">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DriversTab({ drivers, setDrivers }) {
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("all");
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Real-time subscription
  useEffect(() => {
    const unsub = base44.entities.Driver.subscribe(event => {
      setDrivers(prev => {
        if (event.type === "create") return [event.data, ...prev];
        if (event.type === "update") return prev.map(d => d.id === event.id ? event.data : d);
        if (event.type === "delete") return prev.filter(d => d.id !== event.id);
        return prev;
      });
      setLastUpdate(new Date());
    });
    return unsub;
  }, []);

  const openAdd = () => { setEditing(null); setForm({...EMPTY}); };
  const openEdit = r => { setEditing(r); setForm({...r}); };
  const onChange = (k, v) => setForm(f => ({...f, [k]: v}));

  const save = async () => {
    if (!form?.first_name || !form?.phone) return;
    setSaving(true);
    if (editing) {
      await base44.entities.Driver.update(editing.id, form);
      setDrivers(prev => prev.map(d => d.id === editing.id ? {...d, ...form} : d));
    } else {
      const r = await base44.entities.Driver.create(form);
      setDrivers(prev => [r, ...prev]);
    }
    setSaving(false); setForm(null); setEditing(null);
  };

  const del = async r => {
    if (!confirm(`Supprimer ${r.first_name} ${r.last_name} ?`)) return;
    await base44.entities.Driver.delete(r.id);
    setDrivers(prev => prev.filter(d => d.id !== r.id));
  };

  const handleStatusChange = async (driver, newStatus) => {
    await base44.entities.Driver.update(driver.id, { status: newStatus });
    setDrivers(prev => prev.map(d => d.id === driver.id ? {...d, status: newStatus} : d));
  };

  const available = drivers.filter(d => d.status === "disponible").length;
  const busy = drivers.filter(d => d.status === "en_livraison").length;
  const inactive = drivers.filter(d => d.status === "inactif").length;

  const filtered = filter === "all" ? drivers : drivers.filter(d => d.status === filter);

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-obsidian">Chauffeurs-Livreurs</h2>
          <p className="text-sm text-obsidian/40 font-body mt-0.5">{drivers.length} chauffeur(s) · mis à jour {lastUpdate.toLocaleTimeString("fr-FR", {hour:"2-digit",minute:"2-digit"})}</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-gmo-green text-white font-heading font-bold text-sm px-5 py-2.5 rounded-xl btn-glow-green cursor-pointer">
          <Plus className="w-4 h-4" /> Nouveau chauffeur
        </button>
      </div>

      {/* KPI bar */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Disponibles", value: available, grad: "from-green-500 to-emerald-600", status: "disponible" },
          { label: "En livraison", value: busy, grad: "from-blue-500 to-indigo-600", status: "en_livraison" },
          { label: "Inactifs", value: inactive, grad: "from-slate-400 to-slate-500", status: "inactif" },
        ].map(s => (
          <button key={s.label} onClick={() => setFilter(filter === s.status ? "all" : s.status)}
            className={`bg-gradient-to-br ${s.grad} rounded-2xl p-4 flex items-center gap-3 shadow-md cursor-pointer transition-all hover:opacity-90 relative overflow-hidden ${filter === s.status ? "ring-2 ring-white/40" : ""}`}>
            <div className="absolute top-1 right-2 text-white/20 text-3xl select-none pointer-events-none">○</div>
            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="w-3 h-3 rounded-full bg-white" />
            </div>
            <div>
              <p className="font-heading text-xl font-bold text-white">{s.value}</p>
              <p className="text-[10px] text-white/70 font-body">{s.label}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Map */}
      <DriverMapView drivers={drivers} />

      {/* Filter pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {["all", "disponible", "en_livraison", "inactif"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-[11px] font-body px-3 py-1.5 rounded-full border transition-all ${
              filter === f
                ? "bg-gmo-green text-white border-gmo-green shadow-sm shadow-gmo-green/25"
                : "border-gray-200 text-obsidian/50 hover:border-gmo-green/40 hover:text-gmo-green"
            }`}>
            {f === "all" ? `Tous (${drivers.length})` : `${STATUS_CONFIG[f].label} (${drivers.filter(d=>d.status===f).length})`}
          </button>
        ))}
        <span className="ml-auto text-[10px] text-obsidian/30 font-body flex items-center gap-1">
          <Zap className="w-3 h-3 text-gmo-green/40" /> Temps réel actif
        </span>
      </div>

      {/* Driver grid */}
      {filtered.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-12 text-center">
          <Truck className="w-10 h-10 text-obsidian/10 mx-auto mb-3" />
          <p className="text-sm text-obsidian/35 font-body">Aucun chauffeur dans cette catégorie</p>
          <button onClick={openAdd} className="mt-4 text-xs text-gmo-green font-body hover:underline cursor-pointer">+ Ajouter un chauffeur</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(d => (
            <DriverCard
              key={d.id}
              driver={d}
              onEdit={openEdit}
              onDelete={del}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {form && (
        <EntityForm
          title="Chauffeur livreur" fields={FIELDS} data={form} onChange={onChange}
          onSave={save} onClose={() => { setForm(null); setEditing(null); }}
          saving={saving} isEdit={!!editing}
        />
      )}
    </div>
  );
}