/**
 * Formulaire de factures/devis/proformas - Design unifié centré
 */
import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { X, Save, Plus, Trash2, Search, ChevronDown, AlertCircle, FileText, Receipt, ClipboardList } from "lucide-react";
import { motion } from "framer-motion";

const TYPE_CONFIG = {
  facture:  { label: "Facture",  icon: Receipt,      prefix: "FAC", color: "bg-gmo-green text-white" },
  proforma: { label: "Proforma", icon: ClipboardList, prefix: "PRO", color: "bg-blue-600 text-white" },
  devis:    { label: "Devis",    icon: FileText,      prefix: "DEV", color: "bg-purple-600 text-white" },
};

const fieldCls = () => "w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-body text-obsidian placeholder:text-obsidian/30 focus:outline-none focus:bg-white focus:border-gmo-green focus:ring-2 focus:ring-gmo-green/10 transition-all cursor-pointer";

export default function InvoiceForm({ invoice, onSave, onClose, clients = [], products = [] }) {
  const isEdit = !!invoice;
  const defaultType = invoice?.type || "facture";
  const prefix = TYPE_CONFIG[defaultType]?.prefix || "FAC";

  const [form, setForm] = useState({
    type:        invoice?.type     || "facture",
    number:      invoice?.number   || `${prefix}-${Date.now().toString().slice(-6)}`,
    client_id:   invoice?.client_id   || "",
    client_name: invoice?.client_name || "",
    date:        invoice?.date     || new Date().toISOString().split("T")[0],
    due_date:    invoice?.due_date  || "",
    items:       invoice?.items?.length ? invoice.items : [{ product_id: "", name: "", qty: 1, unit_price: 0 }],
    tax_rate:    invoice?.tax_rate  ?? 18,
    status:      invoice?.status   || "brouillon",
    paid_amount: invoice?.paid_amount || 0,
    notes:       invoice?.notes    || "",
  });

  const [clientSearch, setClientSearch] = useState("");
  const [clientOpen, setClientOpen] = useState(false);
  const [productSearches, setProductSearches] = useState({});
  const [productDropdowns, setProductDropdowns] = useState({});
  const [saving, setSaving] = useState(false);

  const setType = (type) => {
    const p = TYPE_CONFIG[type]?.prefix || "FAC";
    setForm(f => ({ ...f, type, number: `${p}-${Date.now().toString().slice(-6)}` }));
  };

  const subtotal = useMemo(() =>
    form.items.reduce((s, it) => s + (parseFloat(it.qty) || 0) * (parseFloat(it.unit_price) || 0), 0),
    [form.items]
  );
  const taxAmount = Math.round(subtotal * (parseFloat(form.tax_rate) || 0) / 100);
  const total = subtotal + taxAmount;
  const remaining = Math.max(0, total - (parseFloat(form.paid_amount) || 0));

  const filteredClients = useMemo(() => {
    if (!clientSearch) return clients.slice(0, 8);
    return clients.filter(c => c.name?.toLowerCase().includes(clientSearch.toLowerCase())).slice(0, 8);
  }, [clients, clientSearch]);

  const selectClient = (client) => {
    setForm(f => ({ ...f, client_id: client.id, client_name: client.name }));
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
    setForm(f => {
      const items = [...f.items];
      items[idx] = { ...items[idx], product_id: product.id, name: product.name, unit_price: product.unit_price || 0 };
      return { ...f, items };
    });
    setProductSearches(s => ({ ...s, [idx]: "" }));
    setProductDropdowns(d => ({ ...d, [idx]: false }));
  };

  const addItem = () => setForm(f => ({ ...f, items: [...f.items, { product_id: "", name: "", qty: 1, unit_price: 0 }] }));
  const removeItem = (idx) => setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));

  const filteredProducts = (idx) => {
    const search = productSearches[idx] || "";
    if (!search) return products.slice(0, 8);
    return products.filter(p => p.name?.toLowerCase().includes(search.toLowerCase())).slice(0, 8);
  };

  const handleSave = async () => {
    if (!form.client_name) return;
    setSaving(true);
    const data = { ...form, subtotal, tax_amount: taxAmount, total, paid_amount: parseFloat(form.paid_amount) || 0 };
    let result;
    if (isEdit) {
      await base44.entities.Invoice.update(invoice.id, data);
      result = { ...invoice, ...data };
    } else {
      result = await base44.entities.Invoice.create(data);
    }
    setSaving(false);
    onSave(result);
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
        <div className="sticky top-0 bg-gradient-to-r from-obsidian/98 to-obsidian/95 border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="font-heading text-base font-bold text-white">
              {isEdit ? "Modifier" : "Nouveau"} · {TYPE_CONFIG[form.type]?.label}
            </p>
            <p className="text-[10px] text-white/40 font-body mt-0.5">{form.number}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="max-w-4xl mx-auto space-y-6">

            {/* Type selector */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest font-heading text-obsidian/40 mb-3">Type de document</p>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(TYPE_CONFIG).map(([key, cfg]) => {
                  const Icon = cfg.icon;
                  return (
                    <button key={key} onClick={() => setType(key)}
                      className={`flex flex-col items-center gap-2 py-4 rounded-xl border text-xs font-heading font-bold transition-all cursor-pointer ${
                        form.type === key ? `${cfg.color} border-transparent shadow-lg shadow-${cfg.color.split('-')[1]}-500/20` : "border-gray-200 text-obsidian/50 hover:border-gray-300 bg-gray-50"
                      }`}>
                      <Icon className="w-5 h-5" />
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Client & dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <p className="text-[10px] font-bold uppercase tracking-widest font-heading text-obsidian/40 mb-2">Client *</p>
                <div className="relative">
                  <button type="button" onClick={() => setClientOpen(o => !o)}
                    className={`${fieldCls()} flex items-center justify-between`}>
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
                        {filteredClients.map(c => (
                          <button key={c.id} onClick={() => selectClient(c)}
                            className="w-full text-left px-4 py-2.5 hover:bg-gmo-green/5 flex items-center gap-3 transition-colors cursor-pointer border-b border-gray-50 last:border-0">
                            <div className="w-7 h-7 rounded-full bg-gmo-green/15 flex items-center justify-center text-gmo-green font-bold text-xs flex-shrink-0">
                              {c.name?.charAt(0)}
                            </div>
                            <div>
                              <p className="text-xs font-heading font-bold text-obsidian">{c.name}</p>
                              <p className="text-[10px] text-obsidian/40 font-body">{c.email || c.phone || c.city}</p>
                            </div>
                          </button>
                        ))}
                        {filteredClients.length === 0 && <p className="text-xs text-obsidian/30 text-center py-3 font-body">Aucun client</p>}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest font-heading text-obsidian/40 mb-2">Date émission</p>
                  <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:border-gmo-green focus:ring-2 focus:ring-gmo-green/10 transition-all" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest font-heading text-obsidian/40 mb-2">Échéance</p>
                  <input type="date" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:border-gmo-green focus:ring-2 focus:ring-gmo-green/10 transition-all" />
                </div>
              </div>
            </div>

            {/* Items */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold uppercase tracking-widest font-heading text-obsidian/40">Lignes articles</p>
                <button onClick={addItem} className="flex items-center gap-1.5 text-xs text-gmo-green font-heading font-bold hover:opacity-70 transition-opacity cursor-pointer">
                  <Plus className="w-3.5 h-3.5" /> Ajouter
                </button>
              </div>

              <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
                <div className="grid grid-cols-12 gap-2 mb-2">
                  {["Désignation", "Qté", "P.U.", "Total", ""].map((h, i) => (
                    <p key={h} className={`text-[9px] uppercase tracking-wider font-heading text-obsidian/30 ${
                      i === 0 ? "col-span-5" : i === 1 ? "col-span-2 text-center" : i === 2 ? "col-span-3 text-right" : i === 3 ? "col-span-2 text-right" : "col-span-0"
                    }`}>{h}</p>
                  ))}
                </div>

                <div className="space-y-2">
                  {form.items.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center group">
                      <div className="col-span-5 relative">
                        <input
                          value={productSearches[idx] !== undefined ? productSearches[idx] : (item.name || "")}
                          onChange={e => {
                            setProductSearches(s => ({ ...s, [idx]: e.target.value }));
                            setProductDropdowns(d => ({ ...d, [idx]: true }));
                            setItem(idx, "name", e.target.value);
                          }}
                          onFocus={() => setProductDropdowns(d => ({ ...d, [idx]: true }))}
                          onBlur={() => setTimeout(() => setProductDropdowns(d => ({ ...d, [idx]: false })), 150)}
                          placeholder="Article…"
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-body focus:outline-none focus:border-gmo-green focus:bg-white transition-all"
                        />
                        {productDropdowns[idx] && (
                          <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-20 max-h-40 overflow-y-auto">
                            {filteredProducts(idx).map(p => (
                              <button key={p.id} onMouseDown={() => selectProduct(idx, p)}
                                className="w-full text-left px-4 py-2.5 hover:bg-gmo-green/5 cursor-pointer border-b border-gray-50 last:border-0">
                                <p className="text-xs font-heading font-bold text-obsidian">{p.name}</p>
                                <p className="text-[9px] text-obsidian/40 font-body">{(p.unit_price || 0).toLocaleString()} F · {p.unit}</p>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="col-span-2">
                        <input type="number" min="1" value={item.qty} onChange={e => setItem(idx, "qty", e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg px-2 py-2 text-xs font-body text-center focus:outline-none focus:border-gmo-green transition-all" />
                      </div>
                      <div className="col-span-3">
                        <input type="number" value={item.unit_price} onChange={e => setItem(idx, "unit_price", e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-body text-right focus:outline-none focus:border-gmo-green transition-all" />
                      </div>
                      <div className="col-span-2 flex items-center justify-end gap-2">
                        <span className="text-xs font-heading font-bold text-obsidian">
                          {((parseFloat(item.qty) || 0) * (parseFloat(item.unit_price) || 0)).toLocaleString()}
                        </span>
                        {form.items.length > 1 && (
                          <button onClick={() => removeItem(idx)} className="opacity-0 group-hover:opacity-100 text-gmo-red/50 hover:text-gmo-red transition-all cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="mt-4 bg-obsidian/4 rounded-xl p-4 border border-obsidian/5">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-body text-obsidian/55">
                    <span>Sous-total HT</span>
                    <span className="font-heading font-bold text-obsidian">{subtotal.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-body text-obsidian/55">
                    <div className="flex items-center gap-2">
                      <span>TVA</span>
                      <input type="number" value={form.tax_rate}
                        onChange={e => setForm(f => ({ ...f, tax_rate: e.target.value }))}
                        className="w-12 bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs text-center focus:outline-none focus:border-gmo-green" />
                      <span>%</span>
                    </div>
                    <span className="font-heading font-bold text-obsidian">{taxAmount.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-sm font-heading font-black text-obsidian border-t border-gray-200 pt-2 mt-1">
                    <span>TOTAL TTC</span>
                    <span className="text-lg text-gmo-green">{total.toLocaleString()} FCFA</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest font-heading text-obsidian/40 mb-2">Statut</p>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:border-gmo-green focus:ring-2 focus:ring-gmo-green/10 transition-all">
                  <option value="brouillon">Brouillon</option>
                  <option value="envoye">Envoyé</option>
                  <option value="paye">Payé</option>
                  <option value="partiel">Partiel</option>
                  <option value="annule">Annulé</option>
                </select>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest font-heading text-obsidian/40 mb-2">Montant payé (FCFA)</p>
                <input type="number" value={form.paid_amount} onChange={e => setForm(f => ({ ...f, paid_amount: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:border-gmo-green focus:ring-2 focus:ring-gmo-green/10 transition-all" />
              </div>
            </div>

            {remaining > 0 && (
              <div className="flex justify-between items-center bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <span className="text-xs font-body text-red-500">Reste à encaisser</span>
                <span className="font-heading font-bold text-gmo-red text-sm">{remaining.toLocaleString()} FCFA</span>
              </div>
            )}

            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest font-heading text-obsidian/40 mb-2">Notes / Conditions</p>
              <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Conditions de paiement, remarques…" rows={3}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:border-gmo-green focus:ring-2 focus:ring-gmo-green/10 transition-all resize-none" />
            </div>

            {!form.client_name && (
              <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <p className="text-xs text-amber-700 font-body">Sélectionnez un client pour continuer.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3">
          <button onClick={handleSave} disabled={saving || !form.client_name}
            className="flex-1 flex items-center justify-center gap-2 bg-gmo-green text-white font-heading font-bold text-sm py-3 rounded-xl hover:bg-gmo-green/90 active:scale-95 transition-all disabled:opacity-40 cursor-pointer">
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Enregistrement…" : (isEdit ? "Mettre à jour" : `Créer ${TYPE_CONFIG[form.type]?.label}`)}
          </button>
          <button onClick={onClose}
            className="px-5 py-3 border border-gray-200 rounded-xl text-sm font-body text-obsidian/50 hover:border-gray-300 hover:text-obsidian hover:bg-gray-50 transition-all cursor-pointer">
            Annuler
          </button>
        </div>
      </motion.div>
    </div>
  );
}