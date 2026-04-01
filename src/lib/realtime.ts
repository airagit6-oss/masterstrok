/**
 * Real-time WebSocket service for live admin events.
 * Connects to the backend /ws endpoint when available.
 * Falls back gracefully when the server is not reachable.
 */

export type RealtimeEventType =
  | 'login_event'
  | 'app_launch_event'
  | 'payment_event'
  | 'error_event'
  | 'metrics_update'
  | 'log_entry';

export interface RealtimeEvent<T = unknown> {
  type: RealtimeEventType;
  payload: T;
  timestamp: string;
}

type EventHandler<T = unknown> = (event: RealtimeEvent<T>) => void;

class RealtimeService {
  private ws: WebSocket | null = null;
  private handlers = new Map<RealtimeEventType, Set<EventHandler>>();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectDelay = 3000;
  private maxReconnectDelay = 30000;
  private shouldConnect = false;
  private url: string;

  constructor(url = '/ws') {
    this.url = url;
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;
    this.shouldConnect = true;

    // Build absolute WS URL from the current origin
    const wsUrl = this.url.startsWith('ws')
      ? this.url
      : `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}${this.url}`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.reconnectDelay = 3000;
      };

      this.ws.onmessage = (ev) => {
        try {
          const event = JSON.parse(ev.data) as RealtimeEvent;
          this.dispatch(event);
        } catch {
          // ignore malformed messages
        }
      };

      this.ws.onclose = () => {
        this.ws = null;
        if (this.shouldConnect) {
          this.scheduleReconnect();
        }
      };

      this.ws.onerror = () => {
        // onerror is always followed by onclose, reconnect handled there
        this.ws?.close();
      };
    } catch {
      // WebSocket constructor throws if URL is invalid
      this.scheduleReconnect();
    }
  }

  disconnect() {
    this.shouldConnect = false;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    const delay = this.reconnectDelay;
    this.reconnectDelay = Math.min(this.reconnectDelay * 2, this.maxReconnectDelay);
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, delay);
  }

  on<T>(type: RealtimeEventType, handler: EventHandler<T>) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler as EventHandler);
    return () => this.off(type, handler);
  }

  off<T>(type: RealtimeEventType, handler: EventHandler<T>) {
    this.handlers.get(type)?.delete(handler as EventHandler);
  }

  private dispatch(event: RealtimeEvent) {
    this.handlers.get(event.type)?.forEach(h => h(event));
  }

  get isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// Singleton instance
export const realtime = new RealtimeService('/ws');
