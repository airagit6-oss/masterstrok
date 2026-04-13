import { useState, useCallback } from 'react';

// ========== TYPES ==========

export type MediaCategory = 'thumbnail' | 'banner' | 'screenshot' | 'demo' | 'extra';
export type MediaStatus = 'pending' | 'approved' | 'rejected';
export type FeaturedTag = 'HOT' | 'NEW' | 'FEATURED' | 'TRENDING' | null;

export interface ImageResolution {
  label: string;
  width: number;
  height: number;
  url: string;
}

export interface GalleryMedia {
  id: string;
  productId: string;
  category: MediaCategory;
  url: string;
  thumbnailUrl: string;        // auto-generated thumb
  resolutions: ImageResolution[]; // multi-res variants
  fileName: string;
  fileSize: number;
  originalFileSize: number;    // before compression
  fileType: string;
  width?: number;
  height?: number;
  title: string;
  altText: string;
  caption: string;
  orderIndex: number;
  isFeatured: boolean;
  featuredTag: FeaturedTag;
  status: MediaStatus;
  moderationNote: string;
  videoUrl?: string;
  lazyLoad: boolean;
  uploadedBy: 'admin' | 'seller';
  sellerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryProduct {
  productId: string;
  productName: string;
  vendorId: string;
  vendorName: string;
  media: GalleryMedia[];
}

export interface GallerySettings {
  maxImagesPerProduct: number;
  maxFileSizeMb: number;
  allowedFormats: string[];
  autoCompress: boolean;
  compressionQuality: number;   // 0-1
  autoWebp: boolean;
  watermarkEnabled: boolean;
  watermarkText: string;
  watermarkOpacity: number;     // 0-1
  requireApproval: boolean;
  autoGenerateThumbnails: boolean;
  thumbnailSize: number;
  generateMultiRes: boolean;
  resolutions: { label: string; maxWidth: number }[];
  enableLazyLoading: boolean;
  enableCdnHeaders: boolean;
  cdnCacheMaxAge: number;       // seconds
  maxBannerImages: number;
  maxScreenshots: number;
  maxDemoVideos: number;
}

// ========== DEFAULTS ==========

const DEFAULT_SETTINGS: GallerySettings = {
  maxImagesPerProduct: 20,
  maxFileSizeMb: 10,
  allowedFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4'],
  autoCompress: true,
  compressionQuality: 0.85,
  autoWebp: true,
  watermarkEnabled: false,
  watermarkText: '© SaaSHub',
  watermarkOpacity: 0.3,
  requireApproval: false,
  autoGenerateThumbnails: true,
  thumbnailSize: 300,
  generateMultiRes: true,
  resolutions: [
    { label: 'card_sm', maxWidth: 400 },
    { label: 'card_lg', maxWidth: 800 },
    { label: 'detail', maxWidth: 1200 },
    { label: 'full', maxWidth: 1920 },
  ],
  enableLazyLoading: true,
  enableCdnHeaders: true,
  cdnCacheMaxAge: 86400,
  maxBannerImages: 3,
  maxScreenshots: 15,
  maxDemoVideos: 3,
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

export function resizeImage(dataUrl: string, maxWidth: number, quality = 0.85, format: 'image/webp' | 'image/jpeg' = 'image/webp'): Promise<string> {
  return new Promise((resolve) => {
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
      resolve(canvas.toDataURL(format, quality));
    };
    img.src = dataUrl;
  });
}

export function compressImage(file: File, maxWidth = 1920, quality = 0.85): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resizeImage(reader.result as string, maxWidth, quality).then(resolve);
    };
    reader.readAsDataURL(file);
  });
}

export function generateThumbnail(url: string, size = 300): Promise<string> {
  return resizeImage(url, size, 0.8);
}

export function generateMultipleResolutions(
  dataUrl: string,
  resolutions: { label: string; maxWidth: number }[],
  quality = 0.85
): Promise<ImageResolution[]> {
  return Promise.all(
    resolutions.map(async (res) => {
      const url = await resizeImage(dataUrl, res.maxWidth, quality);
      const dims = await getImageDimensions(url);
      return { label: res.label, width: dims.width, height: dims.height, url };
    })
  );
}

