import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Sparkles, Search, Zap, CheckCircle2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { searchAPI } from '../services/api';

const SemanticSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || 'comfortable black running shoes under ₹3000';

  const [query, setQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleExecuteSearch = async (searchQueryText = null) => {
    const qToUse = searchQueryText || query;
    if (!qToUse.trim()) return;

    setLoading(true);
    try {
      setSearchParams({ q: qToUse });
      const res = await searchAPI.semanticSearch(qToUse);
      setSearchResults(res.data);
    } catch (err) {
      console.error('Semantic search error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      handleExecuteSearch(initialQuery);
    }
  }, []);

  const sampleQueries = [
    'I need comfortable black running shoes under ₹3000',
    'wireless noise-canceling headphones for music',
    'waterproof canvas backpack with laptop sleeve',
    'high-waisted yoga leggings teal',
    'classic white low-top casual sneakers',
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Search Header */}
      <Box sx={{ textAlignment: 'center', mb: 5 }}>
        <Chip
          icon={<Sparkles size={14} color="#0d9488" />}
          label="SentenceTransformers & FAISS Vector Distance"
          sx={{ bgcolor: 'rgba(13,148,136,0.15)', color: '#2dd4bf', fontWeight: 800, mb: 2 }}
        />

        <Typography variant="h3" sx={{ fontWeight: 900, mb: 1.5, background: 'linear-gradient(90deg, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          AI Semantic Natural Language Search
        </Typography>

        <Typography variant="body1" sx={{ color: '#94a3b8', maxWidth: 700, mx: 'auto' }}>
          Describe what you are looking for in natural language. Our vector model parses price limits, colors, and product intent tags instantly.
        </Typography>
      </Box>

      {/* Main Search Bar */}
      <Paper className="glass-card" sx={{ p: 2, mb: 4, backgroundColor: '#111c2d', borderRadius: 4 }}>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
          <TextField
            fullWidth
            placeholder="Type query e.g. 'I need comfortable black running shoes under ₹3000'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleExecuteSearch()}
            sx={{
              backgroundColor: '#090e17',
              borderRadius: 3,
              '& .MuiInputBase-input': { color: '#fff', fontSize: '1rem', py: 1.8 },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' },
            }}
          />

          <Button
            variant="contained"
            onClick={() => handleExecuteSearch()}
            disabled={loading}
            startIcon={<Search size={20} />}
            sx={{
              backgroundColor: '#0d9488',
              '&:hover': { backgroundColor: '#0f766e' },
              px: 4,
              fontWeight: 800,
              borderRadius: 3,
              minWidth: 160,
            }}
          >
            {loading ? 'Searching...' : 'AI Search'}
          </Button>
        </Box>

        {/* Preset Sample Query Chips */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2.5, px: 0.5 }}>
          <Typography variant="caption" sx={{ width: '100%', color: '#64748b', fontWeight: 700 }}>
            Sample Natural Language Inputs:
          </Typography>

          {sampleQueries.map((sq, i) => (
            <Chip
              key={i}
              label={sq}
              size="small"
              onClick={() => {
                setQuery(sq);
                handleExecuteSearch(sq);
              }}
              sx={{
                bgcolor: 'rgba(30,41,59,0.8)',
                color: '#38bdf8',
                cursor: 'pointer',
                fontSize: '0.75rem',
                border: '1px solid rgba(56,189,248,0.25)',
                '&:hover': { bgcolor: 'rgba(13,148,136,0.2)' },
              }}
            />
          ))}
        </Box>
      </Paper>

      {/* Query Intent Breakdown Banner */}
      {searchResults && (
        <Paper className="glass-card" sx={{ p: 3, mb: 5, backgroundColor: 'rgba(13, 148, 136, 0.08)', borderColor: 'rgba(13, 148, 136, 0.3)' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2dd4bf', mb: 0.5 }}>
                🔍 Natural Language Vector Intent Analysis
              </Typography>

              <Typography variant="body2" sx={{ color: '#f8fafc', fontWeight: 600 }}>
                {searchResults.detected_intent}
              </Typography>
            </Grid>

            <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Chip
                icon={<Zap size={14} color="#fbbf24" />}
                label={`Latency: ${searchResults.latency_ms} ms`}
                size="small"
                sx={{ bgcolor: 'rgba(245,158,11,0.15)', color: '#fbbf24', fontWeight: 800, mr: 1 }}
              />

              <Chip
                icon={<CheckCircle2 size={14} color="#10b981" />}
                label={`Found: ${searchResults.total_found} Matches`}
                size="small"
                sx={{ bgcolor: 'rgba(16,185,129,0.15)', color: '#10b981', fontWeight: 800 }}
              />
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Results Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress sx={{ color: '#0d9488' }} />
        </Box>
      ) : searchResults ? (
        <Grid container spacing={3}>
          {searchResults.results.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      ) : null}
    </Container>
  );
};

export default SemanticSearch;
