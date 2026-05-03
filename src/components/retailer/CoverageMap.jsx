import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Truck, Clock, Phone, Navigation, Info } from "lucide-react";

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const createIcon = (color, size = 32) => L.divIcon({
  html: `<div style="width:${size}px;height:${size}px;border-radius:50% 50% 50% 0;background:${color};transform:rotate(-45deg);border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
  iconSize: [size, size],
  iconAnchor: [size / 2, size],
  popupAnchor: [0, -size],
  className: "",
});

const DEPOT_ICON = L.divIcon({
  html: `<div style="width:40px;height:40px;border-radius:8px;background:#1A7A2E;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 3px 12px rgba(26,122,46,0.5)"><span style="font-size:18px">🏭</span></div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -22],
  className: "",
});

// GMO delivery zones — Burkina Faso
const ZONES = [
  {
    id: "ouaga",
    name: "Ouagadougou",
    lat: 12.3647, lng: -1.5332,
    status: "actif",
    delay: "24h–48h",
    radius: 25000,
    color: "#1A7A2E",
    fillColor: "#1A7A2E",
    desc: "Zone principale — livraison quotidienne",
    phone: "+226 25 33 19 00",
    frequency: "Tous les jours",
  },
  {
    id: "bobo",
    name: "Bobo-Dioulasso",
    lat: 11.1771, lng: -4.2979,
    status: "actif",
    delay: "48h–72h",
    radius: 20000,
    color: "#1A7A2E",
    fillColor: "#1A7A2E",
    desc: "2e ville — 2 tournées par semaine",
    phone: "+226 20 97 XX XX",
    frequency: "Mardi & Vendredi",
  },
  {
    id: "koudougou",
    name: "Koudougou",
    lat: 12.2528, lng: -2.3622,
    status: "actif",
    delay: "48h",
    radius: 12000,
    color: "#1A7A2E",
    fillColor: "#1A7A2E",
    desc: "Tournée hebdomadaire",
    phone: "+226 25 33 19 00",
    frequency: "Mercredi",
  },
  {
    id: "ouahigouya",
    name: "Ouahigouya",
    lat: 13.5730, lng: -2.4216,
    status: "actif",
    delay: "72h",
    radius: 10000,
    color: "#1A7A2E",
    fillColor: "#1A7A2E",
    desc: "Nord Burkina",
    phone: "+226 25 33 19 00",
    frequency: "Jeudi",
  },
  {
    id: "banfora",
    name: "Banfora",
    lat: 10.6336, lng: -4.7588,
    status: "actif",
    delay: "72h",
    radius: 10000,
    color: "#1A7A2E",
    fillColor: "#1A7A2E",
    desc: "Sud-Ouest",
    phone: "+226 25 33 19 00",
    frequency: "Vendredi",
  },
  {
    id: "dedougou",
    name: "Dédougou",
    lat: 12.4623, lng: -3.4611,
    status: "actif",
    delay: "72h",
    radius: 8000,
    color: "#1A7A2E",
    fillColor: "#1A7A2E",
    desc: "Boucle du Mouhoun",
    phone: "+226 25 33 19 00",
    frequency: "Lundi",
  },
  {
    id: "fada",
    name: "Fada N'Gourma",
    lat: 12.0601, lng: 0.3499,
    status: "actif",
    delay: "72h",
    radius: 9000,
    color: "#1A7A2E",
    fillColor: "#1A7A2E",
    desc: "Est Burkina",
    phone: "+226 25 33 19 00",
    frequency: "Mardi",
  },
  {
    id: "tenkodogo",
    name: "Tenkodogo",
    lat: 11.7797, lng: -0.3696,
    status: "partiel",
    delay: "5–7 jours",
    radius: 8000,
    color: "#F5C400",
    fillColor: "#F5C400",
    desc: "Centre-Est — livraison sur demande",
    phone: "+226 25 33 19 00",
    frequency: "Sur demande",
  },
  {
    id: "diebougou",
    name: "Diébougou",
    lat: 10.9600, lng: -3.2500,
    status: "partiel",
    delay: "5–7 jours",
    radius: 7000,
    color: "#F5C400",
    fillColor: "#F5C400",
    desc: "Sud — livraison sur demande",
    phone: "+226 25 33 19 00",
    frequency: "Sur demande",
  },
  {
    id: "abidjan",
    name: "Abidjan (CI)",
    lat: 5.3600, lng: -4.0083,
    status: "expansion",
    delay: "7–10 jours",
    radius: 15000,
    color: "#3B82F6",
    fillColor: "#3B82F6",
    desc: "Côte d'Ivoire — corridor en cours",
    phone: "+226 25 33 19 00",
    frequency: "En développement",
  },
];