export function applyWatermark(dataUrl: string, text: string, opacity = 0.3): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = '#ffffff';
      const fontSize = Math.max(16, img.width * 0.03);
      ctx.font = `${fontSize}px sans-serif`;
      ctx.textAlign = 'center';
      // Diagonal watermark pattern
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-Math.PI / 6);
      for (let y = -canvas.height; y < canvas.height; y += fontSize * 4) {
        for (let x = -canvas.width; x < canvas.width; x += fontSize * text.length * 1.5) {
          ctx.fillText(text, x, y);
        }
      }
      ctx.restore();
      resolve(canvas.toDataURL('image/webp', 0.9));
    };
    img.src = dataUrl;
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

export function validateCategoryLimit(
  existingMedia: GalleryMedia[],
  category: MediaCategory,
  newCount: number,
  settings: GallerySettings
): string | null {
  const existing = existingMedia.filter(m => m.category === category).length;
  const limits: Record<MediaCategory, number> = {
    thumbnail: 1,
    banner: settings.maxBannerImages,
    screenshot: settings.maxScreenshots,
    demo: settings.maxDemoVideos,
    extra: settings.maxImagesPerProduct,
  };
  const max = limits[category];
  if (existing + newCount > max) {
    return `${categoryLabels[category]} limit exceeded. Max: ${max}, Current: ${existing}, Trying to add: ${newCount}`;
  }
  return null;
}

// ========== FILE TYPE HELPERS ==========

export function isImageFile(type: string): boolean {
  return type.startsWith('image/');
}

