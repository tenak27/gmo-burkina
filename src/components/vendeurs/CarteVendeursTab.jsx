import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { base44 } from "@/api/base44Client";
import { MapPin, Radio, RefreshCw } from "lucide-react";

// Fix default leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

const greenIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

export default function CarteVendeursTab({ vendeurs }) {
  const [pointsDeVente, setPointsDeVente] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const vendeursActifs = vendeurs.filter(v => v.is_active && v.lat && v.lng);
  const center = vendeursActifs.length > 0
    ? [vendeursActifs[0].lat, vendeursActifs[0].lng]
    : [12.3647, -1.5337]; // Ouagadougou par défaut

  useEffect(() => {
    loadPoints();
    // Auto-refresh toutes les 30s
    const interval = setInterval(() => {
      loadPoints();
      setLastRefresh(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadPoints = async () => {
    setLoading(true);
    const data = await base44.entities.PointDeVente.list("-created_date", 200);
    setPointsDeVente(data || []);
    setLoading(false);
  };

  const isRecent = (timestamp) => {
    if (!timestamp) return false;
    const diff = (Date.now() - new Date(timestamp).getTime()) / 1000 / 60;
    return diff < 15; // actif si < 15 min
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="font-heading text-lg font-bold text-obsidian">Carte GPS en direct</h2>
          <p className="text-xs text-obsidian/40 font-body">
            Actualisé : {lastRefresh.toLocaleTimeString("fr-FR")} · Auto-refresh 30s
          </p>
        </div>
        <button onClick={() => { loadPoints(); setLastRefresh(new Date()); }}
          className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 text-xs font-body text-obsidian/60 hover:border-gmo-red hover:text-gmo-red transition-colors">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Actualiser
        </button>
      </div>

      {/* Légende */}
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-2 text-xs font-body text-obsidian/60">
          <div className="w-3 h-3 rounded-full bg-gmo-green" /> Vendeur actif (&lt;15min)
        </div>
        <div className="flex items-center gap-2 text-xs font-body text-obsidian/60">
          <div className="w-3 h-3 rounded-full bg-gray-400" /> Hors ligne
        </div>
        <div className="flex items-center gap-2 text-xs font-body text-obsidian/60">
          <div className="w-3 h-3 rounded-full bg-gmo-red" /> Point de vente
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 text-center">
          <Radio className="w-4 h-4 text-gmo-green mx-auto mb-1" />
          <p className="font-heading text-xl font-black text-gmo-green">{vendeursActifs.filter(v => isRecent(v.last_location_update)).length}</p>
          <p className="text-[10px] text-obsidian/40 font-body">En ligne</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 text-center">
          <MapPin className="w-4 h-4 text-gmo-red mx-auto mb-1" />
          <p className="font-heading text-xl font-black text-obsidian">{pointsDeVente.length}</p>
          <p className="text-[10px] text-obsidian/40 font-body">Points de vente</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 text-center">
          <MapPin className="w-4 h-4 text-blue-500 mx-auto mb-1" />
          <p className="font-heading text-xl font-black text-obsidian">{vendeursActifs.length}</p>
          <p className="text-[10px] text-obsidian/40 font-body">Vendeurs GPS</p>
        </div>
      </div>

      {/* Carte */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ height: "500px" }}>
        <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Vendeurs */}
          {vendeursActifs.map(v => (
            <React.Fragment key={v.id}>
              <Marker position={[v.lat, v.lng]} icon={isRecent(v.last_location_update) ? greenIcon : L.Icon.Default}>
                <Popup>
                  <div className="font-body text-sm">
                    <strong>{v.prenom} {v.nom}</strong><br />
                    {v.zone && <span>Zone : {v.zone}<br /></span>}
                    {v.phone && <span>📞 {v.phone}<br /></span>}
                    {v.last_location_update && (
                      <span className="text-xs text-gray-500">
                        Dernière position : {new Date(v.last_location_update).toLocaleString("fr-FR")}
                      </span>
                    )}
                    {isRecent(v.last_location_update) && (
                      <span className="block mt-1 text-green-600 font-semibold text-xs">🟢 En ligne</span>
                    )}
                  </div>
                </Popup>
              </Marker>
              {isRecent(v.last_location_update) && (
                <Circle center={[v.lat, v.lng]} radius={200} color="#1A7A2E" fillOpacity={0.08} />
              )}
            </React.Fragment>
          ))}

          {/* Points de vente */}
          {pointsDeVente.filter(p => p.lat && p.lng).map(p => (
            <Marker key={p.id} position={[p.lat, p.lng]} icon={redIcon}>
              <Popup>
                <div className="font-body text-sm">
                  <strong>🏪 {p.nom_client}</strong><br />
                  {p.quartier && <span>Quartier : {p.quartier}<br /></span>}
                  {p.phone_client && <span>📞 {p.phone_client}<br /></span>}
                  {p.adresse && <span>{p.adresse}</span>}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}