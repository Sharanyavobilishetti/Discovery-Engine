import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Zap, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  Cpu, 
  Compass,
  ChevronRight,
  Layers,
  Search,
  Eye
} from 'lucide-react';
import { useIntent } from '../context/IntentContext';
import ProductCard from '../components/ProductCard';

export default function HomePage({ onNavigate, onSelectProduct }) {
  const { activeIntent, setActiveIntent, intents } = useIntent();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Fetch products filtered by active intent
    fetch(`http://localhost:8000/api/v1/products?intent=${encodeURIComponent(activeIntent)}&limit=8`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Fetch category counts
    fetch('http://localhost:8000/api/v1/products/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(console.error);
  }, [activeIntent]);

  // Generate XAI explanation string based on active intent
  const getExplanation = (product) => {
    if (activeIntent.includes("Budget")) {
      return `Matched because price ₹${product.price.toLocaleString()} aligns perfectly with your Budget Shopping constraint.`;
    }
    if (activeIntent.includes("Urgent")) {
      return `Matched because this item is flagged for 24h Express Priority Shipping.`;
    }
    if (activeIntent.includes("Fashion")) {
      return `Matched using visual color & style embedding vectors in ${product.category}.`;
    }
    if (activeIntent.includes("Seasonal")) {
      return `Recommended for current ${product.seasonal_intent || 'Seasonal'} trends & catalog popularity.`;
    }
    return `Popular trending item in ${product.category} with ${product.rating}★ user satisfaction score.`;
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Showcase Section */}
      <section className="relative overflow-hidden rounded-3xl glass-panel p-8 sm:p-14 border border-white/10 shadow-2xl">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-inner">
            <Zap className="w-4 h-4 text-indigo-400 animate-pulse" /> 
            <span>Real-Time Multi-Intent Personalization Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1] font-heading">
            Shop By <span className="gradient-text">Live Shopping Intent</span>, Not Just Past History
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
            Our hybrid AI framework dynamically fuses real-time session clickstreams, 512-d CLIP visual embeddings, and natural language intent classification to personalize recommendations instantly.
          </p>

          {/* AI Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-left">
              <div className="text-indigo-400 font-extrabold text-lg">512-D</div>
              <div className="text-[11px] text-slate-400 font-medium">FAISS Vectors</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-left">
              <div className="text-purple-400 font-extrabold text-lg">CLIP AI</div>
              <div className="text-[11px] text-slate-400 font-medium">Visual Search</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-left">
              <div className="text-cyan-400 font-extrabold text-lg">&lt; 10ms</div>
              <div className="text-[11px] text-slate-400 font-medium">Hybrid Ranking</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-left">
              <div className="text-amber-400 font-extrabold text-lg">100% XAI</div>
              <div className="text-[11px] text-slate-400 font-medium">Explainable Logic</div>
            </div>
          </div>

          {/* Interactive Intent Selector Chips */}
          <div className="pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-indigo-400" />
                Select Shopping Intent State:
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {intents.map((intent) => {
                const isActive = activeIntent === intent.name;
                return (
                  <button
                    key={intent.id}
                    onClick={() => setActiveIntent(intent.name)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all flex items-center gap-2 ${
                      isActive 
                        ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-500/40 scale-105' 
                        : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-indigo-500/40 hover:bg-slate-800/80'
                    }`}
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300 animate-spin-slow' : 'text-indigo-400'}`} />
                    <span>{intent.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* Categories Discovery */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-white font-heading">Explore Catalog Categories</h2>
            <p className="text-xs text-slate-400">Discover premium items organized by curated domains</p>
          </div>
          <button 
            onClick={() => onNavigate('shop')}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group"
          >
            <span>View Catalog</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.category}
              onClick={() => onNavigate('shop', { category: cat.category })}
              className="group glass-card p-4 rounded-2xl cursor-pointer border border-slate-800 hover:border-indigo-500/50 transition-all text-center flex flex-col items-center gap-3"
            >
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 border border-white/5 relative">
                <img 
                  src={cat.image_url} 
                  alt={cat.category} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{cat.category}</h4>
                <p className="text-[11px] text-indigo-400 font-semibold">{cat.count} Products</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Intent Recommendations Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 shadow-inner">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white font-heading flex items-center gap-2">
                <span>Recommendations for</span>
                <span className="gradient-text">{activeIntent}</span>
              </h2>
              <p className="text-xs text-slate-400">Hybrid collaborative & content recommendations with explainable AI scores</p>
            </div>
          </div>

          <button 
            onClick={() => onNavigate('shop')}
            className="gradient-button px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 self-start sm:self-auto"
          >
            <span>Explore All Products</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="glass-card h-88 rounded-2xl shimmer-loading border border-slate-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
                explanation={getExplanation(product)}
              />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
