const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Fetch paginated products with filters
 * @param {Object} params
 */
export async function fetchProducts({
  category = '',
  subCategories = [],
  brands = [],
  priceMin = null,
  priceMax = null,
  page = 1,
  limit = 12,
  sort = '',
  filter = '',
  search = '',
} = {}) {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (filter) params.set('filter', filter);
  if (search) params.set('search', search);
  if (subCategories.length) params.set('subCategories', subCategories.join(','));
  if (brands.length) params.set('brands', brands.join(','));
  if (priceMin !== null) params.set('priceMin', priceMin);
  if (priceMax !== null) params.set('priceMax', priceMax);
  params.set('page', page);
  params.set('limit', limit);
  if (sort) params.set('sort', sort);

  const res = await fetch(`${BASE}/products?${params}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json(); // { products, total, page, totalPages }
}

/**
 * Fetch available categories & brands for a given URL category param
 */
export async function fetchProductMeta({ category = '', filter = '' } = {}) {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (filter) params.set('filter', filter);
  const res = await fetch(`${BASE}/products/meta?${params}`);
  if (!res.ok) throw new Error('Failed to fetch meta');
  return res.json(); // { categories, brands }
}

/**
 * Fetch single product by numeric id
 */
export async function fetchProductById(id) {
  const res = await fetch(`${BASE}/products/${id}`);
  if (!res.ok) throw new Error('Product not found');
  return res.json();
}

/**
 * Create a product (admin)
 */
export async function createProduct(data) {
  const res = await fetch(`${BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create product');
  return res.json();
}

/**
 * Update a product (admin)
 */
export async function updateProduct(id, data) {
  const res = await fetch(`${BASE}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update product');
  return res.json();
}

/**
 * Delete a product (admin)
 */
export async function deleteProduct(id) {
  const res = await fetch(`${BASE}/products/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete product');
  return res.json();
}
/**
 * Toggle product active status (admin)
 */
export async function toggleProductStatus(id) {
  const res = await fetch(`${BASE}/products/${id}/status`, {
    method: 'PATCH',
  });
  if (!res.ok) throw new Error('Failed to toggle product status');
  return res.json();
}

/**
 * Fetch top-selling products (aggregated from orders)
 * Returns up to 10 products sorted by total quantity sold
 */
export async function fetchTopSellingProducts() {
  const res = await fetch(`${BASE}/products/top-selling`);
  if (!res.ok) throw new Error('Failed to fetch top-selling products');
  return res.json(); // { products, total, page, totalPages }
}
