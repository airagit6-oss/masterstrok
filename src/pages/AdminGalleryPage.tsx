import { useState, useRef, useMemo } from 'react';
import {
  Upload, X, GripVertical, Star, Eye, Trash2, Image as ImageIcon, Film,
  Settings, Check, AlertTriangle, Replace, Save, Shield, Zap, HardDrive,
  BarChart3, CheckCircle2, XCircle, Clock, Maximize2, Copy, Tag,
  ChevronRight, MonitorSmartphone, Layers, FileWarning
} from 'lucide-react';
import { products as marketplaceProducts } from '@/lib/marketplaceData';
import {
  useGallery, type MediaCategory, type GalleryMedia, type GallerySettings, type FeaturedTag,
  categoryLabels, categoryDescriptions, categoryIcons, featuredTagOptions,
  readFileAsDataUrl, compressImage, getImageDimensions, validateFile,
  validateCategoryLimit, generateThumbnail, generateMultipleResolutions,
  applyWatermark, getGalleryOutput, formatFileSize, getCompressionRatio,
  isImageFile, isVideoFile
} from '@/lib/galleryManager';

const categories: MediaCategory[] = ['thumbnail', 'banner', 'screenshot', 'demo', 'extra'];

// ========== TOGGLE SWITCH COMPONENT ==========
const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button onClick={onChange} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-secondary'}`}>
    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-4' : 'translate-x-1'}`} />
  </button>
);

// ========== MODAL WRAPPER ==========
const Modal = ({ open, onClose, title, wide, children }: { open: boolean; onClose: () => void; title: string; wide?: boolean; children: React.ReactNode }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className={`${wide ? 'max-w-3xl' : 'max-w-lg'} w-full rounded-2xl border border-border bg-card p-6 shadow-2xl max-h-[90vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <button onClick={onClose} className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-accent transition-colors"><X className="h-4 w-4 text-muted-foreground" /></button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ========== STAT CARD ==========
const StatCard = ({ icon: Icon, label, value, sub, color }: { icon: any; label: string; value: string | number; sub?: string; color?: string }) => (
  <div className="rounded-xl border border-border bg-card p-4">
    <div className="flex items-center gap-2 mb-2">
      <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${color || 'bg-primary/10'}`}>
        <Icon className={`h-4 w-4 ${color ? 'text-white' : 'text-primary'}`} />
      </div>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </div>
    <p className="text-xl font-bold text-foreground">{value}</p>
    {sub && <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>}
  </div>
);

