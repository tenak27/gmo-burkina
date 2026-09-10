import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation, Clock, LogIn, LogOut, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

const RADIUS_M = 100; // rayon de détection PDV en mètres

function distanceMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function PointageVendeur() {
  const [vendeurId, setVendeurId] = useState("");
  const [vendeurNom, setVendeurNom] = useState("");
  const [pdvs, setPdvs] = useState([]);
  const [currentPos, setCurrentPos] = useState(null);
  const [activeVisit, setActiveVisit] = useState(null);
  const [history, setHistory] = useState([]);
  const [watching, setWatching] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const watchIdRef = useRef(null);
  const activeVisitRef = useRef(null);

  useEffect(() => {
    base44.entities.PointDeVente.filter({ is_active: true }, "nom_client", 500)
      .then((data) => setPdvs(data || []))
      .catch(() => setPdvs([]));
  }, []);

  // Charger l'historique du vendeur
  const loadHistory = async () => {
    if (!vendeurId) return;
    try {
      const visits = await base44.entities.PdvVisit.filter(
        { vendeur_id: vendeurId, status: "termine" },
        "-arrival_time",
        50
      );
      setHistory(visits || []);
    } catch {
      setHistory([]);
    }
  };

  useEffect(() => {
    if (vendeurId) loadHistory();
  }, [vendeurId]);

  // Détection d'entrée/sortie PDV
  useEffect(() => {
    activeVisitRef.current = activeVisit;
  }, [activeVisit]);

  const handlePosition = async (pos) => {
    const { latitude, longitude } = pos.coords;
    setCurrentPos({ lat: latitude, lng: longitude });
    setError("");

    // Trouver le PDV le plus proche dans le rayon
    let nearest = null;
    let minDist = Infinity;
    for (const p of pdvs) {
      if (p.lat == null || p.lng == null) continue;
      const d = distanceMeters(latitude, longitude, p.lat, p.lng);
      if (d < RADIUS_M && d < minDist) {
        minDist = d;
        nearest = p;
      }
    }

    const current = activeVisitRef.current;

    if (nearest && !current) {
      // Arrivée détectée
      try {
        const now = new Date().toISOString();
        const visit = await base44.entities.PdvVisit.create({
          vendeur_id: vendeurId,
          vendeur_nom: vendeurNom,
          pdv_id: nearest.id,
          pdv_nom: nearest.nom_client,
          pdv_quartier: nearest.quartier,
          arrival_time: now,
          arrival_lat: latitude,
          arrival_lng: longitude,
          status: "en_cours",
        });
        setActiveVisit(visit);
        activeVisitRef.current = visit;
        setInfo(`Arrivée détectée à ${nearest.nom_client}`);
        setTimeout(() => setInfo(""), 4000);
      } catch (e) {
        setError("Erreur enregistrement arrivée");
      }
    } else if (!nearest && current) {
      // Départ détecté
      try {
        const departure = new Date().toISOString();
        const duration = Math.round(
          (new Date(departure).getTime() - new Date(current.arrival_time).getTime()) / 1000
        );
        await base44.entities.PdvVisit.update(current.id, {
          departure_time: departure,
          duration_seconds: duration,
          status: "termine",
        });
        setActiveVisit(null);
        activeVisitRef.current = null;
        setInfo(`Départ enregistré — ${Math.floor(duration / 60)} min ${duration % 60}s`);
        setTimeout(() => setInfo(""), 5000);
        loadHistory();
      } catch (e) {
        setError("Erreur enregistrement départ");
      }
    }
  };

  const startTracking = () => {
    if (!vendeurId || !vendeurNom) {
      setError("Identifiant et nom du vendeur requis");
      return;
    }
    if (!navigator.geolocation) {
      setError("Géolocalisation non supportée sur cet appareil");
      return;
    }
    setError("");
    setInfo("Demande de localisation en cours...");
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setInfo("");
        handlePosition(pos);
      },
      (err) => {
        setError(
          err.code === 1
            ? "Permission refusée. Autorisez la localisation dans le navigateur."
            : "Position GPS indisponible"
        );
        setWatching(false);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );
    setWatching(true);
  };

  const stopTracking = () => {
    if (watchIdRef.current != null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    // Clôturer visite en cours
    if (activeVisitRef.current) {
      const current = activeVisitRef.current;
      const departure = new Date().toISOString();
      const duration = Math.round(
        (new Date(departure).getTime() - new Date(current.arrival_time).getTime()) / 1000
      );
      base44.entities.PdvVisit.update(current.id, {
        departure_time: departure,
        duration_seconds: duration,
        status: "termine",
      }).then(() => {
        setActiveVisit(null);
        activeVisitRef.current = null;
        loadHistory();
      });
    }
    setWatching(false);
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current != null) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  const fmtDuration = (s) => {
    if (!s) return "—";
    const m = Math.floor(s / 60);
    const sec = s % 60;
    if (m >= 60) return `${Math.floor(m / 60)}h ${m % 60}min`;
    return `${m}min ${sec}s`;
  };

  return (
    <div className="min-h-screen bg-concrete pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <span className="font-body text-xs uppercase tracking-[0.3em] text-gmo-red block mb-2">
            Suivi terrain
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-obsidian mb-1">
            Pointage Vendeur Ambulant
          </h1>
          <p className="font-body text-sm text-obsidian/60 mb-6">
            Détection automatique de vos passages dans les points de vente via GPS.
          </p>
        </motion.div>

        {/* Identification vendeur */}
        {!watching && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 p-5 mb-4"
          >
            <label className="block text-[11px] font-heading uppercase tracking-widest text-obsidian/50 mb-1.5">
              Identifiant vendeur
            </label>
            <input
              value={vendeurId}
              onChange={(e) => setVendeurId(e.target.value)}
              placeholder="Ex: V001 ou votre ID"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body mb-3 focus:outline-none focus:border-gmo-green"
            />
            <label className="block text-[11px] font-heading uppercase tracking-widest text-obsidian/50 mb-1.5">
              Nom complet
            </label>
            <input
              value={vendeurNom}
              onChange={(e) => setVendeurNom(e.target.value)}
              placeholder="Ex: Ouedraogo Karim"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body mb-4 focus:outline-none focus:border-gmo-green"
            />
            <button
              onClick={startTracking}
              disabled={!vendeurId || !vendeurNom}
              className="w-full flex items-center justify-center gap-2 bg-gmo-green text-white font-heading font-bold text-sm py-3 rounded-xl hover:bg-gmo-green/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Navigation className="w-4 h-4" /> Activer le suivi GPS
            </button>
            {pdvs.length > 0 && (
              <p className="text-[11px] text-obsidian/40 font-body mt-3 text-center">
                {pdvs.length} point{pdvs.length > 1 ? "s" : ""} de vente configuré{pdvs.length > 1 ? "s" : ""} · rayon {RADIUS_M}m
              </p>
            )}
          </motion.div>
        )}

        {/* Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 bg-gmo-red/10 border border-gmo-red/20 text-gmo-red text-sm font-body px-4 py-3 rounded-xl mb-4"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </motion.div>
          )}
          {info && !error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 bg-gmo-green/10 border border-gmo-green/20 text-gmo-green text-sm font-body px-4 py-3 rounded-xl mb-4"
            >
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> {info}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Suivi actif */}
        {watching && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-gray-100 p-5 mb-4"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gmo-green opacity-60"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-gmo-green"></span>
                </span>
                <span className="font-heading text-sm font-bold text-obsidian">Suivi actif</span>
              </div>
              <button
                onClick={stopTracking}
                className="text-xs font-heading font-bold text-gmo-red border border-gmo-red/30 px-3 py-1.5 rounded-lg hover:bg-gmo-red/10 transition-colors"
              >
                Arrêter
              </button>
            </div>

            {currentPos ? (
              <div className="flex items-center gap-2 text-[11px] font-body text-obsidian/50 mb-4">
                <MapPin className="w-3 h-3" />
                {currentPos.lat.toFixed(5)}, {currentPos.lng.toFixed(5)}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[11px] text-obsidian/50 mb-4">
                <Loader2 className="w-3 h-3 animate-spin" /> Recherche GPS...
              </div>
            )}

            {activeVisit ? (
              <div className="bg-gmo-green/8 border border-gmo-green/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <LogIn className="w-4 h-4 text-gmo-green" />
                  <span className="font-heading text-sm font-bold text-obsidian">
                    Présent à {activeVisit.pdv_nom}
                  </span>
                </div>
                <p className="text-xs text-obsidian/60 font-body">
                  Arrivée {new Date(activeVisit.arrival_time).toLocaleTimeString("fr-FR")}
                </p>
                {activeVisit.pdv_quartier && (
                  <p className="text-xs text-obsidian/40 font-body">{activeVisit.pdv_quartier}</p>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                <p className="text-xs text-obsidian/50 font-body">
                  En déplacement vers le prochain point de vente...
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Historique récent */}
        {history.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-heading text-sm font-bold text-obsidian mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gmo-green" /> Derniers passages
            </h3>
            <div className="space-y-2">
              {history.slice(0, 8).map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div>
                    <p className="text-sm font-heading font-bold text-obsidian">{v.pdv_nom}</p>
                    <p className="text-[11px] text-obsidian/40 font-body">
                      {new Date(v.arrival_time).toLocaleDateString("fr-FR")}{" "}
                      {new Date(v.arrival_time).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <span className="text-sm font-heading font-bold text-gmo-green">
                    {fmtDuration(v.duration_seconds)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <a
            href="/performances"
            className="text-xs font-heading font-bold text-gmo-green hover:underline"
          >
            Voir les statistiques →
          </a>
        </div>
      </div>
    </div>
  );
}