import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { MapPin, Plus, X, Loader2, CheckCircle2, Navigation } from "lucide-react";

function PointForm({ vendeur, onClose, onSaved }) {
  const [form, setForm] = useState({ nom_client: "", phone_client: "", adresse: "", quartier: "", ville: "Ouagadougou", lat: null, lng: null, notes: "" });
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState("");

  const captureGPS = () => {
    if (!navigator.geolocation) return setLocError("GPS non disponible");
    setLocating(true);
    setLocError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm(p => ({ ...p, lat: pos.coords.latitude, lng: pos.coords.longitude }));
        setLocating(false);
      },
      (err) => { setLocError("Erreur : " + err.message); setLocating(false); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSave = async () => {
    if (!form.nom_client) return;
    setLoading(true);
    const created = await base44.entities.PointDeVente.create({ ...form, vendeur_id: vendeur.id, is_active: true });
    onSaved(created);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-heading text-base font-bold text-obsidian">Nouveau point de vente</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="px-5 py-4 space-y-3">
          {[
            { key: "nom_client", label: "Nom du client *", type: "text" },
            { key: "phone_client", label: "Téléphone", type: "tel" },
            { key: "adresse", label: "Adresse", type: "text" },
            { key: "quartier", label: "Quartier", type: "text" },
            { key: "ville", label: "Ville", type: "text" },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{f.label}</label>
              <input type={f.type} value={form[f.key] || ""} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none focus:border-gmo-red" />
            </div>
          ))}

          {/* GPS capture */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Position GPS</label>
            <button onClick={captureGPS} disabled={locating}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 transition-all text-sm font-heading font-bold ${
                form.lat ? "border-gmo-green text-gmo-green bg-green-50" : "border-dashed border-gray-300 text-gray-400 hover:border-gmo-red hover:text-gmo-red"
              }`}>
              {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
              {form.lat ? `✓ GPS capturé (${form.lat.toFixed(4)}, ${form.lng.toFixed(4)})` : "Capturer la position GPS"}
            </button>
            {locError && <p className="text-xs text-red-500 mt-1">{locError}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
              rows={2} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none focus:border-gmo-red resize-none" />
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-sm font-heading py-2.5 rounded-xl">Annuler</button>
          <button onClick={handleSave} disabled={loading || !form.nom_client}
            className="flex-1 bg-gmo-red text-white text-sm font-heading font-bold py-2.5 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VendeurPointsVente({ vendeur }) {
  const [points, setPoints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (vendeur?.id) loadPoints();
  }, [vendeur]);

  const loadPoints = async () => {
    setLoading(true);
    const data = await base44.entities.PointDeVente.filter({ vendeur_id: vendeur.id }, "-created_date", 100);
    setPoints(data || []);
    setLoading(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-lg font-bold text-obsidian">Mes points de vente ({points.length})</h2>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-gmo-red text-white text-xs font-heading font-bold px-4 py-2.5 rounded-xl">
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-gmo-red/30 border-t-gmo-red rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {points.map(p => (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${p.lat ? "bg-gmo-green/10" : "bg-gray-100"}`}>
                  <MapPin className={`w-4 h-4 ${p.lat ? "text-gmo-green" : "text-gray-400"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading text-sm font-bold text-obsidian">{p.nom_client}</p>
                  {p.phone_client && <p className="text-xs text-obsidian/50 font-body">📞 {p.phone_client}</p>}
                  {p.quartier && <p className="text-xs text-obsidian/50 font-body">📍 {p.quartier}{p.ville ? `, ${p.ville}` : ""}</p>}
                  {p.adresse && <p className="text-xs text-obsidian/40 font-body">{p.adresse}</p>}
                  {p.notes && <p className="text-xs text-obsidian/30 font-body italic mt-1">{p.notes}</p>}
                  {p.lat && (
                    <a href={`https://maps.google.com/?q=${p.lat},${p.lng}`} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-1.5 text-[10px] text-gmo-green font-body hover:underline">
                      <Navigation className="w-3 h-3" /> Ouvrir dans Maps
                    </a>
                  )}
                </div>
                {p.lat && (
                  <span className="text-[9px] bg-gmo-green/10 text-gmo-green font-body font-bold px-2 py-0.5 rounded-full flex-shrink-0">GPS ✓</span>
                )}
              </div>
            </div>
          ))}
          {points.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 py-14 text-center">
              <MapPin className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="font-heading text-sm text-obsidian/40">Aucun point de vente</p>
              <p className="text-xs text-obsidian/25 font-body mt-1">Ajoutez vos clients/points de vente</p>
            </div>
          )}
        </div>
      )}

      {showForm && <PointForm vendeur={vendeur} onClose={() => setShowForm(false)} onSaved={p => setPoints(prev => [p, ...prev])} />}
    </div>
  );
}