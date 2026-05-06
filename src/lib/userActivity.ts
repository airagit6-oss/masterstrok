// Lightweight client-side store for favorites + recently viewed products.
// Backed by localStorage; emits a window event so all subscribers re-read.

const FAV_KEY = 'saashub_favorites';
const RECENT_KEY = 'saashub_recent';
const EVENT = 'saashub:user-activity';
const RECENT_LIMIT = 24;

function read(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function write(key: string, list: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent(EVENT, { detail: { key } }));
  } catch {
    // storage full / unavailable — fail silently
  }
}

export const favorites = {
  list: () => read(FAV_KEY),
  has: (id: string) => read(FAV_KEY).includes(id),
  toggle: (id: string) => {
    const current = read(FAV_KEY);
    const next = current.includes(id) ? current.filter(x => x !== id) : [id, ...current];
    write(FAV_KEY, next);
    return next.includes(id);
  },
  remove: (id: string) => {
    write(FAV_KEY, read(FAV_KEY).filter(x => x !== id));
  },
  clear: () => write(FAV_KEY, []),
};

export const recent = {
  list: () => read(RECENT_KEY),
  push: (id: string) => {
    const current = read(RECENT_KEY).filter(x => x !== id);
    write(RECENT_KEY, [id, ...current].slice(0, RECENT_LIMIT));
  },
  clear: () => write(RECENT_KEY, []),
};

export function subscribeUserActivity(cb: () => void) {
  const handler = () => cb();
  window.addEventListener(EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}
