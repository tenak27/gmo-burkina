import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import RoleGuard from "@/components/auth/RoleGuard";
import {
  Users, Package, Truck, BarChart2, Settings, Shield, Bell, TrendingUp,
  LogOut, Eye, Database, Globe, RefreshCw, Plus, Pencil, Trash2, CheckCircle2,
  AlertTriangle, ArrowUp, ArrowDown, ShoppingCart, Search
} from "lucide-react";

const TABS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "users", label: "Utilisateurs" },
  { id: "products", label: "Produits" },
  { id: "orders", label: "Commandes" },
];

const STATUS_LABELS = {
  en_attente: "En attente", confirmee: "Confirmée", en_preparation: "En préparation",
  en_livraison: "En livraison", livree: "Livrée", annulee: "Annulée"
};

function AdminDashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("dashboard");

  // Data
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Forms
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({ name: "", category: "alimentaire", unit_price: "", wholesale_price: "", stock_quantity: "", unit: "carton", is_active: true });
  const [savingProduct, setSavingProduct] = useState(false);
  const [searchOrder, setSearchOrder] = useState("");

  useEffect(() => { loadAll(); }, []);

  useEffect(() => {
    const unsub = base44.entities.Order.subscribe((event) => {
      setOrders(prev => {
        if (event.type === "create") return [event.data, ...prev];
        if (event.type === "update") return prev.map(o => o.id === event.id ? event.data : o);
        if (event.type === "delete") return prev.filter(o => o.id !== event.id);
        return prev;
      });
    });
    return unsub;
  }, []);

  const loadAll = async () => {
    setLoading(true);
    const [u, p, o] = await Promise.all([
      base44.entities.User.list("-created_date", 50),
      base44.entities.Product.list("name", 50),
      base44.entities.Order.list("-created_date", 50),
    ]);
    setUsers(u || []);
    setProducts(p || []);
    setOrders(o || []);
    setLoading(false);
  };

  const saveProduct = async () => {
    setSavingProduct(true);
    const data = {
      ...productForm,
      unit_price: parseFloat(productForm.unit_price) || 0,
      wholesale_price: parseFloat(productForm.wholesale_price) || 0,
      stock_quantity: parseInt(productForm.stock_quantity) || 0,
    };
    if (editingProduct) {
      await base44.entities.Product.update(editingProduct.id, data);
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...data } : p));
    } else {
      const np = await base44.entities.Product.create(data);
      setProducts(prev => [...prev, np]);
    }
    setShowProductForm(false);
    setEditingProduct(null);
    setProductForm({ name: "", category: "alimentaire", unit_price: "", wholesale_price: "", stock_quantity: "", unit: "carton", is_active: true });
    setSavingProduct(false);
  };

  const deleteProduct = async (id) => {
    if (!confirm("Supprimer ce produit ?")) return;
    await base44.entities.Product.delete(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateOrderStatus = async (id, status) => {
    await base44.entities.Order.update(id, { status });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const openEdit = (p) => {
    setEditingProduct(p);
    setProductForm({ name: p.name, category: p.category || "alimentaire", unit_price: p.unit_price || "", wholesale_price: p.wholesale_price || "", stock_quantity: p.stock_quantity || 0, unit: p.unit || "carton", is_active: p.is_active !== false });
    setShowProductForm(true);
  };

  // Stats
  const totalRevenue = orders.filter(o => o.status === "livree").reduce((s, o) => s + (o.total_amount || 0), 0);
  const pendingOrders = orders.filter(o => o.status === "en_attente").length;
  const lowStockCount = products.filter(p => p.stock_quantity <= (p.stock_alert || 10)).length;
  const filteredOrders = orders.filter(o =>
    !searchOrder || o.order_number?.includes(searchOrder) || o.client_name?.toLowerCase().includes(searchOrder.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F2F4F7]">
      {/* Header */}
      <header className="bg-[#1C1C1E] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c7662a636_logo-gmo2x.png" alt="GMO" className="h-7 brightness-0 invert opacity-90" />
            <span className="hidden sm:block w-px h-4 bg-white/15" />
            <div className="hidden sm:flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-gmo-green" />
              <span className="text-[10px] text-gmo-green/70 uppercase tracking-widest font-body">Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {pendingOrders > 0 && (
              <div className="relative">
                <Bell className="w-4 h-4 text-white/40" />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-gmo-red rounded-full text-[8px] text-white flex items-center justify-center font-bold">{pendingOrders}</span>
              </div>
            )}
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gmo-green to-gmo-green/60 flex items-center justify-center text-white text-[11px] font-bold font-heading ml-2">
              {user?.full_name?.charAt(0) || "A"}
            </div>
            <div className="hidden sm:block">
              <p className="text-[11px] font-semibold text-white font-heading leading-none">{user?.full_name}</p>
              <p className="text-[9px] text-gmo-green/60 font-body leading-none mt-0.5">Administrateur</p>
            </div>
            <button onClick={() => logout()} className="ml-2 text-white/25 hover:text-red-400 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex border-t border-white/5 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-5 py-2.5 text-[11px] font-body uppercase tracking-widest border-b-2 transition-colors whitespace-nowrap ${
                tab === t.id ? "border-gmo-green text-gmo-green" : "border-transparent text-white/30 hover:text-white/60"
              }`}
            >{t.label}</button>
          ))}
          <div className="ml-auto flex items-center gap-2 py-1.5">
            <button onClick={loadAll} className="flex items-center gap-1 text-white/25 hover:text-white/60 transition-colors text-[10px] font-body">
              <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} /> Sync
            </button>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* ── DASHBOARD ── */}
        {tab === "dashboard" && (
          <div>
            <div className="mb-6">
              <h1 className="font-heading text-xl font-bold text-obsidian">Tableau de bord</h1>
              <p className="text-xs text-obsidian/40 font-body mt-0.5">Vue d'ensemble · GMO Burkina</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Utilisateurs", value: users.length, icon: Users, color: "text-gmo-green", bg: "bg-gmo-green/10", trend: "+5%" },
                { label: "Commandes totales", value: orders.length, icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-50", trend: pendingOrders > 0 ? `${pendingOrders} en attente` : "À jour" },
                { label: "Chiffre affaires", value: totalRevenue > 0 ? `${(totalRevenue/1000).toFixed(0)}k FCFA` : "—", icon: TrendingUp, color: "text-gmo-green", bg: "bg-gmo-green/10", trend: "+12%" },
                { label: "Alertes stock", value: lowStockCount, icon: AlertTriangle, color: lowStockCount > 0 ? "text-amber-600" : "text-green-600", bg: lowStockCount > 0 ? "bg-amber-50" : "bg-green-50", trend: lowStockCount > 0 ? "À vérifier" : "OK" },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                    <s.icon className={`w-4 h-4 ${s.color}`} />
                  </div>
                  <p className="font-heading text-2xl font-bold text-obsidian">{s.value}</p>
                  <p className="text-[11px] text-obsidian/40 font-body">{s.label}</p>
                  <p className={`text-[10px] font-body mt-1 ${s.color}`}>{s.trend}</p>
                </div>
              ))}
            </div>

            {/* Orders + Users side by side */}
            <div className="grid lg:grid-cols-2 gap-5 mb-5">
              {/* Recent orders */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <p className="font-heading text-sm font-bold text-obsidian">Dernières commandes</p>
                  <button onClick={() => setTab("orders")} className="text-xs text-gmo-green font-body hover:underline">Tout voir</button>
                </div>
                {orders.slice(0, 5).map(o => (
                  <div key={o.id} className="flex items-center gap-3 px-5 py-3 border-b border-gray-50 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="font-heading text-xs font-semibold text-obsidian">{o.order_number || `CMD-${o.id?.slice(-6)}`}</p>
                      <p className="text-[11px] text-obsidian/40 font-body truncate">{o.client_name || o.client_email}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-body whitespace-nowrap ${
                      o.status === "livree" ? "text-green-700 bg-green-50"
                      : o.status === "en_livraison" ? "text-gmo-green bg-green-50"
                      : o.status === "annulee" ? "text-red-600 bg-red-50"
                      : "text-amber-600 bg-amber-50"
                    }`}>{STATUS_LABELS[o.status] || o.status}</span>
                  </div>
                ))}
                {orders.length === 0 && <div className="py-8 text-center text-xs text-obsidian/30 font-body">Aucune commande</div>}
              </div>

              {/* Users overview */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <p className="font-heading text-sm font-bold text-obsidian">Utilisateurs récents</p>
                  <button onClick={() => setTab("users")} className="text-xs text-gmo-green font-body hover:underline">Tout voir</button>
                </div>
                {users.slice(0, 5).map(u => (
                  <div key={u.id} className="flex items-center gap-3 px-5 py-3 border-b border-gray-50 last:border-0">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold font-heading flex-shrink-0 ${u.role === "admin" ? "bg-gmo-green" : u.role === "detaillant" ? "bg-gmo-red" : "bg-obsidian/50"}`}>
                      {u.full_name?.charAt(0) || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading text-xs font-semibold text-obsidian truncate">{u.full_name || "—"}</p>
                      <p className="text-[11px] text-obsidian/40 font-body truncate">{u.email}</p>
                    </div>
                    <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full font-body ${
                      u.role === "admin" ? "bg-gmo-green/10 text-gmo-green" : u.role === "detaillant" ? "bg-gmo-red/10 text-gmo-red" : "bg-gray-100 text-obsidian/40"
                    }`}>{u.role || "user"}</span>
                  </div>
                ))}
                {users.length === 0 && <div className="py-8 text-center text-xs text-obsidian/30 font-body">Aucun utilisateur</div>}
              </div>
            </div>

            {/* Low stock alert */}
            {lowStockCount > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <p className="font-heading text-sm font-bold text-amber-800">{lowStockCount} produit(s) en stock faible</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {products.filter(p => p.stock_quantity <= (p.stock_alert || 10)).map(p => (
                    <span key={p.id} className="text-[11px] text-amber-700 bg-white border border-amber-200 px-3 py-1 rounded-full font-body">
                      {p.name} — {p.stock_quantity} restants
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/client" className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-obsidian/60 hover:border-gmo-green hover:text-gmo-green transition-colors shadow-sm font-body">
                <Eye className="w-3.5 h-3.5" /> Vue Client
              </Link>
              <Link to="/detaillant" className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-obsidian/60 hover:border-gmo-red hover:text-gmo-red transition-colors shadow-sm font-body">
                <Eye className="w-3.5 h-3.5" /> Vue Détaillant
              </Link>
              <Link to="/" className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-obsidian/60 hover:border-obsidian hover:text-obsidian transition-colors shadow-sm font-body">
                <Globe className="w-3.5 h-3.5" /> Site public
              </Link>
            </div>
          </div>
        )}

        {/* ── UTILISATEURS ── */}
        {tab === "users" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-heading text-xl font-bold text-obsidian">Utilisateurs</h2>
                <p className="text-xs text-obsidian/40 font-body mt-0.5">{users.length} comptes inscrits</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/60 border-b border-gray-100">
                      <th className="text-left px-5 py-3 text-[10px] uppercase tracking-widest text-obsidian/40 font-heading">Nom</th>
                      <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-obsidian/40 font-heading hidden sm:table-cell">Email</th>
                      <th className="text-center px-4 py-3 text-[10px] uppercase tracking-widest text-obsidian/40 font-heading">Rôle</th>
                      <th className="text-right px-4 py-3 text-[10px] uppercase tracking-widest text-obsidian/40 font-heading hidden sm:table-cell">Inscrit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold font-heading flex-shrink-0 ${u.role === "admin" ? "bg-gmo-green" : u.role === "detaillant" ? "bg-gmo-red" : "bg-obsidian/40"}`}>
                              {u.full_name?.charAt(0) || "?"}
                            </div>
                            <p className="font-heading text-sm font-semibold text-obsidian">{u.full_name || "—"}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 hidden sm:table-cell">
                          <p className="text-xs text-obsidian/50 font-body">{u.email}</p>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-body ${
                            u.role === "admin" ? "bg-gmo-green/10 text-gmo-green" : u.role === "detaillant" ? "bg-gmo-red/10 text-gmo-red" : "bg-gray-100 text-obsidian/45"
                          }`}>{u.role || "user"}</span>
                        </td>
                        <td className="px-4 py-3.5 text-right hidden sm:table-cell">
                          <p className="text-xs text-obsidian/35 font-body">{new Date(u.created_date).toLocaleDateString("fr-FR")}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && (
                  <div className="py-12 text-center">
                    <Database className="w-8 h-8 text-obsidian/10 mx-auto mb-2" />
                    <p className="text-sm text-obsidian/30 font-body">Aucun utilisateur</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── PRODUCTS ── */}
        {tab === "products" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-heading text-xl font-bold text-obsidian">Produits</h2>
                <p className="text-xs text-obsidian/40 font-body mt-0.5">{products.length} références</p>
              </div>
              <button onClick={() => { setEditingProduct(null); setProductForm({ name: "", category: "alimentaire", unit_price: "", wholesale_price: "", stock_quantity: "", unit: "carton", is_active: true }); setShowProductForm(true); }}
                className="flex items-center gap-2 bg-gmo-green text-white text-xs font-heading font-bold px-4 py-2.5 rounded-xl hover:bg-gmo-green/90 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Nouveau produit
              </button>
            </div>

            {/* Product form */}
            {showProductForm && (
              <div className="bg-white rounded-2xl border border-gmo-green/20 shadow-sm p-6 mb-5">
                <p className="font-heading text-sm font-bold text-obsidian mb-4">{editingProduct ? "Modifier le produit" : "Nouveau produit"}</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-obsidian/40 font-heading block mb-1.5">Nom *</label>
                    <input value={productForm.name} onChange={e => setProductForm(f => ({...f, name: e.target.value}))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body text-obsidian focus:border-gmo-green focus:outline-none" placeholder="Nom du produit" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-obsidian/40 font-heading block mb-1.5">Catégorie</label>
                    <select value={productForm.category} onChange={e => setProductForm(f => ({...f, category: e.target.value}))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body text-obsidian focus:border-gmo-green focus:outline-none">
                      {["alimentaire","hygiene","boisson","cereale","autre"].map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-obsidian/40 font-heading block mb-1.5">Prix unitaire (FCFA)</label>
                    <input type="number" value={productForm.unit_price} onChange={e => setProductForm(f => ({...f, unit_price: e.target.value}))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body text-obsidian focus:border-gmo-green focus:outline-none" placeholder="0" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-obsidian/40 font-heading block mb-1.5">Prix grossiste (FCFA)</label>
                    <input type="number" value={productForm.wholesale_price} onChange={e => setProductForm(f => ({...f, wholesale_price: e.target.value}))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body text-obsidian focus:border-gmo-green focus:outline-none" placeholder="0" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-obsidian/40 font-heading block mb-1.5">Quantité en stock</label>
                    <input type="number" value={productForm.stock_quantity} onChange={e => setProductForm(f => ({...f, stock_quantity: e.target.value}))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body text-obsidian focus:border-gmo-green focus:outline-none" placeholder="0" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-obsidian/40 font-heading block mb-1.5">Unité</label>
                    <input value={productForm.unit} onChange={e => setProductForm(f => ({...f, unit: e.target.value}))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body text-obsidian focus:border-gmo-green focus:outline-none" placeholder="carton, sac, bouteille..." />
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={saveProduct} disabled={!productForm.name || savingProduct}
                    className="flex items-center gap-2 bg-gmo-green text-white text-xs font-heading font-bold px-5 py-2.5 rounded-xl hover:bg-gmo-green/90 transition-colors disabled:opacity-40">
                    {savingProduct ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    {editingProduct ? "Enregistrer" : "Créer"}
                  </button>
                  <button onClick={() => { setShowProductForm(false); setEditingProduct(null); }}
                    className="text-xs font-body text-obsidian/50 hover:text-obsidian transition-colors px-4 py-2.5 border border-gray-200 rounded-xl">
                    Annuler
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/60 border-b border-gray-100">
                      <th className="text-left px-5 py-3 text-[10px] uppercase tracking-widest text-obsidian/40 font-heading">Produit</th>
                      <th className="text-right px-4 py-3 text-[10px] uppercase tracking-widest text-obsidian/40 font-heading hidden sm:table-cell">Prix unitaire</th>
                      <th className="text-right px-4 py-3 text-[10px] uppercase tracking-widest text-obsidian/40 font-heading hidden sm:table-cell">Prix gros</th>
                      <th className="text-right px-4 py-3 text-[10px] uppercase tracking-widest text-obsidian/40 font-heading">Stock</th>
                      <th className="text-center px-4 py-3 text-[10px] uppercase tracking-widest text-obsidian/40 font-heading">Statut</th>
                      <th className="text-right px-5 py-3 text-[10px] uppercase tracking-widest text-obsidian/40 font-heading">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.map(p => {
                      const low = p.stock_quantity <= (p.stock_alert || 10);
                      return (
                        <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-5 py-3.5">
                            <p className="font-heading text-sm font-semibold text-obsidian">{p.name}</p>
                            <p className="text-[11px] text-obsidian/35 font-body capitalize">{p.category || "—"} · {p.unit}</p>
                          </td>
                          <td className="px-4 py-3.5 text-right hidden sm:table-cell">
                            <p className="text-sm font-heading font-bold text-obsidian">{(p.unit_price || 0).toLocaleString()} FCFA</p>
                          </td>
                          <td className="px-4 py-3.5 text-right hidden sm:table-cell">
                            <p className="text-sm font-heading font-bold text-gmo-green">{(p.wholesale_price || 0).toLocaleString()} FCFA</p>
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <p className={`font-heading text-sm font-bold ${low ? "text-amber-600" : "text-obsidian"}`}>{p.stock_quantity ?? "—"}</p>
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            {p.stock_quantity === 0 ? (
                              <span className="text-[10px] text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full font-body">Épuisé</span>
                            ) : low ? (
                              <span className="text-[10px] text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-body">Faible</span>
                            ) : (
                              <span className="text-[10px] text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full font-body">OK</span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => openEdit(p)} className="text-obsidian/30 hover:text-gmo-green transition-colors">
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => deleteProduct(p.id)} className="text-obsidian/30 hover:text-gmo-red transition-colors">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {products.length === 0 && (
                  <div className="py-12 text-center">
                    <Package className="w-8 h-8 text-obsidian/10 mx-auto mb-2" />
                    <p className="text-sm text-obsidian/30 font-body">Aucun produit. Créez votre premier produit.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── ORDERS ── */}
        {tab === "orders" && (
          <div>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div>
                <h2 className="font-heading text-xl font-bold text-obsidian">Commandes</h2>
                <p className="text-xs text-obsidian/40 font-body mt-0.5">{orders.length} commandes · temps réel</p>
              </div>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-obsidian/30" />
                <input value={searchOrder} onChange={e => setSearchOrder(e.target.value)}
                  className="pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs font-body text-obsidian focus:border-gmo-green focus:outline-none w-56" placeholder="Rechercher..." />
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/60 border-b border-gray-100">
                      <th className="text-left px-5 py-3 text-[10px] uppercase tracking-widest text-obsidian/40 font-heading">N° Commande</th>
                      <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-obsidian/40 font-heading hidden sm:table-cell">Client</th>
                      <th className="text-right px-4 py-3 text-[10px] uppercase tracking-widest text-obsidian/40 font-heading hidden sm:table-cell">Montant</th>
                      <th className="text-center px-4 py-3 text-[10px] uppercase tracking-widest text-obsidian/40 font-heading">Statut</th>
                      <th className="text-center px-5 py-3 text-[10px] uppercase tracking-widest text-obsidian/40 font-heading">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredOrders.map(o => (
                      <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-3.5">
                          <p className="font-heading text-xs font-bold text-obsidian">{o.order_number || `CMD-${o.id?.slice(-6)}`}</p>
                          <p className="text-[10px] text-obsidian/35 font-body">{new Date(o.created_date).toLocaleDateString("fr-FR")}</p>
                        </td>
                        <td className="px-4 py-3.5 hidden sm:table-cell">
                          <p className="text-xs font-body text-obsidian/70">{o.client_name || "—"}</p>
                          <span className={`text-[9px] font-body px-1.5 py-0.5 rounded-full ${o.client_type === "detaillant" ? "bg-gmo-red/10 text-gmo-red" : "bg-gray-100 text-obsidian/40"}`}>
                            {o.client_type || "client"}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right hidden sm:table-cell">
                          <p className="font-heading text-xs font-bold text-obsidian">{o.total_amount ? `${o.total_amount.toLocaleString()} FCFA` : "—"}</p>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-body ${
                            o.status === "livree" ? "text-green-700 bg-green-50 border border-green-200"
                            : o.status === "en_livraison" ? "text-gmo-green bg-green-50 border border-green-200"
                            : o.status === "annulee" ? "text-red-600 bg-red-50 border border-red-200"
                            : "text-amber-600 bg-amber-50 border border-amber-200"
                          }`}>{STATUS_LABELS[o.status] || o.status}</span>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <select
                            value={o.status}
                            onChange={e => updateOrderStatus(o.id, e.target.value)}
                            className="text-[10px] font-body text-obsidian/60 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-gmo-green cursor-pointer"
                          >
                            {Object.entries(STATUS_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredOrders.length === 0 && (
                  <div className="py-12 text-center">
                    <ShoppingCart className="w-8 h-8 text-obsidian/10 mx-auto mb-2" />
                    <p className="text-sm text-obsidian/30 font-body">{searchOrder ? "Aucun résultat" : "Aucune commande"}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <p className="text-center text-[11px] text-obsidian/20 font-body mt-10 uppercase tracking-widest">
          GMO Burkina Admin · Accès restreint
        </p>
      </main>
    </div>
  );
}

export default function AdminSpace() {
  return (
    <RoleGuard roles={["admin"]}>
      <AdminDashboard />
    </RoleGuard>
  );
}