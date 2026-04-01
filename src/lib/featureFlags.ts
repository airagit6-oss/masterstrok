// ============================================================
// FEATURE FLAGS
// Enable/disable modules per reseller
// ============================================================

const API_BASE = '/api/v1';

export type FeatureName =
  | 'audit_logs'
  | 'notifications'
  | 'activity_timeline'
  | 'global_search'
  | 'file_storage'
  | 'backup_restore'
  | 'webhooks'
  | 'rbac';

export interface FeatureFlag {
  id: string;
  reseller_id?: string;
  feature_name: FeatureName;
  enabled: boolean;
}

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json() as Promise<T>;
}

const STORAGE_KEY = 'saashub_feature_flags';

// Default: all features enabled
const DEFAULTS: Record<FeatureName, boolean> = {
  audit_logs: true,
  notifications: true,
  activity_timeline: true,
  global_search: true,
  file_storage: true,
  backup_restore: true,
  webhooks: true,
  rbac: true,
};

function loadLocal(resellerId?: string): FeatureFlag[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all: FeatureFlag[] = raw ? JSON.parse(raw) : [];
    const scope = resellerId ? all.filter(f => f.reseller_id === resellerId) : all;
    // Fill in defaults for any missing features
    const present = new Set(scope.map(f => f.feature_name));
    for (const [name, enabled] of Object.entries(DEFAULTS) as [FeatureName, boolean][]) {
      if (!present.has(name)) {
        scope.push({ id: `ff_${name}`, reseller_id: resellerId, feature_name: name, enabled });
      }
    }
    return scope;
  } catch {
    return (Object.entries(DEFAULTS) as [FeatureName, boolean][]).map(([name, enabled]) => ({
      id: `ff_${name}`,
      reseller_id: resellerId,
      feature_name: name,
      enabled,
    }));
  }
}

function saveLocal(flags: FeatureFlag[]): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all: FeatureFlag[] = raw ? JSON.parse(raw) : [];
    for (const flag of flags) {
      const idx = all.findIndex(
        f => f.reseller_id === flag.reseller_id && f.feature_name === flag.feature_name
      );
      if (idx >= 0) all[idx] = flag;
      else all.push(flag);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
}

// GET /api/v1/reseller/feature-flags
export async function fetchFeatureFlags(resellerId?: string): Promise<FeatureFlag[]> {
  try {
    const query = resellerId ? `?reseller_id=${encodeURIComponent(resellerId)}` : '';
    return await apiFetch<FeatureFlag[]>(`${API_BASE}/reseller/feature-flags${query}`);
  } catch {
    return loadLocal(resellerId);
  }
}

// POST /api/v1/reseller/feature-flags  (set a flag value)
export async function setFeatureFlag(
  resellerId: string,
  featureName: FeatureName,
  enabled: boolean
): Promise<FeatureFlag> {
  const flag: FeatureFlag = {
    id: `ff_${featureName}_${resellerId}`,
    reseller_id: resellerId,
    feature_name: featureName,
    enabled,
  };
  try {
    return await apiFetch<FeatureFlag>(`${API_BASE}/reseller/feature-flags`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(flag),
    });
  } catch {
    saveLocal([flag]);
    return flag;
  }
}

// Check if a feature is enabled for a reseller (sync, from local cache)
export function isFeatureEnabled(featureName: FeatureName, resellerId?: string): boolean {
  try {
    const flags = loadLocal(resellerId);
    const found = flags.find(f => f.feature_name === featureName);
    return found ? found.enabled : (DEFAULTS[featureName] ?? false);
  } catch {
    return DEFAULTS[featureName] ?? false;
  }
}
