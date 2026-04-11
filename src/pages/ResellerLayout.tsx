import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, UserPlus, Kanban, BookUser, CreditCard,
  Package, TrendingUp, Settings, LogOut, ChevronDown, Bell, Search,
  Store, HelpCircle, ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ResellerProvider } from '@/contexts/ResellerContext';
import { useState } from 'react';

const mainNav = [
  { to: '/reseller/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/reseller/leads', label: 'Referrals', icon: UserPlus },
  { to: '/reseller/pipeline', label: 'Pipeline', icon: Kanban },
  { to: '/reseller/contacts', label: 'Clients', icon: BookUser },
  { to: '/reseller/users', label: 'Managed Stores', icon: Store },
  { to: '/reseller/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { to: '/reseller/products', label: 'Apps', icon: Package },
  { to: '/reseller/earnings', label: 'Payouts', icon: TrendingUp },
];

const bottomNav = [
  { to: '/reseller/settings', label: 'Settings', icon: Settings },
];

const ResellerLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);

  const currentPage = [...mainNav, ...bottomNav].find(n => location.pathname.startsWith(n.to));
  const pageTitle = currentPage?.label ?? 'Partner Dashboard';

  return (
    <div className="min-h-screen flex" style={{ background: '#f6f6f7' }}>
      {/* Sidebar - Shopify Partner style */}
      <aside className="w-[240px] shrink-0 flex flex-col" style={{ background: '#1a1a1a' }}>
        {/* Logo */}
        <div className="px-4 py-4">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: '#008060' }}>
              <span className="text-sm font-bold text-white">S</span>
            </div>
            <div>
              <span className="text-[13px] font-semibold text-white block leading-tight">SaaSHub</span>
              <span className="text-[10px] text-white/50 leading-tight">Partner Program</span>
            </div>
          </Link>
        </div>

        {/* Partner Info */}
        <div className="mx-3 mb-2 rounded-lg px-3 py-2.5" style={{ background: '#2a2a2a' }}>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: '#008060' }}>
              {(user?.name ?? 'P')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium text-white truncate">{user?.name ?? 'Partner'}</p>
              <p className="text-[10px] text-white/40 truncate">{user?.email ?? 'partner@example.com'}</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-white/30 shrink-0" />
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          {mainNav.map(item => {
            const isActive = location.pathname.startsWith(item.to);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13px] font-medium transition-all duration-150 ${
                  isActive
                    ? 'text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
                style={isActive ? { background: '#333333' } : {}}
              >
                <item.icon className="h-[16px] w-[16px] shrink-0" style={isActive ? { color: '#008060' } : {}} />
                {item.label}
                {item.label === 'Referrals' && (
                  <span className="ml-auto text-[10px] font-semibold rounded-full px-1.5 py-0.5" style={{ background: '#008060', color: 'white' }}>
                    6
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Nav */}
        <div className="px-3 py-2 space-y-0.5 border-t" style={{ borderColor: '#333' }}>
          {bottomNav.map(item => {
            const isActive = location.pathname.startsWith(item.to);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13px] font-medium transition-all duration-150 ${
                  isActive ? 'text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
                style={isActive ? { background: '#333333' } : {}}
              >
                <item.icon className="h-[16px] w-[16px] shrink-0" />
                {item.label}
              </NavLink>
            );
          })}
          <NavLink
            to="/"
            className="flex items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all duration-150"
          >
            <ExternalLink className="h-[16px] w-[16px] shrink-0" />
            Visit Marketplace
          </NavLink>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13px] font-medium text-white/60 hover:text-red-400 hover:bg-white/5 transition-all duration-150"
          >
            <LogOut className="h-[16px] w-[16px] shrink-0" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-14 shrink-0 flex items-center justify-between px-6 bg-white border-b" style={{ borderColor: '#e1e3e5' }}>
          <div className="flex items-center gap-3">
            <h1 className="text-[15px] font-semibold" style={{ color: '#1a1a1a' }}>{pageTitle}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <Search className="h-4 w-4" style={{ color: '#6d7175' }} />
            </button>
            <button className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors relative">
              <Bell className="h-4 w-4" style={{ color: '#6d7175' }} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full" style={{ background: '#e51c00' }} />
            </button>
            <button className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
              <HelpCircle className="h-4 w-4" style={{ color: '#6d7175' }} />
            </button>
          </div>
        </header>

        {/* Content */}
        <ResellerProvider>
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </ResellerProvider>
      </div>
    </div>
  );
};

export default ResellerLayout;
