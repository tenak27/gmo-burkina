import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { base44 } from "@/api/base44Client";
import { MapPin, Radio, RefreshCw, Users } from "lucide-react";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const VENDOR_COLORS = ["#CC1717","#1A7A2E","#1d4ed8","#d97706","#7c3aed","#0891b2","#be185d","#15803d"];

const makeVendorIcon = (color) => L.divIcon({
  className: "",
  html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2.5px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
  popupAnchor: [0, -10],
});

const pdvIcon = L.divIcon({
  className: "",
  html: `<div style="width:10px;height:10px;border-radius:50%;background:#f59e0b;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.35)"></div>`,
  iconSize: [10, 10],
  iconAnchor: [5, 5],
  popupAnchor: [0, -8],
});

const isRecent = (ts) => ts && (Date.now() - new Date(ts).getTime()) / 60000 < 15;

export default function CarteVendeursTab({ vendeurs }) {
  const [pointsDeVente, setPointsDeVente] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [selectedVendeur, setSelectedVendeur] = useState("all");

  const vendeursGPS = vendeurs.filter(v => v.is_active && v.lat && v.lng);
  const center = vendeursGPS.length > 0 ? [vendeursGPS[0].lat, vendeursGPS[0].lng] : [12.3647, -1.5337];

  useEffect(() => {
    loadPoints();
    const interval = setInterval(() => { loadPoints(); setLastRefresh(new Date()); }, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadPoints = async () => {
    setLoading(true);
    const data = await base44.entities.PointDeVente.list("-created_date", 500);
    setPointsDeVente(data || []);
    setLoading(false);
  };

  // Assign a color to each vendor deterministically
  const vendeurColorMap = {};
  vendeurs.forEach((v, i) => { vendeurColorMap[v.id] = VENDOR_COLORS[i % VENDOR_COLORS.length]; });

  const filteredPDV = selectedVendeur === "all"
    ? pointsDeVente
    : pointsDeVente.filter(p => p.vendeur_id === selectedVendeur);

  const filteredVendeurs = selectedVendeur === "all"
    ? vendeursGPS
    : vendeursGPS.filter(v => v.id === selectedVendeur);

  // Density: count PDV per vendeur
  const pdvByVendeur = {};
  pointsDeVente.forEach(p => {
    pdvByVendeur[p.vendeur_id] = (pdvByVendeur[p.vendeur_id] || 0) + 1;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="font-heading text-lg font-bold text-obsidian">Carte — Zones d'activité</h2>
          <p className="text-xs text-obsidian/40 font-body">
            Actualisé : {lastRefresh.toLocaleTimeString("fr-FR")} · Auto-refresh 30s
          </p>
        </div>
        <button onClick={() => { loadPoints(); setLastRefresh(new Date()); }}
          className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 text-xs font-body text-obsidian/60 hover:border-gmo-red hover:text-gmo-red transition-colors">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Actualiser
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 text-center">
          <Radio className="w-4 h-4 text-gmo-green mx-auto mb-1" />
          <p className="font-heading text-xl font-black text-gmo-green">{vendeursGPS.filter(v => isRecent(v.last_location_update)).length}</p>
          <p className="text-[10px] text-obsidian/40 font-body">En ligne</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 text-center">
          <MapPin className="w-4 h-4 text-amber-500 mx-auto mb-1" />
          <p className="font-heading text-xl font-black text-obsidian">{pointsDeVente.length}</p>
          <p className="text-[10px] text-obsidian/40 font-body">Points de vente</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 text-center">
          <Users className="w-4 h-4 text-blue-500 mx-auto mb-1" />
          <p className="font-heading text-xl font-black text-obsidian">{vendeursGPS.length}</p>
          <p className="text-[10px] text-obsidian/40 font-body">Vendeurs GPS</p>
        </div>
      </div>

      {/* Filtre vendeur */}
      <div className="flex gap-2 flex-wrap mb-3">
        <button onClick={() => setSelectedVendeur("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${selectedVendeur === "all" ? "bg-obsidian text-white border-obsidian" : "bg-white border-gray-200 text-obsidian/60 hover:border-obsidian/40"}`}>
          Tous
        </button>
        {vendeurs.filter(v => v.is_active).map((v, i) => {
          const color = VENDOR_COLORS[i % VENDOR_COLORS.length];
          const pdvCount = pdvByVendeur[v.id] || 0;
          return (
            <button key={v.id} onClick={() => setSelectedVendeur(v.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${selectedVendeur === v.id ? "text-white border-transparent" : "bg-white border-gray-200 text-obsidian/70 hover:border-gray-400"}`}
              style={selectedVendeur === v.id ? { background: color, borderColor: color } : {}}>
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
              {v.prenom} {v.nom}
              <span className="ml-0.5 opacity-70">({pdvCount})</span>
            </button>
          );
        })}
      </div>

      {/* Légende */}
      <div className="flex items-center gap-4 mb-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs font-body text-obsidian/55">
          <div className="w-3 h-3 rounded-full border-2 border-white shadow-sm" style={{ background: "#1A7A2E" }} /> Vendeur actif
        </div>
        <div className="flex items-center gap-1.5 text-xs font-body text-obsidian/55">
          <div className="w-3 h-3 rounded-full border-2 border-white shadow-sm bg-gray-400" /> Hors ligne
        </div>
        <div className="flex items-center gap-1.5 text-xs font-body text-obsidian/55">
          <div className="w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm bg-amber-400" /> Point de vente
        </div>
        <div className="flex items-center gap-1.5 text-xs font-body text-obsidian/55">
          <div className="w-5 h-2 rounded opacity-30 bg-blue-400 border border-blue-500" /> Zone d'activité
        </div>
      </div>

      {/* Carte */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ height: 520 }}>
        <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Zone de densité par vendeur : cercle autour de chaque PDV */}
          {filteredPDV.filter(p => p.lat && p.lng).map(p => {
            const vIdx = vendeurs.findIndex(v => v.id === p.vendeur_id);
            const color = vIdx >= 0 ? VENDOR_COLORS[vIdx % VENDOR_COLORS.length] : "#94a3b8";
            return (
              <Circle key={"zone-" + p.id} center={[p.lat, p.lng]} radius={120}
                pathOptions={{ color, fillColor: color, fillOpacity: 0.12, weight: 1, opacity: 0.3 }} />
            );
          })}

          {/* Vendeurs GPS */}
          {filteredVendeurs.map((v, i) => {
            const color = vendeurColorMap[v.id] || "#94a3b8";
            const active = isRecent(v.last_location_update);
            const pdvCount = pdvByVendeur[v.id] || 0;
            return (
              <React.Fragment key={v.id}>
                {active && (
                  <Circle center={[v.lat, v.lng]} radius={350}
                    pathOptions={{ color, fillColor: color, fillOpacity: 0.07, weight: 1.5, opacity: 0.4 }} />
                )}
                <Marker position={[v.lat, v.lng]} icon={makeVendorIcon(active ? color : "#94a3b8")}>
                  <Popup>
                    <div className="text-sm" style={{ minWidth: 160 }}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: color, display: "inline-block" }} />
                        <strong>{v.prenom} {v.nom}</strong>
                      </div>
                      {v.zone && <div className="text-xs text-gray-500">📍 Zone : {v.zone}</div>}
                      {v.phone && <div className="text-xs text-gray-500">📞 {v.phone}</div>}
                      <div className="text-xs text-gray-500">🏪 {pdvCount} point(s) de vente</div>
                      {v.last_location_update && (
                        <div className="text-xs text-gray-400 mt-1">
                          GPS : {new Date(v.last_location_update).toLocaleString("fr-FR")}
                        </div>
                      )}
                      <div className={`text-xs font-semibold mt-1 ${active ? "text-green-600" : "text-gray-400"}`}>
                        {active ? "🟢 En ligne" : "⚫ Hors ligne"}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })}

          {/* Points de vente */}
          {filteredPDV.filter(p => p.lat && p.lng).map(p => {
            const vIdx = vendeurs.findIndex(v => v.id === p.vendeur_id);
            const vendeurNom = vIdx >= 0 ? `${vendeurs[vIdx].prenom} ${vendeurs[vIdx].nom}` : "—";
            return (
              <Marker key={p.id} position={[p.lat, p.lng]} icon={pdvIcon}>
                <Popup>
                  <div className="text-sm" style={{ minWidth: 150 }}>
                    <strong>🏪 {p.nom_client}</strong>
                    {p.quartier && <div className="text-xs text-gray-500">Quartier : {p.quartier}</div>}
                    {p.phone_client && <div className="text-xs text-gray-500">📞 {p.phone_client}</div>}
                    {p.adresse && <div className="text-xs text-gray-500">{p.adresse}</div>}
                    <div className="text-xs text-blue-600 mt-1">Vendeur : {vendeurNom}</div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Tableau de densité */}
      {vendeurs.filter(v => v.is_active).length > 0 && (
        <div className="mt-4 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="font-heading text-sm font-bold text-obsidian">Densité par vendeur</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {vendeurs.filter(v => v.is_active).sort((a, b) => (pdvByVendeur[b.id] || 0) - (pdvByVendeur[a.id] || 0)).map((v, i) => {
              const color = VENDOR_COLORS[vendeurs.indexOf(v) % VENDOR_COLORS.length];
              const count = pdvByVendeur[v.id] || 0;
              const max = Math.max(...vendeurs.map(x => pdvByVendeur[x.id] || 0), 1);
              return (
                <div key={v.id} className="flex items-center gap-3 px-4 py-2.5">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                  <span className="text-sm font-body text-obsidian flex-1 truncate">{v.prenom} {v.nom}</span>
                  <div className="flex-1 max-w-[120px] bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${(count / max) * 100}%`, background: color }} />
                  </div>
                  <span className="text-xs font-heading font-bold text-obsidian/60 w-10 text-right">{count} PDV</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}