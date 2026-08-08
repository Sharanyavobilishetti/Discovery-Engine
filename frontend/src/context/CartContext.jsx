import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  useEffect(() => {
    if (token) {
      // Sync cart
      fetch('http://localhost:8000/api/v1/user/cart', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.ok ? res.json() : { cart: [] })
      .then(data => setCart(data.cart || []))
      .catch(console.error);

      // Sync wishlist
      fetch('http://localhost:8000/api/v1/user/wishlist', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.ok ? res.json() : { wishlist: [] })
      .then(data => setWishlist(data.wishlist || []))
      .catch(console.error);
    }
  }, [token]);

  const addToCart = async (product, quantity = 1) => {
    if (token) {
      try {
        await fetch('http://localhost:8000/api/v1/user/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ product_id: product.id, quantity })
        });
      } catch (e) {
        console.error("Cart sync error", e);
      }
    }
    
    // Local fallback update
    setCart(prev => {
      const idx = prev.findIndex(item => item.product.id === product.id);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    if (token) {
      fetch(`http://localhost:8000/api/v1/user/cart/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(console.error);
    }
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const toggleWishlist = (product) => {
    if (token) {
      fetch(`http://localhost:8000/api/v1/user/wishlist/${product.id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(console.error);
    }
    setWishlist(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) return prev.filter(p => p.id !== product.id);
      return [...prev, product];
    });
  };

  const isWishlisted = (productId) => wishlist.some(p => p.id === productId);

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      wishlist,
      addToCart,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isWishlisted,
      cartTotal,
      cartItemCount,
      isCartOpen,
      setIsCartOpen,
      isWishlistOpen,
      setIsWishlistOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
