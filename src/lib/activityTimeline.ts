// ============================================================
// ACTIVITY TIMELINE
// Show history of user/lead actions
// ============================================================

const API_BASE = '/api/v1';

export interface ActivityLog {
  id: string;
  reseller_id?: string;
  user_id?: string;
  activity: string;
  timestamp: string;
}

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json() as Promise<T>;
}

const STORAGE_KEY = 'saashub_activity_logs';
const MAX_LOCAL_ACTIVITY_LOGS = 1000;

function uid(): string {
  return 'act_' + Math.random().toString(36).slice(2, 11);
}

function loadLocal(resellerId?: string, userId?: string): ActivityLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let all: ActivityLog[] = raw ? JSON.parse(raw) : [];
    if (resellerId) all = all.filter(a => a.reseller_id === resellerId);
    if (userId) all = all.filter(a => a.user_id === userId);
    return all.sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1));
  } catch {
    return [];
  }
}

function saveLocal(log: ActivityLog): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all: ActivityLog[] = raw ? JSON.parse(raw) : [];
    all.push(log);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all.slice(-MAX_LOCAL_ACTIVITY_LOGS)));
  } catch {
    // ignore
  }
}

// GET /api/v1/reseller/activity
export async function fetchActivityLogs(
  resellerId?: string,
  userId?: string
): Promise<ActivityLog[]> {
  try {
    const params = new URLSearchParams();
    if (resellerId) params.set('reseller_id', resellerId);
    if (userId) params.set('user_id', userId);
    const query = params.toString() ? `?${params.toString()}` : '';
    return await apiFetch<ActivityLog[]>(`${API_BASE}/reseller/activity${query}`);
  } catch {
    return loadLocal(resellerId, userId);
  }
}

// POST /api/v1/reseller/activity
export async function logActivity(
  entry: Omit<ActivityLog, 'id' | 'timestamp'>
): Promise<ActivityLog> {
  const log: ActivityLog = {
    ...entry,
    id: uid(),
    timestamp: new Date().toISOString(),
  };
  try {
    return await apiFetch<ActivityLog>(`${API_BASE}/reseller/activity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(log),
    });
  } catch {
    saveLocal(log);
    return log;
  }
}

// Convenience helpers
export const activity = {
  leadCreated: (resellerId: string, userId: string, leadName: string) =>
    logActivity({ reseller_id: resellerId, user_id: userId, activity: `Created lead: ${leadName}` }),

  leadStatusChanged: (resellerId: string, userId: string, leadName: string, status: string) =>
    logActivity({ reseller_id: resellerId, user_id: userId, activity: `Lead "${leadName}" moved to ${status}` }),

  userSubscribed: (resellerId: string, userId: string, product: string) =>
    logActivity({ reseller_id: resellerId, user_id: userId, activity: `Subscribed user to ${product}` }),

  paymentReceived: (resellerId: string, userId: string, amount: number) =>
    logActivity({ reseller_id: resellerId, user_id: userId, activity: `Payment received: $${amount}` }),
};
