import React, { useState, useEffect } from "react";
import RoleGuard from "@/components/auth/RoleGuard";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import { Package, MapPin, ShoppingBag, Home, LogOut, CheckCircle2, AlertCircle, Navigation } from "lucide-react";
import VendeurStockPortal from "@/components/vendeurs/VendeurStockPortal";
import VendeurPointsVente from "@/components/vendeurs/VendeurPointsVente";
import VendeurVentes from "@/components/vendeurs/VendeurVentes";
import ProfileNotFound from "@/components/vendeurs/ProfileNotFound";

const TABS = [
  { id: "accueil", label: "Accueil", icon: Home },
  { id: "stock", label: "Mon Stock", icon: Package },
  { id: "points", label: "Points de vente", icon: MapPin },
  { id: "ventes", label: "Mes Ventes", icon: ShoppingBag },
];

function VendeurDashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("accueil");
  const [vendeur, setVendeur] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [ventes, setVentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gpsError, setGpsError] = useState("");

  useEffect(() => { loadData(); }, [user]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    const [vs, stocks, vt] = await Promise.allSettled([
      base44.entities.Vendeur.filter({ user_id: user.id }, "-created_date", 1),
      base44.entities.StockVendeur.filter({ vendeur_id: "" }, "-created_date", 50), // will be filtered after
      base44.entities.VenteVendeur.filter({ vendeur_id: "" }, "-created_date", 100),
    ]);
    const vendeurData = vs.value?.[0] || null;
    setVendeur(vendeurData);

    if (vendeurData) {
      const [s, v] = await Promise.allSettled([
        base44.entities.StockVendeur.filter({ vendeur_id: vendeurData.id }, "-created_date", 50),
        base44.entities.VenteVendeur.filter({ vendeur_id: vendeurData.id }, "-created_date", 100),
      ]);
      setStocks(s.value || []);
      setVentes(v.value || []);
    }
    setLoading(false);
  };

  // GPS toujours actif — démarre automatiquement quand le profil vendeur est chargé
  useEffect(() => {
    if (!vendeur?.id) return;
    if (!navigator.geolocation) { setGpsError("GPS non disponible sur cet appareil"); return; }
    setGpsError("");
    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng, accuracy } = pos.coords;
        await base44.entities.Vendeur.update(vendeur.id, {
          lat, lng,
          last_location_update: new Date().toISOString(),
        });
        setVendeur(prev => ({ ...prev, lat, lng }));
      },
      (err) => setGpsError("GPS : " + err.message),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [vendeur?.id]);

  const stocksEnAttente = stocks.filter(s => s.status === "en_attente_validation" && s.valide_par_magasinier && !s.valide_par_vendeur);
  const stocksActifs = stocks.filter(s => s.status === "valide");
  const totalCartouches = stocksActifs.reduce((s, st) => s + (st.cartouches_disponibles || 0), 0);
  const ventesDuJour = ventes.filter(v => v.date_vente === new Date().toISOString().slice(0,10));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-gmo-red/30 border-t-gmo-red rounded-full animate-spin" />
      </div>
    );
  }

  if (!vendeur) {
    return <ProfileNotFound user={user} onProfileCreated={loadData} onLogout={logout} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gmo-red flex items-center justify-center text-white text-xs font-bold font-heading">
              {vendeur.prenom?.charAt(0)}{vendeur.nom?.charAt(0)}
            </div>
            <div>
              <p className="font-heading text-sm font-bold text-obsidian leading-none">{vendeur.prenom} {vendeur.nom}</p>
              <p className="text-[10px] text-obsidian/40 font-body">Vendeur GMO</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-[10px] font-heading font-bold px-3 py-1.5 rounded-xl border bg-gmo-green text-white border-gmo-green">
              <Navigation className="w-3.5 h-3.5 animate-pulse" /> GPS ON
            </div>
            <button onClick={() => logout()} className="text-obsidian/30 hover:text-gmo-red transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
        {gpsError && <p className="text-center text-[11px] text-red-500 font-body pb-1 px-4">{gpsError}</p>}
        {/* Mobile nav */}
        <nav className="max-w-3xl mx-auto px-4 flex border-t border-gray-100">
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-body font-semibold border-b-2 transition-colors ${
                  tab === t.id ? "border-gmo-red text-gmo-red" : "border-transparent text-obsidian/35 hover:text-gmo-red"
                }`}>
                <Icon className="w-4 h-4" />{t.label}
              </button>
            );
          })}
        </nav>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-5">
        {/* ── ACCUEIL ── */}
        {tab === "accueil" && (
          <div className="space-y-4">
            {/* Welcome */}
            <div className="bg-gradient-to-r from-obsidian to-gmo-red/80 rounded-2xl p-5 text-white">
              <p className="text-[11px] text-white/40 uppercase tracking-widest mb-1">Bonjour</p>
              <h1 className="font-heading text-xl font-bold mb-1">{vendeur.prenom} 👋</h1>
              {vendeur.zone && <p className="text-xs text-white/50">Zone : {vendeur.zone}</p>}
              <div className="mt-3 flex gap-2 flex-wrap">
                <button onClick={() => setTab("stock")}
                  className="flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-xs font-heading font-bold px-3 py-2 rounded-lg hover:bg-white/20">
                  <Package className="w-3.5 h-3.5" /> Mon stock
                </button>
                <button onClick={() => setTab("ventes")}
                  className="flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-xs font-heading font-bold px-3 py-2 rounded-lg hover:bg-white/20">
                  <ShoppingBag className="w-3.5 h-3.5" /> Enregistrer vente
                </button>
              </div>
            </div>

            {/* Alert validation en attente */}
            {stocksEnAttente.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-heading text-sm font-bold text-amber-700">Stock en attente de votre confirmation !</p>
                  <p className="text-xs text-amber-600 font-body mt-0.5">{stocksEnAttente.length} livraison(s) prête(s). Confirmez la réception dans votre onglet Stock.</p>
                  <button onClick={() => setTab("stock")}
                    className="mt-2 flex items-center gap-1.5 bg-amber-500 text-white text-xs font-heading font-bold px-3 py-1.5 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Confirmer maintenant
                  </button>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Cartouches dispo", value: totalCartouches, icon: Package, color: "text-gmo-red" },
                { label: "Ventes aujourd'hui", value: ventesDuJour.length, icon: ShoppingBag, color: "text-gmo-green" },
                { label: "CA du jour (FCFA)", value: ventesDuJour.reduce((s,v) => s+v.montant_total||0,0).toLocaleString(), icon: ShoppingBag, color: "text-blue-600" },
                { label: "Points de vente", value: "—", icon: MapPin, color: "text-purple-600" },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3">
                  <s.icon className={`w-4 h-4 ${s.color} mb-1.5`} />
                  <p className={`font-heading text-xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-[10px] text-obsidian/40 font-body leading-tight mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "stock" && (
          <VendeurStockPortal stocks={stocks} setStocks={setStocks} vendeur={vendeur} />
        )}
        {tab === "points" && (
          <VendeurPointsVente vendeur={vendeur} />
        )}
        {tab === "ventes" && (
          <VendeurVentes vendeur={vendeur} stocks={stocks} setStocks={setStocks} ventes={ventes} setVentes={setVentes} />
        )}
      </main>
    </div>
  );
}

export default function VendeurSpace() {
  return (
    <VendeurDashboard />
  );
}