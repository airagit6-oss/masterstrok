import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { TrendingUp, Users, LayoutDashboard, LogOut, UserPlus, Kanban, BookUser, CreditCard, Package, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ResellerProvider } from '@/contexts/ResellerContext';

const resellerNav = [
  { to: '/reseller/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/reseller/leads', label: 'Leads', icon: UserPlus },
  { to: '/reseller/pipeline', label: 'Pipeline', icon: Kanban },
  { to: '/reseller/contacts', label: 'Contacts', icon: BookUser },
  { to: '/reseller/users', label: 'Users', icon: Users },
  { to: '/reseller/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { to: '/reseller/products', label: 'Products', icon: Package },
  { to: '/reseller/earnings', label: 'Earnings', icon: TrendingUp },
  { to: '/reseller/settings', label: 'Settings', icon: Settings },
];

const ResellerLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-56 shrink-0 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg mp-gradient-bg">
              <span className="text-xs font-bold text-primary-foreground">S</span>
            </div>
            <span className="font-display text-base font-bold text-foreground">SaaSHub</span>
          </Link>
        </div>
        <div className="p-3 border-b border-border">
          <div className="rounded-lg bg-secondary px-3 py-2">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-0.5">Reseller</p>
            <p className="truncate text-sm font-medium text-foreground">{user?.name ?? 'Partner'}</p>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {resellerNav.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`
              }
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Logout
          </button>
        </div>
      </aside>
      <ResellerProvider>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </ResellerProvider>
    </div>
  );
};

export default ResellerLayout;
