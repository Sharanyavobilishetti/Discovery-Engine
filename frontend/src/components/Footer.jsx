import React from 'react';
import { Box, Container, Grid, Typography, Link as MuiLink, Chip } from '@mui/material';
import { Compass, Cpu, Database, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#070c14',
        color: '#94a3b8',
        pt: 8,
        pb: 4,
        mt: 10,
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                }}
              >
                <Compass color="#ffffff" size={20} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#f8fafc' }}>
                Findora Discovery Engine
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ lineHeight: 1.6, mb: 2 }}>
              Next-generation AI e-commerce discovery engine featuring real-time session intent matching, Two-Tower recommendation neural models, and FAISS vector semantic search.
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip icon={<Cpu size={12} color="#2dd4bf" />} label="FastAPI + PyTorch" size="small" sx={{ bgcolor: 'rgba(13,148,136,0.15)', color: '#2dd4bf' }} />
              <Chip icon={<Database size={12} color="#38bdf8" />} label="FAISS Vector DB" size="small" sx={{ bgcolor: 'rgba(56,189,248,0.15)', color: '#38bdf8' }} />
              <Chip icon={<Zap size={12} color="#fbbf24" />} label="Sub-80ms Latency" size="small" sx={{ bgcolor: 'rgba(245,158,11,0.15)', color: '#fbbf24' }} />
            </Box>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="subtitle2" sx={{ color: '#f8fafc', fontWeight: 700, mb: 2 }}>
              Navigation
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink component={Link} to="/" color="inherit" underline="hover">Home</MuiLink>
              <MuiLink component={Link} to="/products" color="inherit" underline="hover">Catalog</MuiLink>
              <MuiLink component={Link} to="/search" color="inherit" underline="hover">AI Semantic Search</MuiLink>
              <MuiLink component={Link} to="/recommendations" color="inherit" underline="hover">Recommendations</MuiLink>
            </Box>
          </Grid>

          <Grid item xs={6} md={3}>
            <Typography variant="subtitle2" sx={{ color: '#f8fafc', fontWeight: 700, mb: 2 }}>
              AI Capabilities
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, fontSize: '0.85rem' }}>
              <Typography variant="body2">⚡ Two-Tower Intent Matching</Typography>
              <Typography variant="body2">🔍 FAISS Natural Language Query</Typography>
              <Typography variant="body2">🛍️ Frequently Bought Together</Typography>
              <Typography variant="body2">👔 Complete the Look Styling</Typography>
              <Typography variant="body2">🤖 RAG Shopping Assistant</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="subtitle2" sx={{ color: '#f8fafc', fontWeight: 700, mb: 2 }}>
              Privacy & Intelligence
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.6, mb: 2 }}>
              Findora uses privacy-aware anonymized session vectors. User intent is computed dynamically in real-time without persistent tracking.
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#10b981' }}>
              <ShieldCheck size={18} />
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                Privacy-Aware Recommendation Logic Active
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', mt: 6, pt: 3, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            © 2026 Findora AI Discovery Engine. All rights reserved. Designed for Production & AI Portfolio.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
