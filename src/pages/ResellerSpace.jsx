import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import RoleGuard from "@/components/auth/RoleGuard";
import { base44 } from "@/api/base44Client";
import {
  Package, Truck, LogOut, ShoppingCart, CheckCircle2,
  Plus, Minus, Send, Home, Download, FileText,
  Clock, XCircle, AlertCircle, CreditCard, TrendingUp,
  RefreshCw, ChevronRight
} from "lucide-react";

const STATUS_LABELS = {
  en_attente: "En attente",
  confirmee: "Confirmée",
  en_preparation: "En préparation",
  en_livraison: "En livraison",
  livree: "Livrée",
  annulee: "Annulée"
};

const APPROVAL_LABELS = {
  pending_pdg_approval: { label: "En attente PDG", cls: "text-amber-600 bg-amber-50 border-amber-200" },
  approved: { label: "Approuvée", cls: "text-green-700 bg-green-50 border-green-200" },
  rejected: { label: "Rejetée", cls: "text-red-600 bg-red-50 border-red-200" },
};

const TABS = [
  { id: "dashboard", label: "Tableau de bord" },
  { id: "commander", label: "Commander" },
  { id: "historique", label: "Historique" },
  { id: "credit", label: "Crédit & Solde" },
];

function ResellerDashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("dashboard");

  // Data
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [receivables, setReceivables] = useState([]);
  const [clientInfo, setClientInfo] = useState(null);

  // Order form
  const [cart, setCart] = useState({});
  const [deliveryMode, setDeliveryMode] = useState("enlevement");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadAll();
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

  const loadAll = async () => {
    setLoading(true);
    const [prods, ords, recs, clients] = await Promise.all([
      base44.entities.Product.filter({ is_active: true }, "name", 100),
      base44.entities.Order.filter({ client_email: user.email }, "-created_date", 50),
      base44.entities.Receivable.filter({ client_name: user.full_name }, "-created_date", 50),
      base44.entities.Client.filter({ email: user.email }, "", 1),
    ]);
    setProducts(prods || []);
    setOrders((ords || []).filter(o => o.client_type === "revendeur"));
    setReceivables(recs || []);
    setClientInfo(clients?.[0] || null);
    setLoading(false);
  };

  const setQty = (id, qty) => {
    if (qty <= 0) {
      setCart(c => { const n = { ...c }; delete n[id]; return n; });
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
    const orderNum = `REV-${Date.now().toString().slice(-8)}`;

    await base44.functions.invoke("resellerOrderRequest", {
      order: {
        order_number: orderNum,
        client_email: user.email,
        client_name: user.full_name,
        client_phone: user.phone || "",
        client_type: "revendeur",
        items,
        total_amount: cartTotal,
        status: "en_attente",
        approval_status: "pending_pdg_approval",
        delivery_mode: deliveryMode,
        delivery_address: deliveryMode === "livraison" ? deliveryAddress : "Enlèvement au dépôt GMO",
        payment_method: "credit",
      }
    });

    setCart({});
    setSubmitting(false);
    setOrderSuccess(true);
    setTimeout(() => setOrderSuccess(false), 5000);
    setTab("historique");
    loadAll();
  };

  // Financial metrics
  const totalCredit = clientInfo?.credit_limit || 0;
  const totalDue = receivables.filter(r => r.status !== "soldee").reduce((s, r) => s + (r.remaining_amount || 0), 0);
  const totalPaid = receivables.reduce((s, r) => s + (r.paid_amount || 0), 0);
  const creditUsed = totalDue;
  const creditAvailable = Math.max(0, totalCredit - creditUsed);
  const creditUsedPct = totalCredit > 0 ? Math.min(100, Math.round((creditUsed / totalCredit) * 100)) : 0;

  const activeOrders = orders.filter(o => !["livree", "annulee"].includes(o.status));
  const pendingApproval = orders.filter(o => o.approval_status === "pending_pdg_approval");
  const overdueReceivables = receivables.filter(r => r.status === "en_retard");

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F4F7] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gmo-green/20 border-t-gmo-green rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F4F7]">
      {/* Header */}
      <header className="bg-gradient-to-br from-obsidian to-obsidian/95 sticky top-0 z-40 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c7662a636_logo-gmo2x.png" alt="GMO" className="h-7 brightness-0 invert opacity-90" />
            <span className="hidden sm:block text-[10px] text-gmo-green/70 uppercase tracking-[0.2em] font-body">Revendeur</span>
          </div>
          <div className="flex items-center gap-2">
            {cartCount > 0 && (
              <button onClick={() => setTab("commander")}
                className="flex items-center gap-2 bg-gradient-to-r from-gmo-green to-gmo-green/90 text-white text-[10px] font-heading font-bold px-3 py-1.5 rounded-lg shadow-lg">
                <ShoppingCart className="w-3.5 h-3.5" /> {cartCount}
              </button>
            )}
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gmo-green to-gmo-green/80 flex items-center justify-center text-white text-[11px] font-bold font-heading shadow-md">
              {user?.full_name?.charAt(0) || "R"}
            </div>
            <span className="hidden sm:block text-xs text-white/60 font-body">{user?.full_name}</span>
            <button onClick={() => logout()} className="ml-2 text-white/30 hover:text-gmo-red transition-colors p-1.5 rounded-lg hover:bg-white/5">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
        <nav className="max-w-5xl mx-auto px-4 sm:px-6 flex border-t border-white/5 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-[11px] font-body uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${
                tab === t.id
                  ? "border-gmo-green text-gmo-green font-semibold"
                  : "border-transparent text-white/30 hover:text-white/50"
              }`}
            >{t.label}{t.id === "commander" && cartCount > 0 ? ` (${cartCount})` : ""}</button>
          ))}
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {orderSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-heading text-sm font-bold text-green-800">Commande envoyée au PDG pour approbation !</p>
              <p className="text-xs text-green-600 font-body">Vous serez notifié par email dès qu'elle sera approuvée.</p>
            </div>
          </div>
        )}

        {/* ── DASHBOARD ── */}
        {tab === "dashboard" && (
          <div className="space-y-5">
            {/* Hero banner */}
            <div className="bg-gradient-to-r from-obsidian via-obsidian/95 to-gmo-green/70 rounded-2xl p-6 text-white shadow-xl border border-white/5">
              <p className="text-[11px] text-white/40 uppercase tracking-widest font-body mb-1">Espace Revendeur</p>
              <h1 className="font-heading text-2xl font-bold mb-1">{user?.full_name} 👋</h1>
              <p className="text-sm text-white/45 font-body mb-4">Gérez vos commandes et votre ligne de crédit GMO.</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setTab("commander")}
                  className="inline-flex items-center gap-2 bg-gmo-green text-white text-xs font-heading font-bold px-4 py-2 rounded-lg hover:bg-gmo-green/90">
                  <ShoppingCart className="w-3.5 h-3.5" /> Passer une commande
                </button>
                <button onClick={() => setTab("credit")}
                  className="inline-flex items-center gap-2 bg-white/10 text-white text-xs font-heading font-bold px-4 py-2 rounded-lg hover:bg-white/15">
                  <CreditCard className="w-3.5 h-3.5" /> Voir mon crédit
                </button>
              </div>
            </div>

            {/* Alerts */}
            {(overdueReceivables.length > 0 || pendingApproval.length > 0) && (
              <div className="space-y-2">
                {overdueReceivables.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-heading text-sm font-bold text-red-700">{overdueReceivables.length} créance(s) en retard</p>
                      <p className="text-xs text-red-500 font-body">Solde en retard : {overdueReceivables.reduce((s, r) => s + (r.remaining_amount || 0), 0).toLocaleString()} FCFA</p>
                    </div>
                    <button onClick={() => setTab("credit")} className="text-xs text-red-600 font-heading font-bold hover:underline flex items-center gap-1">
                      Voir <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {pendingApproval.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
                    <Clock className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <p className="text-sm text-amber-700 font-body flex-1">
                      <span className="font-heading font-bold">{pendingApproval.length} commande(s)</span> en attente d'approbation PDG
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Commandes actives", value: activeOrders.length, icon: Truck, color: "text-gmo-green", bg: "bg-gmo-green/10" },
                { label: "En attente PDG", value: pendingApproval.length, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
                { label: "Solde dû (FCFA)", value: totalDue.toLocaleString(), icon: CreditCard, color: "text-red-500", bg: "bg-red-50" },
                { label: "Crédit disponible", value: creditAvailable.toLocaleString(), icon: TrendingUp, color: "text-gmo-green", bg: "bg-gmo-green/10" },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className={`w-8 h-8 ${s.bg} rounded-lg flex items-center justify-center mb-3`}>
                    <s.icon className={`w-4 h-4 ${s.color}`} />
                  </div>
                  <p className="font-heading text-xl font-bold text-obsidian">{s.value}</p>
                  <p className="text-[11px] text-obsidian/40 font-body mt-0.5 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Recent orders */}
            {orders.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-heading text-sm font-bold text-obsidian">Commandes récentes</p>
                  <button onClick={() => setTab("historique")} className="text-xs text-gmo-green font-body hover:underline flex items-center gap-1">
                    Tout voir <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-2">
                  {orders.slice(0, 4).map(o => (
                    <div key={o.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="font-heading text-xs font-bold text-obsidian">{o.order_number}</p>
                        <p className="text-[10px] text-obsidian/40 font-body">{new Date(o.created_date).toLocaleDateString("fr-FR")}</p>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <span className="font-heading text-xs font-bold text-gmo-green">{(o.total_amount || 0).toLocaleString()} FCFA</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-body ${APPROVAL_LABELS[o.approval_status]?.cls || "text-gray-500 bg-gray-50 border-gray-200"}`}>
                          {APPROVAL_LABELS[o.approval_status]?.label || STATUS_LABELS[o.status]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── COMMANDER ── */}
        {tab === "commander" && (
          <div>
            <div className="mb-5">
              <h2 className="font-heading text-xl font-bold text-obsidian">Nouvelle commande revendeur</h2>
              <p className="text-xs text-obsidian/40 font-body mt-0.5">La commande sera soumise à l'approbation du PDG · Tarifs grossiste</p>
            </div>
            <div className="grid lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 space-y-2">
                {products.filter(p => p.stock_quantity !== 0).map(p => {
                  const qty = cart[p.id] || 0;
                  return (
                    <div key={p.id} className={`bg-white rounded-xl border shadow-sm p-4 flex items-center gap-4 transition-colors ${qty > 0 ? "border-gmo-green/30 bg-gmo-green/[0.02]" : "border-gray-100"}`}>
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

                  {/* Credit check */}
                  {cartTotal > 0 && (
                    <div className={`mb-4 p-3 rounded-xl text-xs font-body ${cartTotal <= creditAvailable ? "bg-gmo-green/5 border border-gmo-green/20 text-gmo-green" : "bg-red-50 border border-red-200 text-red-600"}`}>
                      {cartTotal <= creditAvailable
                        ? `✓ Crédit disponible : ${creditAvailable.toLocaleString()} FCFA`
                        : `⚠ Dépassement de crédit · Disponible : ${creditAvailable.toLocaleString()} FCFA`}
                    </div>
                  )}

                  {/* Mode livraison */}
                  <div className="mb-4">
                    <p className="text-[10px] uppercase tracking-widest font-heading text-obsidian/40 mb-2">Mode de récupération</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => setDeliveryMode("enlevement")}
                        className={`flex flex-col items-center gap-1 py-3 rounded-xl border text-xs font-body transition-all ${deliveryMode === "enlevement" ? "border-gmo-green bg-gmo-green/5 text-gmo-green" : "border-gray-200 text-obsidian/40"}`}>
                        <Home className="w-4 h-4" /> Enlèvement
                      </button>
                      <button onClick={() => setDeliveryMode("livraison")}
                        className={`flex flex-col items-center gap-1 py-3 rounded-xl border text-xs font-body transition-all ${deliveryMode === "livraison" ? "border-gmo-green bg-gmo-green/5 text-gmo-green" : "border-gray-200 text-obsidian/40"}`}>
                        <Truck className="w-4 h-4" /> Livraison
                      </button>
                    </div>
                    {deliveryMode === "livraison" && (
                      <input value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)}
                        placeholder="Adresse de livraison..."
                        className="mt-2 w-full border border-gray-200 rounded-xl px-3 py-2 text-xs font-body focus:outline-none focus:border-gmo-green" />
                    )}
                  </div>

                  <button onClick={submitOrder} disabled={cartCount === 0 || submitting}
                    className="w-full flex items-center justify-center gap-2 bg-gmo-green text-white font-heading font-bold text-sm py-3 rounded-xl hover:bg-gmo-green/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                    {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                    {submitting ? "Envoi..." : "Soumettre au PDG"}
                  </button>
                  <p className="text-[10px] text-obsidian/30 text-center mt-2 font-body">La commande sera approuvée par le PDG avant traitement</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── HISTORIQUE ── */}
        {tab === "historique" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-heading text-xl font-bold text-obsidian">Historique des commandes</h2>
                <p className="text-xs text-obsidian/40 font-body mt-0.5">{orders.length} commande(s) au total</p>
              </div>
              <button onClick={loadAll} className="flex items-center gap-1.5 text-xs text-obsidian/50 border border-gray-200 rounded-xl px-3 py-2 hover:border-gmo-green hover:text-gmo-green transition-colors">
                <RefreshCw className="w-3.5 h-3.5" /> Actualiser
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <Package className="w-10 h-10 text-obsidian/10 mx-auto mb-3" />
                <p className="text-sm text-obsidian/35 font-body mb-3">Aucune commande passée</p>
                <button onClick={() => setTab("commander")} className="text-xs text-gmo-green font-heading font-bold hover:underline">
                  Passer une commande →
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map(o => {
                  const approvalCfg = APPROVAL_LABELS[o.approval_status];
                  return (
                    <div key={o.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-heading text-sm font-bold text-obsidian">{o.order_number || `CMD-${o.id?.slice(-6)}`}</p>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-body ${approvalCfg?.cls || "text-gray-500 bg-gray-50 border-gray-200"}`}>
                              {approvalCfg?.label || STATUS_LABELS[o.status]}
                            </span>
                          </div>
                          <p className="text-[11px] text-obsidian/40 font-body mt-1">{new Date(o.created_date).toLocaleDateString("fr-FR")} · {o.items?.length || 0} article(s)</p>
                          {o.items?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {o.items.slice(0, 3).map((item, i) => (
                                <span key={i} className="text-[10px] bg-gray-50 border border-gray-100 px-2 py-0.5 rounded font-body text-obsidian/50">
                                  {item.name} ×{item.qty}
                                </span>
                              ))}
                              {o.items.length > 3 && <span className="text-[10px] text-obsidian/30 font-body">+{o.items.length - 3}</span>}
                            </div>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-heading text-base font-bold text-gmo-green">{(o.total_amount || 0).toLocaleString()} FCFA</p>
                          <p className="text-[10px] text-obsidian/35 font-body mt-0.5">{({ especes: "Espèces", credit: "Crédit", mobile_money: "Mobile Money", cheque: "Chèque", virement: "Virement" })[o.payment_method] || o.payment_method}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── CRÉDIT & SOLDE ── */}
        {tab === "credit" && (
          <div className="space-y-5">
            <div>
              <h2 className="font-heading text-xl font-bold text-obsidian">Crédit & Solde</h2>
              <p className="text-xs text-obsidian/40 font-body mt-0.5">Suivi de votre ligne de crédit et des remboursements</p>
            </div>

            {/* Credit overview */}
            <div className="bg-gradient-to-br from-obsidian to-obsidian/90 rounded-2xl p-6 text-white shadow-xl border border-white/5">
              <p className="text-[11px] text-white/40 uppercase tracking-widest font-body mb-4">Ligne de crédit</p>
              <div className="grid grid-cols-3 gap-4 mb-5">
                <div>
                  <p className="font-heading text-2xl font-bold">{totalCredit.toLocaleString()}</p>
                  <p className="text-[10px] text-white/40 font-body mt-0.5">Crédit accordé (FCFA)</p>
                </div>
                <div>
                  <p className={`font-heading text-2xl font-bold ${totalDue > 0 ? "text-red-400" : "text-gmo-green"}`}>{totalDue.toLocaleString()}</p>
                  <p className="text-[10px] text-white/40 font-body mt-0.5">Solde dû (FCFA)</p>
                </div>
                <div>
                  <p className={`font-heading text-2xl font-bold ${creditAvailable > 0 ? "text-gmo-green" : "text-red-400"}`}>{creditAvailable.toLocaleString()}</p>
                  <p className="text-[10px] text-white/40 font-body mt-0.5">Disponible (FCFA)</p>
                </div>
              </div>
              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-[10px] text-white/40 font-body mb-1.5">
                  <span>Utilisation : {creditUsedPct}%</span>
                  <span>{creditUsed.toLocaleString()} / {totalCredit.toLocaleString()} FCFA</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${creditUsedPct > 80 ? "bg-red-400" : creditUsedPct > 50 ? "bg-amber-400" : "bg-gmo-green"}`}
                    style={{ width: `${creditUsedPct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Totals recap */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: "Total acheté", value: orders.filter(o => o.approval_status === "approved").reduce((s, o) => s + (o.total_amount || 0), 0).toLocaleString(), suffix: "FCFA", color: "text-obsidian" },
                { label: "Total remboursé", value: totalPaid.toLocaleString(), suffix: "FCFA", color: "text-gmo-green" },
                { label: "Créances en retard", value: overdueReceivables.length.toString(), suffix: "créance(s)", color: overdueReceivables.length > 0 ? "text-red-500" : "text-obsidian" },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <p className={`font-heading text-xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-[10px] text-obsidian/40 font-body mt-0.5">{s.label}</p>
                  <p className="text-[10px] text-obsidian/25 font-body">{s.suffix}</p>
                </div>
              ))}
            </div>

            {/* Receivables list */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="p-5 border-b border-gray-50 flex items-center justify-between">
                <p className="font-heading text-sm font-bold text-obsidian">Détail des créances</p>
                <span className="text-xs text-obsidian/40 font-body">{receivables.length} entrée(s)</span>
              </div>
              {receivables.length === 0 ? (
                <div className="p-10 text-center">
                  <FileText className="w-8 h-8 text-obsidian/10 mx-auto mb-2" />
                  <p className="text-sm text-obsidian/35 font-body">Aucune créance enregistrée</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {receivables.map(r => {
                    const statusCfg = {
                      en_cours: { label: "En cours", cls: "text-blue-600 bg-blue-50 border-blue-200" },
                      en_retard: { label: "En retard", cls: "text-red-600 bg-red-50 border-red-200" },
                      soldee: { label: "Soldée ✓", cls: "text-green-700 bg-green-50 border-green-200" },
                      contentieux: { label: "Contentieux", cls: "text-purple-600 bg-purple-50 border-purple-200" },
                    }[r.status] || { label: r.status, cls: "text-gray-500 bg-gray-50 border-gray-200" };

                    return (
                      <div key={r.id} className="p-4 flex items-center gap-4">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${r.status === "soldee" ? "bg-green-50" : r.status === "en_retard" ? "bg-red-50" : "bg-blue-50"}`}>
                          {r.status === "soldee" ? <CheckCircle2 className="w-4 h-4 text-green-600" />
                            : r.status === "en_retard" ? <AlertCircle className="w-4 h-4 text-red-500" />
                            : <CreditCard className="w-4 h-4 text-blue-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-heading text-xs font-bold text-obsidian truncate">{r.invoice_number || `Créance ${r.id?.slice(-6)}`}</p>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-body ${statusCfg.cls}`}>{statusCfg.label}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-0.5">
                            <p className="text-[10px] text-obsidian/40 font-body">Montant initial : {(r.original_amount || 0).toLocaleString()} FCFA</p>
                            {r.due_date && <p className="text-[10px] text-obsidian/30 font-body">Échéance : {new Date(r.due_date).toLocaleDateString("fr-FR")}</p>}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className={`font-heading text-sm font-bold ${r.remaining_amount > 0 ? "text-red-500" : "text-gmo-green"}`}>
                            {(r.remaining_amount || 0).toLocaleString()} FCFA
                          </p>
                          <p className="text-[10px] text-obsidian/35 font-body">Restant dû</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {totalDue > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-heading text-sm font-bold text-amber-800">Rappel de paiement</p>
                  <p className="text-xs text-amber-600 font-body mt-0.5">
                    Vous avez un solde de <strong>{totalDue.toLocaleString()} FCFA</strong> à rembourser.
                    Contactez l'administration GMO pour effectuer votre règlement.
                  </p>
                  <a href="https://wa.me/+22670213831" target="_blank" rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-xs text-amber-700 font-heading font-bold hover:underline">
                    Contacter GMO via WhatsApp →
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        <p className="text-center text-[11px] text-obsidian/20 font-body mt-6">
          <Link to="/" className="hover:text-gmo-green transition-colors">← Retour au site</Link>
        </p>
      </main>
    </div>
  );
}

export default function ResellerSpace() {
  return (
    <RoleGuard roles={["revendeur", "pdg"]}>
      <ResellerDashboard />
    </RoleGuard>
  );
}