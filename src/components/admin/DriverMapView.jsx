import React, { useState } from "react";
import { MapPin, Navigation, Truck, CheckCircle2, XCircle, RefreshCw, Phone } from "lucide-react";

// Ouagadougou city zones with coordinates for display
const CITY_ZONES = [
  { name: "Dapoya", x: 47, y: 45 },
  { name: "Gounghin", x: 35, y: 55 },
  { name: "Zogona", x: 58, y: 38 },
  { name: "Pissy", x: 28, y: 62 },
  { name: "Tampouy", x: 55, y: 28 },
  { name: "Nimnin", x: 65, y: 58 },
  { name: "Kamsonghin", x: 40, y: 70 },
  { name: "Bendogo", x: 70, y: 42 },
];

const STATUS_COLOR = {
  disponible: { fill: "#10B981", stroke: "#059669", pulse: true, label: "Disponible" },
  en_livraison: { fill: "#3B82F6", stroke: "#2563EB", pulse: true, label: "En livraison" },
  inactif: { fill: "#6B7280", stroke: "#4B5563", pulse: false, label: "Inactif" },
};

const VEHICLE_EMOJI = { moto: "🏍️", camionnette: "🚐", camion: "🚛", voiture: "🚗" };

// Assign a pseudo-position based on driver id + zone
function getDriverPosition(driver, index) {
  // Use zone name to find a nearby position, or distribute evenly
  const zone = CITY_ZONES.find(z => driver.zone?.toLowerCase().includes(z.name.toLowerCase()));
  if (zone) {
    return {
      x: zone.x + ((index % 3) - 1) * 6,
      y: zone.y + (Math.floor(index / 3) % 3 - 1) * 6,
    };
  }
  // fallback: spread across map
  const spread = [
    { x: 30, y: 40 }, { x: 50, y: 30 }, { x: 65, y: 50 },
    { x: 40, y: 65 }, { x: 72, y: 35 }, { x: 25, y: 55 },
    { x: 58, y: 68 }, { x: 45, y: 48 }, { x: 62, y: 42 },
  ];
  return spread[index % spread.length];
}

function DriverPin({ driver, index, selected, onClick }) {
  const cfg = STATUS_COLOR[driver.status] || STATUS_COLOR.inactif;
  const pos = getDriverPosition(driver, index);

  return (
    <g
      transform={`translate(${pos.x}%, ${pos.y}%)`}
      style={{ cursor: "pointer" }}
      onClick={() => onClick(driver)}
    >
      {/* Pulse ring */}
      {cfg.pulse && (
        <circle
          cx="0" cy="0" r="18"
          fill={cfg.fill}
          fillOpacity="0.15"
          className={driver.status !== "inactif" ? "animate-ping" : ""}
          style={{ transformOrigin: "0 0" }}
        />
      )}
      {/* Main dot */}
      <circle cx="0" cy="0" r="10" fill={cfg.fill} stroke="white" strokeWidth="2.5" />
      {/* Selection ring */}
      {selected && (
        <circle cx="0" cy="0" r="14" fill="none" stroke={cfg.fill} strokeWidth="2" strokeDasharray="4 2" />
      )}
      {/* Initials */}
      <text x="0" y="4" textAnchor="middle" fontSize="7" fill="white" fontWeight="bold" fontFamily="Inter">
        {(driver.first_name || "?").charAt(0)}{(driver.last_name || "").charAt(0)}
      </text>
    </g>
  );
}

