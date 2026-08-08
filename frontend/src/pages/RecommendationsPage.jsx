import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Grid, Tabs, Tab, CircularProgress, Paper, Chip } from '@mui/material';
import { Sparkles, Flame, UserCheck, Zap, Layers } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { recommendationsAPI } from '../services/api';

const RecommendationsPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [twoTowerData, setTwoTowerData] = useState(null);
  const [coldStartData, setColdStartData] = useState([]);
  const [trendingData, setTrendingData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        setLoading(true);
        const [twoTowerRes, coldRes, trendRes] = await Promise.all([
          recommendationsAPI.getTwoTower(12),
          recommendationsAPI.getColdStart(12),
          recommendationsAPI.getTrending(12),
        ]);
        setTwoTowerData(twoTowerRes.data);
        setColdStartData(coldRes.data || []);
        setTrendingData(trendRes.data || []);
      } catch (err) {
        console.error('Error fetching recommendations page:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecs();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 4 }}>
        <Chip
          icon={<Zap size={14} color="#0284c7" />}
          label="Multi-Model Recommendation Architecture"
          sx={{ bgcolor: 'rgba(2, 132, 199, 0.15)', color: '#38bdf8', fontWeight: 800, mb: 1.5 }}
        />

        <Typography variant="h3" sx={{ fontWeight: 900, mb: 1 }}>
          AI Recommendation Hub
        </Typography>

        <Typography variant="body1" sx={{ color: '#94a3b8' }}>
          Explore real-time multi-intent recommendations, neural two-tower embeddings, trending momentum, and cold-start fallback engines.
        </Typography>
      </Box>

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
          <Tab icon={<Sparkles size={18} />} iconPosition="start" label="Two-Tower Intent Neural Model" />
          <Tab icon={<UserCheck size={18} />} iconPosition="start" label="Cold-Start Starters" />
          <Tab icon={<Flame size={18} />} iconPosition="start" label="Trending Velocity" />
        </Tabs>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress sx={{ color: '#0d9488' }} />
        </Box>
      ) : (
        <>
          {/* Tab 0: Two-Tower Intent */}
          {tabValue === 0 && twoTowerData && (
            <Box>
              <Paper className="glass-card" sx={{ p: 3, mb: 4, backgroundColor: '#111c2d' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2dd4bf', mb: 0.5 }}>
                  Algorithm: {twoTowerData.algorithm}
                </Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1.5 }}>
                  {twoTowerData.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, my: 'auto' }}>
                    Active Session Intent Vectors:
                  </Typography>
                  {twoTowerData.detected_session_intents?.map((intent, idx) => (
                    <Chip key={idx} label={intent} size="small" sx={{ bgcolor: 'rgba(13,148,136,0.2)', color: '#2dd4bf', fontWeight: 700 }} />
                  ))}
                </Box>
              </Paper>

              <Grid container spacing={3}>
                {twoTowerData.products.map((product) => (
                  <Grid item xs={12} sm={6} md={3} key={product.id}>
                    <ProductCard product={product} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Tab 1: Cold-Start */}
          {tabValue === 1 && (
            <Grid container spacing={3}>
              {coldStartData.map((product) => (
                <Grid item xs={12} sm={6} md={3} key={product.id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          )}

          {/* Tab 2: Trending */}
          {tabValue === 2 && (
            <Grid container spacing={3}>
              {trendingData.map((product) => (
                <Grid item xs={12} sm={6} md={3} key={product.id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Container>
  );
};

export default RecommendationsPage;
