// Central backend availability flag. With no real backend wired, all /api/v1
// calls would 404 and pollute the network panel. When BACKEND_ENABLED is false
// every apiFetch short-circuits to the local fallback path used by each module.
export const BACKEND_ENABLED = false;

export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  if (!BACKEND_ENABLED) {
    throw new Error('backend_disabled');
  }
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json() as Promise<T>;
}
