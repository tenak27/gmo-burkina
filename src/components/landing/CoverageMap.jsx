import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { MapContainer, TileLayer, CircleMarker, Tooltip, Popup } from "react-leaflet";
import { MapPin, Truck, Clock } from "lucide-react";
import "leaflet/dist/leaflet.css";

const CITIES = [
  {
    name: "Ouagadougou",
    lat: 12.3714,
    lng: -1.5197,
    status: "active",
    role: "Siège Social & Hub Principal",
    details: "Centre de distribution principal, siège de GMO",
  },
  {
    name: "Bobo-Dioulasso",
    lat: 11.177,
    lng: -4.2979,
    status: "active",
    role: "Antenne Régionale",
    details: "2ème ville du Burkina, hub de distribution Ouest",
  },
  {
    name: "Diébougou",
    lat: 10.9618,
    lng: -3.2514,
    status: "active",
    role: "Point de Distribution",
    details: "Couverture de la région du Sud-Ouest",
  },
  {
    name: "Ouahigouya",
    lat: 13.5727,
    lng: -2.4316,
    status: "active",
    role: "Point de Distribution",
    details: "Couverture du Nord du Burkina",
  },
  {
    name: "Banfora",
    lat: 10.6338,
    lng: -4.7605,
    status: "coming",
    role: "Expansion prévue",
    details: "Ouverture prochaine",
  },
  {
    name: "Dédougou",
    lat: 12.4626,
    lng: -3.461,
    status: "coming",
    role: "Expansion prévue",
    details: "Couverture de la région de la Boucle du Mouhoun",
  },
  {
    name: "Orodara",
    lat: 10.9964,
    lng: -4.9116,
    status: "coming",
    role: "Expansion prévue",
    details: "Ouverture prochaine",
  },
];

export default function CoverageMap() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selected, setSelected] = useState(null);

  return (
    <section className="bg-gradient-to-b from-cream via-cream/98 to-cream/95 py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div ref={ref} className="mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-6 h-[2px] bg-gmo-red" />
            <span className="font-body text-xs uppercase tracking-[0.3em] text-gmo-red">Zone de couverture</span>
          </motion.div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="font-heading text-4xl lg:text-5xl font-bold text-obsidian"
              >
                NOS POINTS DE
                <br />
                <span className="text-gmo-green">DISTRIBUTION</span>
              </motion.h2>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="h-1 w-20 bg-gradient-to-r from-gmo-green to-gmo-red mt-6 origin-left rounded-full"
              />
            </div>
            {/* Legend */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
              className="flex gap-6 flex-shrink-0"
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gmo-green animate-pulse-green" />
                <span className="font-body text-xs text-obsidian/60 uppercase tracking-widest">Actif</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gold border-2 border-gold/40" />
                <span className="font-body text-xs text-obsidian/60 uppercase tracking-widest">Bientôt</span>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="grid lg:grid-cols-3 gap-6"
        >
          {/* Map */}
          <div className="lg:col-span-2 rounded-2xl overflow-hidden shadow-xl border border-gray-100" style={{ height: 460 }}>
            <MapContainer
              center={[12.0, -2.5]}
              zoom={6.5}
              style={{ height: "100%", width: "100%" }}
              zoomControl={true}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {CITIES.map((city) => (
                <CircleMarker
                  key={city.name}
                  center={[city.lat, city.lng]}
                  radius={city.status === "active" ? 14 : 9}
                  fillColor={city.status === "active" ? "#1A7A2E" : "#F5C400"}
                  fillOpacity={city.status === "active" ? 0.85 : 0.7}
                  color={city.status === "active" ? "#1A7A2E" : "#F5C400"}
                  weight={3}
                  eventHandlers={{ click: () => setSelected(city) }}
                >
                  <Tooltip direction="top" offset={[0, -10]} opacity={0.97} permanent={city.status === "active" && city.name === "Ouagadougou"}>
                    <div className="font-heading text-xs font-bold">{city.name}</div>
                  </Tooltip>
                  <Popup>
                    <div className="p-1">
                      <p className="font-bold text-sm text-obsidian">{city.name}</p>
                      <p className="text-xs text-gmo-green mt-0.5">{city.role}</p>
                      <p className="text-xs text-gray-500 mt-1">{city.details}</p>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>

          {/* Cities list */}
          <div className="flex flex-col gap-3">
            <p className="font-heading text-xs uppercase tracking-widest text-obsidian/40 mb-2">
              Toutes nos localités
            </p>
            {CITIES.map((city, i) => (
              <motion.button
                key={city.name}
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.4 + i * 0.08 }}
                onClick={() => setSelected(selected?.name === city.name ? null : city)}
                className={`text-left p-4 rounded-xl border transition-all duration-300 ${
                  selected?.name === city.name
                    ? "border-gmo-green bg-gmo-green/5 shadow-sm"
                    : "border-gray-100 bg-white hover:border-gmo-green/30 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${city.status === "active" ? "bg-gmo-green animate-pulse-green" : "bg-gold"}`} />
                    <span className="font-heading text-sm font-bold text-obsidian">{city.name}</span>
                  </div>
                  <span className={`font-body text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full ${
                    city.status === "active"
                      ? "text-gmo-green bg-gmo-green/10"
                      : "text-gold bg-gold/15"
                  }`}>
                    {city.status === "active" ? "Actif" : "Bientôt"}
                  </span>
                </div>
                {selected?.name === city.name && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-2 pt-2 border-t border-gmo-green/10"
                  >
                    <p className="font-body text-xs text-gmo-green font-medium">{city.role}</p>
                    <p className="font-body text-xs text-obsidian/50 mt-0.5">{city.details}</p>
                  </motion.div>
                )}
              </motion.button>
            ))}

            {/* Stats */}
            <div className="mt-auto grid grid-cols-2 gap-3 pt-3">
              {[
                { icon: MapPin, val: "4", label: "Villes actives" },
                { icon: Truck, val: "3", label: "En expansion" },
              ].map((s) => (
                <div key={s.label} className="bg-obsidian rounded-xl p-4 text-center">
                  <s.icon className="w-4 h-4 text-gmo-green mx-auto mb-1" />
                  <p className="font-heading text-xl font-bold text-white">{s.val}</p>
                  <p className="font-body text-[10px] uppercase tracking-widest text-white/40">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}