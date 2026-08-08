import React, { useState } from 'react';
import { Star, Heart, ShoppingBag, Zap, Info, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useIntent } from '../context/IntentContext';

export default function ProductCard({ product, onSelectProduct, explanation }) {
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const { activeIntent, trackProductClick } = useIntent();
  const [showTooltip, setShowTooltip] = useState(false);

  const wishlisted = isWishlisted(product.id);
  const discount = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const handleClick = () => {
    trackProductClick(product);
    if (onSelectProduct) onSelectProduct(product);
  };

  return (
    <div className="group relative glass-card rounded-2xl overflow-hidden flex flex-col h-full border border-white/10 hover:border-indigo-500/40 transition-all duration-300">
      
      {/* Product Image & Badges Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-900 cursor-pointer" onClick={handleClick}>
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          {discount > 0 ? (
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 shadow-md">
              {discount}% OFF
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900/80 backdrop-blur-md text-slate-300 border border-white/10">
              {product.category}
            </span>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              wishlisted 
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40 scale-110'
                : 'bg-slate-900/70 text-slate-300 hover:bg-rose-500/20 hover:text-rose-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Express Delivery Badge */}
        {product.express_delivery && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 backdrop-blur-md text-emerald-300 text-[11px] font-semibold">
            <Zap className="w-3 h-3 text-emerald-400" />
            Express 24h
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">{product.sub_category || product.category}</span>
          <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{product.rating}</span>
            <span className="text-slate-500">({product.review_count})</span>
          </div>
        </div>

        <h3 
          onClick={handleClick}
          className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2 cursor-pointer"
        >
          {product.name}
        </h3>

        {/* XAI Recommendation Reason Badge */}
        {explanation && (
          <div className="relative">
            <div 
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[11px] font-medium cursor-help"
            >
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>AI Match: {activeIntent}</span>
              <Info className="w-3 h-3 text-indigo-400 opacity-70" />
            </div>

            {showTooltip && (
              <div className="absolute bottom-full left-0 mb-2 w-64 p-3 rounded-xl bg-slate-900/95 border border-indigo-500/30 text-xs text-slate-200 shadow-2xl z-30 backdrop-blur-md">
                <p className="font-semibold text-indigo-400 mb-1">Why Recommended?</p>
                <p className="text-slate-300 leading-snug">{explanation}</p>
              </div>
            )}
          </div>
        )}

        {/* Price & Add To Cart Button */}
        <div className="mt-auto pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="text-lg font-extrabold text-white">
              ₹{product.price.toLocaleString()}
            </div>
            {product.original_price && (
              <div className="text-xs text-slate-500 line-through">
                ₹{product.original_price.toLocaleString()}
              </div>
            )}
          </div>

          <button
            onClick={() => addToCart(product)}
            className="gradient-button px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md hover:scale-105 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            Add
          </button>
        </div>

      </div>
    </div>
  );
}
