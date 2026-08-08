import React from 'react';
import { Star, Heart, ShoppingBag, Zap, Sparkles, Check, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useIntent } from '../context/IntentContext';

export default function ProductDetailPage({ product, onBack }) {
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const { activeIntent } = useIntent();

  if (!product) return null;

  const wishlisted = isWishlisted(product.id);
  const discount = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-card text-xs font-bold text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Products</span>
      </button>

      {/* Main Detail Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 glass-panel p-8 sm:p-12 rounded-3xl border border-white/10">
        
        {/* Left: Product Image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {discount > 0 && (
            <span className="absolute top-4 left-4 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 shadow-lg">
              {discount}% SAVE
            </span>
          )}
        </div>

        {/* Right: Info & Actions */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">
                {product.category} &bull; {product.sub_category}
              </span>
              <div className="flex items-center gap-1.5 text-amber-400 text-sm font-bold">
                <Star className="w-4 h-4 fill-current" />
                <span>{product.rating}</span>
                <span className="text-slate-500 font-normal">({product.review_count} reviews)</span>
              </div>
            </div>

            <h1 className="text-3xl font-extrabold text-white leading-tight">{product.name}</h1>

            {/* Price section */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-white">₹{product.price.toLocaleString()}</span>
              {product.original_price && (
                <span className="text-base text-slate-500 line-through">₹{product.original_price.toLocaleString()}</span>
              )}
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">{product.description}</p>

            {/* Explainable AI Box */}
            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 space-y-1.5">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Explainable AI Match for "{activeIntent}"</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Recommended because this product features high tag relevance ({product.tags.join(', ')}), aligns with price ceiling rules, and matches user search session vectors.
              </p>
            </div>

            {/* Express Shipping Indicator */}
            {product.express_delivery && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Available for 24h Express Delivery directly to your door</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-slate-800/80 flex items-center gap-4">
            <button
              onClick={() => addToCart(product)}
              className="flex-1 gradient-button py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/30"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={() => toggleWishlist(product)}
              className={`p-3.5 rounded-2xl border transition-all ${
                wishlisted 
                  ? 'bg-rose-500 text-white border-rose-400' 
                  : 'glass-card text-slate-300 border-slate-700 hover:border-rose-500/40'
              }`}
            >
              <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

      </div>

      {/* Specifications Table */}
      {product.specs && Object.keys(product.specs).length > 0 && (
        <section className="glass-panel p-8 rounded-3xl border border-white/10 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <span>Product Specifications</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
            {Object.entries(product.specs).map(([key, val]) => (
              <div key={key} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                <span className="text-slate-400 block mb-0.5">{key}</span>
                <span className="font-bold text-white">{String(val)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
