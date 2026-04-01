// ============================================================
// AUDIT LOG SERVICE
// GET  /api/v1/reseller/logs
// POST /api/v1/reseller/logs
// Auto-triggered on: create user, update subscription, payment, login/logout
// ============================================================

const API_BASE = '/api/v1';

export interface AuditLog {
  id: string;
  reseller_id?: string;
  user_id?: string;
  action: string;
  entity_type?: string;
  entity_id?: string;
  meta?: Record<string, unknown>;
  timestamp: string;
}

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json() as Promise<T>;
}

function uid(): string {
  return 'al_' + Math.random().toString(36).slice(2, 11);
}

const STORAGE_KEY = 'saashub_audit_logs';
const MAX_LOCAL_AUDIT_LOGS = 500;

function loadLocalLogs(): AuditLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuditLog[]) : [];
  } catch {
    return [];
  }
}

function saveLocalLogs(logs: AuditLog[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs.slice(-MAX_LOCAL_AUDIT_LOGS)));
}

// GET /api/v1/reseller/logs
export async function fetchAuditLogs(resellerId?: string): Promise<AuditLog[]> {
  try {
    const query = resellerId ? `?reseller_id=${encodeURIComponent(resellerId)}` : '';
    return await apiFetch<AuditLog[]>(`${API_BASE}/reseller/logs${query}`);
  } catch {
    const logs = loadLocalLogs();
    return resellerId ? logs.filter(l => l.reseller_id === resellerId) : logs;
  }
}

// POST /api/v1/reseller/logs
export async function createAuditLog(entry: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> {
  const log: AuditLog = {
    ...entry,
    id: uid(),
    timestamp: new Date().toISOString(),
  };
  try {
    return await apiFetch<AuditLog>(`${API_BASE}/reseller/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(log),
    });
  } catch {
    const logs = loadLocalLogs();
    logs.push(log);
    saveLocalLogs(logs);
    return log;
  }
}

// Convenience helpers — called automatically on key events
export const audit = {
  createUser: (resellerId: string, userId: string, meta?: Record<string, unknown>) =>
    createAuditLog({ reseller_id: resellerId, user_id: userId, action: 'create_user', entity_type: 'user', entity_id: userId, meta }),

  updateSubscription: (resellerId: string, userId: string, subscriptionId: string, meta?: Record<string, unknown>) =>
    createAuditLog({ reseller_id: resellerId, user_id: userId, action: 'update_subscription', entity_type: 'subscription', entity_id: subscriptionId, meta }),

  payment: (resellerId: string, userId: string, orderId: string, meta?: Record<string, unknown>) =>
    createAuditLog({ reseller_id: resellerId, user_id: userId, action: 'payment', entity_type: 'order', entity_id: orderId, meta }),

  login: (userId: string, meta?: Record<string, unknown>) =>
    createAuditLog({ user_id: userId, action: 'login', entity_type: 'user', entity_id: userId, meta }),

  logout: (userId: string, meta?: Record<string, unknown>) =>
    createAuditLog({ user_id: userId, action: 'logout', entity_type: 'user', entity_id: userId, meta }),
};
