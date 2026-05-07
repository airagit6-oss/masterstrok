import { products as seedProducts, type Product } from './marketplaceData';

const KEY = 'saashub_admin_products_v1';
const EVT = 'saashub:products-changed';

type AdminPatch = Partial<Product> & { __deleted?: boolean };
type Overrides = Record<string, AdminPatch>;

function loadOverrides(): Overrides {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}') as Overrides;
  } catch {
    return {};
  }
}

function saveOverrides(o: Overrides) {
  localStorage.setItem(KEY, JSON.stringify(o));
  window.dispatchEvent(new Event(EVT));
}

export function listProducts(): Product[] {
  const o = loadOverrides();
  const merged: Product[] = [];
  for (const p of seedProducts) {
    const patch = o[p.id];
    if (patch?.__deleted) continue;
    merged.push(patch ? { ...p, ...patch } : p);
  }
  // include net-new products (id not in seed)
  const seedIds = new Set(seedProducts.map(p => p.id));
  for (const [id, patch] of Object.entries(o)) {
    if (seedIds.has(id) || patch.__deleted) continue;
    if (patch.name && patch.category) {
      merged.push({
        id,
        name: patch.name!,
        category: patch.category!,
        categorySlug: patch.categorySlug || 'education',
        shortDescription: patch.shortDescription || '',
        description: patch.description || '',
        price: patch.price ?? 0,
        rating: patch.rating ?? 4.5,
        reviews: patch.reviews ?? 0,
        users: patch.users ?? 0,
        thumbnail: patch.thumbnail || seedProducts[0].thumbnail,
        screenshots: patch.screenshots || [],
        features: patch.features || [],
        modules: patch.modules || [],
        tags: patch.tags || [],
        status: (patch.status as Product['status']) || 'new',
        subscription: patch.subscription || { monthly: 0, yearly: 0 },
      });
    }
  }
  return merged;
}

export function upsertProduct(p: Product) {
  const o = loadOverrides();
  o[p.id] = { ...o[p.id], ...p, __deleted: false };
  saveOverrides(o);
}

export function deleteProduct(id: string) {
  const o = loadOverrides();
  o[id] = { ...(o[id] || {}), __deleted: true };
  saveOverrides(o);
}

export function newProductId() {
  return 'prod-' + Date.now().toString(36);
}

export function subscribeProducts(cb: () => void) {
  const handler = () => cb();
  window.addEventListener(EVT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(EVT, handler);
    window.removeEventListener('storage', handler);
  };
}
