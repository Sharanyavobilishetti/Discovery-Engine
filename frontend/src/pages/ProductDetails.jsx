import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  Rating,
  Chip,
  Divider,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Check, Sparkles, Shirt, Layers } from 'lucide-react';
import { productsAPI, recommendationsAPI } from '../services/api';
import { useCartWishlist } from '../context/CartWishlistContext';
import { useIntent } from '../context/IntentContext';
import ProductCard from '../components/ProductCard';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isWishlisted } = useCartWishlist();
  const { trackAction } = useIntent();

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [fbtProducts, setFbtProducts] = useState([]);
  const [completeLook, setCompleteLook] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const [prodRes, simRes, fbtRes, lookRes] = await Promise.all([
          productsAPI.getProductDetails(id),
          recommendationsAPI.getContentBased(id, 4),
          recommendationsAPI.getFBT(id, 3),
          recommendationsAPI.getCompleteLook(id, 3),
        ]);
        setProduct(prodRes.data);
        setSimilarProducts(simRes.data || []);
        setFbtProducts(fbtRes.data || []);
        setCompleteLook(lookRes.data || []);

        // Log real-time view behavior
        trackAction(parseInt(id), 'view');
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  if (loading || !product) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 15 }}>
        <CircularProgress sx={{ color: '#0d9488' }} />
      </Box>
    );
  }

  const wishlisted = isWishlisted(product.id);
  const featuresList = (product.features || '').split('|');

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Paper className="glass-card" sx={{ p: 4, backgroundColor: '#111c2d', borderRadius: 4, mb: 8 }}>
        <Grid container spacing={5}>
          {/* Main Product Image */}
          <Grid item xs={12} md={6}>
            <Box sx={{ height: 420, borderRadius: 3, overflow: 'hidden', backgroundColor: '#090e17' }}>
              <img src={product.image_url} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Box>
          </Grid>

          {/* Product Info & Purchase Options */}
          <Grid item xs={12} md={6}>
            <Chip label={product.category_name || 'Category'} size="small" sx={{ bgcolor: 'rgba(13,148,136,0.2)', color: '#2dd4bf', fontWeight: 700, mb: 1.5 }} />

            <Typography variant="h3" sx={{ fontWeight: 800, color: '#f8fafc', mb: 1 }}>
              {product.title}
            </Typography>

            <Typography variant="subtitle1" sx={{ color: '#0d9488', fontWeight: 700, mb: 2 }}>
              Brand: {product.brand}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Rating value={product.rating || 4.8} precision={0.1} readOnly sx={{ color: '#f59e0b' }} />
              <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                {product.rating} ({product.reviews_count} customer reviews)
              </Typography>
            </Box>

            <Typography variant="h4" sx={{ fontWeight: 900, color: '#2dd4bf', mb: 3 }}>
              ₹{product.price.toLocaleString('en-IN')}
            </Typography>

            <Typography variant="body1" sx={{ color: '#cbd5e1', lineHeight: 1.7, mb: 3 }}>
              {product.description}
            </Typography>

            {/* Features Bullet List */}
            {featuresList.length > 0 && featuresList[0] && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#f8fafc', mb: 1 }}>
                  Key Features & Specifications:
                </Typography>

                {featuresList.map((feat, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 0.5 }}>
                    <Check size={16} color="#10b981" />
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>{feat.trim()}</Typography>
                  </Box>
                ))}
              </Box>
            )}

            <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.08)' }} />

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => {
                  trackAction(product.id, 'cart');
                  addToCart(product, quantity);
                }}
                startIcon={<ShoppingBag size={20} />}
                sx={{
                  flexGrow: 1,
                  backgroundColor: '#0d9488',
                  '&:hover': { backgroundColor: '#0f766e' },
                  py: 1.5,
                  fontWeight: 800,
                  fontSize: '1.05rem',
                }}
              >
                Add to Cart
              </Button>

              <IconButton
                onClick={() => toggleWishlist(product)}
                sx={{
                  p: 1.5,
                  backgroundColor: 'rgba(30, 41, 59, 0.8)',
                  color: wishlisted ? '#ef4444' : '#94a3b8',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <Heart size={22} fill={wishlisted ? '#ef4444' : 'none'} />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Frequently Bought Together (FBT) Bundle */}
      {fbtProducts.length > 0 && (
        <Box sx={{ mb: 8 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Layers color="#0284c7" size={24} />
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Frequently Bought Together
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {fbtProducts.map((p) => (
              <Grid item xs={12} sm={4} key={p.id}>
                <ProductCard product={p} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Complete the Look Section */}
      {completeLook.length > 0 && (
        <Box sx={{ mb: 8 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Shirt color="#f59e0b" size={24} />
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Complete the Look (Outfit Pairing)
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {completeLook.map((p) => (
              <Grid item xs={12} sm={4} key={p.id}>
                <ProductCard product={p} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Sparkles color="#0d9488" size={24} />
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Similar Products (Content-Based AI)
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {similarProducts.map((p) => (
              <Grid item xs={12} sm={6} md={3} key={p.id}>
                <ProductCard product={p} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default ProductDetails;
