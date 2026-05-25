/**
 * Formulaire de commandes - Design unifié centré
 */
import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { X, Save, Plus, Trash2, Search, Package, Truck, Home, AlertCircle, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const STATUS_OPTIONS = [
  { value: "en_attente",    label: "En attente" },
  { value: "confirmee",     label: "Confirmée" },
  { value: "en_preparation",label: "En préparation" },
  { value: "en_livraison",  label: "En livraison" },
  { value: "livree",        label: "Livrée" },
  { value: "annulee",       label: "Annulée" },
];

const PAYMENT_OPTIONS = [
  { value: "especes",      label: "Espèces" },
  { value: "cheque",       label: "Chèque" },
  { value: "mobile_money", label: "Mobile Money" },
  { value: "virement",     label: "Virement" },
  { value: "credit",       label: "Crédit" },
  { value: "partiel",      label: "Partiel" },
];

export default function SaleOrderForm({ order, onSave, onClose, clients = [], products = [], drivers = [] }) {
  const isEdit = !!order;

  const [form, setForm] = useState({
    order_number:     order?.order_number     || `CMD-${Date.now().toString().slice(-7)}`,
    client_email:     order?.client_email     || "",
    client_name:      order?.client_name      || "",
    client_phone:     order?.client_phone     || "",
    client_type:      order?.client_type      || "client",
    items:            order?.items?.length ? order.items : [{ product_id: "", name: "", qty: 1, unit_price: 0 }],
    status:           order?.status           || "en_attente",
    delivery_mode:    order?.delivery_mode    || "livraison",
    delivery_address: order?.delivery_address || "",
    delivery_city:    order?.delivery_city    || "",
    driver_id:        order?.driver_id        || "",
    driver_name:      order?.driver_name      || "",
    payment_method:   order?.payment_method   || "especes",
    payment_status:   order?.payment_status   || "non_paye",
    notes:            order?.notes            || "",
    estimated_delivery: order?.estimated_delivery || "",
  });

  const [clientSearch, setClientSearch] = useState("");
  const [clientOpen, setClientOpen] = useState(false);
  const [productSearches, setProductSearches] = useState({});
  const [productDropdowns, setProductDropdowns] = useState({});
  const [saving, setSaving] = useState(false);

  const total = useMemo(() =>
    form.items.reduce((s, it) => s + (parseFloat(it.qty) || 0) * (parseFloat(it.unit_price) || 0), 0),
    [form.items]
  );

  const filteredClients = useMemo(() => {
    if (!clientSearch) return clients.slice(0, 8);
    return clients.filter(c =>
      c.name?.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.email?.toLowerCase().includes(clientSearch.toLowerCase())
    ).slice(0, 8);
  }, [clients, clientSearch]);

  const selectClient = (client) => {
    setForm(f => ({ ...f, client_email: client.email || "", client_name: client.name, client_phone: client.phone || "" }));
    setClientOpen(false);
    setClientSearch("");
  };

  const setItem = (idx, key, value) => {
    setForm(f => {
      const items = [...f.items];
      items[idx] = { ...items[idx], [key]: value };
      return { ...f, items };
    });
  };

  const selectProduct = (idx, product) => {
    const useWholesale = form.client_type === "detaillant";
    setForm(f => {
      const items = [...f.items];
      items[idx] = {
        ...items[idx],
        product_id: product.id,
        name: product.name,
        unit_price: (useWholesale ? product.wholesale_price : product.unit_price) || product.unit_price || 0,
      };
      return { ...f, items };
    });
    setProductSearches(s => ({ ...s, [idx]: "" }));
    setProductDropdowns(d => ({ ...d, [idx]: false }));
  };

  const addItem = () => setForm(f => ({ ...f, items: [...f.items, { product_id: "", name: "", qty: 1, unit_price: 0 }] }));
  const removeItem = (idx) => setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));

  const selectDriver = (driver) => {
    setForm(f => ({ ...f, driver_id: driver.id, driver_name: `${driver.first_name} ${driver.last_name}` }));
  };

  const handleSave = async () => {
    if (!form.client_name || form.items.every(it => !it.name)) return;
    setSaving(true);
    const data = { ...form, total_amount: total };
    if (isEdit) {
      await base44.entities.Order.update(order.id, data);
    } else {
      await base44.entities.Order.create(data);
    }
    setSaving(false);
    onSave(data);
  };

  const filteredProducts = (idx) => {
    const search = productSearches[idx] || "";
    if (!search) return products.slice(0, 8);
    return products.filter(p => p.name?.toLowerCase().includes(search.toLowerCase())).slice(0, 8);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 28, stiffness: 350 }}
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] border border-gray-100 my-4"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#1E3A5F] to-[#2D4A6F] border-b border-white/10 px-6 py-5 flex items-center justify-between">
          <div>
            <p className="font-heading text-lg font-bold text-white tracking-tight">{isEdit ? "Modifier" : "Nouvelle"} Commande</p>
            <p className="text-[10px] text-white/50 font-body mt-0.5 uppercase tracking-wider">{form.order_number}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="max-w-4xl mx-auto space-y-6">

            {/* Client */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest font-heading text-obsidian/40 mb-3">Client</p>
              <div className="relative mb-4">
                <button type="button" onClick={() => setClientOpen(o => !o)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-body text-obsidian placeholder:text-obsidian/30 focus:outline-none focus:bg-white focus:border-gmo-green focus:ring-2 focus:ring-gmo-green/10 transition-all flex items-center justify-between cursor-pointer">
                  <span className={form.client_name ? "text-obsidian" : "text-obsidian/30"}>
                    {form.client_name || "Choisir un client…"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-obsidian/30 flex-shrink-0" />
                </button>
                {clientOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden">
                    <div className="p-3 border-b border-gray-50">
                      <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                        <Search className="w-3.5 h-3.5 text-obsidian/30" />
                        <input autoFocus value={clientSearch} onChange={e => setClientSearch(e.target.value)} placeholder="Rechercher…"
                          className="flex-1 text-xs font-body bg-transparent focus:outline-none text-obsidian" />
                      </div>
                    </div>
                    <div className="max-h-44 overflow-y-auto">
                      {filteredClients.length === 0
                        ? <p className="text-xs text-obsidian/30 font-body text-center py-3">Aucun client trouvé</p>
                        : filteredClients.map(c => (
                          <button key={c.id} onClick={() => selectClient(c)}
                            className="w-full text-left px-4 py-2.5 hover:bg-gmo-green/5 flex items-center gap-3 transition-colors cursor-pointer border-b border-gray-50 last:border-0">
                            <div className="w-7 h-7 rounded-full bg-gmo-green/15 flex items-center justify-center text-gmo-green font-bold text-xs flex-shrink-0">
                              {c.name?.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-heading font-bold text-obsidian truncate">{c.name}</p>
                              <p className="text-[10px] text-obsidian/40 font-body truncate">{c.email || c.phone}</p>
                            </div>
                          </button>
                        ))
                      }
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest font-heading text-obsidian/40 mb-2">Nom *</p>
                  <input value={form.client_name} onChange={e => setForm(f => ({ ...f, client_name: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:border-gmo-green focus:ring-2 focus:ring-gmo-green/10 transition-all" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest font-heading text-obsidian/40 mb-2">Téléphone</p>
                  <input value={form.client_phone} onChange={e => setForm(f => ({ ...f, client_phone: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:border-gmo-green focus:ring-2 focus:ring-gmo-green/10 transition-all" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest font-heading text-obsidian/40 mb-2">Email</p>
                  <input type="email" value={form.client_email} onChange={e => setForm(f => ({ ...f, client_email: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:border-gmo-green focus:ring-2 focus:ring-gmo-green/10 transition-all" />
                </div>
                <div className="sm:col-span-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest font-heading text-obsidian/40 mb-2">Type client</p>
                  <select value={form.client_type} onChange={e => setForm(f => ({ ...f, client_type: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:border-gmo-green focus:ring-2 focus:ring-gmo-green/10 transition-all">
                    <option value="client">Client particulier</option>
                    <option value="detaillant">Détaillant (prix gros)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold uppercase tracking-widest font-heading text-obsidian/40">Produits commandés</p>
                <button onClick={addItem} className="flex items-center gap-1.5 text-xs text-gmo-green font-heading font-bold hover:opacity-70 cursor-pointer">
                  <Plus className="w-3.5 h-3.5" /> Ajouter
                </button>
              </div>

              <div className="space-y-3">
                {form.items.map((item, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-xl border border-gray-100 p-4 space-y-3">
                    <div className="relative">
                      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2.5 focus-within:border-gmo-green transition-colors">
                        <Search className="w-3.5 h-3.5 text-obsidian/25 flex-shrink-0" />
                        <input
                          value={productSearches[idx] ?? item.name}
                          onChange={e => {
                            setProductSearches(s => ({ ...s, [idx]: e.target.value }));
                            setProductDropdowns(d => ({ ...d, [idx]: true }));
                            if (!e.target.value) setItem(idx, "name", "");
                          }}
                          onFocus={() => setProductDropdowns(d => ({ ...d, [idx]: true }))}
                          placeholder="Rechercher un produit…"
                          className="flex-1 text-xs font-body bg-transparent focus:outline-none text-obsidian placeholder:text-obsidian/30"
                        />
                      </div>
                      {productDropdowns[idx] && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-20 max-h-40 overflow-y-auto">
                          {filteredProducts(idx).map(p => (
                            <button key={p.id} onMouseDown={() => selectProduct(idx, p)}
                              className="w-full text-left px-4 py-2.5 hover:bg-gmo-green/5 flex items-center justify-between gap-3 cursor-pointer border-b border-gray-50 last:border-0">
                              <div className="min-w-0">
                                <p className="text-xs font-heading font-bold text-obsidian truncate">{p.name}</p>
                                <p className="text-[9px] text-obsidian/40 font-body">{p.unit} · Stock: {p.stock_quantity}</p>
                              </div>
                              <p className="text-xs font-heading font-bold text-gmo-green flex-shrink-0">
                                {(form.client_type === "detaillant" ? p.wholesale_price : p.unit_price || 0).toLocaleString()} F
                              </p>
                            </button>
                          ))}
                          {filteredProducts(idx).length === 0 && (
                            <p className="text-xs text-obsidian/30 text-center py-3 font-body">Aucun produit</p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <p className="text-[9px] uppercase tracking-widest font-heading text-obsidian/35 mb-2">Qté</p>
                        <input type="number" min="1" value={item.qty}
                          onChange={e => setItem(idx, "qty", e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-xs font-body text-center focus:outline-none focus:border-gmo-green transition-all" />
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-widest font-heading text-obsidian/35 mb-2">Prix unit.</p>
                        <input type="number" value={item.unit_price}
                          onChange={e => setItem(idx, "unit_price", e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-xs font-body focus:outline-none focus:border-gmo-green transition-all" />
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-widest font-heading text-obsidian/35 mb-2">Sous-total</p>
                        <div className="bg-gmo-green/5 border border-gmo-green/10 rounded-lg px-3 py-2.5 text-xs font-heading font-bold text-gmo-green text-right">
                          {((parseFloat(item.qty) || 0) * (parseFloat(item.unit_price) || 0)).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {form.items.length > 1 && (
                      <button onClick={() => removeItem(idx)}
                        className="flex items-center gap-1.5 text-[10px] text-red-400 hover:text-gmo-red font-body transition-colors cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" /> Supprimer cette ligne
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between bg-obsidian/4 rounded-xl px-5 py-3 border border-obsidian/5">
                <span className="font-heading text-xs font-bold text-obsidian/60 uppercase tracking-wide">Total commande</span>
                <span className="font-heading text-xl font-bold text-gmo-green">{total.toLocaleString()} FCFA</span>
              </div>
            </div>

            {/* Delivery */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest font-heading text-obsidian/40 mb-3">Livraison</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { value: "livraison", label: "Livraison", icon: Truck },
                  { value: "enlevement", label: "Enlèvement", icon: Home },
                ].map(m => (
                  <button key={m.value} onClick={() => setForm(f => ({ ...f, delivery_mode: m.value }))}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-xs font-body transition-all cursor-pointer ${
                      form.delivery_mode === m.value
                        ? "border-gmo-green bg-gmo-green/5 text-gmo-green font-semibold"
                        : "border-gray-200 bg-gray-50 text-obsidian/50 hover:border-gray-300"
                    }`}>
                    <m.icon className="w-4 h-4" /> {m.label}
                  </button>
                ))}
              </div>

              {form.delivery_mode === "livraison" && (
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest font-heading text-obsidian/40 mb-2">Adresse de livraison</p>
                    <input value={form.delivery_address} onChange={e => setForm(f => ({ ...f, delivery_address: e.target.value }))}
                      placeholder="Quartier, rue, porte…"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:border-gmo-green focus:ring-2 focus:ring-gmo-green/10 transition-all" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest font-heading text-obsidian/40 mb-2">Ville</p>
                      <input value={form.delivery_city} onChange={e => setForm(f => ({ ...f, delivery_city: e.target.value }))}
                        placeholder="Ouagadougougou…"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:border-gmo-green focus:ring-2 focus:ring-gmo-green/10 transition-all" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest font-heading text-obsidian/40 mb-2">Date estimée</p>
                      <input type="date" value={form.estimated_delivery} onChange={e => setForm(f => ({ ...f, estimated_delivery: e.target.value }))}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:border-gmo-green focus:ring-2 focus:ring-gmo-green/10 transition-all" />
                    </div>
                  </div>
                  {drivers.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest font-heading text-obsidian/40 mb-2">Chauffeur assigné</p>
                      <select value={form.driver_id} onChange={e => {
                        const driver = drivers.find(d => d.id === e.target.value);
                        if (driver) selectDriver(driver);
                        else setForm(f => ({ ...f, driver_id: "", driver_name: "" }));
                      }}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:border-gmo-green focus:ring-2 focus:ring-gmo-green/10 transition-all">
                        <option value="">— Aucun chauffeur —</option>
                        {drivers.filter(d => d.status === "disponible" || d.id === form.driver_id).map(d => (
                          <option key={d.id} value={d.id}>{d.first_name} {d.last_name} ({d.vehicle_type})</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Payment & status */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <p className="text-[10px] font-bold uppercase tracking-widest font-heading text-obsidian/40 mb-2">Statut commande</p>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:border-gmo-green focus:ring-2 focus:ring-gmo-green/10 transition-all">
                  {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest font-heading text-obsidian/40 mb-2">Mode paiement</p>
                <select value={form.payment_method} onChange={e => setForm(f => ({ ...f, payment_method: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:border-gmo-green focus:ring-2 focus:ring-gmo-green/10 transition-all">
                  {PAYMENT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest font-heading text-obsidian/40 mb-2">Statut paiement</p>
                <select value={form.payment_status} onChange={e => setForm(f => ({ ...f, payment_status: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:border-gmo-green focus:ring-2 focus:ring-gmo-green/10 transition-all">
                  <option value="non_paye">Non payé</option>
                  <option value="partiel">Partiel</option>
                  <option value="paye">Payé</option>
                </select>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest font-heading text-obsidian/40 mb-2">Notes internes</p>
              <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Remarques, instructions spéciales…" rows={3}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:border-gmo-green focus:ring-2 focus:ring-gmo-green/10 transition-all resize-none" />
            </div>

            {!form.client_name && (
              <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <p className="text-xs text-amber-700 font-body">Le nom du client est requis.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-5 flex items-center gap-3">
          <button onClick={onClose}
            className="px-6 py-3 border border-gray-200 rounded-xl text-sm font-body text-obsidian/60 hover:border-gray-300 hover:text-obsidian hover:bg-gray-50 transition-all cursor-pointer font-medium">
            Annuler
          </button>
          <button onClick={handleSave} disabled={saving || !form.client_name}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-gmo-green to-emerald-600 text-white font-heading font-bold text-sm py-3.5 rounded-xl hover:shadow-lg hover:shadow-gmo-green/25 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Enregistrement…" : (isEdit ? "Mettre à jour" : "Créer la commande")}
          </button>
        </div>
      </motion.div>
    </div>
  );
}