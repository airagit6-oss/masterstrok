// ============================================================
// FILE STORAGE
// POST /api/v1/reseller/upload
// Store: local or S3-compatible
// ============================================================

const API_BASE = '/api/v1';

export type FileType = 'image' | 'document' | 'video' | 'other';

export interface StoredFile {
  id: string;
  reseller_id?: string;
  url: string;
  type: FileType;
  name: string;
  size_bytes: number;
  created_at: string;
}

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json() as Promise<T>;
}

const STORAGE_KEY = 'saashub_files';

function uid(): string {
  return 'file_' + Math.random().toString(36).slice(2, 11);
}

function detectFileType(mimeType: string): FileType {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (
    mimeType === 'application/pdf' ||
    mimeType.includes('document') ||
    mimeType.startsWith('text/')
  )
    return 'document';
  return 'other';
}

function loadLocalFiles(resellerId?: string): StoredFile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all: StoredFile[] = raw ? JSON.parse(raw) : [];
    return resellerId ? all.filter(f => f.reseller_id === resellerId) : all;
  } catch {
    return [];
  }
}

function saveLocalFile(file: StoredFile): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all: StoredFile[] = raw ? JSON.parse(raw) : [];
    all.push(file);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
}

// POST /api/v1/reseller/upload
export async function uploadFile(
  file: File,
  resellerId?: string
): Promise<StoredFile> {
  const formData = new FormData();
  formData.append('file', file);
  if (resellerId) formData.append('reseller_id', resellerId);

  try {
    return await apiFetch<StoredFile>(`${API_BASE}/reseller/upload`, {
      method: 'POST',
      body: formData,
    });
  } catch {
    // Offline fallback: encode as data URL for local preview
    const dataUrl = await _readAsDataUrl(file);
    const stored: StoredFile = {
      id: uid(),
      reseller_id: resellerId,
      url: dataUrl,
      type: detectFileType(file.type),
      name: file.name,
      size_bytes: file.size,
      created_at: new Date().toISOString(),
    };
    saveLocalFile(stored);
    return stored;
  }
}

// GET /api/v1/reseller/files
export async function fetchFiles(resellerId?: string): Promise<StoredFile[]> {
  try {
    const query = resellerId ? `?reseller_id=${encodeURIComponent(resellerId)}` : '';
    return await apiFetch<StoredFile[]>(`${API_BASE}/reseller/files${query}`);
  } catch {
    return loadLocalFiles(resellerId);
  }
}

// DELETE /api/v1/reseller/files/:id
export async function deleteFile(id: string): Promise<void> {
  try {
    await apiFetch<void>(`${API_BASE}/reseller/files/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  } catch {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const all: StoredFile[] = raw ? JSON.parse(raw) : [];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all.filter(f => f.id !== id)));
    } catch {
      // ignore
    }
  }
}

function _readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
