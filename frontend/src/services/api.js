const API_BASE_URL = 'http://localhost:8000/api/v1';

export const fetchHealth = async () => {
  try {
    const res = await fetch('http://localhost:8000/health');
    return await res.json();
  } catch (err) {
    console.error("Health check error:", err);
    return { status: "offline", error: err.message };
  }
};

export const fetchProducts = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE_URL}/products?${query}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
};

export const fetchCategories = async () => {
  const res = await fetch(`${API_BASE_URL}/products/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
};

export const detectIntent = async (sessionData) => {
  const res = await fetch(`${API_BASE_URL}/intent/detect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sessionData)
  });
  if (!res.ok) throw new Error('Failed to detect intent');
  return res.json();
};

export const getRecommendations = async (params) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE_URL}/recommendations?${query}`);
  if (!res.ok) throw new Error('Failed to fetch recommendations');
  return res.json();
};
