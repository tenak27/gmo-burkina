import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import {
  FileText, Plus, Minus, Trash2, Send, CheckCircle2,
  Hash, Package, Phone, MapPin, Copy, Check
} from "lucide-react";

function generateQuoteNumber() {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `DEV-${yy}${mm}${dd}-${rand}`;
}

export default function QuoteForm({ products, user }) {
  const [cart, setCart] = useState([]); // [{ product, qty }]
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null); // quote number after success
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) && !cart.find(c => c.product.id === p.id)
  );

  const addToCart = (product) => {
    setCart(prev => [...prev, { product, qty: 1 }]);
    setSearchTerm("");
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(c =>
      c.product.id === id ? { ...c, qty: Math.max(1, c.qty + delta) } : c
    ));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(c => c.product.id !== id));
  };

  const total = cart.reduce((s, c) => s + (c.product.unit_price || 0) * c.qty, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setSubmitting(true);
    const quoteNumber = generateQuoteNumber();
    const items = cart.map(c => ({
      product_id: c.product.id,
      product_name: c.product.name,
      name: c.product.name,
      unit: c.product.unit,
      qty: c.qty,
      unit_price: c.product.unit_price || 0,
    }));
    await base44.entities.Order.create({
      order_number: quoteNumber,
      client_email: user.email,
      client_name: user.full_name,
      client_phone: phone,
      client_type: "client",
      items,
      total_amount: total,
      status: "en_attente",
      delivery_mode: "livraison",
      delivery_city: city,
      notes: notes ? `DEVIS AUTOMATIQUE - ${notes}` : "DEVIS AUTOMATIQUE",
      payment_status: "non_paye",
    });
    setSubmitted(quoteNumber);
    setSubmitting(false);
  };

  const copyNumber = () => {
    navigator.clipboard.writeText(submitted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl border border-green-200 p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="font-heading text-lg font-bold text-obsidian mb-2">Devis soumis avec succès !</h3>
        <p className="text-sm text-obsidian/50 font-body mb-5">Notre équipe va traiter votre demande et vous recontacter.</p>

        {/* Quote number with copy */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-5 inline-flex items-center gap-3">
          <Hash className="w-4 h-4 text-gmo-green" />
          <div className="text-left">
            <p className="text-[10px] text-obsidian/40 font-body uppercase tracking-widest">Numéro de suivi</p>
            <p className="font-heading text-base font-black text-obsidian tracking-wider">{submitted}</p>
          </div>
          <button onClick={copyNumber} className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-obsidian/50 hover:text-obsidian">
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <p className="text-xs text-obsidian/40 font-body mb-6">Conservez ce numéro pour suivre l'état de votre devis.</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => { setSubmitted(null); setCart([]); setPhone(""); setCity(""); setNotes(""); }}
            className="flex items-center justify-center gap-2 bg-gmo-green text-white font-heading font-bold text-sm px-6 py-3 rounded-xl hover:bg-gmo-green/90 transition-colors">
            <Plus className="w-4 h-4" /> Nouveau devis
          </button>
          <a href={`https://wa.me/22676211633?text=Bonjour%20GMO%2C%20je%20souhaite%20suivre%20mon%20devis%20numéro%20${submitted}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 border border-gray-200 text-obsidian/60 font-body text-sm px-6 py-3 rounded-xl hover:border-gmo-green hover:text-gmo-green transition-colors">
            <Phone className="w-4 h-4" /> Suivre via WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5">
        <h2 className="font-heading text-xl font-bold text-obsidian">Demande de Devis</h2>
        <p className="text-xs text-obsidian/40 font-body mt-0.5">Sélectionnez les produits et obtenez un numéro de suivi unique</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product search & add */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="font-heading text-sm font-bold text-obsidian mb-3 flex items-center gap-2">
            <Package className="w-4 h-4 text-gmo-green" /> Ajouter des produits
          </p>
          <div className="relative">
            <input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Rechercher un produit du catalogue..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-body text-obsidian placeholder:text-obsidian/30 focus:outline-none focus:ring-2 focus:ring-gmo-green/30 focus:border-gmo-green"
            />
            {searchTerm && filteredProducts.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-52 overflow-y-auto">
                {filteredProducts.map(p => (
                  <button
                    key={p.id} type="button" onClick={() => addToCart(p)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 text-left transition-colors border-b border-gray-50 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-body font-semibold text-obsidian">{p.name}</p>
                      <p className="text-[11px] text-obsidian/40 font-body">{p.category} · {p.unit}</p>
                    </div>
                    {p.unit_price && (
                      <span className="text-xs font-heading font-bold text-gmo-green whitespace-nowrap ml-3">
                        {p.unit_price.toLocaleString()} FCFA
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
            {searchTerm && filteredProducts.length === 0 && (
              <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg p-4 text-center">
                <p className="text-sm text-obsidian/35 font-body">Aucun produit trouvé</p>
              </div>
            )}
          </div>
        </div>

        {/* Cart */}
        {cart.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <p className="font-heading text-sm font-bold text-obsidian">Produits sélectionnés ({cart.length})</p>
              <p className="text-xs text-gmo-green font-heading font-bold">{total.toLocaleString()} FCFA</p>
            </div>
            <div className="divide-y divide-gray-50">
              {cart.map(({ product, qty }) => (
                <div key={product.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-heading text-xs font-bold text-obsidian truncate">{product.name}</p>
                    <p className="text-[11px] text-obsidian/40 font-body">{product.unit}</p>
                  </div>
                  {/* Qty controls */}
                  <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                    <button type="button" onClick={() => updateQty(product.id, -1)}
                      className="px-2 py-1.5 hover:bg-gray-200 text-obsidian/50 hover:text-obsidian transition-colors">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-xs font-heading font-bold text-obsidian">{qty}</span>
                    <button type="button" onClick={() => updateQty(product.id, 1)}
                      className="px-2 py-1.5 hover:bg-gray-200 text-obsidian/50 hover:text-obsidian transition-colors">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-xs font-heading font-bold text-obsidian whitespace-nowrap w-20 text-right">
                    {((product.unit_price || 0) * qty).toLocaleString()} FCFA
                  </p>
                  <button type="button" onClick={() => removeFromCart(product.id)}
                    className="text-obsidian/25 hover:text-gmo-red transition-colors p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 bg-gmo-green/5 border-t border-gmo-green/10 flex items-center justify-between">
              <p className="text-xs text-obsidian/50 font-body">Total estimé (hors taxes)</p>
              <p className="font-heading text-base font-black text-gmo-green">{total.toLocaleString()} FCFA</p>
            </div>
          </div>
        )}

        {/* Contact info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
          <p className="font-heading text-sm font-bold text-obsidian flex items-center gap-2">
            <Phone className="w-4 h-4 text-gmo-green" /> Informations de livraison
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-obsidian/45 font-body uppercase tracking-widest mb-1">Téléphone</label>
              <input
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+226 XX XX XX XX"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-body text-obsidian placeholder:text-obsidian/25 focus:outline-none focus:ring-2 focus:ring-gmo-green/30 focus:border-gmo-green"
              />
            </div>
            <div>
              <label className="block text-[11px] text-obsidian/45 font-body uppercase tracking-widest mb-1">Ville de livraison</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-obsidian/25" />
                <input
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="Ouagadougou, Bobo..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-body text-obsidian placeholder:text-obsidian/25 focus:outline-none focus:ring-2 focus:ring-gmo-green/30 focus:border-gmo-green"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-[11px] text-obsidian/45 font-body uppercase tracking-widest mb-1">Notes / Instructions (optionnel)</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              placeholder="Informations complémentaires pour votre commande..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-body text-obsidian placeholder:text-obsidian/25 focus:outline-none focus:ring-2 focus:ring-gmo-green/30 focus:border-gmo-green resize-none"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={cart.length === 0 || submitting}
          className="w-full flex items-center justify-center gap-2 bg-gmo-green text-white font-heading font-bold text-sm py-4 rounded-2xl hover:bg-gmo-green/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Génération du devis...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Générer mon devis {cart.length > 0 && `· ${total.toLocaleString()} FCFA`}
            </>
          )}
        </button>
        {cart.length === 0 && (
          <p className="text-center text-xs text-obsidian/30 font-body">Ajoutez au moins un produit pour générer un devis</p>
        )}
      </form>
    </div>
  );
}