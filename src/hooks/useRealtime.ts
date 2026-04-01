import { useEffect, useState } from 'react';
import { realtime, type RealtimeEvent, type RealtimeEventType } from '@/lib/realtime';

/**
 * Connects to the realtime WebSocket and returns the latest event
 * of the given type. Automatically subscribes/unsubscribes.
 */
export function useRealtimeEvent<T>(type: RealtimeEventType) {
  const [latest, setLatest] = useState<RealtimeEvent<T> | null>(null);

  useEffect(() => {
    realtime.connect();
    const unsub = realtime.on<T>(type, setLatest);
    return unsub;
  }, [type]);

  return latest;
}

/**
 * Returns the current connection state of the realtime service.
 */
export function useRealtimeStatus() {
  const [connected, setConnected] = useState(realtime.isConnected);

  useEffect(() => {
    const iv = setInterval(() => {
      setConnected(realtime.isConnected);
    }, 2000);
    return () => clearInterval(iv);
  }, []);

  return connected;
}
