/**
 * Formulaire moderne pour que le commercial initie une commande revendeur
 * Style VISTA-FACT inspiré de votre référence
 */
import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { X, Save, Plus, Minus, Search, ChevronDown, AlertCircle, Send } from "lucide-react";
import { motion } from "framer-motion";

const fieldStyle = "w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm font-body text-obsidian placeholder:text-obsidian/30 focus:outline-none focus:border-gmo-green focus:ring-2 focus:ring-gmo-green/10 transition-all";
const labelStyle = "block text-[10px] font-bold uppercase tracking-wider text-obsidian/50 mb-1.5 font-heading";

export default function InitiateResellerOrderModal({ clients = [], products = [], onClose, onSuccess }) {
  const [step, setStep] = useState(1); // 1: client, 2: articles, 3: review
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientSearch, setClientSearch] = useState("");
  const [clientOpen, setClientOpen] = useState(false);
  const [cart, setCart] = useState({});
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const filteredClients = useMemo(() => {
    if (!clientSearch) return clients.filter(c => c.type === "revendeur").slice(0, 10);
    const q = clientSearch.toLowerCase();
    return clients.filter(c => 
      c.type === "revendeur" && (c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q))
    ).slice(0, 10);
  }, [clients, clientSearch]);

  const setQty = (id, qty) => {
    if (qty <= 0) {
      setCart(c => { const n = { ...c }; delete n[id]; return n; });
    } else {
      setCart(c => ({ ...c, [id]: qty }));
    }
  };

  const cartTotal = useMemo(() =>
    Object.entries(cart).reduce((sum, [id, qty]) => {
      const p = products.find(p => p.id === id);
      return sum + (p?.wholesale_price || p?.unit_price || 0) * qty;
    }, 0),
    [cart, products]
  );

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const handleSubmit = async () => {
    if (!selectedClient || cartCount === 0) return;
    setSubmitting(true);
    
    const items = Object.entries(cart).map(([id, qty]) => {
      const p = products.find(p => p.id === id);
      return {
        product_id: id,
        name: p?.name,
        qty,
        unit_price: p?.wholesale_price || p?.unit_price
      };
    });

    const orderNum = `CMD-COM-${Date.now().toString().slice(-8)}`;
    
    try {
      await base44.entities.Order.create({
        order_number: orderNum,
        client_email: selectedClient.email,
        client_name: selectedClient.name,
        client_phone: selectedClient.phone || "",
        client_type: "revendeur",
        items,
        total_amount: cartTotal,
        status: "confirmee",
        approval_status: "approved",
        delivery_mode: "livraison",
        delivery_address: selectedClient.address || "",
        delivery_city: selectedClient.city || "",
        payment_method: "credit",
        payment_status: "non_paye",
        notes: `Commercial initiated - ${notes}`,
      });
      
      setSubmitting(false);
      onSuccess?.();
      onClose();
    } catch (err) {
      setSubmitting(false);
      alert("Erreur lors de la création de la commande");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 28, stiffness: 350 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[88vh] overflow-hidden flex flex-col border border-gray-100"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-obsidian/98 to-obsidian/95 border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="font-heading text-lg font-bold text-white">Initier une commande</p>
            <p className="text-[10px] text-white/40 font-body mt-0.5">Revendeur · Étape {step}/3</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

          {/* STEP 1: Sélection client */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="mb-6">
                <p className="font-heading text-sm font-bold text-obsidian mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gmo-green text-white font-heading text-xs font-bold flex items-center justify-center">1</span>
                  Sélectionner le revendeur
                </p>
              </div>

              <div>
                <label className={labelStyle}>Revendeur *</label>
                <div className="relative mb-4">
                  <button type="button" onClick={() => setClientOpen(o => !o)}
                    className={`${fieldStyle} flex items-center justify-between`}>
                    <span className={selectedClient ? "text-obsidian" : "text-obsidian/30"}>
                      {selectedClient ? selectedClient.name : "Choisir un revendeur…"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-obsidian/30 flex-shrink-0" />
                  </button>
                  {clientOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden">
                      <div className="p-3 border-b border-gray-50">
                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                          <Search className="w-3.5 h-3.5 text-obsidian/30" />
                          <input autoFocus value={clientSearch} onChange={e => setClientSearch(e.target.value)}
                            placeholder="Rechercher un revendeur…"
                            className="flex-1 text-xs bg-transparent focus:outline-none text-obsidian" />
                        </div>
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {filteredClients.length === 0
                          ? <p className="text-xs text-obsidian/30 text-center py-4 font-body">Aucun revendeur trouvé</p>
                          : filteredClients.map(c => (
                            <button key={c.id} onClick={() => {
                              setSelectedClient(c);
                              setClientOpen(false);
                              setClientSearch("");
                            }}
                              className="w-full text-left px-4 py-3 hover:bg-gmo-green/5 flex items-center gap-3 transition-colors cursor-pointer border-b border-gray-50 last:border-0">
                              <div className="w-7 h-7 rounded-full bg-gmo-green/15 flex items-center justify-center text-gmo-green font-bold text-xs flex-shrink-0">
                                {c.name?.charAt(0)}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-heading font-bold text-obsidian truncate">{c.name}</p>
                                <p className="text-[10px] text-obsidian/40 font-body truncate">{c.email || c.phone || c.city}</p>
                              </div>
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                {selectedClient && (
                  <div className="bg-gmo-green/5 border border-gmo-green/20 rounded-lg p-4 mb-6">
                    <p className="text-xs font-heading font-bold text-obsidian mb-2">{selectedClient.name}</p>
                    <div className="space-y-1">
                      {selectedClient.email && <p className="text-[11px] text-obsidian/60 font-body">{selectedClient.email}</p>}
                      {selectedClient.phone && <p className="text-[11px] text-obsidian/60 font-body">{selectedClient.phone}</p>}
                      {selectedClient.address && <p className="text-[11px] text-obsidian/60 font-body">{selectedClient.address}</p>}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 2: Sélection articles */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="mb-6">
                <p className="font-heading text-sm font-bold text-obsidian mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gmo-green text-white font-heading text-xs font-bold flex items-center justify-center">2</span>
                  Ajouter les articles
                </p>
              </div>

              <div className="space-y-2 mb-6">
                {products.filter(p => p.stock_quantity > 0).map(p => {
                  const qty = cart[p.id] || 0;
                  return (
                    <div key={p.id} className={`border rounded-lg p-4 flex items-center gap-4 transition-all ${qty > 0 ? "border-gmo-green/30 bg-gmo-green/[0.02]" : "border-gray-200 bg-gray-50/30"}`}>
                      <div className="flex-1 min-w-0">
                        <p className="font-heading text-xs font-bold text-obsidian">{p.name}</p>
                        <p className="text-[10px] text-obsidian/40 font-body mt-0.5">
                          {p.unit || "unité"} · <span className="text-gmo-green font-semibold">{(p.wholesale_price || p.unit_price || 0).toLocaleString()} FCFA</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => setQty(p.id, qty - 1)}
                          className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-obsidian/50 hover:border-gmo-red hover:text-gmo-red transition-colors cursor-pointer">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center font-heading text-sm font-bold text-obsidian">{qty}</span>
                        <button onClick={() => setQty(p.id, qty + 1)}
                          className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-obsidian/50 hover:border-gmo-green hover:text-gmo-green transition-colors cursor-pointer">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 3: Confirmation */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="mb-6">
                <p className="font-heading text-sm font-bold text-obsidian mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gmo-green text-white font-heading text-xs font-bold flex items-center justify-center">3</span>
                  Vérifier et soumettre
                </p>
              </div>

              {/* Client */}
              <div className="bg-gray-50 rounded-lg p-4 mb-5 border border-gray-100">
                <p className="text-[10px] uppercase tracking-widest font-heading text-obsidian/40 mb-2">Revendeur</p>
                <p className="font-heading text-sm font-bold text-obsidian">{selectedClient?.name}</p>
              </div>

              {/* Articles */}
              <div className="bg-gray-50 rounded-lg p-4 mb-5 border border-gray-100">
                <p className="text-[10px] uppercase tracking-widest font-heading text-obsidian/40 mb-3">Articles ({cartCount})</p>
                <div className="space-y-2">
                  {Object.entries(cart).map(([id, qty]) => {
                    const p = products.find(p => p.id === id);
                    if (!p) return null;
                    const lineTotal = (p.wholesale_price || p.unit_price || 0) * qty;
                    return (
                      <div key={id} className="flex justify-between text-xs font-body">
                        <span className="text-obsidian/70">{p.name} <span className="text-obsidian/40">×{qty}</span></span>
                        <span className="font-heading font-bold text-obsidian">{lineTotal.toLocaleString()} F</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Totals */}
              <div className="bg-obsidian text-white rounded-lg p-4 mb-5">
                <div className="flex justify-between items-center">
                  <span className="font-heading text-sm font-bold">Total</span>
                  <span className="font-heading text-lg font-bold text-gmo-green">{cartTotal.toLocaleString()} FCFA</span>
                </div>
              </div>

              {/* Notes */}
              <div className="mb-5">
                <label className={labelStyle}>Notes (optionnel)</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder="Instructions spéciales, commentaires…"
                  rows={3}
                  className={`${fieldStyle} resize-none`} />
              </div>
            </motion.div>
          )}

          {/* Validation errors */}
          {(step === 1 && !selectedClient) && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 mt-4">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <p className="text-xs text-amber-700 font-body">Sélectionnez un revendeur pour continuer.</p>
            </div>
          )}
          {(step === 2 && cartCount === 0) && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 mt-4">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <p className="text-xs text-amber-700 font-body">Ajoutez au moins un article pour continuer.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)}
              className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-body text-obsidian/60 hover:border-gray-300 hover:bg-gray-50 transition-all cursor-pointer">
              Précédent
            </button>
          )}
          
          {step < 3 ? (
            <button onClick={() => {
              if (step === 1 && selectedClient) setStep(2);
              if (step === 2 && cartCount > 0) setStep(3);
            }}
              disabled={(step === 1 && !selectedClient) || (step === 2 && cartCount === 0)}
              className="flex-1 flex items-center justify-center gap-2 bg-gmo-green text-white font-heading font-bold text-sm py-2.5 rounded-lg hover:bg-gmo-green/90 transition-all disabled:opacity-40 cursor-pointer">
              Suivant
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 bg-gmo-green text-white font-heading font-bold text-sm py-2.5 rounded-lg hover:bg-gmo-green/90 transition-all disabled:opacity-40 cursor-pointer">
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Création en cours…
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Soumettre la commande
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}