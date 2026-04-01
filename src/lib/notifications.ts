// ============================================================
// NOTIFICATION SYSTEM
// GET /api/v1/reseller/notifications
// Triggers: subscription expiry, new lead, payment fail
// ============================================================

const API_BASE = '/api/v1';

export type NotificationType = 'subscription_expiry' | 'new_lead' | 'payment_fail' | 'info';
export type NotificationStatus = 'unread' | 'read';

export interface Notification {
  id: string;
  reseller_id?: string;
  type: NotificationType;
  message: string;
  status: NotificationStatus;
  created_at: string;
}

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json() as Promise<T>;
}

const STORAGE_KEY = 'saashub_notifications';
const MAX_LOCAL_NOTIFICATIONS = 200;

function uid(): string {
  return 'notif_' + Math.random().toString(36).slice(2, 11);
}

function loadLocal(resellerId?: string): Notification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all: Notification[] = raw ? JSON.parse(raw) : [];
    return resellerId ? all.filter(n => n.reseller_id === resellerId) : all;
  } catch {
    return [];
  }
}

function saveLocal(notifications: Notification[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications.slice(-MAX_LOCAL_NOTIFICATIONS)));
  } catch {
    // ignore storage errors
  }
}

// GET /api/v1/reseller/notifications
export async function fetchNotifications(resellerId?: string): Promise<Notification[]> {
  try {
    const query = resellerId ? `?reseller_id=${encodeURIComponent(resellerId)}` : '';
    return await apiFetch<Notification[]>(`${API_BASE}/reseller/notifications${query}`);
  } catch {
    return loadLocal(resellerId);
  }
}

// Create a new notification (used by trigger helpers)
export async function createNotification(
  entry: Omit<Notification, 'id' | 'created_at' | 'status'>
): Promise<Notification> {
  const notif: Notification = {
    ...entry,
    id: uid(),
    status: 'unread',
    created_at: new Date().toISOString(),
  };
  try {
    return await apiFetch<Notification>(`${API_BASE}/reseller/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notif),
    });
  } catch {
    const all: Notification[] = (() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    })();
    all.push(notif);
    saveLocal(all);
    return notif;
  }
}

// Mark a notification as read
export async function markNotificationRead(id: string): Promise<void> {
  try {
    await apiFetch<void>(`${API_BASE}/reseller/notifications/${encodeURIComponent(id)}/read`, {
      method: 'PATCH',
    });
  } catch {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const all: Notification[] = raw ? JSON.parse(raw) : [];
      const idx = all.findIndex(n => n.id === id);
      if (idx >= 0) all[idx].status = 'read';
      saveLocal(all);
    } catch {
      // ignore
    }
  }
}

// Trigger helpers
export const notify = {
  subscriptionExpiry: (resellerId: string, userId: string, productName: string) =>
    createNotification({
      reseller_id: resellerId,
      type: 'subscription_expiry',
      message: `Subscription for ${productName} (user ${userId}) is expiring soon.`,
    }),

  newLead: (resellerId: string, leadName: string) =>
    createNotification({
      reseller_id: resellerId,
      type: 'new_lead',
      message: `New lead received: ${leadName}.`,
    }),

  paymentFail: (resellerId: string, userId: string, orderId: string) =>
    createNotification({
      reseller_id: resellerId,
      type: 'payment_fail',
      message: `Payment failed for order ${orderId} (user ${userId}).`,
    }),
};
