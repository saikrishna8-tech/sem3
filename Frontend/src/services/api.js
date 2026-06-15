
const API_BASE = 'http://localhost:8000/api';
export const getToken = () => localStorage.getItem('auth_token');

export const mapProduct = (product, index = 0) => ({
  id: product.id,
  name: product.name,
  price: product.price,
  originalPrice: product.price,
  discount: 0,
  rating: product.rating ?? 4.5,
  reviews: Math.round((product.rating ?? 4.5) * 25),
  image: product.imageUrl,
  category: product.category,
  description: product.description,
  isTrending: (product.rating ?? 0) >= 4.8 || index < 2,
});

export async function apiRequest(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type');

  const data = contentType?.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof data === 'object' && data?.message
        ? data.message
        : `Request failed (${response.status})`;

    throw new Error(message);
  }

  return data;
}

export const authApi = {
  login: (email, password) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
    }),

  register: (name, email, password) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    }),
};

export const productApi = {
  getAll: () => apiRequest('/products'),

  create: (product) =>
    apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    }),

  update: (id, product) =>
    apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    }),

  remove: (id) =>
    apiRequest(`/products/${id}`, {
      method: 'DELETE',
    }),
};

export const searchApi = {
  search: (query) =>
    apiRequest(`/search?query=${encodeURIComponent(query)}`),
};