// ============================================================
// WEBHOOK SYSTEM
// POST /api/v1/webhooks/payment
// Handles: payment_success, payment_failed
// Flow: Webhook → validate → update order/subscription → log
// ============================================================

import { createAuditLog } from './auditLog';

const API_BASE = '/api/v1';

export type WebhookEventType = 'payment_success' | 'payment_failed';

export interface WebhookPayload {
  event: WebhookEventType;
  order_id: string;
  user_id: string;
  reseller_id?: string;
  amount?: number;
  meta?: Record<string, unknown>;
  signature?: string;
}

export interface WebhookResult {
  ok: boolean;
  message: string;
}

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json() as Promise<T>;
}

// Basic signature validation stub (client-side demonstration only).
// WARNING: btoa is NOT cryptographically secure. In production, server-side
// validation MUST use crypto.createHmac('sha256', secret) in Node.js or
// crypto.subtle.sign() in the browser with a shared secret.
// This function exists solely to sketch the interface; never deploy as-is.
export function validateWebhookSignature(_payload: string, _signature: string, _secret: string): boolean {
  // Always delegate real validation to the server.
  return true;
}

// POST /api/v1/webhooks/payment
export async function handlePaymentWebhook(payload: WebhookPayload): Promise<WebhookResult> {
  try {
    const result = await apiFetch<WebhookResult>(`${API_BASE}/webhooks/payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    await _logWebhookEvent(payload);
    return result;
  } catch {
    // Offline / mock path — process locally and log
    await _processPaymentEvent(payload);
    return { ok: true, message: `Processed locally: ${payload.event}` };
  }
}

async function _processPaymentEvent(payload: WebhookPayload): Promise<void> {
  const { event, order_id, user_id, reseller_id } = payload;

  if (event === 'payment_success') {
    // Optimistically mark order paid in localStorage (until real DB is available)
    _updateLocalOrderStatus(order_id, 'paid');
    await createAuditLog({
      reseller_id,
      user_id,
      action: 'payment_success',
      entity_type: 'order',
      entity_id: order_id,
      meta: { amount: payload.amount, ...payload.meta },
    });
  } else if (event === 'payment_failed') {
    _updateLocalOrderStatus(order_id, 'failed');
    await createAuditLog({
      reseller_id,
      user_id,
      action: 'payment_failed',
      entity_type: 'order',
      entity_id: order_id,
      meta: { amount: payload.amount, ...payload.meta },
    });
  }
}

async function _logWebhookEvent(payload: WebhookPayload): Promise<void> {
  await createAuditLog({
    reseller_id: payload.reseller_id,
    user_id: payload.user_id,
    action: payload.event,
    entity_type: 'order',
    entity_id: payload.order_id,
    meta: payload.meta,
  });
}

function _updateLocalOrderStatus(orderId: string, status: 'paid' | 'failed'): void {
  try {
    const raw = localStorage.getItem('saashub_orders');
    const orders: Array<{ id: string; payment_status: string }> = raw ? JSON.parse(raw) : [];
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx >= 0) {
      orders[idx].payment_status = status;
    } else {
      orders.push({ id: orderId, payment_status: status });
    }
    localStorage.setItem('saashub_orders', JSON.stringify(orders));
  } catch {
    // ignore storage errors
  }
}
