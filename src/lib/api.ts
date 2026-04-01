import { products as mockProducts, getReviews as mockGetReviews, sections } from './marketplaceData';
import type { Product, Review } from './marketplaceData';
import { kpiData, generateLogs, generateLog, generateUsers, generateApps } from './mockData';

// Versioned API base — all new endpoints use /api/v1
// Legacy marketplace endpoints remain on /api for backward compatibility.
const API_BASE = '/api';
export const API_V1 = '/api/v1';

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json() as Promise<T>;
}

// ── Re-export versioned production modules ────────────────────────────────────
// Consumers import from @/lib/api for a single entry-point experience.

export {
  fetchAuditLogs,
  createAuditLog,
  audit,
} from './auditLog';
export type { AuditLog } from './auditLog';

export {
  fetchRoles,
  assignRole,
  hasPermission,
  roleCheck,
  resolveRole,
} from './roles';
export type { Role, UserRole, RoleName } from './roles';

export {
  handlePaymentWebhook,
  validateWebhookSignature,
} from './webhooks';
export type { WebhookPayload, WebhookResult, WebhookEventType } from './webhooks';

export {
  fetchNotifications,
  createNotification,
  markNotificationRead,
  notify,
} from './notifications';
export type { Notification, NotificationType, NotificationStatus } from './notifications';

export {
  triggerBackup,
  triggerRestore,
  listLocalBackups,
} from './backup';
export type { BackupMeta, RestoreResult } from './backup';

export {
  fetchFeatureFlags,
  setFeatureFlag,
  isFeatureEnabled,
} from './featureFlags';
export type { FeatureFlag, FeatureName } from './featureFlags';

export {
  fetchActivityLogs,
  logActivity,
  activity,
} from './activityTimeline';
export type { ActivityLog } from './activityTimeline';

export {
  globalSearch,
} from './search';
export type { SearchResult, SearchResponse, SearchEntityType } from './search';

export {
  uploadFile,
  fetchFiles,
  deleteFile,
} from './storage';
export type { StoredFile, FileType } from './storage';

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

// ── Marketplace endpoints ──────────────────────────────────────────────────

// GET /api/products/featured
export async function fetchFeaturedProducts(): Promise<Product[]> {
  try {
    return await apiFetch<Product[]>(`${API_BASE}/products/featured`);
  } catch {
    return mockProducts.filter(p => p.status === 'featured' || p.status === 'trending').slice(0, 12);
  }
}

export interface ProductFilters {
  macro?: string;
  sub?: string;
  micro?: string;
  q?: string;
}

// GET /api/products?macro=&sub=&micro=
export async function fetchProducts(filters: ProductFilters = {}): Promise<Product[]> {
  try {
    const params = new URLSearchParams();
    if (filters.macro) params.set('macro', filters.macro);
    if (filters.sub) params.set('sub', filters.sub);
    if (filters.micro) params.set('micro', filters.micro);
    return await apiFetch<Product[]>(`${API_BASE}/products?${params.toString()}`);
  } catch {
    let results = [...mockProducts];
    if (filters.macro) {
      results = results.filter(p =>
        p.categorySlug === filters.macro ||
        p.category.toLowerCase().replace(/\s+/g, '-') === filters.macro
      );
    }
    return results;
  }
}

// GET /api/search?q=
export async function fetchSearchResults(q: string): Promise<Product[]> {
  if (!q.trim()) return mockProducts;
  try {
    const params = new URLSearchParams({ q });
    return await apiFetch<Product[]>(`${API_BASE}/search?${params.toString()}`);
  } catch {
    const lower = q.toLowerCase();
    return mockProducts.filter(p =>
      p.name.toLowerCase().includes(lower) ||
      p.category.toLowerCase().includes(lower) ||
      p.shortDescription.toLowerCase().includes(lower) ||
      p.tags.some(t => t.toLowerCase().includes(lower))
    );
  }
}

// ── User data endpoints ────────────────────────────────────────────────────

export interface UserOrder {
  id: string;
  product: string;
  plan: string;
  amount: number;
  date: string;
  status: string;
}

// GET /api/user/orders
export async function fetchUserOrders(): Promise<UserOrder[]> {
  try {
    return await apiFetch<UserOrder[]>(`${API_BASE}/user/orders`);
  } catch {
    return [
      { id: 'ORD-001', product: 'EduFlow Pro', plan: 'Yearly', amount: 290, date: '2026-03-15', status: 'Active' },
      { id: 'ORD-002', product: 'HotelNest', plan: 'Monthly', amount: 79, date: '2026-03-01', status: 'Active' },
      { id: 'ORD-003', product: 'ShopEngine', plan: 'Lifetime', amount: 499, date: '2026-01-20', status: 'Completed' },
    ];
  }
}

export interface UserApp {
  name: string;
  status: 'Running' | 'Stopped';
  activeUsers: number;
  requestsMin: number;
  errorPercent: number;
  sparkline: { t: number; v: number }[];
}

// GET /api/user/apps
export async function fetchUserApps(): Promise<UserApp[]> {
  try {
    return await apiFetch<UserApp[]>(`${API_BASE}/user/apps`);
  } catch {
    return generateApps();
  }
}

// GET /api/user/subscription
export async function fetchUserSubscription(): Promise<{ active: boolean; plan?: string; expiresAt?: string }> {
  try {
    return await apiFetch<{ active: boolean; plan?: string; expiresAt?: string }>(`${API_BASE}/user/subscription`);
  } catch {
    return { active: false };
  }
}

// ── Admin data endpoints ───────────────────────────────────────────────────

export type KpiSnapshot = ReturnType<typeof kpiData>;

// GET /api/admin/metrics
export async function fetchAdminMetrics(): Promise<KpiSnapshot> {
  try {
    return await apiFetch<KpiSnapshot>(`${API_BASE}/admin/metrics`);
  } catch {
    return kpiData();
  }
}

export type LogEntry = ReturnType<typeof generateLog>;

// GET /api/admin/logs
export async function fetchAdminLogs(limit = 80): Promise<LogEntry[]> {
  try {
    const params = new URLSearchParams({ limit: String(limit) });
    return await apiFetch<LogEntry[]>(`${API_BASE}/admin/logs?${params.toString()}`);
  } catch {
    return generateLogs(limit);
  }
}

export type UserEntry = ReturnType<typeof generateUsers>[number];

// GET /api/admin/users
export async function fetchAdminUsers(count = 30): Promise<UserEntry[]> {
  try {
    return await apiFetch<UserEntry[]>(`${API_BASE}/admin/users`);
  } catch {
    return generateUsers(count);
  }
}

// ── Marketplace sections helper ────────────────────────────────────────────
export { sections };

