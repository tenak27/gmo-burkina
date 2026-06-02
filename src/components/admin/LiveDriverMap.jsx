import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { base44 } from "@/api/base44Client";
import { Navigation, Wifi, WifiOff, Clock } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function createDriverIcon(status) {
  const color = status === "en_livraison" ? "#3B82F6" : "#10B981";
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
      <circle cx="18" cy="18" r="16" fill="${color}" stroke="white" stroke-width="3"/>
      <text x="18" y="23" text-anchor="middle" font-size="16" fill="white">🏍️</text>
      <polygon points="18,44 10,30 26,30" fill="${color}"/>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -44],
  });
}

function FitBounds({ locations }) {
  const map = useMap();
  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map(l => [l.lat, l.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [locations.length]);
  return null;
}

function timeAgo(ts) {
  if (!ts) return "jamais";
  const diff = Math.floor((Date.now() - new Date(ts)) / 1000);
  if (diff < 60) return `il y a ${diff}s`;
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)}min`;
  return `il y a ${Math.floor(diff / 3600)}h`;
}

export default function LiveDriverMap({ drivers }) {
  const [locations, setLocations] = useState([]);
  const [lastSync, setLastSync] = useState(null);

  const load = async () => {
    const data = await base44.entities.DriverLocation.list("-last_update", 50);
    setLocations(data || []);
    setLastSync(new Date());
  };

  useEffect(() => {
    load();
    // subscribe to real-time updates
    const unsub = base44.entities.DriverLocation.subscribe(event => {
      setLocations(prev => {
        if (event.type === "create") return [...prev, event.data];
        if (event.type === "update") return prev.map(l => l.id === event.id ? event.data : l);
        if (event.type === "delete") return prev.filter(l => l.id !== event.id);
        return prev;
      });
      setLastSync(new Date());
    });
    return unsub;
  }, []);

  // Only show active (GPS on, updated in last 10 min)
  const activeLocations = locations.filter(l => {
    if (!l.is_active) return false;
    if (!l.last_update) return false;
    const diff = (Date.now() - new Date(l.last_update)) / 1000 / 60;
    return diff < 10;
  });

  const staleLocations = locations.filter(l => {
    if (!l.last_update) return false;
    const diff = (Date.now() - new Date(l.last_update)) / 1000 / 60;
    return diff >= 10 && diff < 60;
  });

  const getDriverStatus = (driverName) => {
    const d = drivers.find(dr => `${dr.first_name} ${dr.last_name}` === driverName);
    return d?.status || "disponible";
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
            <Navigation className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="font-heading text-sm font-bold text-obsidian">Suivi GPS Live</p>
            <p className="text-[10px] text-obsidian/40 font-body">
              {activeLocations.length} chauffeur(s) en ligne
              {lastSync && ` · sync ${lastSync.toLocaleTimeString("fr-FR", {hour:"2-digit",minute:"2-digit",second:"2-digit"})}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {activeLocations.length > 0 ? (
            <span className="flex items-center gap-1.5 text-[10px] text-green-600 font-body bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <Wifi className="w-3 h-3" /> Live
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-[10px] text-gray-400 font-body bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200">
              <WifiOff className="w-3 h-3" /> Aucun GPS actif
            </span>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-5 py-2 bg-gray-50/60 border-b border-gray-100 flex-wrap">
        <span className="text-[10px] text-obsidian/50 font-body flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> En livraison
        </span>
        <span className="text-[10px] text-obsidian/50 font-body flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Disponible
        </span>
        <span className="text-[10px] text-obsidian/40 font-body ml-auto flex items-center gap-1">
          <Clock className="w-3 h-3" /> Positions perdues si inactif &gt;10min
        </span>
      </div>

      {/* Map */}
      <div style={{ height: 400 }}>
        <MapContainer
          center={[12.3714, -1.5197]}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {activeLocations.length > 0 && <FitBounds locations={activeLocations} />}
          {activeLocations.map(loc => (
            <Marker
              key={loc.id}
              position={[loc.lat, loc.lng]}
              icon={createDriverIcon(getDriverStatus(loc.driver_name))}
            >
              <Popup>
                <div className="p-1 min-w-[140px]">
                  <p className="font-bold text-sm text-gray-800 mb-1">{loc.driver_name}</p>
                  <p className="text-xs text-gray-500">📍 {loc.lat.toFixed(5)}, {loc.lng.toFixed(5)}</p>
                  {loc.accuracy && <p className="text-xs text-gray-400">Précision : {Math.round(loc.accuracy)}m</p>}
                  {loc.speed != null && <p className="text-xs text-gray-400">Vitesse : {Math.round(loc.speed * 3.6)} km/h</p>}
                  <p className="text-xs text-green-600 mt-1">{timeAgo(loc.last_update)}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Stale info */}
      {staleLocations.length > 0 && (
        <div className="px-5 py-2.5 border-t border-gray-100 bg-amber-50/50">
          <p className="text-[10px] text-amber-600 font-body">
            ⚠️ {staleLocations.length} chauffeur(s) hors ligne depuis plus de 10 min :&nbsp;
            {staleLocations.map(l => l.driver_name).join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}