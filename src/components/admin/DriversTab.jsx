import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import EntityTable from "./EntityTable";
import EntityForm from "./EntityForm";
import { Truck, Phone, MapPin, CheckCircle2, Clock, XCircle } from "lucide-react";

const STATUS_STYLE = {
  disponible: "bg-green-50 text-green-700 border border-green-200",
  en_livraison: "bg-blue-50 text-blue-600 border border-blue-200",
  inactif: "bg-gray-100 text-obsidian/40",
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

const COLUMNS = [
  { key: "first_name", label: "Chauffeur", render: (v, r) => (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-full bg-obsidian/5 flex items-center justify-center text-obsidian/50 font-heading font-bold text-sm flex-shrink-0">
        {(v||"?").charAt(0)}{(r.last_name||"").charAt(0)}
      </div>
      <div>
        <p className="font-heading text-xs font-bold text-obsidian">{v} {r.last_name}</p>
        <p className="text-[10px] text-obsidian/40 font-body flex items-center gap-1">
          <Phone className="w-2.5 h-2.5" />{r.phone}
        </p>
      </div>
    </div>
  )},
  { key: "vehicle_type", label: "Véhicule", render: (v, r) => (
    <div>
      <p className="text-xs font-body text-obsidian/70 capitalize">{({moto:"🏍️ Moto",camionnette:"🚐 Camionnette",camion:"🚛 Camion",voiture:"🚗 Voiture"})[v]||v}</p>
      {r.vehicle_plate && <p className="text-[10px] text-obsidian/35 font-body">{r.vehicle_plate}</p>}
    </div>
  )},
  { key: "zone", label: "Zone", render: v => v ? (
    <span className="flex items-center gap-1 text-xs text-obsidian/60 font-body"><MapPin className="w-3 h-3" />{v}</span>
  ) : <span className="text-obsidian/20">—</span> },
  { key: "status", label: "Statut", align: "center", render: v => (
    <span className={`text-[10px] px-2.5 py-1 rounded-full font-body ${STATUS_STYLE[v]||""}`}>
      {({disponible:"Disponible",en_livraison:"En livraison",inactif:"Inactif"})[v]||v}
    </span>
  )},
];

const EMPTY = { first_name:"", last_name:"", phone:"", vehicle_type:"moto", vehicle_plate:"", zone:"", status:"disponible", notes:"", is_active:true };

export default function DriversTab({ drivers, setDrivers }) {
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

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

  const available = drivers.filter(d => d.status === "disponible").length;
  const busy = drivers.filter(d => d.status === "en_livraison").length;

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Disponibles", value: available, color: "text-green-600", bg: "bg-green-50", border: "border-green-200", icon: CheckCircle2 },
          { label: "En livraison", value: busy, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", icon: Truck },
          { label: "Total chauffeurs", value: drivers.filter(d => d.is_active !== false).length, color: "text-obsidian/70", bg: "bg-gray-50", border: "border-gray-200", icon: Clock },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4 flex items-center gap-3`}>
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div>
              <p className={`font-heading text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-obsidian/40 font-body">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
      <EntityTable
        title="Chauffeurs livreurs"
        subtitle={`${drivers.length} chauffeurs enregistrés`}
        columns={COLUMNS} rows={drivers}
        onAdd={openAdd} onEdit={openEdit} onDelete={del}
        addLabel="Nouveau chauffeur"
      />
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