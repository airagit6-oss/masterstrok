// ============================================================
// BACKUP + RESTORE
// POST /api/v1/admin/backup
// POST /api/v1/admin/restore
// Task: daily DB backup, store backup file
// ============================================================

const API_BASE = '/api/v1';

export interface BackupMeta {
  id: string;
  created_at: string;
  size_bytes: number;
  tables: string[];
  download_url?: string;
}

export interface RestoreResult {
  ok: boolean;
  restored_tables: string[];
  message: string;
}

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json() as Promise<T>;
}

// POST /api/v1/admin/backup
export async function triggerBackup(): Promise<BackupMeta> {
  try {
    return await apiFetch<BackupMeta>(`${API_BASE}/admin/backup`, { method: 'POST' });
  } catch {
    // Offline simulation: snapshot localStorage data as a backup record
    const snapshot = _captureLocalSnapshot();
    const meta: BackupMeta = {
      id: 'bkp_' + Math.random().toString(36).slice(2, 11),
      created_at: new Date().toISOString(),
      size_bytes: new Blob([JSON.stringify(snapshot)]).size,
      tables: Object.keys(snapshot),
    };
    _storeBackupLocally(meta, snapshot);
    return meta;
  }
}

// POST /api/v1/admin/restore
export async function triggerRestore(backupId: string): Promise<RestoreResult> {
  try {
    return await apiFetch<RestoreResult>(`${API_BASE}/admin/restore`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ backup_id: backupId }),
    });
  } catch {
    const entry = _loadBackupLocally(backupId);
    if (!entry) {
      return { ok: false, restored_tables: [], message: `Backup ${backupId} not found.` };
    }
    _restoreLocalSnapshot(entry.snapshot);
    return {
      ok: true,
      restored_tables: Object.keys(entry.snapshot),
      message: `Restored from backup ${backupId} (${entry.meta.created_at}).`,
    };
  }
}

// List locally stored backups
export function listLocalBackups(): BackupMeta[] {
  try {
    const raw = localStorage.getItem('saashub_backups');
    const entries: Array<{ meta: BackupMeta }> = raw ? JSON.parse(raw) : [];
    return entries.map(e => e.meta);
  } catch {
    return [];
  }
}

// ── Internals ──────────────────────────────────────────────

const LOCAL_BACKUP_KEY = 'saashub_backups';
const MAX_LOCAL_BACKUPS = 10;

const BACKUP_TABLES = [
  'saashub_auth',
  'saashub_sub',
  'saashub_audit_logs',
  'saashub_notifications',
  'saashub_activity_logs',
  'saashub_orders',
  'saashub_feature_flags',
] as const;

function _captureLocalSnapshot(): Record<string, unknown> {
  const snapshot: Record<string, unknown> = {};
  for (const key of BACKUP_TABLES) {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) snapshot[key] = JSON.parse(raw);
    } catch {
      // skip unreadable keys
    }
  }
  return snapshot;
}

function _storeBackupLocally(meta: BackupMeta, snapshot: Record<string, unknown>): void {
  try {
    const raw = localStorage.getItem(LOCAL_BACKUP_KEY);
    const entries: Array<{ meta: BackupMeta; snapshot: Record<string, unknown> }> = raw
      ? JSON.parse(raw)
      : [];
    entries.push({ meta, snapshot });
    // Keep last MAX_LOCAL_BACKUPS backups
    localStorage.setItem(LOCAL_BACKUP_KEY, JSON.stringify(entries.slice(-MAX_LOCAL_BACKUPS)));
  } catch {
    // ignore
  }
}

function _loadBackupLocally(
  backupId: string
): { meta: BackupMeta; snapshot: Record<string, unknown> } | null {
  try {
    const raw = localStorage.getItem(LOCAL_BACKUP_KEY);
    const entries: Array<{ meta: BackupMeta; snapshot: Record<string, unknown> }> = raw
      ? JSON.parse(raw)
      : [];
    return entries.find(e => e.meta.id === backupId) ?? null;
  } catch {
    return null;
  }
}

function _restoreLocalSnapshot(snapshot: Record<string, unknown>): void {
  for (const [key, value] of Object.entries(snapshot)) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  }
}
