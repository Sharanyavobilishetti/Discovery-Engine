import axios from 'axios';

const API_BASE_URL = '/api';

export const getSessionId = () => {
  let sessionId = localStorage.getItem('findora_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('findora_session_id', sessionId);
  }
  return sessionId;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('findora_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fallback Product Dataset for Public Standalone Web Deployments
const MOCK_PRODUCTS = [
  {
    id: 1,
    title: 'AeroGlide Stealth Nitro Running Shoes',
    description: 'Ultra-lightweight mesh running shoes with responsive foam cushioning and carbon fiber energy plate. Perfect for marathon running and daily training.',
    price: 2899.0,
    category_id: 1,
    category_name: 'Footwear & Sneakers',
    brand: 'AeroGlide',
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviews_count: 340,
    is_trending: true,
    is_new_arrival: false,
    tags: 'running,shoes,black,stealth,breathable,cushioning,lightweight,comfort',
    features: 'Nitrogen-infused midsole|Engineered mesh upper|Reflective night safety strip|Weight: 220g',
    color: 'Black',
    gender: 'Unisex',
    stock: 50,
    match_score: 0.94,
    explanation: '94% AI Match based on your intent for running gear'
  },
  {
    id: 2,
    title: 'UrbanPulse Court Low-Top White Sneakers',
    description: 'Classic white leather low-top sneakers designed for everyday street style and effortless casual pairing.',
    price: 2499.0,
    category_id: 1,
    category_name: 'Footwear & Sneakers',
    brand: 'UrbanPulse',
    image_url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviews_count: 210,
    is_trending: true,
    is_new_arrival: true,
    tags: 'sneakers,white,casual,leather,streetwear,minimalist,comfortable',
    features: '100% Genuine full-grain leather|Rubber cupsole|Anti-bacterial insoles',
    color: 'White',
    gender: 'Unisex',
    stock: 45,
    match_score: 0.89,
    explanation: '89% AI Match based on street style browsing'
  },
  {
    id: 6,
    title: 'DryPro Performance Compression Running T-Shirt',
    description: 'Moisture-wicking athletic compression top with ventilation zones. Keeps you cool, dry, and focused during gym sessions.',
    price: 999.0,
    category_id: 2,
    category_name: 'Activewear & Sportswear',
    brand: 'DryPro',
    image_url: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=80',
    rating: 4.5,
    reviews_count: 420,
    is_trending: true,
    is_new_arrival: false,
    tags: 'tshirt,activewear,running,gym,black,dryfit,compression,breathable',
    features: 'Quick-dry fabric|Anti-odor treatment|Flatlock anti-chafing seams',
    color: 'Charcoal Black',
    gender: 'Men',
    stock: 60,
    match_score: 0.91,
    explanation: 'Complete outfit pairing for active running'
  },
  {
    id: 7,
    title: 'FlexZone High-Waisted Seamless Yoga Leggings',
    description: 'Squat-proof 4-way stretch activewear leggings with side phone pockets. Designed for maximum flexibility during yoga and fitness.',
    price: 1499.0,
    category_id: 2,
    category_name: 'Activewear & Sportswear',
    brand: 'FlexZone',
    image_url: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews_count: 512,
    is_trending: true,
    is_new_arrival: true,
    tags: 'leggings,yoga,activewear,teal,highwaist,stretch,gym',
    features: 'Nylon-Spandex blend|Non-see-through fabric|Deep side pockets',
    color: 'Teal',
    gender: 'Women',
    stock: 35,
    match_score: 0.96,
    explanation: '96% AI Match based on athletic intent'
  },
  {
    id: 10,
    title: 'SonicPro ANC Wireless Noise-Canceling Headphones',
    description: 'Flagship wireless over-ear headphones featuring Hybrid Active Noise Cancellation, 40mm titanium drivers, and 40 hours battery playback.',
    price: 8999.0,
    category_id: 3,
    category_name: 'Electronics & Audio',
    brand: 'SonicPro',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews_count: 680,
    is_trending: true,
    is_new_arrival: false,
    tags: 'headphones,wireless,audio,anc,black,bluetooth,music,noise-canceling',
    features: '-35dB ANC|LDAC Audio Codec|Multi-point Bluetooth 5.3',
    color: 'Matte Black',
    gender: 'Unisex',
    stock: 25,
    match_score: 0.95,
    explanation: 'Popular choice for premium audio listeners'
  },
  {
    id: 16,
    title: 'NomadCraft Waterproof Canvas Backpack 25L',
    description: 'Heavy-duty waxed canvas backpack with padded 16-inch laptop compartment and leather accent straps.',
    price: 3199.0,
    category_id: 5,
    category_name: 'Bags & Accessories',
    brand: 'NomadCraft',
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviews_count: 380,
    is_trending: true,
    is_new_arrival: false,
    tags: 'backpack,bag,canvas,laptop,travel,waterproof,olive,accessories',
    features: 'Water-resistant canvas|Shockproof laptop sleeve|Luggage strap',
    color: 'Olive Green',
    gender: 'Unisex',
    stock: 40,
    match_score: 0.90,
    explanation: 'Top accessory for travel & work'
  }
];

const MOCK_CATEGORIES = [
  { id: 1, name: 'Footwear & Sneakers', slug: 'footwear', image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80' },
  { id: 2, name: 'Activewear & Sportswear', slug: 'activewear', image_url: 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&auto=format&fit=crop&q=80' },
  { id: 3, name: 'Electronics & Audio', slug: 'electronics', image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80' },
  { id: 4, name: 'Casual Fashion & Denim', slug: 'casual-fashion', image_url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80' },
  { id: 5, name: 'Bags & Accessories', slug: 'accessories', image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80' }
];

export const authAPI = {
  login: (data) => api.post('/auth/login', data).catch(() => ({ data: { access_token: 'mock_jwt_token', token_type: 'bearer', user: { id: 1, email: data.email, full_name: 'Alex Rivera', role: 'customer' } } })),
  register: (data) => api.post('/auth/register', data).catch(() => ({ data: { access_token: 'mock_jwt_token', token_type: 'bearer', user: { id: 1, email: data.email, full_name: data.full_name, role: 'customer' } } })),
  getMe: () => api.get('/auth/me').catch(() => ({ data: { id: 1, email: 'alex@example.com', full_name: 'Alex Rivera', role: 'customer' } })),
};

export const productsAPI = {
  getProducts: (params) => api.get('/products', { params }).catch(() => {
    let filtered = [...MOCK_PRODUCTS];
    if (params?.category_id) {
      filtered = filtered.filter(p => p.category_id === params.category_id);
    }
    if (params?.min_price) {
      filtered = filtered.filter(p => p.price >= params.min_price);
    }
    if (params?.max_price) {
      filtered = filtered.filter(p => p.price <= params.max_price);
    }
    return { data: { items: filtered, total: filtered.length, page: 1, size: 12, pages: 1 } };
  }),
  getCategories: () => api.get('/products/categories').catch(() => ({ data: MOCK_CATEGORIES })),
  getProductDetails: (id) => api.get(`/products/${id}`).catch(() => {
    const p = MOCK_PRODUCTS.find(item => item.id === parseInt(id)) || MOCK_PRODUCTS[0];
    return { data: p };
  }),
};

export const recommendationsAPI = {
  getTwoTower: (limit = 8) => api.get('/recommendations/two-tower', { params: { session_id: getSessionId(), limit } }).catch(() => ({
    data: {
      algorithm: 'Two-Tower Neural Intent Matching',
      description: 'User intent vector matched with high-dimensional product features in real-time.',
      detected_session_intents: ['Endurance Running & Athletics', 'Wireless Audio'],
      products: MOCK_PRODUCTS.slice(0, limit)
    }
  })),
  getContentBased: (id, limit = 6) => api.get(`/recommendations/content-based/${id}`, { params: { limit } }).catch(() => ({ data: MOCK_PRODUCTS.slice(0, limit) })),
  getFBT: (id, limit = 3) => api.get(`/recommendations/frequently-bought-together/${id}`, { params: { limit } }).catch(() => ({ data: MOCK_PRODUCTS.slice(1, 1 + limit) })),
  getCompleteLook: (id, limit = 3) => api.get(`/recommendations/complete-the-look/${id}`, { params: { limit } }).catch(() => ({ data: [MOCK_PRODUCTS[2], MOCK_PRODUCTS[4], MOCK_PRODUCTS[5]].slice(0, limit) })),
  getColdStart: (limit = 8) => api.get('/recommendations/cold-start', { params: { limit } }).catch(() => ({ data: MOCK_PRODUCTS.slice(0, limit) })),
  getTrending: (limit = 8) => api.get('/recommendations/trending', { params: { limit } }).catch(() => ({ data: MOCK_PRODUCTS.slice(0, limit) })),
};

export const searchAPI = {
  semanticSearch: (query) => api.post('/search/semantic', { query, session_id: getSessionId() }).catch(() => {
    const qLower = query.lower ? query.lower() : query.toLowerCase();
    const results = MOCK_PRODUCTS.filter(p => p.title.toLowerCase().includes(qLower) || p.tags.toLowerCase().includes(qLower) || qLower.includes('shoes') || qLower.includes('running'));
    return {
      data: {
        query,
        detected_intent: 'Budget <= ₹3000 ; Colors: black ; Intents: Footwear',
        extracted_budget: 3000.0,
        extracted_tags: ['black', 'Footwear'],
        total_found: results.length || MOCK_PRODUCTS.length,
        latency_ms: 18.4,
        results: results.length > 0 ? results : MOCK_PRODUCTS
      }
    };
  }),
  assistantChat: (message) => api.post('/search/assistant', { message, session_id: getSessionId() }).catch(() => ({
    data: {
      reply: `For your request '${message}', I recommend items with breathable mesh and responsive cushioning foam. Here are top choices from Findora:`,
      intent_summary: 'Detected Intent: Athletic Gear & Comfort Discovery',
      suggested_products: MOCK_PRODUCTS.slice(0, 3),
      suggested_queries: ['Black running shoes under ₹3000', 'Wireless headphones for gym', 'Waterproof canvas backpack']
    }
  })),
  getSuggestions: (q) => api.get('/search/suggestions', { params: { q } }).catch(() => ({
    data: {
      query: q,
      suggestions: [
        'comfortable black running shoes under ₹3000',
        'wireless noise-canceling headphones',
        'waterproof canvas backpack 25L'
      ]
    }
  })),
};

export const usersAPI = {
  trackBehavior: (productId, action) => api.post('/users/track', { product_id: productId, action, session_id: getSessionId() }).catch(() => ({ data: { status: 'success' } })),
  getBrowsingHistory: () => api.get('/users/browsing-history', { params: { session_id: getSessionId() } }).catch(() => ({ data: MOCK_PRODUCTS.slice(0, 3) })),
};

export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist').catch(() => ({ data: [MOCK_PRODUCTS[0], MOCK_PRODUCTS[4]] })),
  addToWishlist: (productId) => api.post(`/wishlist/${productId}`).catch(() => ({ data: { message: 'Added' } })),
  removeFromWishlist: (productId) => api.delete(`/wishlist/${productId}`).catch(() => ({ data: { message: 'Removed' } })),
};

export const ordersAPI = {
  createOrder: (items, shippingAddress) => api.post('/orders', { items, shipping_address: shippingAddress }).catch(() => ({
    data: {
      id: Math.floor(Math.random() * 9000) + 1000,
      total_amount: 5398.0,
      status: 'completed',
      shipping_address: shippingAddress,
      created_at: new Date().toISOString(),
      items: items.map(i => ({ product_id: i.product_id, price: 2499.0, quantity: i.quantity, title: 'Item', image_url: MOCK_PRODUCTS[0].image_url }))
    }
  })),
  getOrders: () => api.get('/orders').catch(() => ({
    data: [
      {
        id: 1042,
        total_amount: 5398.0,
        status: 'completed',
        shipping_address: '123 Tech Park, Bangalore',
        created_at: new Date().toISOString(),
        items: [{ product_id: 1, price: 2899.0, quantity: 1, title: MOCK_PRODUCTS[0].title, image_url: MOCK_PRODUCTS[0].image_url }]
      }
    ]
  })),
};

export const dashboardAPI = {
  getAdminStats: () => api.get('/dashboard/stats').catch(() => ({
    data: {
      total_users: 142,
      total_products: 50,
      total_orders: 89,
      total_revenue: 248900.0,
      recommendation_ctr: 68.4,
      top_search_queries: [
        { query: 'comfortable black running shoes under ₹3000', count: 42 },
        { query: 'wireless noise-canceling headphones', count: 31 },
        { query: 'high-waisted yoga leggings', count: 28 },
        { query: 'waterproof canvas backpack', count: 19 },
        { query: 'casual white sneakers', count: 15 }
      ],
      sales_over_time: [
        { month: 'Jan', sales: 14200 },
        { month: 'Feb', sales: 19800 },
        { month: 'Mar', sales: 26500 },
        { month: 'Apr', sales: 34100 },
        { month: 'May', sales: 42800 },
        { month: 'Jun', sales: 58900 }
      ],
      category_distribution: [
        { category: 'Footwear & Sneakers', count: 15 },
        { category: 'Activewear & Sportswear', count: 12 },
        { category: 'Electronics & Audio', count: 10 },
        { category: 'Casual Fashion & Denim', count: 8 },
        { category: 'Bags & Accessories', count: 5 }
      ],
      active_intents: [
        { intent: 'Endurance Running & Athletics', percentage: 34 },
        { intent: 'Premium Audio & Gadgets', percentage: 28 },
        { intent: 'Minimalist Casual Fashion', percentage: 22 },
        { intent: 'Travel & Outdoor Accessories', percentage: 16 }
      ]
    }
  })),
};

export default api;
