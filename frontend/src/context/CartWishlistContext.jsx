import React, { createContext, useContext, useState, useEffect } from 'react';
import { wishlistAPI, ordersAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartWishlistContext = createContext();

export const CartWishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('findora_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlist, setWishlist] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    localStorage.setItem('findora_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (user) {
      wishlistAPI.getWishlist()
        .then((res) => setWishlist(res.data))
        .catch((err) => console.error(err));
    } else {
      setWishlist([]);
    }
  }, [user]);

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showNotification(`Added ${product.title} to Cart`, 'success');
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showNotification('Item removed from cart', 'info');
  };

  const updateCartQuantity = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = async (product) => {
    if (!user) {
      showNotification('Please log in to add to Wishlist', 'warning');
      return;
    }

    const exists = wishlist.some((item) => item.id === product.id);
    try {
      if (exists) {
        await wishlistAPI.removeFromWishlist(product.id);
        setWishlist((prev) => prev.filter((item) => item.id !== product.id));
        showNotification('Removed from Wishlist', 'info');
      } else {
        await wishlistAPI.addToWishlist(product.id);
        setWishlist((prev) => [...prev, product]);
        showNotification('Added to Wishlist', 'success');
      }
    } catch (err) {
      showNotification('Wishlist operation failed', 'error');
    }
  };

  const isWishlisted = (productId) => wishlist.some((item) => item.id === productId);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const showNotification = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const closeNotification = () => setSnackbar((prev) => ({ ...prev, open: false }));

  return (
    <CartWishlistContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        wishlist,
        toggleWishlist,
        isWishlisted,
        snackbar,
        showNotification,
        closeNotification,
      }}
    >
      {children}
    </CartWishlistContext.Provider>
  );
};

export const useCartWishlist = () => useContext(CartWishlistContext);
