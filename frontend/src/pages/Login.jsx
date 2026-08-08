import React, { useState } from 'react';
import { Container, Paper, Box, Typography, TextField, Button, Alert } from '@mui/material';
import { Compass, LogIn } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('alex@example.com');
  const [password, setPassword] = useState('alex123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid login credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Paper className="glass-card" sx={{ p: 4, borderRadius: 4, backgroundColor: '#111c2d' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              mb: 1.5,
            }}
          >
            <Compass size={30} color="#fff" />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#f8fafc' }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            Log in to access your personalized discovery feed & wishlist
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Email Address"
            type="email"
            required
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              '& .MuiInputBase-input': { color: '#fff' },
              '& .MuiInputLabel-root': { color: '#94a3b8' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' },
            }}
          />

          <TextField
            label="Password"
            type="password"
            required
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              '& .MuiInputBase-input': { color: '#fff' },
              '& .MuiInputLabel-root': { color: '#94a3b8' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            startIcon={<LogIn size={18} />}
            sx={{
              backgroundColor: '#0d9488',
              '&:hover': { backgroundColor: '#0f766e' },
              py: 1.5,
              fontWeight: 700,
              fontSize: '1rem',
            }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 1 }}>
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
              Test Credentials: <strong>alex@example.com</strong> / <strong>alex123</strong> (or Admin: <strong>admin@findora.com</strong> / <strong>admin123</strong>)
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Don't have an account?{' '}
              <Typography component={Link} to="/register" sx={{ color: '#2dd4bf', textDecoration: 'none', fontWeight: 700 }}>
                Register Here
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
