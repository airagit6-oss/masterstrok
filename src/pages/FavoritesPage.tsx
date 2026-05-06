import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { favorites, subscribeUserActivity } from '@/lib/userActivity';
import { products } from '@/lib/marketplaceData';

const FavoritesPage = () => {
  const [ids, setIds] = useState<string[]>(() => favorites.list());

  useEffect(() => subscribeUserActivity(() => setIds(favorites.list())), []);

  const items = ids
    .map(id => products.find(p => p.id === id))
    .filter((p): p is (typeof products)[number] => Boolean(p));

  const remove = (id: string, name: string) => {
    favorites.remove(id);
    toast.success(`Removed ${name}`);
  };

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Favorites</h1>
        <div className="flex flex-col items-center py-24 text-center">
          <Heart className="mb-4 h-12 w-12 text-muted-foreground/30" />
          <p className="text-lg font-medium text-foreground">No favorites yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Save apps you love by clicking the heart icon</p>
          <Link to="/" className="mt-6 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            Browse Apps
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Favorites</h1>
        <span className="text-sm text-muted-foreground">{items.length} saved</span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(p => (
          <div key={p.id} className="group flex gap-3 rounded-xl border border-border bg-card p-3">
            <Link to={`/product/${p.id}`} className="shrink-0">
              <img src={p.thumbnail} alt={p.name} loading="lazy" className="h-20 w-28 rounded-lg object-cover" />
            </Link>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-primary truncate">{p.category}</p>
              <Link to={`/product/${p.id}`} className="block text-sm font-bold text-foreground truncate hover:underline">
                {p.name}
              </Link>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{p.shortDescription}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-bold text-foreground">${p.price}</span>
                <button
                  onClick={() => remove(p.id, p.name)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                  aria-label={`Remove ${p.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
