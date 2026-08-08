import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Button,
  Chip,
  Paper,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import { Sparkles, Zap, Flame, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { recommendationsAPI, productsAPI } from '../services/api';
import { useIntent } from '../context/IntentContext';

const Home = () => {
  const navigate = useNavigate();
  const { activeIntents } = useIntent();
  const [twoTowerRecs, setTwoTowerRecs] = useState([]);
  const [trending, setTrending] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const [twoTowerRes, trendingRes, catRes] = await Promise.all([
          recommendationsAPI.getTwoTower(8),
          recommendationsAPI.getTrending(8),
          productsAPI.getCategories(),
        ]);
        if (isMounted) {
          setTwoTowerRecs(twoTowerRes.data.products || []);
          setTrending(trendingRes.data || []);
          setCategories(catRes.data || []);
        }
      } catch (err) {
        console.error('Error loading homepage recommendations:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, []);

  const sampleQueries = [
    'comfortable black running shoes under ₹3000',
    'wireless noise-canceling headphones',
    'high-waisted yoga leggings',
    'waterproof canvas backpack 25L',
  ];

  return (
    <Box sx={{ minHeight: '100vh', pb: 6 }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          py: { xs: 8, md: 12 },
          background: 'radial-gradient(circle at 50% 20%, rgba(13, 148, 136, 0.25) 0%, rgba(2, 132, 199, 0.15) 35%, rgba(11, 19, 30, 1) 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Chip
            icon={<Sparkles size={14} color="#2dd4bf" />}
            label="FAISS Vector Search & Real-Time Intent AI"
            sx={{
              backgroundColor: 'rgba(13, 148, 136, 0.2)',
              color: '#2dd4bf',
              fontWeight: 800,
              px: 1,
              py: 0.5,
              mb: 3,
              border: '1px solid rgba(20, 184, 166, 0.4)',
            }}
          />

          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.2rem' },
              lineHeight: 1.1,
              mb: 2.5,
              background: 'linear-gradient(135deg, #ffffff 30%, #94a3b8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Discover What You Need <br />
            <span style={{ background: 'linear-gradient(90deg, #2dd4bf, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Before You Even Type It
            </span>
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: '#94a3b8',
              maxWidth: 760,
              mx: 'auto',
              mb: 4,
              fontSize: { xs: '1rem', md: '1.2rem' },
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            Findora predicts your multi-intent shopping needs in real-time. Experience natural language semantic search and two-tower recommendation matching under 80ms.
          </Typography>

          {/* Quick AI Search Prompt Pills */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1.5, mb: 4 }}>
            <Typography variant="caption" sx={{ width: '100%', color: '#64748b', fontWeight: 700 }}>
              Try searching natural language queries:
            </Typography>
            {sampleQueries.map((q, idx) => (
              <Chip
                key={idx}
                label={`"${q}"`}
                onClick={() => navigate(`/search?q=${encodeURIComponent(q)}`)}
                sx={{
                  backgroundColor: 'rgba(30, 41, 59, 0.8)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  '&:hover': {
                    backgroundColor: 'rgba(13, 148, 136, 0.25)',
                    borderColor: '#2dd4bf',
                    transform: 'translateY(-2px)',
                  },
                }}
              />
            ))}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/search')}
              startIcon={<Sparkles size={20} />}
              sx={{
                backgroundColor: '#0d9488',
                '&:hover': { backgroundColor: '#0f766e' },
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 700,
                borderRadius: '30px',
              }}
            >
              Explore AI Semantic Search
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/products')}
              endIcon={<ArrowRight size={20} />}
              sx={{
                color: '#f8fafc',
                borderColor: 'rgba(255,255,255,0.2)',
                '&:hover': { borderColor: '#0284c7', backgroundColor: 'rgba(2, 132, 199, 0.1)' },
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                borderRadius: '30px',
              }}
            >
              Browse Catalog
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Real-time Session Intent Status Indicator */}
      <Container maxWidth="lg" sx={{ mt: -4, position: 'relative', zIndex: 10 }}>
        <Paper
          className="glass-card"
          sx={{
            p: 3,
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
            background: 'rgba(17, 28, 45, 0.95)',
            borderColor: 'rgba(13, 148, 136, 0.3)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                bgcolor: 'rgba(13, 148, 136, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
              }}
            >
              <Zap size={24} color="#2dd4bf" />
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#f8fafc' }}>
                Real-Time Session Intent Engine Active
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                System calculates intent vectors dynamically based on your clicks, views, and searches.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {activeIntents.map((intent, idx) => (
              <Chip
                key={idx}
                label={`${intent.tag} (${Math.round(intent.weight * 100)}%)`}
                size="small"
                sx={{
                  bgcolor: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  fontWeight: 700,
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                }}
              />
            ))}
          </Box>
        </Paper>
      </Container>

      {/* Category Explorer */}
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Shop by Category
          </Typography>
          <Button onClick={() => navigate('/products')} endIcon={<ArrowRight size={16} />} sx={{ color: '#0d9488' }}>
            View All
          </Button>
        </Box>

        <Grid container spacing={2}>
          {categories.map((cat) => (
            <Grid item xs={6} sm={4} md={2.4} key={cat.id}>
              <Card
                onClick={() => navigate(`/products?category_id=${cat.id}`)}
                sx={{
                  cursor: 'pointer',
                  backgroundColor: '#111c2d',
                  borderRadius: 4,
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.08)',
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-4px)', borderColor: '#0d9488' },
                }}
              >
                <Box sx={{ height: 110, overflow: 'hidden' }}>
                  <img src={cat.image_url} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
                <CardContent sx={{ p: 1.5, textAlign: 'center' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                    {cat.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Two-Tower Personalized Recommendations */}
      <Container maxWidth="lg" sx={{ mt: 10 }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Sparkles color="#0d9488" size={26} />
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Personalized Recommendation Feed
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            Powered by Two-Tower Neural Models matching your live intent weights (sub-80ms latency) with explainable AI match tags.
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#0d9488' }} />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {twoTowerRecs.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Trending Products */}
      <Container maxWidth="lg" sx={{ mt: 10 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
          <Flame color="#f59e0b" size={26} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Trending Products Right Now
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Items with high search momentum and click velocity across the platform.
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {trending.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
