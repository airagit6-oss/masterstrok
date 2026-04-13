import { useState, useCallback } from 'react';

// ========== TYPES ==========

export type MediaCategory = 'thumbnail' | 'banner' | 'screenshot' | 'demo' | 'extra';

export interface GalleryMedia {
  id: string;
  productId: string;
  category: MediaCategory;
  url: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  width?: number;
  height?: number;
  title: string;
  altText: string;
  caption: string;
  orderIndex: number;
  isFeatured: boolean;
  status: 'pending' | 'approved' | 'rejected';
  videoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryProduct {
  productId: string;
  productName: string;
  media: GalleryMedia[];
}

export interface GallerySettings {
  maxImagesPerProduct: number;
  maxFileSizeMb: number;
  allowedFormats: string[];
  autoCompress: boolean;
  autoWebp: boolean;
  watermarkEnabled: boolean;
  requireApproval: boolean;
}

// ========== DEFAULTS ==========

const DEFAULT_SETTINGS: GallerySettings = {
  maxImagesPerProduct: 20,
  maxFileSizeMb: 10,
  allowedFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4'],
  autoCompress: true,
  autoWebp: true,
  watermarkEnabled: false,
  requireApproval: false,
};

const STORAGE_KEY = 'saashub_gallery';
const SETTINGS_KEY = 'saashub_gallery_settings';

function uid(): string {
  return 'gm_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ========== PERSISTENCE ==========

function loadGallery(): GalleryProduct[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveGallery(data: GalleryProduct[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadSettings(): GallerySettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch { return DEFAULT_SETTINGS; }
}

export function saveSettings(s: GallerySettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

// ========== IMAGE PROCESSING ==========

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

export function getImageDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: 0, height: 0 });
    img.src = url;
  });
}

export function compressImage(file: File, maxWidth = 1920, quality = 0.85): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width;
        let h = img.height;
        if (w > maxWidth) { h = (maxWidth / w) * h; w = maxWidth; }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/webp', quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function generateThumbnail(url: string, size = 300): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ratio = Math.min(size / img.width, size / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/webp', 0.8));
    };
    img.src = url;
  });
}

export function validateFile(file: File, settings: GallerySettings): string | null {
  if (!settings.allowedFormats.includes(file.type)) {
    return `Unsupported format: ${file.type}. Allowed: ${settings.allowedFormats.join(', ')}`;
  }
  if (file.size > settings.maxFileSizeMb * 1024 * 1024) {
    return `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Max: ${settings.maxFileSizeMb}MB`;
  }
  return null;
}

// ========== CATEGORY LABELS ==========

export const categoryLabels: Record<MediaCategory, string> = {
  thumbnail: 'Thumbnail',
  banner: 'Banner (Hero)',
  screenshot: 'Screenshots',
  demo: 'Demo / Preview',
  extra: 'Extra Gallery',
};

export const categoryDescriptions: Record<MediaCategory, string> = {
  thumbnail: 'Main card image shown in marketplace listings',
  banner: 'Full-width hero banner for product detail page',
  screenshot: 'App screenshots for the detail page slider',
  demo: 'Video preview or animated GIF demo',
  extra: 'Additional assets and promotional images',
};

// ========== API OUTPUT ==========

export interface ProductGalleryOutput {
  thumbnail_url: string | null;
  banner_url: string | null;
  gallery_images: { url: string; title: string; alt: string; order: number }[];
  demo_video_url: string | null;
  featured_tag: string | null;
  image_order_index: number[];
}

export function getGalleryOutput(media: GalleryMedia[]): ProductGalleryOutput {
  const thumbnail = media.find(m => m.category === 'thumbnail' && m.status === 'approved');
  const banner = media.find(m => m.category === 'banner' && m.status === 'approved');
  const demo = media.find(m => m.category === 'demo' && m.status === 'approved');
  const screenshots = media
    .filter(m => m.category === 'screenshot' && m.status === 'approved')
    .sort((a, b) => a.orderIndex - b.orderIndex);
  const featured = media.find(m => m.isFeatured);

  return {
    thumbnail_url: thumbnail?.url ?? null,
    banner_url: banner?.url ?? null,
    gallery_images: screenshots.map(s => ({ url: s.url, title: s.title, alt: s.altText, order: s.orderIndex })),
    demo_video_url: demo?.videoUrl ?? demo?.url ?? null,
    featured_tag: featured ? 'FEATURED' : null,
    image_order_index: screenshots.map(s => s.orderIndex),
  };
}

