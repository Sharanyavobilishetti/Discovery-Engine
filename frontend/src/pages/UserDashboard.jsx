import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  Avatar,
  Button,
  Divider,
  Chip,
  CircularProgress,
} from '@mui/material';
import { User, History, Heart, ShoppingBag, Sparkles, LogOut, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usersAPI, ordersAPI, recommendationsAPI } from '../services/api';
import { useCartWishlist } from '../context/CartWishlistContext';
import ProductCard from '../components/ProductCard';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const { wishlist } = useCartWishlist();
  const [tabValue, setTabValue] = useState(0);
  const [browsingHistory, setBrowsingHistory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tailoredRecs, setTailoredRecs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [historyRes, recsRes] = await Promise.all([
          usersAPI.getBrowsingHistory(),
          recommendationsAPI.getTwoTower(4),
        ]);
        setBrowsingHistory(historyRes.data || []);
        setTailoredRecs(recsRes.data.products || []);

        if (user) {
          const ordersRes = await ordersAPI.getOrders();
          setOrders(ordersRes.data || []);
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, [user]);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Profile Header */}
      <Paper className="glass-card" sx={{ p: 4, mb: 5, backgroundColor: '#111c2d', borderRadius: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar sx={{ width: 80, height: 80, bgcolor: '#0d9488', fontSize: '2rem', fontWeight: 800 }}>
              {user?.full_name?.charAt(0) || 'G'}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#f8fafc' }}>
              {user ? user.full_name : 'Guest Shopper'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
              {user ? user.email : 'Session Intent Mode • Login for order history'}
            </Typography>
            <Chip
              icon={<Sparkles size={14} color="#2dd4bf" />}
              label={user ? `Role: ${user.role.toUpperCase()}` : 'Anonymous Intent Active'}
              size="small"
              sx={{ bgcolor: 'rgba(13, 148, 136, 0.2)', color: '#2dd4bf', fontWeight: 700 }}
            />
          </Grid>
          {user && (
            <Grid item>
              <Button variant="outlined" color="error" startIcon={<LogOut size={16} />} onClick={logout}>
                Logout
              </Button>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.1)', mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={(e, val) => setTabValue(val)}
          sx={{
            '& .MuiTab-root': { color: '#94a3b8', fontWeight: 700, fontSize: '0.95rem' },
            '& .Mui-selected': { color: '#2dd4bf' },
            '& .MuiTabs-indicator': { backgroundColor: '#0d9488' },
          }}
        >
          <Tab icon={<History size={18} />} iconPosition="start" label="Recently Viewed" />
          <Tab icon={<Heart size={18} />} iconPosition="start" label={`Wishlist (${wishlist.length})`} />
          <Tab icon={<ShoppingBag size={18} />} iconPosition="start" label={`Order History (${orders.length})`} />
          <Tab icon={<Sparkles size={18} />} iconPosition="start" label="Tailored Feed" />
        </Tabs>
      </Box>

      {/* Tab 0: Recently Viewed */}
      {tabValue === 0 && (
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
            Recently Viewed Items
          </Typography>
          {browsingHistory.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center', backgroundColor: '#111c2d' }}>
              <Typography color="#94a3b8">No items viewed in this session yet.</Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {browsingHistory.map((product) => (
                <Grid item xs={12} sm={6} md={3} key={product.id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {/* Tab 1: Wishlist */}
      {tabValue === 1 && (
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
            My Wishlist
          </Typography>
          {wishlist.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center', backgroundColor: '#111c2d' }}>
              <Typography color="#94a3b8">Your wishlist is empty. Click the heart icon on any product card!</Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {wishlist.map((product) => (
                <Grid item xs={12} sm={6} md={3} key={product.id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {/* Tab 2: Orders */}
      {tabValue === 2 && (
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
            Purchase History
          </Typography>
          {orders.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center', backgroundColor: '#111c2d' }}>
              <Typography color="#94a3b8">No past orders found.</Typography>
            </Paper>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {orders.map((order) => (
                <Paper key={order.id} sx={{ p: 3, backgroundColor: '#111c2d', borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#f8fafc' }}>
                        Order #{order.id}
                      </Typography>

                      <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                        {new Date(order.created_at).toLocaleDateString()}
                      </Typography>
                    </Box>

                    <Chip icon={<CheckCircle size={14} color="#10b981" />} label={order.status.toUpperCase()} color="success" size="small" />
                  </Box>

                  <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.06)' }} />

                  {order.items.map((item, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 1 }}>
                      <img src={item.image_url} alt={item.title} style={{ width: 44, height: 44, borderRadius: 6, objectFit: 'cover' }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                          {item.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                          Qty: {item.quantity} x ₹{item.price.toLocaleString('en-IN')}
                        </Typography>
                      </Box>
                    </Box>
                  ))}

                  <Box sx={{ textAlign: 'right', mt: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2dd4bf' }}>
                      Total: ₹{order.total_amount.toLocaleString('en-IN')}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* Tab 3: Tailored Recs */}
      {tabValue === 3 && (
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
            Recommended Products For You
          </Typography>

          <Grid container spacing={3}>
            {tailoredRecs.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default UserDashboard;
