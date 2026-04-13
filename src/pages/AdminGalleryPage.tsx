import { useState, useRef, useCallback } from 'react';
import {
  Upload, X, GripVertical, Star, Eye, Trash2, Image as ImageIcon, Film,
  Settings, Check, AlertTriangle, Replace, Plus, ChevronDown, Save,
  Monitor, Smartphone, Layout, Download
} from 'lucide-react';
import { products as marketplaceProducts } from '@/lib/marketplaceData';
import {
  useGallery, type MediaCategory, type GalleryMedia,
  categoryLabels, categoryDescriptions,
  readFileAsDataUrl, compressImage, getImageDimensions, validateFile,
  generateThumbnail, getGalleryOutput, type GallerySettings
} from '@/lib/galleryManager';

const categories: MediaCategory[] = ['thumbnail', 'banner', 'screenshot', 'demo', 'extra'];

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
  const [showPreview, setShowPreview] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replaceTarget, setReplaceTarget] = useState<string | null>(null);
  const [localSettings, setLocalSettings] = useState<GallerySettings>(gallery.settings);

  const selectedProduct = marketplaceProducts.find(p => p.id === selectedProductId);
  const galleryProduct = gallery.getProduct(selectedProductId);
  const currentMedia = (galleryProduct?.media ?? [])
    .filter(m => m.category === activeCategory)
    .sort((a, b) => a.orderIndex - b.orderIndex);
  const allMedia = galleryProduct?.media ?? [];

  // ========== UPLOAD ==========
  const handleFiles = async (files: FileList) => {
    if (!selectedProduct) return;
    setUploading(true);
    const newMedia: Parameters<typeof gallery.addMedia>[2] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const err = validateFile(file, gallery.settings);
      if (err) { alert(err); continue; }

      const progressKey = file.name;
      setUploadProgress(p => ({ ...p, [progressKey]: 10 }));

      let url: string;
      if (file.type.startsWith('image/') && gallery.settings.autoCompress) {
        setUploadProgress(p => ({ ...p, [progressKey]: 40 }));
        url = await compressImage(file);
      } else {
        url = await readFileAsDataUrl(file);
      }
      setUploadProgress(p => ({ ...p, [progressKey]: 80 }));

      const dims = file.type.startsWith('image/') ? await getImageDimensions(url) : { width: 0, height: 0 };

      newMedia.push({
        productId: selectedProductId,
        category: activeCategory,
        url,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        width: dims.width,
        height: dims.height,
        title: file.name.replace(/\.[^.]+$/, ''),
        altText: '',
        caption: '',
        isFeatured: false,
        videoUrl: file.type.startsWith('video/') ? url : undefined,
      });
      setUploadProgress(p => ({ ...p, [progressKey]: 100 }));
    }

    if (newMedia.length > 0) {
      gallery.addMedia(selectedProductId, selectedProduct.name, newMedia);
    }

    setTimeout(() => { setUploadProgress({}); setUploading(false); }, 500);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverZone(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  };

  const handleVideoUrl = () => {
    if (!videoUrlInput.trim() || !selectedProduct) return;
    gallery.addMedia(selectedProductId, selectedProduct.name, [{
      productId: selectedProductId,
      category: 'demo',
      url: videoUrlInput,
      fileName: 'Video Link',
      fileSize: 0,
      fileType: 'video/url',
      title: 'Demo Video',
      altText: '',
      caption: '',
      isFeatured: false,
      videoUrl: videoUrlInput,
    }]);
    setVideoUrlInput('');
  };

  // ========== REPLACE ==========
  const handleReplace = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !replaceTarget) return;
    const file = e.target.files[0];
    const url = gallery.settings.autoCompress ? await compressImage(file) : await readFileAsDataUrl(file);
    gallery.replaceMedia(selectedProductId, replaceTarget, url, file.name, file.size);
    setReplaceTarget(null);
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
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const bulkDelete = () => {
    if (selectedIds.size === 0) return;
    gallery.removeMedia(selectedProductId, Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  // ========== API OUTPUT ==========
  const apiOutput = getGalleryOutput(allMedia);

  const catCount = (cat: MediaCategory) => (galleryProduct?.media ?? []).filter(m => m.category === cat).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Product Gallery</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage product media, screenshots, banners, and demo videos</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowPreview(true)} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent transition-colors">
            <Eye className="h-4 w-4" /> Preview API
          </button>
          <button onClick={() => setShowSettings(true)} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent transition-colors">
            <Settings className="h-4 w-4" /> Settings
          </button>
        </div>
      </div>

      {/* Product Selector */}
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-sm">
          <label className="block text-xs font-medium text-muted-foreground mb-1">Select Product</label>
          <select
            value={selectedProductId}
            onChange={e => { setSelectedProductId(e.target.value); setSelectedIds(new Set()); }}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {marketplaceProducts.map(p => (
              <option key={p.id} value={p.id}>{p.name} — {p.category}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 mt-5">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setSelectedIds(new Set()); }}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:bg-accent'
              }`}
            >
              {categoryLabels[cat]}
              {catCount(cat) > 0 && <span className="ml-1 opacity-70">({catCount(cat)})</span>}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">{categoryDescriptions[activeCategory]}</p>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOverZone(true); }}
        onDragLeave={() => setDragOverZone(false)}
        onDrop={handleDrop}
        className={`rounded-xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
          dragOverZone ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={gallery.settings.allowedFormats.join(',')}
          onChange={e => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
        <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">Drop files here or click to upload</p>
        <p className="text-xs text-muted-foreground mt-1">
          JPG, PNG, WEBP, GIF, MP4 · Max {gallery.settings.maxFileSizeMb}MB · Max {gallery.settings.maxImagesPerProduct} files
        </p>

        {/* Upload Progress */}
        {Object.entries(uploadProgress).length > 0 && (
          <div className="mt-4 space-y-2 max-w-sm mx-auto">
            {Object.entries(uploadProgress).map(([name, pct]) => (
              <div key={name} className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground truncate w-32">{name}</span>
                <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs text-muted-foreground">{pct}%</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video URL input for Demo category */}
      {activeCategory === 'demo' && (
        <div className="flex items-center gap-2">
          <Film className="h-4 w-4 text-muted-foreground" />
          <input
            value={videoUrlInput}
            onChange={e => setVideoUrlInput(e.target.value)}
            placeholder="Paste YouTube / Vimeo URL..."
            className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button onClick={handleVideoUrl} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Add Video
          </button>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2">
          <span className="text-sm font-medium text-foreground">{selectedIds.size} selected</span>
          <button onClick={bulkDelete} className="flex items-center gap-1 rounded-lg bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground hover:bg-destructive/90">
            <Trash2 className="h-3 w-3" /> Delete Selected
          </button>
          <button onClick={() => setSelectedIds(new Set())} className="text-xs text-muted-foreground hover:text-foreground">Clear</button>
        </div>
      )}

      {/* Media Grid with Drag Reorder */}
      {currentMedia.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <ImageIcon className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No {categoryLabels[activeCategory].toLowerCase()} uploaded yet</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {currentMedia.map(media => (
            <div
              key={media.id}
              draggable
              onDragStart={() => handleSortDragStart(media.id)}
              onDragOver={(e) => handleSortDragOver(e, media.id)}
              onDrop={() => handleSortDrop(media.id)}
              className={`group relative rounded-xl border overflow-hidden transition-all cursor-grab active:cursor-grabbing ${
                dragOverItem === media.id ? 'border-primary ring-2 ring-primary/30 scale-[1.02]' : 'border-border'
              } ${selectedIds.has(media.id) ? 'ring-2 ring-primary' : ''} ${
                media.status === 'rejected' ? 'opacity-50' : ''
              }`}
            >
              {/* Select Checkbox */}
              <button
                onClick={() => toggleSelect(media.id)}
                className={`absolute top-2 left-2 z-10 h-5 w-5 rounded border flex items-center justify-center transition-colors ${
                  selectedIds.has(media.id) ? 'bg-primary border-primary text-primary-foreground' : 'border-white/50 bg-black/30 text-transparent hover:border-white'
                }`}
              >
                <Check className="h-3 w-3" />
              </button>

              {/* Featured badge */}
              {media.isFeatured && (
                <span className="absolute top-2 right-2 z-10 rounded-full bg-mp-gold px-2 py-0.5 text-[10px] font-bold text-black">★ FEATURED</span>
              )}

              {/* Status badge */}
              {media.status === 'pending' && (
                <span className="absolute top-2 right-2 z-10 rounded-full bg-yellow-500/90 px-2 py-0.5 text-[10px] font-bold text-black">PENDING</span>
              )}
              {media.status === 'rejected' && (
                <span className="absolute top-2 right-2 z-10 rounded-full bg-destructive px-2 py-0.5 text-[10px] font-bold text-white">REJECTED</span>
              )}

              {/* Image / Video */}
              {media.fileType.startsWith('video/') || media.videoUrl ? (
                <div className="relative h-36 bg-secondary flex items-center justify-center">
                  <Film className="h-8 w-8 text-muted-foreground" />
                  <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1 text-[9px] text-white">VIDEO</span>
                </div>
              ) : (
                <div className="relative h-36 bg-secondary">
                  <img src={media.url} alt={media.altText || media.title} className="h-full w-full object-cover" loading="lazy" />
                  {/* Drag grip */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="h-4 w-4 text-white drop-shadow" />
                  </div>
                </div>
              )}

              {/* Info */}
              <div className="p-2.5 bg-card">
                <p className="text-xs font-medium text-foreground truncate">{media.title || media.fileName}</p>
                <p className="text-[10px] text-muted-foreground">{(media.fileSize / 1024).toFixed(0)}KB{media.width ? ` · ${media.width}×${media.height}` : ''}</p>

                {/* Actions */}
                <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => gallery.setFeatured(selectedProductId, media.id)} title="Set Featured" className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-mp-gold transition-colors">
                    <Star className="h-3 w-3" />
                  </button>
                  <button onClick={() => setEditMedia(media)} title="Edit" className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                    <Eye className="h-3 w-3" />
                  </button>
                  <button onClick={() => { setReplaceTarget(media.id); replaceInputRef.current?.click(); }} title="Replace" className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                    <Replace className="h-3 w-3" />
                  </button>
                  <button onClick={() => gallery.moderateMedia(selectedProductId, media.id, media.status === 'approved' ? 'rejected' : 'approved')} title="Moderate" className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                    {media.status === 'approved' ? <AlertTriangle className="h-3 w-3" /> : <Check className="h-3 w-3" />}
                  </button>
                  <button onClick={() => gallery.removeMedia(selectedProductId, [media.id])} title="Delete" className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-destructive transition-colors">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hidden replace input */}
      <input ref={replaceInputRef} type="file" accept="image/*" onChange={handleReplace} className="hidden" />

      {/* ===== EDIT MODAL ===== */}
      {editMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Edit Media Details</h2>
              <button onClick={() => setEditMedia(null)}><X className="h-5 w-5 text-muted-foreground" /></button>
            </div>
            {editMedia.url && !editMedia.videoUrl && (
              <img src={editMedia.url} alt="" className="w-full h-48 object-cover rounded-lg mb-4" />
            )}
            <div className="space-y-3">
              {[
                { label: 'Title', key: 'title', placeholder: 'Image title' },
                { label: 'Alt Text (SEO)', key: 'altText', placeholder: 'Describe this image for accessibility' },
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
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => { gallery.updateMedia(selectedProductId, editMedia.id, editMedia); setEditMedia(null); }}
                className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Save className="h-4 w-4 inline mr-1" /> Save
              </button>
              <button onClick={() => setEditMedia(null)} className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== SETTINGS MODAL ===== */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Gallery Settings</h2>
              <button onClick={() => setShowSettings(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Max Images/Product</label>
                  <input type="number" value={localSettings.maxImagesPerProduct} onChange={e => setLocalSettings(s => ({ ...s, maxImagesPerProduct: +e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Max File Size (MB)</label>
                  <input type="number" value={localSettings.maxFileSizeMb} onChange={e => setLocalSettings(s => ({ ...s, maxFileSizeMb: +e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
              </div>
              {[
                { key: 'autoCompress', label: 'Auto Compress', desc: 'Compress images on upload' },
                { key: 'autoWebp', label: 'Auto WebP', desc: 'Convert to WebP format' },
                { key: 'watermarkEnabled', label: 'Watermark', desc: 'Add watermark to images' },
                { key: 'requireApproval', label: 'Require Approval', desc: 'New uploads need admin approval' },
              ].map(t => (
                <div key={t.key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{t.label}</p>
                    <p className="text-xs text-muted-foreground">{t.desc}</p>
                  </div>
                  <button
                    onClick={() => setLocalSettings(s => ({ ...s, [t.key]: !(s as any)[t.key] }))}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${(localSettings as any)[t.key] ? 'bg-primary' : 'bg-secondary'}`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${(localSettings as any)[t.key] ? 'translate-x-4' : 'translate-x-1'}`} />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={() => { gallery.updateSettings(localSettings); setShowSettings(false); }} className="mt-5 w-full rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Save Settings
            </button>
          </div>
        </div>
      )}

      {/* ===== API PREVIEW MODAL ===== */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">API Output Preview</h2>
              <button onClick={() => setShowPreview(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
            </div>
            <pre className="rounded-lg bg-secondary p-4 text-xs text-foreground font-mono overflow-auto max-h-[60vh] whitespace-pre-wrap">
              {JSON.stringify(apiOutput, null, 2)}
            </pre>
            <p className="mt-3 text-xs text-muted-foreground">This is the structured output for frontend consumption (Netflix-style sliders, product cards, detail pages).</p>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-5 gap-3">
        {categories.map(cat => {
          const count = catCount(cat);
          const approved = (galleryProduct?.media ?? []).filter(m => m.category === cat && m.status === 'approved').length;
          return (
            <div key={cat} className="rounded-xl border border-border bg-card p-3">
              <p className="text-xs text-muted-foreground">{categoryLabels[cat]}</p>
              <p className="text-lg font-bold text-foreground mt-0.5">{count}</p>
              <p className="text-[10px] text-muted-foreground">{approved} approved</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminGalleryPage;
