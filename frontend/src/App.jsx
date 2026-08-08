import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { IntentProvider } from './context/IntentContext';

import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import AuthModal from './components/AuthModal';
import VisualSearchModal from './components/VisualSearchModal';

import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';

function MainApp() {
  const [currentTab, setCurrentTab] = useState('home'); // 'home' | 'shop' | 'detail'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [shopParams, setShopParams] = useState({});
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);

  const handleNavigate = (tab, params = {}) => {
    setCurrentTab(tab);
    setShopParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setCurrentTab('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        onOpenVisualSearch={() => setIsVisualSearchOpen(true)}
        onNavigate={handleNavigate}
        currentTab={currentTab}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">
        {currentTab === 'home' && (
          <HomePage 
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentTab === 'shop' && (
          <ShopPage 
            initialParams={shopParams}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentTab === 'detail' && (
          <ProductDetailPage 
            product={selectedProduct}
            onBack={() => setCurrentTab('shop')}
          />
        )}
      </main>

      <footer className="glass-panel border-t border-white/10 py-8 px-6 text-center text-xs text-slate-400">
        <p className="font-semibold text-slate-300">AI-Powered Multi-Intent E-Commerce Recommendation System</p>
        <p className="text-slate-500 mt-1">&copy; Production Architecture &bull; Built with FastAPI, PyTorch, FAISS & React</p>
      </footer>

      {/* Global Overlays & Modals */}
      <CartDrawer />
      <WishlistDrawer />
      <AuthModal />
      <VisualSearchModal 
        isOpen={isVisualSearchOpen} 
        onClose={() => setIsVisualSearchOpen(false)}
        onSelectProduct={handleSelectProduct}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <IntentProvider>
          <MainApp />
        </IntentProvider>
      </CartProvider>
    </AuthProvider>
  );
}
