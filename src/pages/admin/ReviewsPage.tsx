import { Star, Flag } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Review { id: number; user: string; product: string; rating: number; text: string; flagged: boolean; status: 'pending' | 'approved' | 'removed'; }

const seed: Review[] = [
  { id: 1, user: 'Alex M.', product: 'EduFlow Pro', rating: 5, text: 'Best LMS I have used in years. Incredible support team.', flagged: false, status: 'pending' },
  { id: 2, user: 'Jenna K.', product: 'ShopEngine', rating: 2, text: 'Slow checkout, missing features.', flagged: true, status: 'pending' },
  { id: 3, user: 'Carlos R.', product: 'FactoryOS', rating: 4, text: 'Solid platform for production planning.', flagged: false, status: 'pending' },
];

const ReviewsPage = () => {
  const [reviews, setReviews] = useState<Review[]>(seed);

  const approve = (id: number) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'approved', flagged: false } : r));
    toast.success('Review approved');
  };
  const remove = (id: number) => {
    if (!window.confirm('Remove this review?')) return;
    setReviews(prev => prev.filter(r => r.id !== id));
    toast.success('Review removed');
  };

  const visible = reviews.filter(r => r.status !== 'removed');

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-1">Reviews</h1>
      <p className="text-sm text-muted-foreground mb-6">Moderate user reviews and ratings.</p>
      <div className="space-y-3">
        {visible.map(r => (
          <div key={r.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-semibold text-foreground">{r.user} <span className="text-muted-foreground font-normal">on</span> {r.product}</p>
                <div className="flex items-center gap-0.5 mt-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className={`h-3.5 w-3.5 ${idx < r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {r.status === 'approved' && (
                  <span className="text-xs px-2 py-1 rounded bg-green-500/10 text-green-500">Approved</span>
                )}
                {r.flagged && (
                  <span className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-destructive/10 text-destructive">
                    <Flag className="h-3 w-3" /> Flagged
                  </span>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{r.text}</p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => approve(r.id)}
                disabled={r.status === 'approved'}
                className="text-xs font-medium text-primary hover:underline disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed"
              >
                {r.status === 'approved' ? 'Approved' : 'Approve'}
              </button>
              <button onClick={() => remove(r.id)} className="text-xs font-medium text-destructive hover:underline">Remove</button>
            </div>
          </div>
        ))}
        {visible.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            No reviews to moderate.
          </div>
        )}
      </div>
    </div>
  );
};
export default ReviewsPage;
