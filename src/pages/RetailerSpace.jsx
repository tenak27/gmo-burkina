import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import RoleGuard from "@/components/auth/RoleGuard";
import { base44 } from "@/api/base44Client";
import {
  Package, Truck, LogOut, Star, RefreshCw, Phone,
  ShoppingCart, AlertTriangle, CheckCircle2, Plus, Minus, Send, MapPin, Home, Download, FileText
} from "lucide-react";
import StocksView from "@/components/retailer/StocksView";
import ProductGallery from "@/components/retailer/ProductGallery";
import LiveChatWidget from "@/components/retailer/LiveChatWidget";
import CoverageMap from "@/components/retailer/CoverageMap";

const TABS = [
  { id: "accueil", label: "Accueil" },
  { id: "catalogue", label: "Catalogue" },
  { id: "stocks", label: "Stocks" },
  { id: "commande", label: "Commander" },
  { id: "livraisons", label: "Livraisons" },
  { id: "zones", label: "🗺 Zones" },
];

function RetailerDashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("accueil");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [cart, setCart] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [deliveryMode, setDeliveryMode] = useState("livraison"); // "livraison" | "enlevement"
  const [deliveryAddress, setDeliveryAddress] = useState("");

  useEffect(() => {
    loadProducts();
    if (user) loadOrders();
  }, [user]);

  // Real-time order updates
  useEffect(() => {
    if (!user) return;
    const unsub = base44.entities.Order.subscribe((event) => {
      if (event.data?.client_email === user.email) {
        setOrders(prev => {
          if (event.type === "create") return [event.data, ...prev];
          if (event.type === "update") return prev.map(o => o.id === event.id ? event.data : o);
          return prev;
        });
      }
    });
    return unsub;
  }, [user]);

  const loadProducts = async () => {
    setLoadingProducts(true);
    const data = await base44.entities.Product.filter({ is_active: true }, "name", 50);
    setProducts(data || []);
    setLoadingProducts(false);
  };

  const loadOrders = async () => {
    const data = await base44.entities.Order.filter({ client_email: user.email, client_type: "detaillant" }, "-created_date", 20);
    setOrders(data || []);
  };

  const setQty = (id, qty) => {
    if (qty <= 0) {
      setCart(c => { const n = {...c}; delete n[id]; return n; });
    } else {
      setCart(c => ({ ...c, [id]: qty }));
    }
  };

  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = products.find(p => p.id === id);
    return sum + (p?.wholesale_price || p?.unit_price || 0) * qty;
  }, 0);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const submitOrder = async () => {
    if (cartCount === 0 || !user) return;
    setSubmitting(true);
    const items = Object.entries(cart).map(([id, qty]) => {
      const p = products.find(p => p.id === id);
      return { product_id: id, name: p?.name, qty, unit_price: p?.wholesale_price || p?.unit_price };
    });
    const orderNum = `DET-${Date.now().toString().slice(-8)}`;
    await base44.entities.Order.create({
      order_number: orderNum,
      client_email: user.email,
      client_name: user.full_name,
      client_type: "detaillant",
      items,
      total_amount: cartTotal,
      status: "en_attente",
      delivery_mode: deliveryMode,
      delivery_address: deliveryMode === "livraison" ? deliveryAddress : "Enlèvement au dépôt",
      notes: deliveryMode === "enlevement" ? "Client viendra récupérer au dépôt GMO" : "",
    });
    setCart({});
    setSubmitting(false);
    setOrderSuccess(true);
    setTimeout(() => setOrderSuccess(false), 4000);
    setTab("livraisons");
  };

  const lowStock = products.filter(p => p.stock_quantity <= p.stock_alert);
  const activeOrders = orders.filter(o => !["livree","annulee"].includes(o.status));

  return (
    <div className="min-h-screen bg-[#F2F4F7]">
      {/* Header */}
      <header className="bg-[#1C1C1E] sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c7662a636_logo-gmo2x.png" alt="GMO" className="h-7 brightness-0 invert opacity-90" />
            <span className="hidden sm:block text-[10px] text-gmo-red/70 uppercase tracking-[0.2em] font-body">Détaillant</span>
          </div>
          <div className="flex items-center gap-2">
            {cartCount > 0 && (
              <button onClick={() => setTab("commande")}
                className="flex items-center gap-2 bg-gmo-red text-white text-[10px] font-heading font-bold px-3 py-1.5 rounded-lg">
                <ShoppingCart className="w-3.5 h-3.5" /> {cartCount}
              </button>
            )}
            <div className="w-7 h-7 rounded-full bg-gmo-red flex items-center justify-center text-white text-[11px] font-bold font-heading">
              {user?.full_name?.charAt(0) || "D"}
            </div>
            <span className="hidden sm:block text-xs text-white/50 font-body">{user?.full_name}</span>
            <button onClick={() => logout()} className="ml-2 text-white/25 hover:text-red-400 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
        <nav className="max-w-5xl mx-auto px-4 sm:px-6 flex border-t border-white/5 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-[11px] font-body uppercase tracking-widest border-b-2 transition-colors whitespace-nowrap ${
                tab === t.id ? "border-gmo-red text-gmo-red" : "border-transparent text-white/30 hover:text-white/60"
              }`}
            >{t.label}{t.id === "commande" && cartCount > 0 ? ` (${cartCount})` : ""}</button>
          ))}
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">

        {orderSuccess && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-heading text-sm font-bold text-green-800">Commande envoyée !</p>
              <p className="text-xs text-green-600 font-body">Votre réapprovisionnement est en cours de traitement.</p>
            </div>
          </div>
        )}

        {/* ── ACCUEIL ── */}
        {tab === "accueil" && (
          <div>
            <div className="bg-gradient-to-r from-[#1C1C1E] to-[#CC1717]/70 rounded-2xl p-6 mb-5 text-white">
              <p className="text-[11px] text-white/40 uppercase tracking-widest font-body mb-1">Partenaire Détaillant</p>
              <h1 className="font-heading text-2xl font-bold mb-1">{user?.full_name || "Partenaire"} 👋</h1>
              <p className="text-sm text-white/45 font-body">Gérez vos stocks et réapprovisionnements.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => setTab("commande")}
                  className="inline-flex items-center gap-2 bg-gmo-red text-white text-xs font-heading font-bold px-4 py-2 rounded-lg hover:bg-gmo-red/90">
                  <ShoppingCart className="w-3.5 h-3.5" /> Passer une commande
                </button>
                <button onClick={() => setTab("stocks")}
                  className="inline-flex items-center gap-2 border border-white/20 text-white/60 text-xs font-body px-4 py-2 rounded-lg hover:border-white/40 hover:text-white transition-colors">
                  <Package className="w-3.5 h-3.5" /> Voir les stocks
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: "Commandes actives", value: activeOrders.length || "0", icon: Truck, color: "text-gmo-red" },
                { label: "Produits disponibles", value: products.filter(p => p.stock_quantity > 0).length || products.length, icon: Package, color: "text-gmo-green" },
                { label: "Alertes stock", value: lowStock.length || "0", icon: AlertTriangle, color: "text-amber-500" },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <s.icon className={`w-4 h-4 ${s.color} mb-2`} />
                  <p className="font-heading text-xl font-bold text-obsidian">{s.value}</p>
                  <p className="text-[11px] text-obsidian/40 font-body mt-0.5 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Alerts */}
            {lowStock.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <p className="font-heading text-sm font-bold text-amber-800">{lowStock.length} produit(s) en stock faible</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {lowStock.slice(0,4).map(p => (
                    <span key={p.id} className="text-[11px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-body">{p.name}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Fidélité */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
                <Star className="w-5 h-5 text-gold fill-gold" />
              </div>
              <div className="flex-1">
                <p className="font-heading text-sm font-bold text-obsidian">Programme fidélité — Bronze</p>
                <p className="text-xs text-obsidian/45 font-body">Remises progressives selon volume d'achat</p>
              </div>
              <div className="text-right">
                <p className="font-heading text-lg font-bold text-obsidian">5%</p>
                <p className="text-[10px] text-obsidian/35 font-body">Remise actuelle</p>
              </div>
            </div>
          </div>
        )}

        {/* ── CATALOGUE GALERIE ── */}
        {tab === "catalogue" && (
          <div>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div>
                <h2 className="font-heading text-xl font-bold text-obsidian">Catalogue produits</h2>
                <p className="text-xs text-obsidian/40 font-body mt-0.5">Tarifs grossiste · Ajout rapide au panier</p>
              </div>
              <a
                href={`data:text/html;charset=utf-8,${encodeURIComponent(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Catalogue GMO Burkina</title><style>body{font-family:Arial,sans-serif;margin:30px;color:#1C1C1E}h1{color:#1A7A2E;border-bottom:3px solid #1A7A2E;padding-bottom:10px}table{width:100%;border-collapse:collapse;margin-top:20px}th{background:#1A7A2E;color:white;padding:10px;text-align:left;font-size:12px}td{padding:8px 10px;border-bottom:1px solid #eee;font-size:12px}tr:nth-child(even){background:#f9f9f9}.footer{margin-top:30px;color:#999;font-size:10px;text-align:center}</style></head><body><h1>📦 Catalogue Produits — GMO Burkina</h1><p style="color:#666;font-size:12px">Tarifs grossiste en vigueur · ${new Date().toLocaleDateString('fr-FR')}</p><table><tr><th>Produit</th><th>Catégorie</th><th>Unité</th><th>Prix Grossiste (FCFA)</th><th>Stock</th></tr>${products.map(p=>`<tr><td><strong>${p.name}</strong></td><td>${p.category||'—'}</td><td>${p.unit||'unité'}</td><td><strong>${(p.wholesale_price||p.unit_price||0).toLocaleString()}</strong></td><td>${p.stock_quantity||0}</td></tr>`).join('')}</table><div class="footer">GMO Burkina · Quartier Dapoya, Ouagadougou · +226 25 33 19 00 · infos@gmoburkina.com</div></body></html>`)}`}
                download="Catalogue-GMO-Burkina.html"
                className="flex items-center gap-2 bg-gmo-green text-white font-heading font-bold text-xs px-4 py-2.5 rounded-xl btn-glow-green"
              >
                <Download className="w-3.5 h-3.5" /> Télécharger catalogue PDF
              </a>
            </div>
            <ProductGallery
              products={products}
              cart={cart}
              setCart={setCart}
              onGoToCart={() => setTab("commande")}
            />
          </div>
        )}

        {/* ── STOCKS ── */}
        {tab === "stocks" && (
          <StocksView products={products} loadingProducts={loadingProducts} onRefresh={loadProducts} />
        )}

        {/* ── COMMANDER ── */}
        {tab === "commande" && (
          <div>
            <div className="mb-5">
              <h2 className="font-heading text-xl font-bold text-obsidian">Réapprovisionnement</h2>
              <p className="text-xs text-obsidian/40 font-body mt-0.5">Sélectionnez les produits et quantités</p>
            </div>

            {products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                <Package className="w-8 h-8 text-obsidian/10 mx-auto mb-2" />
                <p className="text-sm text-obsidian/35 font-body">Catalogue indisponible</p>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-5">
                {/* Products list */}
                <div className="lg:col-span-2 space-y-2">
                  {products.filter(p => p.stock_quantity !== 0).map(p => {
                    const qty = cart[p.id] || 0;
                    return (
                      <div key={p.id} className={`bg-white rounded-xl border shadow-sm p-4 flex items-center gap-4 transition-colors ${qty > 0 ? "border-gmo-red/30" : "border-gray-100"}`}>
                        <div className="flex-1 min-w-0">
                          <p className="font-heading text-sm font-bold text-obsidian">{p.name}</p>
                          <p className="text-[11px] text-obsidian/40 font-body">{p.unit || "unité"} · <span className="text-gmo-green font-semibold">{(p.wholesale_price || p.unit_price || 0).toLocaleString()} FCFA</span></p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button onClick={() => setQty(p.id, qty - 1)}
                            className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-obsidian/50 hover:border-gmo-red hover:text-gmo-red transition-colors">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center font-heading text-sm font-bold text-obsidian">{qty}</span>
                          <button onClick={() => setQty(p.id, qty + 1)}
                            className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-obsidian/50 hover:border-gmo-green hover:text-gmo-green transition-colors">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Cart summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-32">
                    <p className="font-heading text-sm font-bold text-obsidian mb-4">Récapitulatif</p>
                    {cartCount === 0 ? (
                      <p className="text-xs text-obsidian/35 font-body py-4 text-center">Aucun produit sélectionné</p>
                    ) : (
                      <div className="space-y-2 mb-4">
                        {Object.entries(cart).map(([id, qty]) => {
                          const p = products.find(p => p.id === id);
                          if (!p) return null;
                          return (
                            <div key={id} className="flex justify-between text-xs font-body">
                              <span className="text-obsidian/60">{p.name} ×{qty}</span>
                              <span className="font-semibold text-obsidian">{((p.wholesale_price || p.unit_price || 0) * qty).toLocaleString()}</span>
                            </div>
                          );
                        })}
                        <div className="border-t border-gray-100 pt-2 flex justify-between">
                          <span className="font-heading text-sm font-bold text-obsidian">Total</span>
                          <span className="font-heading text-sm font-bold text-gmo-green">{cartTotal.toLocaleString()} FCFA</span>
                        </div>
                      </div>
                    )}
                    {/* Delivery mode selector */}
                    <div className="mb-4">
                      <p className="text-[10px] uppercase tracking-widest font-heading text-obsidian/40 mb-2">Mode de récupération</p>
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => setDeliveryMode("livraison")}
                          className={`flex flex-col items-center gap-1 py-3 rounded-xl border text-xs font-body transition-all ${deliveryMode === "livraison" ? "border-gmo-red bg-gmo-red/5 text-gmo-red" : "border-gray-200 text-obsidian/40 hover:border-gmo-red/30"}`}>
                          <Truck className="w-4 h-4" />
                          Livraison
                        </button>
                        <button onClick={() => setDeliveryMode("enlevement")}
                          className={`flex flex-col items-center gap-1 py-3 rounded-xl border text-xs font-body transition-all ${deliveryMode === "enlevement" ? "border-gmo-green bg-gmo-green/5 text-gmo-green" : "border-gray-200 text-obsidian/40 hover:border-gmo-green/30"}`}>
                          <Home className="w-4 h-4" />
                          Enlèvement
                        </button>
                      </div>
                      {deliveryMode === "livraison" && (
                        <input
                          value={deliveryAddress}
                          onChange={e => setDeliveryAddress(e.target.value)}
                          placeholder="Adresse de livraison..."
                          className="mt-2 w-full border border-gray-200 rounded-xl px-3 py-2 text-xs font-body focus:outline-none focus:border-gmo-red"
                        />
                      )}
                      {deliveryMode === "enlevement" && (
                        <p className="mt-2 text-[10px] text-gmo-green font-body bg-gmo-green/5 border border-gmo-green/20 rounded-lg p-2">
                          📍 À retirer au dépôt GMO — Quartier Dapoya, Ouagadougou
                        </p>
                      )}
                    </div>
                    <button
                      onClick={submitOrder}
                      disabled={cartCount === 0 || submitting}
                      className="w-full flex items-center justify-center gap-2 bg-gmo-red text-white font-heading font-bold text-sm py-3 rounded-xl hover:bg-gmo-red/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                      {submitting ? "Envoi..." : "Envoyer la commande"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── LIVRAISONS ── */}
        {tab === "livraisons" && (
          <div>
            <h2 className="font-heading text-xl font-bold text-obsidian mb-5">Mes commandes & livraisons</h2>
            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                <Truck className="w-8 h-8 text-obsidian/10 mx-auto mb-2" />
                <p className="text-sm text-obsidian/35 font-body mb-3">Aucune commande passée</p>
                <button onClick={() => setTab("commande")} className="text-xs text-gmo-red font-body hover:underline">
                  Passer une commande →
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map(o => (
                  <div key={o.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-heading text-sm font-bold text-obsidian">{o.order_number || `CMD-${o.id?.slice(-6)}`}</p>
                        <p className="text-[11px] text-obsidian/40 font-body mt-0.5">{new Date(o.created_date).toLocaleDateString("fr-FR")}</p>
                        {o.items?.length > 0 && (
                          <p className="text-xs text-obsidian/50 font-body mt-1">{o.items.length} produit(s)</p>
                        )}
                      </div>
                      <div className="text-right">
                        {o.total_amount && <p className="font-heading text-sm font-bold text-gmo-green">{o.total_amount.toLocaleString()} FCFA</p>}
                        <span className={`inline-block mt-1 text-[10px] px-2.5 py-1 rounded-full border font-body ${
                          o.status === "livree" ? "text-green-700 bg-green-50 border-green-200"
                          : o.status === "annulee" ? "text-red-600 bg-red-50 border-red-200"
                          : o.status === "en_livraison" ? "text-gmo-green bg-green-50 border-green-200"
                          : "text-amber-600 bg-amber-50 border-amber-200"
                        }`}>
                          {({ en_attente: "En attente", confirmee: "Confirmée", en_preparation: "En prépa.", en_livraison: "En livraison", livree: "Livrée", annulee: "Annulée" })[o.status] || o.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ZONES DE COUVERTURE ── */}
        {tab === "zones" && (
          <div>
            <div className="mb-5">
              <h2 className="font-heading text-xl font-bold text-obsidian">Zones de livraison</h2>
              <p className="text-xs text-obsidian/40 font-body mt-0.5">Visualisez les zones couvertes et planifiez vos livraisons</p>
            </div>
            <CoverageMap
              onSelectZone={(zone) => {
                if (zone.status !== "expansion") {
                  setDeliveryMode("livraison");
                  setDeliveryAddress(zone.name);
                }
              }}
            />
            <div className="mt-4 bg-gmo-green/5 border border-gmo-green/20 rounded-xl p-4 flex items-start gap-3">
              <MapPin className="w-4 h-4 text-gmo-green mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-heading text-sm font-bold text-gmo-green">Planifier une livraison</p>
                <p className="text-xs text-obsidian/55 font-body mt-0.5">Cliquez sur une zone active sur la carte, puis passez votre commande — l'adresse de livraison sera pré-remplie.</p>
                <button onClick={() => setTab("commande")}
                  className="mt-2 text-xs text-gmo-green font-heading font-semibold hover:underline">
                  Passer une commande →
                </button>
              </div>
            </div>
          </div>
        )}

        <p className="text-center text-[11px] text-obsidian/20 font-body mt-8">
          <Link to="/" className="hover:text-gmo-red transition-colors">← Retour au site</Link>
        </p>
      </main>
      <LiveChatWidget />
    </div>
  );
}

export default function RetailerSpace() {
  return (
    <RoleGuard roles={["detaillant", "pdg"]}>
      <RetailerDashboard />
    </RoleGuard>
  );
}