const DEPOT = { lat: 12.3547, lng: -1.5400, name: "Dépôt Principal GMO", address: "Quartier Dapoya, Ouagadougou" };

function FlyTo({ lat, lng }) {
  const map = useMap();
  map.flyTo([lat, lng], 11, { duration: 1.2 });
  return null;
}

export default function CoverageMap({ onSelectZone }) {
  const [selectedZone, setSelectedZone] = useState(null);
  const [flyTarget, setFlyTarget] = useState(null);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? ZONES : ZONES.filter(z => z.status === filter);

  const selectZone = (zone) => {
    setSelectedZone(zone);
    setFlyTarget({ lat: zone.lat, lng: zone.lng });
    if (onSelectZone) onSelectZone(zone);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="font-heading text-sm font-bold text-obsidian flex items-center gap-2">
            <Navigation className="w-4 h-4 text-gmo-green" /> Zones de couverture GMO
          </h3>
          <p className="text-[10px] text-obsidian/40 font-body mt-0.5">Cliquez sur une zone pour voir les détails de livraison</p>
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
          {[
            { id: "all", label: "Toutes" },
            { id: "actif", label: "✅ Actives" },
            { id: "partiel", label: "⚡ Partielles" },
            { id: "expansion", label: "🔵 Expansion" },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-body transition-all whitespace-nowrap ${
                filter === f.id ? "bg-white shadow-sm text-obsidian font-semibold" : "text-obsidian/45 hover:text-obsidian"
              }`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Map */}
        <div className="lg:flex-1 h-80 lg:h-[420px]">
          <MapContainer
            center={[12.0, -2.0]}
            zoom={6}
            style={{ height: "100%", width: "100%" }}
            zoomControl={true}
            scrollWheelZoom={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='© OpenStreetMap'
            />

            {flyTarget && <FlyTo lat={flyTarget.lat} lng={flyTarget.lng} />}

            {/* Main depot */}
            <Marker position={[DEPOT.lat, DEPOT.lng]} icon={DEPOT_ICON}>
              <Popup>
                <div className="text-sm font-bold text-gmo-green">{DEPOT.name}</div>
                <div className="text-xs text-gray-600 mt-1">{DEPOT.address}</div>
                <div className="text-xs text-gray-500 mt-0.5">+226 25 33 19 00</div>
              </Popup>
            </Marker>

            {/* Delivery zones */}
            {filtered.map(zone => (
              <React.Fragment key={zone.id}>
                <Circle
                  center={[zone.lat, zone.lng]}
                  radius={zone.radius}
                  pathOptions={{
                    color: zone.color,
                    fillColor: zone.fillColor,
                    fillOpacity: selectedZone?.id === zone.id ? 0.22 : 0.1,
                    weight: selectedZone?.id === zone.id ? 2.5 : 1.5,
                    dashArray: zone.status === "expansion" ? "8,4" : zone.status === "partiel" ? "4,4" : null,
                  }}
                  eventHandlers={{ click: () => selectZone(zone) }}
                />
                <Marker
                  position={[zone.lat, zone.lng]}
                  icon={createIcon(zone.color, 28)}
                  eventHandlers={{ click: () => selectZone(zone) }}
                >
                  <Popup>
                    <div className="min-w-[160px]">
                      <div className="font-bold text-sm" style={{ color: zone.color }}>{zone.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{zone.desc}</div>
                      <div className="text-xs mt-1.5 flex items-center gap-1">
                        <span>⏱</span><span className="font-semibold">{zone.delay}</span>
                      </div>
                      <div className="text-xs flex items-center gap-1">
                        <span>📅</span><span>{zone.frequency}</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            ))}
          </MapContainer>
        </div>

        {/* Sidebar */}
        <div className="lg:w-64 border-t lg:border-t-0 lg:border-l border-gray-100 overflow-y-auto" style={{ maxHeight: 420 }}>
          {selectedZone ? (
            <div className="p-4">
              <button onClick={() => setSelectedZone(null)} className="text-[10px] text-obsidian/35 hover:text-obsidian font-body mb-3 flex items-center gap-1 transition-colors">
                ← Retour à la liste
              </button>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: selectedZone.color }} />
                <h4 className="font-heading text-sm font-bold text-obsidian">{selectedZone.name}</h4>
              </div>
              <span className={`text-[9px] uppercase tracking-widest px-2 py-1 rounded-full font-body inline-block mb-3 ${
                selectedZone.status === "actif" ? "bg-gmo-green/10 text-gmo-green"
                : selectedZone.status === "partiel" ? "bg-amber-50 text-amber-600"
                : "bg-blue-50 text-blue-600"
              }`}>
                {selectedZone.status === "actif" ? "✅ Zone active" : selectedZone.status === "partiel" ? "⚡ Partielle" : "🔵 En expansion"}
              </span>
              <div className="space-y-2.5">
                {[
                  { icon: Clock, label: "Délai de livraison", value: selectedZone.delay },
                  { icon: Truck, label: "Fréquence", value: selectedZone.frequency },
                  { icon: Info, label: "Détails", value: selectedZone.desc },
                  { icon: Phone, label: "Contact", value: selectedZone.phone },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-3.5 h-3.5 text-obsidian/40" />
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-obsidian/30 font-heading">{item.label}</p>
                      <p className="text-xs font-body text-obsidian font-medium mt-0.5">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <a href={`https://wa.me/22676211633?text=Bonjour GMO, je souhaite une livraison sur ${selectedZone.name}`}
                target="_blank" rel="noopener noreferrer"
                className="mt-4 w-full flex items-center justify-center gap-2 bg-gmo-green text-white font-heading font-bold text-xs py-2.5 rounded-xl hover:bg-gmo-green/90 transition-colors">
                📦 Commander pour {selectedZone.name}
              </a>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {/* Depot */}
              <div className="px-4 py-3 bg-gmo-green/5 flex items-center gap-3">
                <span className="text-lg">🏭</span>
                <div>
                  <p className="text-xs font-heading font-bold text-gmo-green">Dépôt Principal</p>
                  <p className="text-[10px] text-obsidian/45 font-body">Dapoya, Ouagadougou</p>
                </div>
              </div>
              {filtered.map(zone => (
                <button key={zone.id} onClick={() => selectZone(zone)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: zone.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-heading font-semibold text-obsidian truncate">{zone.name}</p>
                    <p className="text-[10px] text-obsidian/40 font-body truncate">{zone.delay} · {zone.frequency}</p>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-body flex-shrink-0 ${
                    zone.status === "actif" ? "bg-gmo-green/10 text-gmo-green"
                    : zone.status === "partiel" ? "bg-amber-50 text-amber-600"
                    : "bg-blue-50 text-blue-600"
                  }`}>
                    {zone.status === "actif" ? "✅" : zone.status === "partiel" ? "⚡" : "🔵"}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="px-5 py-3 border-t border-gray-100 flex items-center gap-4 flex-wrap">
        {[
          { color: "#1A7A2E", label: "Zone active" },
          { color: "#F5C400", label: "Livraison partielle" },
          { color: "#3B82F6", label: "En expansion" },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: l.color }} />
            <span className="text-[10px] text-obsidian/50 font-body">{l.label}</span>
          </div>
        ))}
        <span className="text-[10px] text-obsidian/30 font-body ml-auto">🏭 = Dépôt GMO</span>
      </div>
    </div>
  );
}