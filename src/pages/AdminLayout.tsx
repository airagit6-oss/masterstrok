import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { BarChart2, Users, ShoppingBag, CreditCard, FileText, AlertCircle, Activity, Settings, LogOut, LayoutDashboard, Server, GitBranch, LayoutGrid, Image } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const adminNav = [
  { to: '/admin', label: 'Overview', icon: BarChart2, end: true },
  { to: '/admin/products', label: 'Products', icon: ShoppingBag, end: false },
  { to: '/admin/users', label: 'Users', icon: Users, end: false },
  { to: '/admin/orders', label: 'Orders', icon: CreditCard, end: false },
  { to: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard, end: false },
  { to: '/admin/revenue', label: 'Revenue', icon: BarChart2, end: false },
  { to: '/admin/logs', label: 'Logs', icon: FileText, end: false },
  { to: '/admin/alerts', label: 'Alerts', icon: AlertCircle, end: false },
  { to: '/admin/apps', label: 'Apps Monitor', icon: Activity, end: false },
  { to: '/admin/infrastructure', label: 'Infrastructure', icon: Server, end: false },
  { to: '/admin/metrics', label: 'Metrics', icon: LayoutDashboard, end: false },
  { to: '/admin/traces', label: 'Traces', icon: GitBranch, end: false },
  { to: '/admin/dashboards', label: 'Dashboards', icon: LayoutGrid, end: false },
  { to: '/admin/gallery', label: 'Gallery', icon: Image, end: false },
  { to: '/admin/settings', label: 'Settings', icon: Settings, end: false },
];

const AdminLayout = () => {
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
          <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/30 px-3 py-2">
            <p className="text-xs font-semibold text-yellow-400 uppercase tracking-wider mb-0.5">👑 Boss Panel</p>
            <p className="truncate text-sm font-medium text-foreground">{user?.name ?? 'Admin'}</p>
          </div>
        </div>
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {adminNav.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`
              }
            >
              <item.icon className="h-3.5 w-3.5 shrink-0" />
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
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