// ========== HOOK ==========

export function useGallery() {
  const [products, setProducts] = useState<GalleryProduct[]>(loadGallery);
  const [settings, setSettingsState] = useState<GallerySettings>(loadSettings);

  const persist = useCallback((updated: GalleryProduct[]) => {
    setProducts(updated);
    saveGallery(updated);
  }, []);

  const updateSettings = useCallback((s: GallerySettings) => {
    setSettingsState(s);
    saveSettings(s);
  }, []);

  const getProduct = useCallback((productId: string) => {
    return products.find(p => p.productId === productId);
  }, [products]);

  const addMedia = useCallback((productId: string, productName: string, media: Omit<GalleryMedia, 'id' | 'createdAt' | 'updatedAt' | 'orderIndex' | 'status'>[]) => {
    const now = new Date().toISOString();
    const existing = products.find(p => p.productId === productId);
    const startIdx = existing ? existing.media.length : 0;

    const newMedia: GalleryMedia[] = media.map((m, i) => ({
      ...m,
      id: uid(),
      orderIndex: startIdx + i,
      status: settings.requireApproval ? 'pending' : 'approved',
      createdAt: now,
      updatedAt: now,
    }));

    let updated: GalleryProduct[];
    if (existing) {
      updated = products.map(p => p.productId === productId ? { ...p, media: [...p.media, ...newMedia] } : p);
    } else {
      updated = [...products, { productId, productName, media: newMedia }];
    }
    persist(updated);
    return newMedia;
  }, [products, settings, persist]);

  const removeMedia = useCallback((productId: string, mediaIds: string[]) => {
    const updated = products.map(p => {
      if (p.productId !== productId) return p;
      return { ...p, media: p.media.filter(m => !mediaIds.includes(m.id)) };
    });
    persist(updated);
  }, [products, persist]);

  const updateMedia = useCallback((productId: string, mediaId: string, changes: Partial<GalleryMedia>) => {
    const updated = products.map(p => {
      if (p.productId !== productId) return p;
      return {
        ...p,
        media: p.media.map(m => m.id === mediaId ? { ...m, ...changes, updatedAt: new Date().toISOString() } : m),
      };
    });
    persist(updated);
  }, [products, persist]);

  const reorderMedia = useCallback((productId: string, category: MediaCategory, orderedIds: string[]) => {
    const updated = products.map(p => {
      if (p.productId !== productId) return p;
      return {
        ...p,
        media: p.media.map(m => {
          if (m.category !== category) return m;
          const idx = orderedIds.indexOf(m.id);
          return idx >= 0 ? { ...m, orderIndex: idx } : m;
        }),
      };
    });
    persist(updated);
  }, [products, persist]);

  const setFeatured = useCallback((productId: string, mediaId: string) => {
    const updated = products.map(p => {
      if (p.productId !== productId) return p;
      return {
        ...p,
        media: p.media.map(m => ({ ...m, isFeatured: m.id === mediaId })),
      };
    });
    persist(updated);
  }, [products, persist]);

  const replaceMedia = useCallback((productId: string, mediaId: string, newUrl: string, fileName: string, fileSize: number) => {
    updateMedia(productId, mediaId, { url: newUrl, fileName, fileSize });
  }, [updateMedia]);

  const moderateMedia = useCallback((productId: string, mediaId: string, status: 'approved' | 'rejected') => {
    updateMedia(productId, mediaId, { status });
  }, [updateMedia]);

  return {
    products,
    settings,
    updateSettings,
    getProduct,
    addMedia,
    removeMedia,
    updateMedia,
    reorderMedia,
    setFeatured,
    replaceMedia,
    moderateMedia,
  };
}
