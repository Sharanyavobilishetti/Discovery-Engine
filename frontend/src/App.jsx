import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Snackbar, Alert, Box } from '@mui/material';
import { getTheme } from './theme/theme';

import { AuthProvider } from './context/AuthContext';
import { CartWishlistProvider, useCartWishlist } from './context/CartWishlistContext';
import { IntentProvider } from './context/IntentContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIAssistantWidget from './components/AIAssistantWidget';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import ProductListing from './pages/ProductListing';
import ProductDetails from './pages/ProductDetails';
import SemanticSearch from './pages/SemanticSearch';
import RecommendationsPage from './pages/RecommendationsPage';
import AdminDashboard from './pages/AdminDashboard';

const AppContent = ({ mode, toggleTheme }) => {
  const { snackbar, closeNotification } = useCartWishlist();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar mode={mode} toggleTheme={toggleTheme} />
      <Box sx={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/products" element={<ProductListing />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/search" element={<SemanticSearch />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Box>
      <Footer />
      <AIAssistantWidget />

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={closeNotification}>
        <Alert onClose={closeNotification} severity={snackbar.severity} sx={{ width: '100%', fontWeight: 700 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

function App() {
  const [mode, setMode] = useState('dark');
  const toggleTheme = () => setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  const theme = getTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartWishlistProvider>
          <IntentProvider>
            <Router>
              <AppContent mode={mode} toggleTheme={toggleTheme} />
            </Router>
          </IntentProvider>
        </CartWishlistProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