export default function DriverMapView({ drivers }) {
  const [selected, setSelected] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const activeDrivers = drivers.filter(d => d.is_active !== false);
  const delivering = activeDrivers.filter(d => d.status === "en_livraison").length;
  const available = activeDrivers.filter(d => d.status === "disponible").length;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gmo-green/10 rounded-xl flex items-center justify-center">
            <Navigation className="w-4 h-4 text-gmo-green" />
          </div>
          <div>
            <h3 className="font-heading text-sm font-bold text-obsidian">Carte de suivi</h3>
            <p className="text-[10px] text-obsidian/40 font-body">Ouagadougou · {activeDrivers.length} chauffeurs</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 text-[10px] font-body">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
              <span className="text-obsidian/50">{delivering} en livraison</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span className="text-obsidian/50">{available} disponibles</span>
            </span>
          </div>
          <button
            onClick={() => setLastRefresh(new Date())}
            className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center text-obsidian/40 hover:text-gmo-green hover:border-gmo-green/30 transition-colors cursor-pointer"
            title="Actualiser"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3">
        {/* SVG Map */}
        <div className="lg:col-span-2 relative bg-[#f0f4f0] overflow-hidden" style={{ minHeight: 340 }}>
          {/* Map background grid — stylized streets */}
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="absolute inset-0">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#d1fae5" strokeWidth="0.3" />
              </pattern>
            </defs>

            {/* City background */}
            <rect width="100" height="100" fill="#f0f4f0" />
            <rect width="100" height="100" fill="url(#grid)" />

            {/* Main roads */}
            <line x1="0" y1="50" x2="100" y2="50" stroke="#d1d5db" strokeWidth="1.2" />
            <line x1="50" y1="0" x2="50" y2="100" stroke="#d1d5db" strokeWidth="1.2" />
            <line x1="0" y1="30" x2="100" y2="70" stroke="#e5e7eb" strokeWidth="0.7" />
            <line x1="0" y1="70" x2="100" y2="30" stroke="#e5e7eb" strokeWidth="0.7" />
            <line x1="20" y1="0" x2="80" y2="100" stroke="#e5e7eb" strokeWidth="0.5" />
            <line x1="80" y1="0" x2="20" y2="100" stroke="#e5e7eb" strokeWidth="0.5" />

            {/* City center marker */}
            <circle cx="50" cy="50" r="4" fill="none" stroke="#1A7A2E" strokeWidth="0.8" strokeDasharray="2 1" />
            <circle cx="50" cy="50" r="1.5" fill="#1A7A2E" fillOpacity="0.4" />

            {/* Zone labels */}
            {CITY_ZONES.map(z => (
              <text key={z.name} x={`${z.x}%`} y={`${z.y}%`} textAnchor="middle" fontSize="3" fill="#9ca3af" fontFamily="Inter">{z.name}</text>
            ))}

            {/* Driver pins — rendered using foreignObject trick via absolute positioned elements */}
            {activeDrivers.map((driver, i) => {
              const pos = getDriverPosition(driver, i);
              const cfg = STATUS_COLOR[driver.status] || STATUS_COLOR.inactif;
              const isSelected = selected?.id === driver.id;
              return (
                <g key={driver.id} style={{ cursor: "pointer" }} onClick={() => setSelected(isSelected ? null : driver)}>
                  {cfg.pulse && (
                    <circle cx={`${pos.x}%`} cy={`${pos.y}%`} r="2.5%" fill={cfg.fill} fillOpacity="0.12" />
                  )}
                  <circle cx={`${pos.x}%`} cy={`${pos.y}%`} r="1.8%" fill={cfg.fill} stroke="white" strokeWidth="0.8" />
                  {isSelected && (
                    <circle cx={`${pos.x}%`} cy={`${pos.y}%`} r="3%" fill="none" stroke={cfg.fill} strokeWidth="0.6" strokeDasharray="1.5 0.8" />
                  )}
                  <text x={`${pos.x}%`} y={`${pos.y + 0.6}%`} textAnchor="middle" fontSize="2" fill="white" fontWeight="bold" fontFamily="Inter">
                    {(driver.first_name || "?").charAt(0)}{(driver.last_name || "").charAt(0)}
                  </text>
                </g>
              );
            })}

            {/* GMO HQ label */}
            <text x="50" y="46" textAnchor="middle" fontSize="2.5" fill="#1A7A2E" fontWeight="bold" fontFamily="Inter">GMO HQ</text>
          </svg>

          {/* Overlay: last update */}
          <div className="absolute bottom-3 left-3 text-[9px] text-obsidian/30 font-body bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-gray-200">
            Mis à jour · {lastRefresh.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
          </div>

          {/* Legend */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 p-2.5 space-y-1.5 shadow-sm">
            {Object.entries(STATUS_COLOR).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: cfg.fill }} />
                <span className="text-[9px] text-obsidian/55 font-body">{cfg.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Driver list panel */}
        <div className="border-t lg:border-t-0 lg:border-l border-gray-100 overflow-y-auto" style={{ maxHeight: 340 }}>
          {activeDrivers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-10 gap-3">
              <Truck className="w-8 h-8 text-obsidian/10" />
              <p className="text-xs text-obsidian/30 font-body">Aucun chauffeur</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {activeDrivers.map((driver, i) => {
                const cfg = STATUS_COLOR[driver.status] || STATUS_COLOR.inactif;
                const isSelected = selected?.id === driver.id;
                return (
                  <button
                    key={driver.id}
                    onClick={() => setSelected(isSelected ? null : driver)}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors cursor-pointer ${isSelected ? "bg-gmo-green/5" : ""}`}
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center font-heading font-bold text-xs text-white flex-shrink-0" style={{ background: cfg.fill }}>
                      {(driver.first_name || "?").charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading text-xs font-bold text-obsidian truncate">{driver.first_name} {driver.last_name}</p>
                      <p className="text-[9px] font-body text-obsidian/40 flex items-center gap-1">
                        <span>{VEHICLE_EMOJI[driver.vehicle_type] || "🚗"}</span>
                        {driver.zone || "Zone non définie"}
                      </p>
                    </div>
                    <span className="text-[9px] font-body px-1.5 py-0.5 rounded-full border flex-shrink-0" style={{ color: cfg.fill, borderColor: cfg.fill + "40", background: cfg.fill + "12" }}>
                      {cfg.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Selected driver detail */}
      {selected && (
        <div className="border-t border-gray-100 px-5 py-4 bg-gray-50/50 flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gmo-green/10 flex items-center justify-center font-heading font-bold text-sm text-gmo-green">
              {(selected.first_name || "?").charAt(0)}
            </div>
            <div>
              <p className="font-heading text-sm font-bold text-obsidian">{selected.first_name} {selected.last_name}</p>
              <p className="text-[10px] text-obsidian/40 font-body">{selected.vehicle_plate || "Plaque non renseignée"} · {selected.vehicle_type}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            {selected.phone && (
              <a href={`tel:${selected.phone}`} className="flex items-center gap-1.5 bg-gmo-green text-white text-xs font-heading font-bold px-3 py-1.5 rounded-lg hover:bg-gmo-green/90 transition-colors cursor-pointer">
                <Phone className="w-3.5 h-3.5" /> {selected.phone}
              </a>
            )}
            <button onClick={() => setSelected(null)} className="text-obsidian/30 hover:text-obsidian text-xs font-body cursor-pointer">✕ Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}