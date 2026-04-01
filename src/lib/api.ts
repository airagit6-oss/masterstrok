import { products as mockProducts, getReviews as mockGetReviews } from './marketplaceData';
import type { Product, Review } from './marketplaceData';

const API_BASE = '/api';

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json() as Promise<T>;
}

// GET /api/products/:id
export async function fetchProduct(id: string): Promise<Product> {
  try {
    return await apiFetch<Product>(`${API_BASE}/products/${encodeURIComponent(id)}`);
  } catch {
    const product = mockProducts.find(p => p.id === id);
    if (!product) throw new Error('Product not found');
    return product;
  }
}

// GET /api/products/:id/reviews
export async function fetchProductReviews(id: string): Promise<Review[]> {
  try {
    return await apiFetch<Review[]>(`${API_BASE}/products/${encodeURIComponent(id)}/reviews`);
  } catch {
    return mockGetReviews();
  }
}

// GET /api/products/:id/related
export async function fetchRelatedProducts(id: string): Promise<Product[]> {
  try {
    return await apiFetch<Product[]>(`${API_BASE}/products/${encodeURIComponent(id)}/related`);
  } catch {
    const product = mockProducts.find(p => p.id === id);
    if (!product) return [];
    return mockProducts
      .filter(p => p.categorySlug === product.categorySlug && p.id !== id)
      .slice(0, 4);
  }
}

// POST /api/cart
export async function apiAddToCart(productId: string, quantity: number): Promise<void> {
  try {
    await apiFetch<void>(`${API_BASE}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity }),
    });
  } catch {
    // Cart is managed client-side; API failure is non-blocking
  }
}

// POST /api/checkout
export async function apiCheckout(
  productId: string,
  planId: string
): Promise<{ orderId: string }> {
  return apiFetch<{ orderId: string }>(`${API_BASE}/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, planId }),
  });
}
