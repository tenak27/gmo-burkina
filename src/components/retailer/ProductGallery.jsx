import React, { useState, useMemo } from "react";
import { Search, Package, Plus, Minus, ShoppingCart, X, ZoomIn, Check } from "lucide-react";

const CATEGORIES = ["Tous", "alimentaire", "hygiene", "boisson", "cereale", "autre"];

export default function ProductGallery({ products, cart, setCart, onGoToCart }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tous");
  const [zoomed, setZoomed] = useState(null);

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (p.stock_quantity === 0) return false;
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "Tous" || p.category === category;
      return matchSearch && matchCat;
    });
  }, [products, search, category]);

  const setQty = (id, qty) => {
    if (qty <= 0) {
      setCart(c => { const n = { ...c }; delete n[id]; return n; });
    } else {
      setCart(c => ({ ...c, [id]: qty }));
    }
  };

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <div>
      {/* Search + categories */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-obsidian/30" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un produit..."
            className="w-full pl-10 pr-4 py-2.5 text-sm font-body border border-gray-200 rounded-xl focus:border-gmo-red focus:outline-none transition-colors bg-gray-50/50"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-obsidian/30 hover:text-obsidian">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`text-[10px] font-body px-3 py-1.5 rounded-full border transition-all capitalize ${
                category === c
                  ? "border-gmo-red bg-gmo-red text-white font-semibold"
                  : "border-gray-200 text-obsidian/40 hover:border-gray-300 hover:text-obsidian/60"
              }`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Cart bar */}
      {cartCount > 0 && (
        <div className="sticky top-12 lg:top-0 z-30 mb-4 bg-gmo-red rounded-2xl p-3 flex items-center justify-between shadow-lg shadow-gmo-red/20 transition-all">
          <div className="flex items-center gap-2 text-white">
            <ShoppingCart className="w-4 h-4" />
            <span className="font-heading text-sm font-bold">{cartCount} article(s) dans le panier</span>
          </div>
          <button onClick={onGoToCart}
            className="bg-white text-gmo-red font-heading font-bold text-xs px-4 py-1.5 rounded-xl hover:bg-red-50 transition-colors">
            Valider →
          </button>
        </div>
      )}

      {/* Product grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <Package className="w-8 h-8 text-obsidian/10 mx-auto mb-2" />
          <p className="text-sm text-obsidian/35 font-body">Aucun produit disponible</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map(p => {
            const qty = cart[p.id] || 0;
            const inCart = qty > 0;
            const low = p.stock_quantity <= (p.stock_alert || 0);
            return (
              <div key={p.id}
                className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md group ${
                  inCart ? "border-gmo-red/30 ring-1 ring-gmo-red/10" : "border-gray-100"
                }`}>
                {/* Image with zoom */}
                <div className="relative aspect-square bg-gray-50 overflow-hidden cursor-zoom-in"
                  onClick={() => setZoomed(p)}>
                  {p.image_url ? (
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-8 h-8 text-obsidian/10" />
                    </div>
                  )}
                  {/* Zoom overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                    <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
                  </div>
                  {/* In-cart badge */}
                  {inCart && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-gmo-red rounded-full flex items-center justify-center shadow-md">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  {/* Stock badge */}
                  {low && (
                    <div className="absolute top-2 left-2 text-[8px] bg-amber-500 text-white px-1.5 py-0.5 rounded-full font-body font-semibold">
                      Stock faible
                    </div>
                  )}
                </div>

                {/* Info + controls */}
                <div className="p-3">
                  <p className="font-heading text-xs font-bold text-obsidian leading-tight mb-0.5 truncate">{p.name}</p>
                  <p className="text-[10px] text-obsidian/35 font-body capitalize mb-2">{p.category || "—"} · {p.unit || "unité"}</p>
                  <p className="font-heading text-sm font-bold text-gmo-green mb-2">
                    {(p.wholesale_price || p.unit_price || 0).toLocaleString()} FCFA
                  </p>

                  {qty === 0 ? (
                    <button
                      onClick={() => setQty(p.id, 1)}
                      className="w-full flex items-center justify-center gap-1.5 bg-obsidian text-white text-[10px] font-heading font-bold py-2 rounded-xl hover:bg-gmo-red transition-colors duration-200"
                    >
                      <Plus className="w-3 h-3" /> Ajouter
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button onClick={() => setQty(p.id, qty - 1)}
                        className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-obsidian/50 hover:border-gmo-red hover:text-gmo-red transition-colors">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="flex-1 text-center font-heading text-sm font-bold text-obsidian">{qty}</span>
                      <button onClick={() => setQty(p.id, qty + 1)}
                        className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-obsidian/50 hover:border-gmo-green hover:text-gmo-green transition-colors">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Zoom lightbox */}
      {zoomed && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setZoomed(null)}>
          <div className="relative max-w-md w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}>
            <button onClick={() => setZoomed(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-obsidian/60 hover:text-obsidian shadow-md">
              <X className="w-4 h-4" />
            </button>
            <div className="aspect-square bg-gray-50">
              {zoomed.image_url ? (
                <img src={zoomed.image_url} alt={zoomed.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-16 h-16 text-obsidian/10" />
                </div>
              )}
            </div>
            <div className="p-5">
              <h3 className="font-heading text-lg font-bold text-obsidian">{zoomed.name}</h3>
              <p className="text-xs text-obsidian/40 font-body capitalize mb-1">{zoomed.category} · {zoomed.unit}</p>
              {zoomed.description && <p className="text-sm text-obsidian/60 font-body mb-3">{zoomed.description}</p>}
              <div className="flex items-center justify-between">
                <p className="font-heading text-xl font-bold text-gmo-green">{(zoomed.wholesale_price || zoomed.unit_price || 0).toLocaleString()} FCFA</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setQty(zoomed.id, Math.max(0, (cart[zoomed.id] || 0) - 1))}
                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:border-gmo-red hover:text-gmo-red transition-colors">
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-heading font-bold text-obsidian">{cart[zoomed.id] || 0}</span>
                  <button onClick={() => setQty(zoomed.id, (cart[zoomed.id] || 0) + 1)}
                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:border-gmo-green hover:text-gmo-green transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}