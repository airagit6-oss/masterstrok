// ============================================================
// GLOBAL SEARCH
// GET /api/v1/reseller/search?q=
// Searches: users, leads, products
// Returns unified result set
// ============================================================

const API_BASE = '/api/v1';

export type SearchEntityType = 'user' | 'lead' | 'product';

export interface SearchResult {
  id: string;
  type: SearchEntityType;
  title: string;
  subtitle?: string;
  url?: string;
  meta?: Record<string, unknown>;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
  total: number;
}

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json() as Promise<T>;
}

// GET /api/v1/reseller/search?q=<query>
export async function globalSearch(query: string, resellerId?: string): Promise<SearchResponse> {
  const trimmed = query.trim();
  if (!trimmed) return { query: '', results: [], total: 0 };

  try {
    const params = new URLSearchParams({ q: trimmed });
    if (resellerId) params.set('reseller_id', resellerId);
    return await apiFetch<SearchResponse>(
      `${API_BASE}/reseller/search?${params.toString()}`
    );
  } catch {
    return _searchLocally(trimmed, resellerId);
  }
}

// ── Local (localStorage) search fallback ──────────────────

function _searchLocally(query: string, resellerId?: string): SearchResponse {
  const q = query.toLowerCase();
  const results: SearchResult[] = [
    ..._searchUsers(q, resellerId),
    ..._searchLeads(q, resellerId),
    ..._searchProducts(q),
  ];
  return { query, results, total: results.length };
}

interface LocalUser {
  id: string;
  name?: string;
  email?: string;
  reseller_id?: string;
}

interface LocalLead {
  id: string;
  name?: string;
  email?: string;
  status?: string;
  reseller_id?: string;
}

interface LocalProduct {
  id: string;
  title?: string;
  macro_category?: string;
}

function _searchUsers(q: string, resellerId?: string): SearchResult[] {
  try {
    const raw = localStorage.getItem('saashub_reseller_users');
    const users: LocalUser[] = raw ? JSON.parse(raw) : [];
    return users
      .filter(u => !resellerId || u.reseller_id === resellerId)
      .filter(u =>
        (u.name ?? '').toLowerCase().includes(q) ||
        (u.email ?? '').toLowerCase().includes(q)
      )
      .map(u => ({
        id: u.id,
        type: 'user' as SearchEntityType,
        title: u.name ?? u.id,
        subtitle: u.email,
        url: '/reseller/users',
      }));
  } catch {
    return [];
  }
}

function _searchLeads(q: string, resellerId?: string): SearchResult[] {
  try {
    const raw = localStorage.getItem('saashub_reseller_leads');
    const leads: LocalLead[] = raw ? JSON.parse(raw) : [];
    return leads
      .filter(l => !resellerId || l.reseller_id === resellerId)
      .filter(l =>
        (l.name ?? '').toLowerCase().includes(q) ||
        (l.email ?? '').toLowerCase().includes(q)
      )
      .map(l => ({
        id: l.id,
        type: 'lead' as SearchEntityType,
        title: l.name ?? l.id,
        subtitle: l.status,
        url: '/reseller/leads',
      }));
  } catch {
    return [];
  }
}

function _searchProducts(q: string): SearchResult[] {
  try {
    const raw = localStorage.getItem('saashub_products');
    const products: LocalProduct[] = raw ? JSON.parse(raw) : [];
    return products
      .filter(p =>
        (p.title ?? '').toLowerCase().includes(q) ||
        (p.macro_category ?? '').toLowerCase().includes(q)
      )
      .map(p => ({
        id: p.id,
        type: 'product' as SearchEntityType,
        title: p.title ?? p.id,
        subtitle: p.macro_category,
        url: `/product/${p.id}`,
      }));
  } catch {
    return [];
  }
}
