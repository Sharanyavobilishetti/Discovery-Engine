import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  InputBase,
  IconButton,
  Button,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Compass,
  Search,
  ShoppingBag,
  Heart,
  User,
  Sun,
  Moon,
  Sparkles,
  LayoutDashboard,
  Bot,
  Zap,
} from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCartWishlist } from '../context/CartWishlistContext';
import { useIntent } from '../context/IntentContext';
import { searchAPI } from '../services/api';

const Navbar = ({ mode, toggleTheme }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { cart, wishlist } = useCartWishlist();
  const { activeIntents } = useIntent();

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      searchAPI
        .getSuggestions(searchQuery)
        .then((res) => setSuggestions(res.data.suggestions || []))
        .catch(() => setSuggestions([]));
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSuggestionClick = (text) => {
    setSearchQuery(text);
    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(text)}`);
  };

  const handleUserMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleUserMenuClose = () => setAnchorEl(null);

  const topIntent = activeIntents[0]?.tag || 'Personalized Discovery';

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: mode === 'dark' ? 'rgba(11, 19, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        zIndex: 1100,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 }, py: 1, gap: 2 }}>
        {/* Brand Logo */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.2,
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(13, 148, 136, 0.4)',
            }}
          >
            <Compass color="#ffffff" size={24} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, background: 'linear-gradient(90deg, #2dd4bf, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Findora
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '0.62rem', color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', mt: -0.5 }}>
              AI Discovery Engine
            </Typography>
          </Box>
        </Box>

        {/* Natural Language Search Bar with Autocomplete */}
        <Box sx={{ position: 'relative', flexGrow: 1, maxWidth: 540, mx: { xs: 1, md: 2 } }}>
          <Paper
            component="form"
            onSubmit={handleSearchSubmit}
            elevation={0}
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 2,
              py: 0.5,
              borderRadius: '24px',
              backgroundColor: mode === 'dark' ? '#111c2d' : '#f1f5f9',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              '&:focus-within': {
                borderColor: '#0d9488',
                boxShadow: '0 0 16px rgba(13, 148, 136, 0.3)',
              },
            }}
          >
            <Sparkles size={18} color="#0d9488" style={{ marginRight: 8 }} />
            <InputBase
              placeholder="Search natural language: e.g. 'comfortable black running shoes under ₹3000'"
              fullWidth
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              sx={{ color: 'inherit', fontSize: '0.88rem' }}
            />
            <IconButton type="submit" sx={{ p: 1, color: '#0d9488' }}>
              <Search size={18} />
            </IconButton>
          </Paper>

          {/* Autocomplete Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <Paper
              elevation={8}
              sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                mt: 1,
                borderRadius: 3,
                backgroundColor: '#111c2d',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                zIndex: 1300,
                overflow: 'hidden',
              }}
            >
              <List disablePadding>
                {suggestions.map((item, idx) => (
                  <ListItem
                    key={idx}
                    button
                    onClick={() => handleSuggestionClick(item)}
                    sx={{ py: 1, px: 2.5, '&:hover': { backgroundColor: 'rgba(13, 148, 136, 0.15)' } }}
                  >
                    <Search size={14} color="#38bdf8" style={{ marginRight: 12 }} />
                    <ListItemText primary={item} primaryTypographyProps={{ fontSize: '0.85rem', color: '#f1f5f9' }} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Box>

        {/* Navigation Links */}
        <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 1 }}>
          <Button component={Link} to="/" sx={{ color: location.pathname === '/' ? '#2dd4bf' : '#94a3b8' }}>
            Home
          </Button>
          <Button component={Link} to="/products" sx={{ color: location.pathname === '/products' ? '#2dd4bf' : '#94a3b8' }}>
            Catalog
          </Button>
          <Button component={Link} to="/search" startIcon={<Sparkles size={15} color="#2dd4bf" />} sx={{ color: location.pathname === '/search' ? '#2dd4bf' : '#94a3b8' }}>
            AI Search
          </Button>
          <Button component={Link} to="/recommendations" startIcon={<Zap size={15} color="#0284c7" />} sx={{ color: location.pathname === '/recommendations' ? '#2dd4bf' : '#94a3b8' }}>
            Recommendations
          </Button>
          {user?.role === 'admin' && (
            <Button component={Link} to="/admin" startIcon={<LayoutDashboard size={15} color="#f59e0b" />} sx={{ color: location.pathname === '/admin' ? '#f59e0b' : '#94a3b8' }}>
              Admin
            </Button>
          )}
        </Box>

        {/* Real-time Session Intent Badge & Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            icon={<Zap size={13} color="#f59e0b" />}
            label={`Intent: ${topIntent}`}
            size="small"
            sx={{
              display: { xs: 'none', md: 'inline-flex' },
              backgroundColor: 'rgba(245, 158, 11, 0.12)',
              color: '#fbbf24',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              fontWeight: 700,
              fontSize: '0.70rem',
            }}
          />

          <IconButton onClick={toggleTheme} sx={{ color: '#94a3b8' }}>
            {mode === 'dark' ? <Sun size={20} color="#fbbf24" /> : <Moon size={20} />}
          </IconButton>

          <IconButton component={Link} to="/dashboard" sx={{ color: '#94a3b8' }}>
            <Badge badgeContent={wishlist.length} color="secondary">
              <Heart size={20} />
            </Badge>
          </IconButton>

          <IconButton component={Link} to="/dashboard" sx={{ color: '#94a3b8' }}>
            <Badge badgeContent={cartCount} color="primary">
              <ShoppingBag size={20} />
            </Badge>
          </IconButton>

          {user ? (
            <>
              <IconButton onClick={handleUserMenuOpen} sx={{ p: 0.5 }}>
                <Avatar sx={{ width: 34, height: 34, bgcolor: '#0d9488', fontSize: '0.9rem', fontWeight: 800 }}>
                  {user.full_name?.charAt(0) || 'U'}
                </Avatar>
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleUserMenuClose}>
                <MenuItem onClick={() => { handleUserMenuClose(); navigate('/dashboard'); }}>Dashboard</MenuItem>
                {user.role === 'admin' && (
                  <MenuItem onClick={() => { handleUserMenuClose(); navigate('/admin'); }}>Admin Dashboard</MenuItem>
                )}
                <MenuItem onClick={() => { handleUserMenuClose(); logout(); }}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Button variant="contained" size="small" component={Link} to="/login" sx={{ backgroundColor: '#0d9488', '&:hover': { backgroundColor: '#0f766e' } }}>
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
