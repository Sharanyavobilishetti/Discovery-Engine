import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  Chip,
  Button,
} from '@mui/material';
import { Filter, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productsAPI } from '../services/api';

const ProductListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category_id') ? parseInt(searchParams.get('category_id')) : '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState('popular');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsAPI.getCategories().then((res) => setCategories(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {
          page,
          size: 12,
          category_id: selectedCategory || undefined,
          min_price: priceRange[0],
          max_price: priceRange[1],
          sort_by: sortBy,
        };
        const res = await productsAPI.getProducts(params);
        setProducts(res.data.items);
        setTotalPages(res.data.pages);
      } catch (err) {
        console.error('Error fetching catalog products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, selectedCategory, priceRange, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('');
    setPriceRange([0, 10000]);
    setSortBy('popular');
    setPage(1);
    setSearchParams({});
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
          Product Catalog & Discovery
        </Typography>

        <Typography variant="body1" sx={{ color: '#94a3b8' }}>
          Explore our complete collection with real-time multi-attribute filters and sorting.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Filter Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper className="glass-card" sx={{ p: 3, backgroundColor: '#111c2d', borderRadius: 4, position: 'sticky', top: 90 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Filter size={20} color="#0d9488" />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Filters
                </Typography>
              </Box>

              <Button size="small" onClick={handleResetFilters} startIcon={<RotateCcw size={14} />} sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                Reset
              </Button>
            </Box>

            {/* Category Filter */}
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#f8fafc' }}>
              Category
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
              <Chip
                label="All Categories"
                clickable
                onClick={() => { setSelectedCategory(''); setPage(1); }}
                sx={{
                  justifyContent: 'flex-start',
                  bgcolor: selectedCategory === '' ? '#0d9488' : 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  fontWeight: 600,
                }}
              />
              {categories.map((cat) => (
                <Chip
                  key={cat.id}
                  label={cat.name}
                  clickable
                  onClick={() => { setSelectedCategory(cat.id); setPage(1); }}
                  sx={{
                    justifyContent: 'flex-start',
                    bgcolor: selectedCategory === cat.id ? '#0d9488' : 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    fontWeight: 600,
                  }}
                />
              ))}
            </Box>

            {/* Price Range Filter */}
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#f8fafc' }}>
              Price Range (₹)
            </Typography>

            <Box sx={{ px: 1, mb: 3 }}>
              <Slider
                value={priceRange}
                onChange={(e, val) => setPriceRange(val)}
                valueLabelDisplay="auto"
                min={0}
                max={10000}
                step={500}
                sx={{ color: '#0d9488' }}
              />
              <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                ₹{priceRange[0].toLocaleString('en-IN')} - ₹{priceRange[1].toLocaleString('en-IN')}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Product Grid Area */}
        <Grid item xs={12} md={9}>
          {/* Top Sort Controls */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600 }}>
              Showing products ({products.length})
            </Typography>

            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel sx={{ color: '#94a3b8' }}>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
                sx={{
                  color: '#fff',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' },
                }}
              >
                <MenuItem value="popular">Popularity & Rating</MenuItem>
                <MenuItem value="price_asc">Price: Low to High</MenuItem>
                <MenuItem value="price_desc">Price: High to Low</MenuItem>
                <MenuItem value="rating">Highest Rated</MenuItem>
                <MenuItem value="new">New Arrivals</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Product Grid */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <CircularProgress sx={{ color: '#0d9488' }} />
            </Box>
          ) : (
            <>
              <Grid container spacing={3}>
                {products.map((product) => (
                  <Grid item xs={12} sm={6} md={4} key={product.id}>
                    <ProductCard product={product} />
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(e, val) => setPage(val)}
                    color="primary"
                    size="large"
                    sx={{
                      '& .MuiPaginationItem-root': { color: '#94a3b8' },
                      '& .Mui-selected': { backgroundColor: '#0d9488', color: '#fff' },
                    }}
                  />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductListing;
