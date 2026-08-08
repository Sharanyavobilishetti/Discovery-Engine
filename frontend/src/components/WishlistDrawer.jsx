import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function WishlistDrawer() {
  const { wishlist, toggleWishlist, addToCart, isWishlistOpen, setIsWishlistOpen } = useCart();

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        onClick={() => setIsWishlistOpen(false)} 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" 
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-panel border-l border-white/10 flex flex-col justify-between shadow-2xl">
          
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Your Saved Wishlist</h2>
                <p className="text-xs text-slate-400">{wishlist.length} saved products</p>
              </div>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {wishlist.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
                <Heart className="w-16 h-16 text-slate-700 mb-4 stroke-1" />
                <p className="text-base font-semibold text-slate-300">Your wishlist is empty</p>
                <p className="text-xs text-slate-500 mt-1">Click the heart icon on any product card to save it for later.</p>
              </div>
            ) : (
              wishlist.map((product) => (
                <div 
                  key={product.id} 
                  className="glass-card p-4 rounded-xl flex items-center gap-4 border border-slate-800"
                >
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg bg-slate-900"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{product.name}</h4>
                    <div className="text-xs text-rose-400 font-semibold mt-0.5">
                      ₹{product.price.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        addToCart(product);
                        toggleWishlist(product);
                      }}
                      className="p-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors flex items-center gap-1"
                      title="Move to Cart"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="p-2 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
