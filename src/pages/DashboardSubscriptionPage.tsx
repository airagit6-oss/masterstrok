import { Link } from 'react-router-dom';
import { CreditCard, Zap, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const DashboardSubscriptionPage = () => {
  const { hasSubscription } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Subscription</h1>

      {hasSubscription ? (
        <div className="space-y-4">
          <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-6">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle2 className="h-6 w-6 text-green-400" />
              <h2 className="text-lg font-semibold text-foreground">Pro Plan — Active</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Your subscription is active. You have full access to all apps and features.
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-card border border-border p-3">
                <p className="text-muted-foreground">Next billing</p>
                <p className="font-medium text-foreground mt-0.5">May 1, 2026</p>
              </div>
              <div className="rounded-lg bg-card border border-border p-3">
                <p className="text-muted-foreground">Plan amount</p>
                <p className="font-medium text-foreground mt-0.5">$79 / month</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Cancel Subscription</p>
              <p className="text-sm text-muted-foreground mt-0.5">You'll retain access until the end of your billing period.</p>
            </div>
            <button className="rounded-lg border border-destructive/50 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CreditCard className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">No active subscription</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
            Subscribe to get unlimited access to all SaaS apps on the platform.
          </p>
          <Link
            to="/subscription"
            className="mt-6 flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Zap className="h-4 w-4" />
            View Plans
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardSubscriptionPage;
