import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box, IconButton, Button, Rating } from '@mui/material';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartWishlist } from '../context/CartWishlistContext';
import { useIntent } from '../context/IntentContext';
import ExplainableBadge from './ExplainableBadge';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isWishlisted } = useCartWishlist();
  const { trackAction } = useIntent();

  const handleCardClick = () => {
    trackAction(product.id, 'click');
    navigate(`/products/${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    trackAction(product.id, 'cart');
    addToCart(product, 1);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const wishlisted = isWishlisted(product.id);

  return (
    <Card
      className="glass-card"
      onClick={handleCardClick}
      sx={{
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden', height: 220, backgroundColor: '#090e17' }}>
        <CardMedia
          component="img"
          image={product.image_url}
          alt={product.title}
          sx={{
            height: '100%',
            width: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
            '&:hover': {
              transform: 'scale(1.08)',
            },
          }}
        />
        <IconButton
          onClick={handleWishlist}
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            color: wishlisted ? '#ef4444' : '#94a3b8',
            '&:hover': {
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              color: '#ef4444',
            },
          }}
        >
          <Heart size={18} fill={wishlisted ? '#ef4444' : 'none'} />
        </IconButton>
        {product.is_trending && (
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              backgroundColor: '#0d9488',
              color: '#fff',
              px: 1.2,
              py: 0.4,
              borderRadius: '6px',
              fontSize: '0.68rem',
              fontWeight: 800,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              boxShadow: '0 4px 10px rgba(13, 148, 136, 0.4)',
            }}
          >
            Trending
          </Box>
        )}
      </Box>

      <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="caption" sx={{ color: '#0d9488', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {product.brand} • {product.category_name || 'Item'}
          </Typography>

          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              fontSize: '0.98rem',
              color: '#f8fafc',
              lineHeight: 1.3,
              mt: 0.5,
              mb: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {product.title}
          </Typography>

          <ExplainableBadge explanation={product.explanation} matchScore={product.match_score} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1 }}>
            <Rating value={product.rating || 4.5} precision={0.1} readOnly size="small" sx={{ color: '#f59e0b' }} />
            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
              ({product.reviews_count || 120})
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2, pt: 1.5, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#2dd4bf' }}>
            ₹{product.price.toLocaleString('en-IN')}
          </Typography>

          <Button
            variant="contained"
            size="small"
            onClick={handleAddToCart}
            startIcon={<ShoppingBag size={15} />}
            sx={{
              backgroundColor: '#0d9488',
              '&:hover': { backgroundColor: '#0f766e' },
              fontSize: '0.8rem',
            }}
          >
            Add
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
