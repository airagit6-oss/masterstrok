import { Star, Flag } from 'lucide-react';

const ReviewsPage = () => (
  <div>
    <h1 className="text-2xl font-bold text-foreground mb-1">Reviews</h1>
    <p className="text-sm text-muted-foreground mb-6">Moderate user reviews and ratings.</p>
    <div className="space-y-3">
      {[
        { user: 'Alex M.', product: 'EduFlow Pro', rating: 5, text: 'Best LMS I have used in years. Incredible support team.', flagged: false },
        { user: 'Jenna K.', product: 'ShopEngine', rating: 2, text: 'Slow checkout, missing features.', flagged: true },
        { user: 'Carlos R.', product: 'FactoryOS', rating: 4, text: 'Solid platform for production planning.', flagged: false },
      ].map((r, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-sm font-semibold text-foreground">{r.user} <span className="text-muted-foreground font-normal">on</span> {r.product}</p>
              <div className="flex items-center gap-0.5 mt-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} className={`h-3.5 w-3.5 ${idx < r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} />
                ))}
              </div>
            </div>
            {r.flagged && (
              <span className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-destructive/10 text-destructive">
                <Flag className="h-3 w-3" /> Flagged
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{r.text}</p>
          <div className="flex gap-2 mt-3">
            <button className="text-xs font-medium text-primary hover:underline">Approve</button>
            <button className="text-xs font-medium text-destructive hover:underline">Remove</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);
export default ReviewsPage;
