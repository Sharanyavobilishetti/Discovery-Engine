import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Sparkles, Filter, RefreshCw, Layers, Check } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useIntent } from '../context/IntentContext';

export default function ShopPage({ initialParams = {}, onSelectProduct }) {
  const { activeIntent, intents } = useIntent();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialParams.category || 'All');
  const [searchQuery, setSearchQuery] = useState(initialParams.search || '');
  const [selectedIntent, setSelectedIntent] = useState(activeIntent || 'All');
  const [maxPrice, setMaxPrice] = useState(60000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/products/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(console.error);
  }, []);

  const loadProducts = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== 'All') params.append('category', selectedCategory);
    if (selectedIntent && selectedIntent !== 'All') params.append('intent', selectedIntent);
    if (searchQuery) params.append('search', searchQuery);
    if (maxPrice < 60000) params.append('max_price', maxPrice);

    fetch(`http://localhost:8000/api/v1/products?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, selectedIntent, maxPrice]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadProducts();
  };

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedIntent('All');
    setSearchQuery('');
    setMaxPrice(60000);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl">
        <div>
          <h1 className="text-3xl font-extrabold text-white font-heading">Product Catalog</h1>
          <p className="text-xs text-slate-400 mt-1">Discover, search, and filter catalog items powered by AI multi-intent embeddings</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-md w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by title, category, tags..."
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-11 pr-12 py-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md"
          >
            Search
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar Filters */}
        <aside className="glass-panel p-6 rounded-3xl border border-white/10 h-fit space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Filter className="w-4 h-4 text-indigo-400" />
              <span>Catalog Filters</span>
            </div>
            <button 
              onClick={resetFilters} 
              className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> Reset All
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-3">
            <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider block">Categories</label>
            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                  selectedCategory === 'All' 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-md' 
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <span>All Categories</span>
                {selectedCategory === 'All' && <Check className="w-3.5 h-3.5" />}
              </button>
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.category;
                return (
                  <button
                    key={cat.category}
                    onClick={() => setSelectedCategory(cat.category)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all flex justify-between items-center ${
                      isSelected 
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-md' 
                        : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <span>{cat.category}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-400 font-semibold">
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Shopping Intent Filter */}
          <div className="space-y-3 border-t border-slate-800/80 pt-5">
            <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider block flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Shopping Intent</span>
            </label>
            <select
              value={selectedIntent}
              onChange={(e) => setSelectedIntent(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-2xl p-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-medium cursor-pointer"
            >
              <option value="All" className="bg-slate-900 text-slate-300">All Intent Modes</option>
              {intents.map(intent => (
                <option key={intent.id} value={intent.name} className="bg-slate-900 text-slate-300">
                  {intent.name}
                </option>
              ))}
            </select>
          </div>

          {/* Max Price Range Slider */}
          <div className="space-y-3 border-t border-slate-800/80 pt-5">
            <div className="flex justify-between items-center text-xs font-bold text-slate-300">
              <span>Max Price</span>
              <span className="text-indigo-400 font-extrabold">₹{maxPrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="500"
              max="60000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
            />
          </div>
        </aside>

        {/* Right Main Catalog Grid */}
        <main className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Showing <strong className="text-white font-bold">{products.length}</strong> matching products</span>
            <span className="flex items-center gap-1 text-indigo-400 font-semibold">
              <Sparkles className="w-3 h-3" /> Ranked by AI Intent Hybrid Score
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="glass-card h-88 rounded-2xl shimmer-loading border border-slate-800" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="glass-panel p-16 rounded-3xl text-center text-slate-400 space-y-3 border border-white/10">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                <Search className="w-8 h-8" />
              </div>
              <p className="text-lg font-bold text-slate-200">No products match your filter criteria</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">Try resetting filters or searching with broader keywords.</p>
              <button
                onClick={resetFilters}
                className="gradient-button px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 mt-2"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map(prod => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onSelectProduct={onSelectProduct}
                  explanation={`Matches criteria in ${prod.category} catalog`}
                />
              ))}
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
