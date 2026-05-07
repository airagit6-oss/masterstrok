import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Pencil, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import {
  listProducts,
  upsertProduct,
  deleteProduct,
  newProductId,
  subscribeProducts,
} from '@/lib/productStore';
import { categories } from '@/lib/marketplaceData';
import type { Product } from '@/lib/marketplaceData';

const emptyDraft = (): Product => ({
  id: newProductId(),
  name: '',
  category: categories[0].name,
  categorySlug: categories[0].slug,
  shortDescription: '',
  description: '',
  price: 0,
  rating: 4.5,
  reviews: 0,
  users: 0,
  thumbnail: '',
  screenshots: [],
  features: [],
  modules: [],
  tags: [],
  status: 'new',
  subscription: { monthly: 0, yearly: 0 },
});

const AdminProductsPage = () => {
  const [items, setItems] = useState<Product[]>(() => listProducts());
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Product | null>(null);

  useEffect(() => {
    document.title = 'Products · Admin';
    return subscribeProducts(() => setItems(listProducts()));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.status.toLowerCase().includes(q),
    );
  }, [items, query]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    if (!editing.name.trim()) {
      toast.error('Name is required');
      return;
    }
    const cat = categories.find(c => c.slug === editing.categorySlug);
    upsertProduct({
      ...editing,
      name: editing.name.trim(),
      category: cat?.name || editing.category,
    });
    toast.success('Product saved');
    setEditing(null);
  };

  const handleDelete = (p: Product) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    deleteProduct(p.id);
    toast.success('Product deleted');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground">{items.length} total · manage catalog inventory</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search products"
              className="pl-8 pr-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground w-56"
            />
          </div>
          <button
            onClick={() => setEditing(emptyDraft())}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Product
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Product</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Category</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Price</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Users</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Rating</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {p.thumbnail && <img src={p.thumbnail} alt={p.name} className="h-8 w-8 rounded object-cover" />}
                    <span className="font-medium text-foreground">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground capitalize">{p.category}</td>
                <td className="px-4 py-3 text-foreground">${p.price}</td>
                <td className="px-4 py-3 text-foreground">{p.users.toLocaleString()}</td>
                <td className="px-4 py-3 text-foreground">⭐ {p.rating.toFixed(1)}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                    p.status === 'trending' ? 'bg-primary/20 text-primary' :
                    p.status === 'new' ? 'bg-green-500/20 text-green-400' :
                    p.status === 'popular' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      to={`/product/${p.id}`}
                      className="p-1.5 rounded hover:bg-accent text-xs text-primary"
                      title="View"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => setEditing({ ...p })}
                      className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={`Edit ${p.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p)}
                      className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      aria-label={`Delete ${p.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  No products match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setEditing(null)}
        >
          <form
            onClick={e => e.stopPropagation()}
            onSubmit={handleSave}
            className="bg-card border border-border rounded-xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-lg font-semibold text-foreground">
              {items.some(i => i.id === editing.id) ? 'Edit product' : 'Add product'}
            </h2>
            <div className="space-y-3">
              <label className="block">
                <span className="text-xs text-muted-foreground">Name</span>
                <input
                  required
                  value={editing.name}
                  onChange={e => setEditing({ ...editing, name: e.target.value })}
                  className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground"
                />
              </label>
              <label className="block">
                <span className="text-xs text-muted-foreground">Short description</span>
                <input
                  value={editing.shortDescription}
                  onChange={e => setEditing({ ...editing, shortDescription: e.target.value })}
                  className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground"
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs text-muted-foreground">Category</span>
                  <select
                    value={editing.categorySlug}
                    onChange={e => setEditing({ ...editing, categorySlug: e.target.value })}
                    className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground"
                  >
                    {categories.map(c => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs text-muted-foreground">Status</span>
                  <select
                    value={editing.status}
                    onChange={e => setEditing({ ...editing, status: e.target.value as Product['status'] })}
                    className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground"
                  >
                    <option value="new">new</option>
                    <option value="trending">trending</option>
                    <option value="popular">popular</option>
                    <option value="featured">featured</option>
                  </select>
                </label>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <label className="block">
                  <span className="text-xs text-muted-foreground">Price ($)</span>
                  <input
                    type="number" min={0}
                    value={editing.price}
                    onChange={e => setEditing({ ...editing, price: Number(e.target.value) })}
                    className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground"
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-muted-foreground">Users</span>
                  <input
                    type="number" min={0}
                    value={editing.users}
                    onChange={e => setEditing({ ...editing, users: Number(e.target.value) })}
                    className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground"
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-muted-foreground">Rating</span>
                  <input
                    type="number" min={0} max={5} step={0.1}
                    value={editing.rating}
                    onChange={e => setEditing({ ...editing, rating: Number(e.target.value) })}
                    className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground"
                  />
                </label>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="px-4 py-2 text-sm rounded-lg border border-border text-foreground hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
