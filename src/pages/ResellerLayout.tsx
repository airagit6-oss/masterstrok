import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { TrendingUp, Users, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const resellerNav = [
  { to: '/reseller/dashboard', label: 'Earnings', icon: TrendingUp },
  { to: '/reseller/users', label: 'Referred Users', icon: Users },
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
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default ResellerLayout;
