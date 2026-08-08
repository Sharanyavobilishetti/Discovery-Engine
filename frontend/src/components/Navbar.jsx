import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Search, 
  Camera, 
  ShoppingBag, 
  Heart, 
  User, 
  Zap, 
  LogOut,
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useIntent } from '../context/IntentContext';

export default function Navbar({ onOpenVisualSearch, onNavigate, currentTab }) {
  const { user, logout, setIsAuthOpen } = useAuth();
  const { cartItemCount, wishlist, setIsCartOpen, setIsWishlistOpen } = useCart();
  const { activeIntent, setActiveIntent, intents, recentSearch, setRecentSearch } = useIntent();
  const [searchInput, setSearchInput] = useState(recentSearch || "");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setRecentSearch(searchInput.trim());
      if (onNavigate) onNavigate('shop', { search: searchInput.trim() });
    }
  };

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-white/10 px-4 sm:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate && onNavigate('home')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold gradient-text leading-none">IntentRec</h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">Multi-Intent AI Engine</p>
          </div>
        </div>

        {/* Search Bar & Visual Search Button */}
        <form 
          onSubmit={handleSearchSubmit} 
          className="flex-1 max-w-xl relative flex items-center"
        >
          <div className="relative w-full">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Try 'Blue formal shirt under ₹1500' or 'Budget gaming laptop'..."
              className="w-full bg-slate-900/80 border border-slate-700/80 focus:border-indigo-500 rounded-2xl pl-11 pr-24 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            
            {/* Visual Search Button */}
            <button
              type="button"
              onClick={onOpenVisualSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="Upload image for AI Visual Search"
            >
              <Camera className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">Visual Search</span>
            </button>
          </div>
        </form>

        {/* Navigation Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Active Intent Selector Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <select
              value={activeIntent}
              onChange={(e) => setActiveIntent(e.target.value)}
              className="bg-transparent text-indigo-300 font-semibold focus:outline-none cursor-pointer text-xs"
            >
              {intents.map(intent => (
                <option key={intent.id} value={intent.name} className="bg-slate-900 text-slate-200">
                  Intent: {intent.name}
                </option>
              ))}
            </select>
          </div>

          {/* Shop Page Link */}
          <button
            onClick={() => onNavigate && onNavigate('shop')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              currentTab === 'shop' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Catalog</span>
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="relative p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-rose-400 hover:border-rose-500/40 transition-all"
          >
            <Heart className="w-4 h-4" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-lg">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-indigo-400 hover:border-indigo-500/40 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shadow-lg shadow-indigo-500/50">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Auth Button */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-medium flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-[10px]">
                  {user.full_name[0]}
                </div>
                <span className="hidden md:inline">{user.full_name}</span>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="gradient-button px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <User className="w-4 h-4" />
              <span>Login</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
}
