import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  Users,
  Package,
  ShoppingBag,
  DollarSign,
  MousePointer,
  TrendingUp,
  Search,
  Sparkles,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { dashboardAPI } from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardAPI
      .getAdminStats()
      .then((res) => setStats(res.data))
      .catch((err) => console.error('Error fetching admin stats:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 15 }}>
        <CircularProgress sx={{ color: '#0d9488' }} />
      </Box>
    );
  }

  // Chart 1: Sales Revenue Over Time
  const salesChartData = {
    labels: stats.sales_over_time.map((d) => d.month),
    datasets: [
      {
        label: 'Revenue (₹)',
        data: stats.sales_over_time.map((d) => d.sales),
        borderColor: '#0d9488',
        backgroundColor: 'rgba(13, 148, 136, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Chart 2: Category Distribution
  const categoryChartData = {
    labels: stats.category_distribution.map((c) => c.category),
    datasets: [
      {
        data: stats.category_distribution.map((c) => c.count),
        backgroundColor: ['#0d9488', '#0284c7', '#f59e0b', '#8b5cf6', '#ec4899'],
        borderWidth: 0,
      },
    ],
  };

  // Chart 3: Active Intent Percentage Bar
  const intentChartData = {
    labels: stats.active_intents.map((i) => i.intent),
    datasets: [
      {
        label: 'Session Velocity %',
        data: stats.active_intents.map((i) => i.percentage),
        backgroundColor: '#38bdf8',
        borderRadius: 8,
      },
    ],
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Dashboard Title */}
      <Box sx={{ mb: 5 }}>
        <Chip
          icon={<Sparkles size={14} color="#f59e0b" />}
          label="Real-Time Analytics & Discovery Metrics"
          sx={{ bgcolor: 'rgba(245,158,11,0.15)', color: '#fbbf24', fontWeight: 800, mb: 1.5 }}
        />

        <Typography variant="h3" sx={{ fontWeight: 900, mb: 1 }}>
          Findora Admin Analytics Dashboard
        </Typography>

        <Typography variant="body1" sx={{ color: '#94a3b8' }}>
          Live metrics for recommendation click-through rates, revenue trends, top search queries, and active intent velocity.
        </Typography>
      </Box>

      {/* Metric Cards Row */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper className="glass-card" sx={{ p: 3, backgroundColor: '#111c2d', borderRadius: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700 }}>TOTAL USERS</Typography>
              <Users size={20} color="#38bdf8" />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#f8fafc' }}>
              {stats.total_users}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Paper className="glass-card" sx={{ p: 3, backgroundColor: '#111c2d', borderRadius: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700 }}>PRODUCTS</Typography>
              <Package size={20} color="#2dd4bf" />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#f8fafc' }}>
              {stats.total_products}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Paper className="glass-card" sx={{ p: 3, backgroundColor: '#111c2d', borderRadius: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700 }}>ORDERS</Typography>
              <ShoppingBag size={20} color="#f59e0b" />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#f8fafc' }}>
              {stats.total_orders}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Paper className="glass-card" sx={{ p: 3, backgroundColor: '#111c2d', borderRadius: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700 }}>REVENUE</Typography>
              <DollarSign size={20} color="#10b981" />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#10b981' }}>
              ₹{stats.total_revenue.toLocaleString('en-IN')}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Paper className="glass-card" sx={{ p: 3, backgroundColor: '#111c2d', borderRadius: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700 }}>REC CTR %</Typography>
              <MousePointer size={20} color="#ec4899" />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#ec4899' }}>
              {stats.recommendation_ctr}%
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={4} sx={{ mb: 5 }}>
        <Grid item xs={12} md={8}>
          <Paper className="glass-card" sx={{ p: 3, backgroundColor: '#111c2d', borderRadius: 4, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
              Sales Revenue Trajectory
            </Typography>
            <Box sx={{ height: 260 }}>
              <Line data={salesChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper className="glass-card" sx={{ p: 3, backgroundColor: '#111c2d', borderRadius: 4, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
              Category Catalog Distribution
            </Typography>
            <Box sx={{ height: 240, display: 'flex', justifyContent: 'center' }}>
              <Doughnut data={categoryChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Search Analytics & Intent Table */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Paper className="glass-card" sx={{ p: 3, backgroundColor: '#111c2d', borderRadius: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Search size={20} color="#0d9488" />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Top Natural Language Search Queries
              </Typography>
            </Box>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Query Text</TableCell>
                    <TableCell align="right" sx={{ color: '#94a3b8', fontWeight: 700 }}>Search Count</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.top_search_queries.map((row, idx) => (
                    <TableRow key={idx} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell sx={{ color: '#f8fafc', fontWeight: 600 }}>"{row.query}"</TableCell>
                      <TableCell align="right" sx={{ color: '#2dd4bf', fontWeight: 800 }}>{row.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper className="glass-card" sx={{ p: 3, backgroundColor: '#111c2d', borderRadius: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <TrendingUp size={20} color="#38bdf8" />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Real-Time Intent Velocity
              </Typography>
            </Box>

            <Box sx={{ height: 240 }}>
              <Bar data={intentChartData} options={{ responsive: true, maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { display: false } } }} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