export function isVideoFile(type: string): boolean {
  return type.startsWith('video/') || type === 'video/url';
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getCompressionRatio(original: number, compressed: number): number {
  if (original === 0) return 0;
  return Math.round((1 - compressed / original) * 100);
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
  thumbnail: 'Main card image shown in marketplace listings (1 max)',
  banner: 'Full-width hero banner for product detail page & sliders',
  screenshot: 'App screenshots for the detail page gallery slider',
  demo: 'Video preview or animated GIF demo',
  extra: 'Additional assets and promotional images',
};

export const categoryIcons: Record<MediaCategory, string> = {
  thumbnail: '🖼️',
  banner: '🏞️',
  screenshot: '📸',
  demo: '🎬',
  extra: '📎',
};

export const featuredTagOptions: { value: FeaturedTag; label: string; color: string }[] = [
  { value: null, label: 'None', color: '' },
  { value: 'HOT', label: '🔥 HOT', color: 'bg-red-500' },
  { value: 'NEW', label: '✨ NEW', color: 'bg-green-500' },
  { value: 'FEATURED', label: '⭐ FEATURED', color: 'bg-yellow-500' },
  { value: 'TRENDING', label: '📈 TRENDING', color: 'bg-blue-500' },
];

// ========== API OUTPUT ==========

export interface ProductGalleryOutput {
  thumbnail_url: string | null;
  thumbnail_alt: string;
  banner_url: string | null;
  gallery_images: { url: string; thumbnail_url: string; title: string; alt: string; caption: string; order: number; resolutions: ImageResolution[] }[];
  demo_video_url: string | null;
  featured_tag: FeaturedTag;
  image_order_index: number[];
  total_images: number;
  lazy_loading: boolean;
  cdn_cache_headers: { 'Cache-Control': string } | null;
}

export function getGalleryOutput(media: GalleryMedia[], settings: GallerySettings): ProductGalleryOutput {
  const approved = media.filter(m => m.status === 'approved');
  const thumbnail = approved.find(m => m.category === 'thumbnail');
  const banner = approved.find(m => m.category === 'banner');
  const demo = approved.find(m => m.category === 'demo');
  const screenshots = approved
    .filter(m => m.category === 'screenshot')
    .sort((a, b) => a.orderIndex - b.orderIndex);
  const extras = approved
    .filter(m => m.category === 'extra')
    .sort((a, b) => a.orderIndex - b.orderIndex);
  const allGallery = [...screenshots, ...extras];
  const featured = media.find(m => m.isFeatured);

  return {
    thumbnail_url: thumbnail?.url ?? null,
    thumbnail_alt: thumbnail?.altText ?? '',
    banner_url: banner?.url ?? null,
    gallery_images: allGallery.map(s => ({
      url: s.url,
      thumbnail_url: s.thumbnailUrl,
      title: s.title,
      alt: s.altText,
      caption: s.caption,
      order: s.orderIndex,
      resolutions: s.resolutions,
    })),
    demo_video_url: demo?.videoUrl ?? demo?.url ?? null,
    featured_tag: featured?.featuredTag ?? null,
    image_order_index: allGallery.map(s => s.orderIndex),
    total_images: allGallery.length,
    lazy_loading: settings.enableLazyLoading,
    cdn_cache_headers: settings.enableCdnHeaders
      ? { 'Cache-Control': `public, max-age=${settings.cdnCacheMaxAge}, immutable` }
      : null,
  };
}

// ========== STATS ==========

export interface GalleryStats {
  totalProducts: number;
  totalMedia: number;
  totalSizeBytes: number;
  byCategory: Record<MediaCategory, number>;
  byStatus: Record<MediaStatus, number>;
  avgImagesPerProduct: number;
  compressionSavedBytes: number;
}

export function computeStats(products: GalleryProduct[]): GalleryStats {
  const allMedia = products.flatMap(p => p.media);
  const byCategory = { thumbnail: 0, banner: 0, screenshot: 0, demo: 0, extra: 0 };
  const byStatus = { pending: 0, approved: 0, rejected: 0 };
  let totalSize = 0;
  let saved = 0;

  for (const m of allMedia) {
    byCategory[m.category]++;
    byStatus[m.status]++;
    totalSize += m.fileSize;
    saved += (m.originalFileSize || m.fileSize) - m.fileSize;
  }

  return {
    totalProducts: products.length,
    totalMedia: allMedia.length,
    totalSizeBytes: totalSize,
    byCategory,
    byStatus,
    avgImagesPerProduct: products.length > 0 ? Math.round(allMedia.length / products.length) : 0,
    compressionSavedBytes: saved,
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

  const addMedia = useCallback((
    productId: string,
    productName: string,
    media: Omit<GalleryMedia, 'id' | 'createdAt' | 'updatedAt' | 'orderIndex' | 'status'>[],
    vendorId = 'admin',
    vendorName = 'Admin'
  ) => {
    const now = new Date().toISOString();
    const existing = products.find(p => p.productId === productId);
    const startIdx = existing ? existing.media.length : 0;

    const newMedia: GalleryMedia[] = media.map((m, i) => ({
      ...m,
      id: uid(),
      orderIndex: startIdx + i,
      status: settings.requireApproval ? 'pending' as const : 'approved' as const,
      createdAt: now,
      updatedAt: now,
    }));

    let updated: GalleryProduct[];
    if (existing) {
      updated = products.map(p => p.productId === productId ? { ...p, media: [...p.media, ...newMedia] } : p);
    } else {
      updated = [...products, { productId, productName, vendorId, vendorName, media: newMedia }];
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

  const replaceMedia = useCallback((productId: string, mediaId: string, newUrl: string, fileName: string, fileSize: number, thumbnailUrl?: string, resolutions?: ImageResolution[]) => {
    updateMedia(productId, mediaId, { url: newUrl, fileName, fileSize, ...(thumbnailUrl && { thumbnailUrl }), ...(resolutions && { resolutions }) });
  }, [updateMedia]);

  const moderateMedia = useCallback((productId: string, mediaId: string, status: MediaStatus, note = '') => {
    updateMedia(productId, mediaId, { status, moderationNote: note });
  }, [updateMedia]);

  const bulkModerate = useCallback((productId: string, mediaIds: string[], status: MediaStatus, note = '') => {
    const updated = products.map(p => {
      if (p.productId !== productId) return p;
      return {
        ...p,
        media: p.media.map(m =>
          mediaIds.includes(m.id) ? { ...m, status, moderationNote: note, updatedAt: new Date().toISOString() } : m
        ),
      };
    });
    persist(updated);
  }, [products, persist]);

  const setFeaturedTag = useCallback((productId: string, mediaId: string, tag: FeaturedTag) => {
    updateMedia(productId, mediaId, { featuredTag: tag });
  }, [updateMedia]);

  const stats = computeStats(products);

  return {
    products,
    settings,
    stats,
    updateSettings,
    getProduct,
    addMedia,
    removeMedia,
    updateMedia,
    reorderMedia,
    setFeatured,
    replaceMedia,
    moderateMedia,
    bulkModerate,
    setFeaturedTag,
  };
}