// ========== MAIN PAGE ==========
const AdminGalleryPage = () => {
  const gallery = useGallery();
  const [selectedProductId, setSelectedProductId] = useState(marketplaceProducts[0]?.id ?? '');
  const [activeCategory, setActiveCategory] = useState<MediaCategory>('screenshot');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [dragOverZone, setDragOverZone] = useState(false);
  const [dragItem, setDragItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  const [editMedia, setEditMedia] = useState<GalleryMedia | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showApiPreview, setShowApiPreview] = useState(false);
  const [showLightbox, setShowLightbox] = useState<GalleryMedia | null>(null);
  const [showFrontendPreview, setShowFrontendPreview] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [activeTab, setActiveTab] = useState<'gallery' | 'stats' | 'moderation'>('gallery');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replaceTarget, setReplaceTarget] = useState<string | null>(null);
  const [localSettings, setLocalSettings] = useState<GallerySettings>(gallery.settings);

  const selectedProduct = marketplaceProducts.find(p => p.id === selectedProductId);
  const galleryProduct = gallery.getProduct(selectedProductId);
  const currentMedia = useMemo(() =>
    (galleryProduct?.media ?? []).filter(m => m.category === activeCategory).sort((a, b) => a.orderIndex - b.orderIndex),
    [galleryProduct, activeCategory]
  );
  const allMedia = galleryProduct?.media ?? [];
  const catCount = (cat: MediaCategory) => allMedia.filter(m => m.category === cat).length;

  // ========== UPLOAD ==========
  const handleFiles = async (files: FileList) => {
    if (!selectedProduct) return;
    const limitErr = validateCategoryLimit(allMedia, activeCategory, files.length, gallery.settings);
    if (limitErr) { alert(limitErr); return; }

    setUploading(true);
    const newMedia: Parameters<typeof gallery.addMedia>[2] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const err = validateFile(file, gallery.settings);
      if (err) { alert(err); continue; }

      const progressKey = file.name;
      setUploadProgress(p => ({ ...p, [progressKey]: 5 }));

      const originalSize = file.size;
      let url: string;

      // Step 1: Read & compress
      if (isImageFile(file.type) && gallery.settings.autoCompress) {
        setUploadProgress(p => ({ ...p, [progressKey]: 15 }));
        url = await compressImage(file, 1920, gallery.settings.compressionQuality);
      } else {
        url = await readFileAsDataUrl(file);
      }
      setUploadProgress(p => ({ ...p, [progressKey]: 35 }));

      // Step 2: Watermark
      if (isImageFile(file.type) && gallery.settings.watermarkEnabled) {
        url = await applyWatermark(url, gallery.settings.watermarkText, gallery.settings.watermarkOpacity);
      }
      setUploadProgress(p => ({ ...p, [progressKey]: 50 }));

      // Step 3: Dimensions
      const dims = isImageFile(file.type) ? await getImageDimensions(url) : { width: 0, height: 0 };
      setUploadProgress(p => ({ ...p, [progressKey]: 60 }));

      // Step 4: Thumbnail
      let thumbUrl = url;
      if (isImageFile(file.type) && gallery.settings.autoGenerateThumbnails) {
        thumbUrl = await generateThumbnail(url, gallery.settings.thumbnailSize);
      }
      setUploadProgress(p => ({ ...p, [progressKey]: 75 }));

      // Step 5: Multi-resolution
      let resolutions: { label: string; width: number; height: number; url: string }[] = [];
      if (isImageFile(file.type) && gallery.settings.generateMultiRes) {
        resolutions = await generateMultipleResolutions(url, gallery.settings.resolutions, gallery.settings.compressionQuality);
      }
      setUploadProgress(p => ({ ...p, [progressKey]: 95 }));

      const compressedSize = Math.round(url.length * 0.75); // approximate data URL → binary

      newMedia.push({
        productId: selectedProductId,
        category: activeCategory,
        url,
        thumbnailUrl: thumbUrl,
        resolutions,
        fileName: file.name,
        fileSize: compressedSize,
        originalFileSize: originalSize,
        fileType: file.type,
        width: dims.width,
        height: dims.height,
        title: file.name.replace(/\.[^.]+$/, ''),
        altText: '',
        caption: '',
        isFeatured: false,
        featuredTag: null,
        moderationNote: '',
        lazyLoad: gallery.settings.enableLazyLoading,
        uploadedBy: 'admin',
        videoUrl: file.type.startsWith('video/') ? url : undefined,
      });
      setUploadProgress(p => ({ ...p, [progressKey]: 100 }));
    }

    if (newMedia.length > 0) {
      gallery.addMedia(selectedProductId, selectedProduct.name, newMedia);
    }

    setTimeout(() => { setUploadProgress({}); setUploading(false); }, 600);
  };

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setDragOverZone(false); if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files); };

  const handleVideoUrl = () => {
    if (!videoUrlInput.trim() || !selectedProduct) return;
    gallery.addMedia(selectedProductId, selectedProduct.name, [{
      productId: selectedProductId,
      category: 'demo',
      url: videoUrlInput,
      thumbnailUrl: '',
      resolutions: [],
      fileName: 'Video Link',
      fileSize: 0,
      originalFileSize: 0,
      fileType: 'video/url',
      title: 'Demo Video',
      altText: '',
      caption: '',
      isFeatured: false,
      featuredTag: null,
      moderationNote: '',
      lazyLoad: true,
      uploadedBy: 'admin',
      videoUrl: videoUrlInput,
    }]);
    setVideoUrlInput('');
  };

  // ========== REPLACE ==========
  const handleReplace = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !replaceTarget) return;
    const file = e.target.files[0];
    let url = gallery.settings.autoCompress ? await compressImage(file, 1920, gallery.settings.compressionQuality) : await readFileAsDataUrl(file);
    if (gallery.settings.watermarkEnabled) url = await applyWatermark(url, gallery.settings.watermarkText, gallery.settings.watermarkOpacity);
    const thumbUrl = gallery.settings.autoGenerateThumbnails ? await generateThumbnail(url, gallery.settings.thumbnailSize) : url;
    const resolutions = gallery.settings.generateMultiRes ? await generateMultipleResolutions(url, gallery.settings.resolutions) : [];
    gallery.replaceMedia(selectedProductId, replaceTarget, url, file.name, file.size, thumbUrl, resolutions);
    setReplaceTarget(null);
    if (replaceInputRef.current) replaceInputRef.current.value = '';
  };

  // ========== DRAG REORDER ==========
  const handleSortDragStart = (id: string) => setDragItem(id);
  const handleSortDragOver = (e: React.DragEvent, id: string) => { e.preventDefault(); setDragOverItem(id); };
  const handleSortDrop = (targetId: string) => {
    if (!dragItem || dragItem === targetId) { setDragItem(null); setDragOverItem(null); return; }
    const ids = currentMedia.map(m => m.id);
    const fromIdx = ids.indexOf(dragItem);
    const toIdx = ids.indexOf(targetId);
    ids.splice(fromIdx, 1);
    ids.splice(toIdx, 0, dragItem);
    gallery.reorderMedia(selectedProductId, activeCategory, ids);
    setDragItem(null);
    setDragOverItem(null);
  };

  // ========== BULK ==========
  const toggleSelect = (id: string) => setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const selectAll = () => setSelectedIds(new Set(currentMedia.map(m => m.id)));
  const clearSelection = () => setSelectedIds(new Set());
  const bulkDelete = () => { gallery.removeMedia(selectedProductId, Array.from(selectedIds)); clearSelection(); };
  const bulkApprove = () => { gallery.bulkModerate(selectedProductId, Array.from(selectedIds), 'approved'); clearSelection(); };
  const bulkReject = () => { gallery.bulkModerate(selectedProductId, Array.from(selectedIds), 'rejected'); clearSelection(); };

  // ========== API OUTPUT ==========
  const apiOutput = useMemo(() => getGalleryOutput(allMedia, gallery.settings), [allMedia, gallery.settings]);

  // ========== PENDING ITEMS (all products) ==========
  const pendingItems = useMemo(() =>
    gallery.products.flatMap(p => p.media.filter(m => m.status === 'pending').map(m => ({ ...m, productName: p.productName }))),
    [gallery.products]
  );

  // =============================================
  // RENDER
  // =============================================
  return (
    <div className="space-y-6">
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ImageIcon className="h-6 w-6 text-primary" /> Product Gallery Manager
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Multi-vendor media management · Upload, process, moderate & deliver</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowFrontendPreview(true)} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent transition-colors">
            <MonitorSmartphone className="h-4 w-4" /> Preview
          </button>
          <button onClick={() => setShowApiPreview(true)} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent transition-colors">
            <Copy className="h-4 w-4" /> API JSON
          </button>
          <button onClick={() => { setLocalSettings(gallery.settings); setShowSettings(true); }} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent transition-colors">
            <Settings className="h-4 w-4" /> Settings
          </button>
        </div>
      </div>

      {/* ===== STATS ROW ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <StatCard icon={Layers} label="Total Media" value={gallery.stats.totalMedia} sub={`${gallery.stats.totalProducts} products`} />
        <StatCard icon={HardDrive} label="Total Size" value={formatFileSize(gallery.stats.totalSizeBytes)} sub={`Saved ${formatFileSize(gallery.stats.compressionSavedBytes)}`} />
        <StatCard icon={CheckCircle2} label="Approved" value={gallery.stats.byStatus.approved} color="bg-green-600" />
        <StatCard icon={Clock} label="Pending" value={gallery.stats.byStatus.pending} color="bg-yellow-600" />
        <StatCard icon={XCircle} label="Rejected" value={gallery.stats.byStatus.rejected} color="bg-red-600" />
        <StatCard icon={BarChart3} label="Avg/Product" value={gallery.stats.avgImagesPerProduct} sub="images per product" />
      </div>

      {/* ===== TABS ===== */}
      <div className="flex items-center gap-1 border-b border-border">
        {([
          { key: 'gallery', label: 'Gallery Manager', icon: ImageIcon },
          { key: 'moderation', label: `Moderation Queue (${pendingItems.length})`, icon: Shield },
          { key: 'stats', label: 'Category Breakdown', icon: BarChart3 },
        ] as const).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-[1px] ${
              activeTab === tab.key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className="h-4 w-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* ========== TAB: MODERATION ========== */}
      {activeTab === 'moderation' && (
        <div className="space-y-3">
          {pendingItems.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-12 text-center">
              <Shield className="h-10 w-10 mx-auto mb-3 text-green-500/40" />
              <p className="text-sm text-muted-foreground">All media has been moderated. No pending items.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {pendingItems.map(item => (
                <div key={item.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-3">
                  <div className="h-16 w-20 rounded-lg bg-secondary overflow-hidden shrink-0">
                    {isImageFile(item.fileType) ? (
                      <img src={item.thumbnailUrl || item.url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center"><Film className="h-6 w-6 text-muted-foreground" /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.title || item.fileName}</p>
                    <p className="text-xs text-muted-foreground">{(item as any).productName} · {categoryLabels[item.category]} · {formatFileSize(item.fileSize)}</p>
                    <p className="text-[10px] text-muted-foreground">Uploaded by {item.uploadedBy} · {new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => setShowLightbox(item)} className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => gallery.moderateMedia(item.productId, item.id, 'approved')}
                      className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 transition-colors"
                    >
                      <Check className="h-3 w-3" /> Approve
                    </button>
                    <button
                      onClick={() => gallery.moderateMedia(item.productId, item.id, 'rejected', 'Content policy violation')}
                      className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 transition-colors"
                    >
                      <X className="h-3 w-3" /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========== TAB: STATS ========== */}
      {activeTab === 'stats' && (
        <div className="space-y-4">
          <div className="grid grid-cols-5 gap-3">
            {categories.map(cat => {
              const count = gallery.stats.byCategory[cat];
              const approved = gallery.products.flatMap(p => p.media).filter(m => m.category === cat && m.status === 'approved').length;
              const pending = gallery.products.flatMap(p => p.media).filter(m => m.category === cat && m.status === 'pending').length;
              return (
                <div key={cat} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{categoryIcons[cat]}</span>
                    <span className="text-xs font-medium text-muted-foreground">{categoryLabels[cat]}</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{count}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-green-500">✓ {approved}</span>
                    <span className="text-[10px] text-yellow-500">⏳ {pending}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Per-product breakdown */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-accent/30">
              <h3 className="text-sm font-semibold text-foreground">Per-Product Media Inventory</h3>
            </div>
            <div className="divide-y divide-border">
              {gallery.products.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">No gallery data yet. Upload media to see breakdown.</div>
              ) : gallery.products.map(gp => (
                <div key={gp.productId} className="flex items-center gap-4 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{gp.productName}</p>
                    <p className="text-[10px] text-muted-foreground">Vendor: {gp.vendorName}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {categories.map(c => {
                      const n = gp.media.filter(m => m.category === c).length;
                      return n > 0 ? <span key={c} className="rounded bg-secondary px-1.5 py-0.5">{categoryIcons[c]} {n}</span> : null;
                    })}
                  </div>
                  <span className="text-xs font-semibold text-foreground">{gp.media.length} total</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========== TAB: GALLERY ========== */}
      {activeTab === 'gallery' && (
        <div className="space-y-5">
          {/* Product Selector + Category Tabs */}
          <div className="flex items-end gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px] max-w-sm">
              <label className="block text-xs font-medium text-muted-foreground mb-1">Select Product</label>
              <select
                value={selectedProductId}
                onChange={e => { setSelectedProductId(e.target.value); clearSelection(); }}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {marketplaceProducts.map(p => (
                  <option key={p.id} value={p.id}>{p.name} — {p.category}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); clearSelection(); }}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-card border border-border text-muted-foreground hover:bg-accent'
                  }`}
                >
                  <span>{categoryIcons[cat]}</span>
                  {categoryLabels[cat]}
                  {catCount(cat) > 0 && (
                    <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${activeCategory === cat ? 'bg-white/20' : 'bg-secondary'}`}>
                      {catCount(cat)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">{categoryDescriptions[activeCategory]}</p>

          {/* Upload Zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOverZone(true); }}
            onDragLeave={() => setDragOverZone(false)}
            onDrop={handleDrop}
            className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
              dragOverZone ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-border hover:border-muted-foreground'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={gallery.settings.allowedFormats.join(',')}
              onChange={e => { if (e.target.files) handleFiles(e.target.files); e.target.value = ''; }}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-2">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">Drop files here or click to browse</p>
              <p className="text-xs text-muted-foreground max-w-md">
                JPG, PNG, WEBP, GIF, MP4 · Max {gallery.settings.maxFileSizeMb}MB per file
                {gallery.settings.autoCompress && ' · Auto-compress'}
                {gallery.settings.autoWebp && ' · WebP conversion'}
                {gallery.settings.watermarkEnabled && ' · Watermark'}
              </p>
              <div className="flex items-center gap-4 mt-1">
                {gallery.settings.autoCompress && <span className="flex items-center gap-1 text-[10px] text-green-500"><Zap className="h-3 w-3" /> Compress</span>}
                {gallery.settings.generateMultiRes && <span className="flex items-center gap-1 text-[10px] text-blue-500"><Layers className="h-3 w-3" /> Multi-Res</span>}
                {gallery.settings.autoGenerateThumbnails && <span className="flex items-center gap-1 text-[10px] text-purple-500"><ImageIcon className="h-3 w-3" /> Thumbs</span>}
                {gallery.settings.enableLazyLoading && <span className="flex items-center gap-1 text-[10px] text-orange-500"><Zap className="h-3 w-3" /> Lazy</span>}
              </div>
            </div>

            {/* Progress */}
            {Object.entries(uploadProgress).length > 0 && (
              <div className="mt-5 space-y-2 max-w-md mx-auto" onClick={e => e.stopPropagation()}>
                {Object.entries(uploadProgress).map(([name, pct]) => (
                  <div key={name} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground truncate w-28">{name}</span>
                    <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground w-8 text-right">{pct}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Video URL for Demo */}
          {activeCategory === 'demo' && (
            <div className="flex items-center gap-2">
              <Film className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                value={videoUrlInput}
                onChange={e => setVideoUrlInput(e.target.value)}
                placeholder="Paste YouTube / Vimeo URL..."
                className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button onClick={handleVideoUrl} disabled={!videoUrlInput.trim()} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                Add Video
              </button>
            </div>
          )}

          {/* Bulk Actions */}
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2.5 flex-wrap">
              <span className="text-sm font-medium text-foreground">{selectedIds.size} selected</span>
              <button onClick={bulkApprove} className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700">
                <Check className="h-3 w-3" /> Approve
              </button>
              <button onClick={bulkReject} className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700">
                <XCircle className="h-3 w-3" /> Reject
              </button>
              <button onClick={bulkDelete} className="flex items-center gap-1 rounded-lg bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground hover:bg-destructive/90">
                <Trash2 className="h-3 w-3" /> Delete
              </button>
              <div className="flex-1" />
              <button onClick={selectAll} className="text-xs text-primary hover:underline">Select All</button>
              <button onClick={clearSelection} className="text-xs text-muted-foreground hover:text-foreground">Clear</button>
            </div>
          )}

          {/* ===== MEDIA GRID ===== */}
          {currentMedia.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-16 text-center">
              <ImageIcon className="h-12 w-12 mx-auto mb-3 text-muted-foreground/20" />
              <p className="text-sm font-medium text-foreground">No {categoryLabels[activeCategory].toLowerCase()} uploaded</p>
              <p className="text-xs text-muted-foreground mt-1">Drag & drop files above or click to browse</p>
            </div>
          ) : (
            <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {currentMedia.map((media, idx) => (
                <div
                  key={media.id}
                  draggable
                  onDragStart={() => handleSortDragStart(media.id)}
                  onDragOver={(e) => handleSortDragOver(e, media.id)}
                  onDrop={() => handleSortDrop(media.id)}
                  onDragEnd={() => { setDragItem(null); setDragOverItem(null); }}
                  className={`group relative rounded-xl border overflow-hidden transition-all cursor-grab active:cursor-grabbing ${
                    dragOverItem === media.id ? 'border-primary ring-2 ring-primary/20 scale-[1.02]' : 'border-border hover:border-muted-foreground'
                  } ${selectedIds.has(media.id) ? 'ring-2 ring-primary' : ''} ${
                    media.status === 'rejected' ? 'opacity-40 grayscale' : ''
                  }`}
                >
                  {/* Select */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleSelect(media.id); }}
                    className={`absolute top-2 left-2 z-10 h-5 w-5 rounded border-2 flex items-center justify-center transition-all ${
                      selectedIds.has(media.id) ? 'bg-primary border-primary text-white' : 'border-white/60 bg-black/30 text-transparent group-hover:border-white'
                    }`}
                  >
                    <Check className="h-3 w-3" />
                  </button>

                  {/* Order badge */}
                  <span className="absolute top-2 left-9 z-10 rounded bg-black/50 px-1.5 py-0.5 text-[9px] font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    #{idx + 1}
                  </span>

                  {/* Featured badge */}
                  {media.isFeatured && (
                    <span className="absolute top-2 right-2 z-10 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 px-2 py-0.5 text-[10px] font-bold text-black shadow-lg">★ FEATURED</span>
                  )}

                  {/* Featured Tag */}
                  {!media.isFeatured && media.featuredTag && (
                    <span className={`absolute top-2 right-2 z-10 rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow ${
                      media.featuredTag === 'HOT' ? 'bg-red-500' : media.featuredTag === 'NEW' ? 'bg-green-500' : media.featuredTag === 'TRENDING' ? 'bg-blue-500' : 'bg-yellow-500'
                    }`}>
                      {media.featuredTag}
                    </span>
                  )}

                  {/* Status */}
                  {media.status === 'pending' && (
                    <span className="absolute bottom-[60px] left-2 z-10 rounded-full bg-yellow-500/90 px-2 py-0.5 text-[9px] font-bold text-black">⏳ PENDING</span>
                  )}
                  {media.status === 'rejected' && (
                    <span className="absolute bottom-[60px] left-2 z-10 rounded-full bg-red-500/90 px-2 py-0.5 text-[9px] font-bold text-white">✗ REJECTED</span>
                  )}

                  {/* Image / Video */}
                  {isVideoFile(media.fileType) || media.videoUrl ? (
                    <div className="relative h-40 bg-secondary flex items-center justify-center" onClick={() => setShowLightbox(media)}>
                      <Film className="h-10 w-10 text-muted-foreground/40" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                          <ChevronRight className="h-5 w-5 text-white ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1.5 text-[9px] text-white font-medium">VIDEO</span>
                    </div>
                  ) : (
                    <div className="relative h-40 bg-secondary cursor-pointer" onClick={() => setShowLightbox(media)}>
                      <img
                        src={media.thumbnailUrl || media.url}
                        alt={media.altText || media.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        loading={media.lazyLoad ? 'lazy' : 'eager'}
                      />
                      {/* Grip */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical className="h-6 w-6 text-white drop-shadow-lg" />
                      </div>
                      {/* Expand */}
                      <button
                        onClick={(e) => { e.stopPropagation(); setShowLightbox(media); }}
                        className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 h-6 w-6 rounded bg-black/50 flex items-center justify-center text-white transition-opacity"
                      >
                        <Maximize2 className="h-3 w-3" />
                      </button>
                      {/* Compression indicator */}
                      {media.originalFileSize > 0 && media.originalFileSize !== media.fileSize && (
                        <span className="absolute bottom-1 left-1 opacity-0 group-hover:opacity-100 rounded bg-green-600/80 px-1 text-[8px] text-white font-medium transition-opacity">
                          -{getCompressionRatio(media.originalFileSize, media.fileSize)}%
                        </span>
                      )}
                    </div>
                  )}

                  {/* Info Footer */}
                  <div className="p-2.5 bg-card space-y-1.5">
                    <p className="text-xs font-medium text-foreground truncate">{media.title || media.fileName}</p>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span>{formatFileSize(media.fileSize)}</span>
                      {media.width ? <span>{media.width}×{media.height}</span> : null}
                      {media.resolutions.length > 0 && <span className="text-blue-400">{media.resolutions.length} res</span>}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-0.5 pt-1 border-t border-border/50">
                      <button onClick={(e) => { e.stopPropagation(); gallery.setFeatured(selectedProductId, media.id); }} title="Set Featured"
                        className={`h-7 w-7 rounded-lg flex items-center justify-center transition-colors ${media.isFeatured ? 'text-yellow-500 bg-yellow-500/10' : 'text-muted-foreground hover:bg-accent hover:text-yellow-500'}`}>
                        <Star className="h-3.5 w-3.5" fill={media.isFeatured ? 'currentColor' : 'none'} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setEditMedia(media); }} title="Edit Details"
                        className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setReplaceTarget(media.id); replaceInputRef.current?.click(); }} title="Replace"
                        className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                        <Replace className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); gallery.moderateMedia(selectedProductId, media.id, media.status === 'approved' ? 'rejected' : 'approved'); }} title="Toggle Approval"
                        className={`h-7 w-7 rounded-lg flex items-center justify-center transition-colors ${media.status === 'approved' ? 'text-green-500 hover:bg-red-500/10 hover:text-red-500' : 'text-muted-foreground hover:bg-green-500/10 hover:text-green-500'}`}>
                        {media.status === 'approved' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); gallery.removeMedia(selectedProductId, [media.id]); }} title="Delete"
                        className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Hidden replace input */}
      <input ref={replaceInputRef} type="file" accept="image/*" onChange={handleReplace} className="hidden" />

      {/* ===== LIGHTBOX ===== */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={() => setShowLightbox(null)}>
          <button className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20" onClick={() => setShowLightbox(null)}>
            <X className="h-5 w-5" />
          </button>
          <div className="max-w-4xl max-h-[85vh] w-full" onClick={e => e.stopPropagation()}>
            {isImageFile(showLightbox.fileType) && !showLightbox.videoUrl ? (
              <img src={showLightbox.url} alt={showLightbox.altText || showLightbox.title} className="w-full h-auto max-h-[75vh] object-contain rounded-lg" />
            ) : (
              <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center">
                {showLightbox.videoUrl?.includes('youtube') || showLightbox.videoUrl?.includes('youtu.be') ? (
                  <iframe
                    src={showLightbox.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                    className="w-full h-full rounded-lg"
                    allowFullScreen
                  />
                ) : showLightbox.videoUrl?.includes('vimeo') ? (
                  <iframe
                    src={showLightbox.videoUrl.replace('vimeo.com/', 'player.vimeo.com/video/')}
                    className="w-full h-full rounded-lg"
                    allowFullScreen
                  />
                ) : (
                  <Film className="h-16 w-16 text-muted-foreground/30" />
                )}
              </div>
            )}
            <div className="mt-3 flex items-center justify-between text-white">
              <div>
                <p className="text-sm font-medium">{showLightbox.title || showLightbox.fileName}</p>
                <p className="text-xs text-white/60">{formatFileSize(showLightbox.fileSize)} · {showLightbox.width}×{showLightbox.height} · {showLightbox.resolutions.length} resolutions</p>
              </div>
              <div className="flex items-center gap-2">
                {showLightbox.status === 'approved' && <span className="rounded-full bg-green-600 px-2.5 py-1 text-xs font-medium">✓ Approved</span>}
                {showLightbox.status === 'pending' && <span className="rounded-full bg-yellow-600 px-2.5 py-1 text-xs font-medium">⏳ Pending</span>}
                {showLightbox.status === 'rejected' && <span className="rounded-full bg-red-600 px-2.5 py-1 text-xs font-medium">✗ Rejected</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== EDIT MODAL ===== */}
      <Modal open={!!editMedia} onClose={() => setEditMedia(null)} title="Edit Media Details">
        {editMedia && (
          <>
            {isImageFile(editMedia.fileType) && !editMedia.videoUrl && (
              <img src={editMedia.url} alt="" className="w-full h-48 object-cover rounded-lg mb-4" />
            )}
            <div className="space-y-3">
              {[
                { label: 'Title', key: 'title', placeholder: 'Image title for display' },
                { label: 'Alt Text (SEO)', key: 'altText', placeholder: 'Describe for screen readers & search engines' },
                { label: 'Caption', key: 'caption', placeholder: 'Optional caption text' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">{f.label}</label>
                  <input
                    value={(editMedia as any)[f.key] ?? ''}
                    onChange={e => setEditMedia(prev => prev ? { ...prev, [f.key]: e.target.value } : null)}
                    placeholder={f.placeholder}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Category</label>
                  <select
                    value={editMedia.category}
                    onChange={e => setEditMedia(prev => prev ? { ...prev, category: e.target.value as MediaCategory } : null)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {categories.map(c => <option key={c} value={c}>{categoryLabels[c]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Featured Tag</label>
                  <select
                    value={editMedia.featuredTag ?? ''}
                    onChange={e => setEditMedia(prev => prev ? { ...prev, featuredTag: (e.target.value || null) as FeaturedTag } : null)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {featuredTagOptions.map(t => <option key={t.label} value={t.value ?? ''}>{t.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Metadata readout */}
              <div className="rounded-lg bg-secondary p-3 space-y-1">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">File Info</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-foreground">
                  <span>Original: {formatFileSize(editMedia.originalFileSize)}</span>
                  <span>Compressed: {formatFileSize(editMedia.fileSize)}</span>
                  <span>Dimensions: {editMedia.width}×{editMedia.height}</span>
                  <span>Format: {editMedia.fileType}</span>
                  <span>Resolutions: {editMedia.resolutions.length}</span>
                  <span>Lazy Load: {editMedia.lazyLoad ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => { gallery.updateMedia(selectedProductId, editMedia.id, editMedia); setEditMedia(null); }}
                className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Save className="h-4 w-4 inline mr-1" /> Save Changes
              </button>
              <button onClick={() => setEditMedia(null)} className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent">
                Cancel
              </button>
            </div>
          </>
        )}
      </Modal>

      {/* ===== SETTINGS MODAL ===== */}
      <Modal open={showSettings} onClose={() => setShowSettings(false)} title="Gallery Settings" wide>
        <div className="space-y-5">
          {/* Upload Limits */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Upload Limits</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { key: 'maxImagesPerProduct', label: 'Max Images/Product' },
                { key: 'maxFileSizeMb', label: 'Max File Size (MB)' },
                { key: 'maxBannerImages', label: 'Max Banners' },
                { key: 'maxScreenshots', label: 'Max Screenshots' },
                { key: 'maxDemoVideos', label: 'Max Demo Videos' },
                { key: 'thumbnailSize', label: 'Thumb Size (px)' },
                { key: 'compressionQuality', label: 'Quality (0-1)' },
                { key: 'cdnCacheMaxAge', label: 'CDN Cache (sec)' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-[10px] font-medium text-muted-foreground mb-1">{f.label}</label>
                  <input
                    type="number"
                    step={f.key === 'compressionQuality' ? '0.05' : '1'}
                    value={(localSettings as any)[f.key]}
                    onChange={e => setLocalSettings(s => ({ ...s, [f.key]: +e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Processing Toggles */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Processing & Delivery</h3>
            <div className="space-y-0">
              {[
                { key: 'autoCompress', label: 'Auto Compress', desc: 'Reduce file size on upload', icon: Zap },
                { key: 'autoWebp', label: 'WebP Conversion', desc: 'Convert all images to WebP format', icon: FileWarning },
                { key: 'generateMultiRes', label: 'Multi-Resolution', desc: 'Generate card_sm, card_lg, detail, full variants', icon: Layers },
                { key: 'autoGenerateThumbnails', label: 'Auto Thumbnails', desc: 'Generate small thumbs for grid views', icon: ImageIcon },
                { key: 'enableLazyLoading', label: 'Lazy Loading', desc: 'Load images on scroll for performance', icon: Zap },
                { key: 'enableCdnHeaders', label: 'CDN Cache Headers', desc: 'Add Cache-Control headers for CDN delivery', icon: HardDrive },
                { key: 'watermarkEnabled', label: 'Watermark', desc: 'Apply watermark text to uploaded images', icon: Shield },
                { key: 'requireApproval', label: 'Require Approval', desc: 'New uploads enter pending state for admin review', icon: CheckCircle2 },
              ].map(t => (
                <div key={t.key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <t.icon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{t.label}</p>
                      <p className="text-xs text-muted-foreground">{t.desc}</p>
                    </div>
                  </div>
                  <Toggle checked={(localSettings as any)[t.key]} onChange={() => setLocalSettings(s => ({ ...s, [t.key]: !(s as any)[t.key] }))} />
                </div>
              ))}
            </div>
          </div>

          {/* Watermark Text */}
          {localSettings.watermarkEnabled && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-medium text-muted-foreground mb-1">Watermark Text</label>
                <input
                  value={localSettings.watermarkText}
                  onChange={e => setLocalSettings(s => ({ ...s, watermarkText: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-muted-foreground mb-1">Watermark Opacity</label>
                <input
                  type="number"
                  step="0.05"
                  min="0.05"
                  max="1"
                  value={localSettings.watermarkOpacity}
                  onChange={e => setLocalSettings(s => ({ ...s, watermarkOpacity: +e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          )}

          {/* Security */}
          <div className="rounded-lg bg-secondary/50 border border-border p-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5"><Shield className="h-3 w-3" /> Security</h3>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>✓ File type validation (MIME + extension)</li>
              <li>✓ File size limit enforcement</li>
              <li>✓ Category-specific upload limits</li>
              <li>✓ Access control — owner/admin only edit</li>
              <li>✓ Secure data URL storage paths</li>
              <li className="text-muted-foreground/50">⏳ Malware scan — available with CDN integration</li>
            </ul>
          </div>
        </div>

        <button onClick={() => { gallery.updateSettings(localSettings); setShowSettings(false); }} className="mt-5 w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Save Settings
        </button>
      </Modal>

      {/* ===== API PREVIEW MODAL ===== */}
      <Modal open={showApiPreview} onClose={() => setShowApiPreview(false)} title="API Output — Frontend Ready JSON" wide>
        <p className="text-xs text-muted-foreground mb-3">Structured output for Netflix-style sliders, product cards, and detail pages.</p>
        <pre className="rounded-lg bg-secondary p-4 text-[11px] text-foreground font-mono overflow-auto max-h-[60vh] whitespace-pre-wrap leading-relaxed">
          {JSON.stringify(apiOutput, null, 2)}
        </pre>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded bg-green-500/10 text-green-500 px-1.5 py-0.5 font-medium">GET</span>
          <code className="text-foreground">/api/v1/products/{selectedProductId}/gallery</code>
        </div>
      </Modal>

      {/* ===== FRONTEND PREVIEW MODAL ===== */}
      <Modal open={showFrontendPreview} onClose={() => setShowFrontendPreview(false)} title="Frontend Preview — How It Looks" wide>
        <div className="space-y-6">
          {/* Product Card Preview */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Product Card (Netflix Row)</h4>
            <div className="flex gap-3">
              {[apiOutput.thumbnail_url, ...apiOutput.gallery_images.slice(0, 3).map(g => g.url)].filter(Boolean).map((url, i) => (
                <div key={i} className="w-48 rounded-xl overflow-hidden border border-border bg-card shadow-lg">
                  <div className="h-28 bg-secondary">
                    <img src={url!} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium text-foreground truncate">{selectedProduct?.name || 'Product'}</p>
                    <p className="text-[10px] text-muted-foreground">${selectedProduct?.price ?? '29'}/mo</p>
                  </div>
                  {apiOutput.featured_tag && i === 0 && (
                    <span className="absolute top-1 left-1 rounded bg-red-500 px-1 text-[8px] text-white font-bold">{apiOutput.featured_tag}</span>
                  )}
                </div>
              ))}
              {!apiOutput.thumbnail_url && apiOutput.gallery_images.length === 0 && (
                <div className="w-48 h-40 rounded-xl border border-dashed border-border flex items-center justify-center">
                  <p className="text-xs text-muted-foreground">No images</p>
                </div>
              )}
            </div>
          </div>

          {/* Banner Preview */}
          {apiOutput.banner_url && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Hero Banner</h4>
              <div className="rounded-xl overflow-hidden border border-border h-40 bg-secondary">
                <img src={apiOutput.banner_url} alt="" className="h-full w-full object-cover" />
              </div>
            </div>
          )}

          {/* Screenshot Slider Preview */}
          {apiOutput.gallery_images.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Screenshot Gallery (Detail Page)</h4>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {apiOutput.gallery_images.map((img, i) => (
                  <div key={i} className="shrink-0 w-64 rounded-lg overflow-hidden border border-border">
                    <img src={img.url} alt={img.alt} className="h-36 w-full object-cover" />
                    {img.title && <p className="px-2 py-1 text-[10px] text-muted-foreground truncate">{img.title}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Performance badges */}
          <div className="flex items-center gap-3 flex-wrap">
            {apiOutput.lazy_loading && <span className="rounded-full bg-green-500/10 text-green-500 px-2.5 py-1 text-[10px] font-medium">✓ Lazy Loading</span>}
            {apiOutput.cdn_cache_headers && <span className="rounded-full bg-blue-500/10 text-blue-500 px-2.5 py-1 text-[10px] font-medium">✓ CDN Cached</span>}
            <span className="rounded-full bg-purple-500/10 text-purple-500 px-2.5 py-1 text-[10px] font-medium">✓ {apiOutput.total_images} images optimized</span>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminGalleryPage;
