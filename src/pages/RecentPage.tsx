import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { toast } from 'sonner';
import { recent, subscribeUserActivity } from '@/lib/userActivity';
import { products } from '@/lib/marketplaceData';

const RecentPage = () => {
  const [ids, setIds] = useState<string[]>(() => recent.list());

  useEffect(() => subscribeUserActivity(() => setIds(recent.list())), []);

  const items = ids
    .map(id => products.find(p => p.id === id))
    .filter((p): p is (typeof products)[number] => Boolean(p));

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Recently Viewed</h1>
        <div className="flex flex-col items-center py-24 text-center">
          <Clock className="mb-4 h-12 w-12 text-muted-foreground/30" />
          <p className="text-lg font-medium text-foreground">No recent activity</p>
          <p className="mt-1 text-sm text-muted-foreground">Products you view will appear here</p>
          <Link to="/" className="mt-6 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            Explore Apps
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Recently Viewed</h1>
        <button
          onClick={() => { recent.clear(); toast.success('History cleared'); }}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Clear history
        </button>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(p => (
          <Link
            key={p.id}
            to={`/product/${p.id}`}
            className="flex gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary/30"
          >
            <img src={p.thumbnail} alt={p.name} loading="lazy" className="h-20 w-28 shrink-0 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-primary truncate">{p.category}</p>
              <p className="text-sm font-bold text-foreground truncate">{p.name}</p>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{p.shortDescription}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentPage;
