import { Link } from 'react-router-dom';
import { ShoppingBag, CreditCard, Heart, Clock, ArrowRight, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const DashboardPage = () => {
  const { user, hasSubscription } = useAuth();

  const quickLinks = [
    { to: '/dashboard/apps', label: 'My Apps', icon: ShoppingBag, desc: 'Access your purchased apps' },
    { to: '/dashboard/orders', label: 'Orders', icon: ShoppingBag, desc: 'View your order history' },
    { to: '/dashboard/subscription', label: 'Subscription', icon: CreditCard, desc: 'Manage your plan' },
    { to: '/dashboard/favorites', label: 'Favorites', icon: Heart, desc: 'Saved items' },
    { to: '/dashboard/recent', label: 'Recent', icon: Clock, desc: 'Recently viewed' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {user?.name ?? 'User'} 👋
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your apps and subscription from your dashboard.
        </p>
      </div>

      {!hasSubscription && (
        <div className="rounded-xl border border-primary/30 bg-primary/10 p-4 flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground">Upgrade to unlock all apps</p>
            <p className="text-sm text-muted-foreground mt-0.5">Get unlimited access to all SaaS products</p>
          </div>
          <Link
            to="/subscription"
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Zap className="h-4 w-4" />
            Upgrade Now
          </Link>
        </div>
      )}

      {hasSubscription && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground">✅ Active Subscription</p>
            <p className="text-sm text-muted-foreground mt-0.5">You have full access to all apps</p>
          </div>
          <Link
            to="/"
            className="flex items-center gap-1.5 rounded-lg bg-card border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors"
          >
            Browse Apps
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map(item => (
          <Link
            key={item.to}
            to={item.to}
            className="rounded-xl border border-border bg-card p-4 hover:bg-accent transition-colors group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <item.icon className="h-4 w-4 text-primary" />
              </div>
              <span className="font-medium text-foreground">{item.label}</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
