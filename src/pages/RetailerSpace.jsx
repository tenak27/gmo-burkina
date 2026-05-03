import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import RoleGuard from "@/components/auth/RoleGuard";
import { base44 } from "@/api/base44Client";
import {
  Package, Truck, LogOut, Bell, Star, RefreshCw, Phone,
  ShoppingCart, AlertTriangle, CheckCircle2, Plus, Minus, Send, BarChart2
} from "lucide-react";

const TABS = [
  { id: "accueil", label: "Accueil" },
  { id: "stocks", label: "Stocks" },
  { id: "commande", label: "Commander" },
  { id: "livraisons", label: "Livraisons" },
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

        {/* ── STOCKS ── */}
        {tab === "stocks" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-heading text-xl font-bold text-obsidian">Stocks disponibles</h2>
                <p className="text-xs text-obsidian/40 font-body mt-0.5">{products.length} produits · Tarifs grossiste</p>
              </div>
              <button onClick={loadProducts} className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 text-xs text-obsidian/50 hover:border-gmo-red hover:text-gmo-red transition-colors">
                <RefreshCw className={`w-3.5 h-3.5 ${loadingProducts ? "animate-spin" : ""}`} />
              </button>
            </div>

            {products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                <Package className="w-8 h-8 text-obsidian/10 mx-auto mb-2" />
                <p className="text-sm text-obsidian/35 font-body">Catalogue en cours de chargement</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <th className="text-left px-5 py-3 text-[10px] uppercase tracking-widest text-obsidian/40 font-heading">Produit</th>
                        <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-obsidian/40 font-heading hidden sm:table-cell">Catégorie</th>
                        <th className="text-right px-4 py-3 text-[10px] uppercase tracking-widest text-obsidian/40 font-heading">Prix grossiste</th>
                        <th className="text-right px-4 py-3 text-[10px] uppercase tracking-widest text-obsidian/40 font-heading hidden sm:table-cell">Stock</th>
                        <th className="text-center px-4 py-3 text-[10px] uppercase tracking-widest text-obsidian/40 font-heading">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {products.map(p => {
                        const inStock = p.stock_quantity > (p.stock_alert || 0);
                        const lowS = p.stock_quantity <= (p.stock_alert || 0) && p.stock_quantity > 0;
                        return (
                          <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-5 py-3.5">
                              <p className="font-heading text-sm font-semibold text-obsidian">{p.name}</p>
                              <p className="text-[11px] text-obsidian/40 font-body">{p.unit || "unité"}</p>
                            </td>
                            <td className="px-4 py-3.5 hidden sm:table-cell">
                              <span className="text-[11px] text-obsidian/50 font-body capitalize">{p.category || "—"}</span>
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <p className="font-heading text-sm font-bold text-gmo-green">{(p.wholesale_price || p.unit_price || 0).toLocaleString()} FCFA</p>
                            </td>
                            <td className="px-4 py-3.5 text-right hidden sm:table-cell">
                              <p className="font-heading text-sm font-semibold text-obsidian">{p.stock_quantity ?? "—"}</p>
                            </td>
                            <td className="px-4 py-3.5 text-center">
                              {p.stock_quantity === 0 ? (
                                <span className="text-[10px] text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full font-body">Épuisé</span>
                              ) : lowS ? (
                                <span className="text-[10px] text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-body">Faible</span>
                              ) : (
                                <span className="text-[10px] text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full font-body">Dispo</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
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

        <p className="text-center text-[11px] text-obsidian/20 font-body mt-8">
          <Link to="/" className="hover:text-gmo-red transition-colors">← Retour au site</Link>
        </p>
      </main>
    </div>
  );
}

export default function RetailerSpace() {
  return (
    <RoleGuard roles={["detaillant", "admin"]}>
      <RetailerDashboard />
    </RoleGuard>
  );
}