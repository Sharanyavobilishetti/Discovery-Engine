import React, { useState } from 'react';
import { X, Camera, Upload, Sparkles, Check, ArrowRight, Image as ImageIcon } from 'lucide-react';

const SAMPLE_IMAGES = [
  { id: 'shoes', title: 'Running Shoes', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80' },
  { id: 'headphones', title: 'Wireless Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80' },
  { id: 'tshirt', title: 'Cotton T-Shirt', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80' },
  { id: 'watch', title: 'Smart Watch', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80' },
];

export default function VisualSearchModal({ isOpen, onClose, onSelectProduct }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSelectSample = (imgUrl) => {
    setSelectedImage(imgUrl);
    performVisualSearch(imgUrl);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
        performVisualSearch(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const performVisualSearch = async (imageUrl) => {
    setAnalyzing(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8000/api/v1/recommendations/visual-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: imageUrl })
      });
      if (!res.ok) throw new Error('Visual search failed');
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      setError('Could not connect to visual search AI model.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-slate-950/85 backdrop-blur-md" 
      />

      <div className="relative w-full max-w-2xl glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">AI Visual Similarity Search</h3>
            <p className="text-xs text-slate-400">Upload a picture or pick a sample photo to find visually matched items in stock</p>
          </div>
        </div>

        {/* Drag & Drop Upload Zone */}
        <div className="space-y-4 mb-6">
          <label className="border-2 border-dashed border-slate-700 hover:border-indigo-500/50 bg-slate-900/60 rounded-2xl p-6 text-center cursor-pointer block transition-colors">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileUpload} 
            />
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 rounded-full bg-indigo-500/10 text-indigo-400">
                <Upload className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-slate-200">Click to upload an image</span>
              <span className="text-xs text-slate-500">Supports PNG, JPG, WEBP up to 10MB</span>
            </div>
          </label>

          {/* Sample Images Quick Pick */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Or try a sample photo:</span>
            <div className="grid grid-cols-4 gap-3">
              {SAMPLE_IMAGES.map(sample => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSample(sample.url)}
                  className={`group relative aspect-square rounded-xl overflow-hidden border transition-all ${
                    selectedImage === sample.url ? 'border-indigo-500 ring-2 ring-indigo-500/50 scale-105' : 'border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <img src={sample.url} alt={sample.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  <span className="absolute inset-x-0 bottom-0 bg-slate-950/80 p-1 text-[10px] font-semibold text-white truncate text-center">
                    {sample.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AI Analysis State */}
        {analyzing && (
          <div className="p-8 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-center space-y-3">
            <Sparkles className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
            <h4 className="text-sm font-bold text-indigo-300">Extracting CNN Visual Feature Vectors...</h4>
            <p className="text-xs text-slate-400">Comparing cosine similarity against catalog product embeddings</p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium text-center">
            {error}
          </div>
        )}

        {/* Visual Search Match Results */}
        {!analyzing && results.length > 0 && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Top Visual Matches Found ({results.length})</span>
              </h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {results.map(prod => (
                <div 
                  key={prod.id}
                  onClick={() => {
                    if (onSelectProduct) onSelectProduct(prod);
                    onClose();
                  }}
                  className="group glass-card p-3 rounded-xl border border-slate-800 hover:border-indigo-500/40 cursor-pointer flex flex-col justify-between transition-all"
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-900 mb-2">
                    <img src={prod.image_url} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    {prod.visual_match_score && (
                      <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-indigo-600 text-white shadow-md">
                        {Math.round(prod.visual_match_score * 100)}% MATCH
                      </span>
                    )}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white truncate">{prod.name}</h5>
                    <p className="text-xs font-semibold text-indigo-400 mt-0.5">₹{prod.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
