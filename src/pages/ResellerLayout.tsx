import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, UserPlus, Kanban, BookUser, CreditCard,
  Package, TrendingUp, Settings, LogOut, Bell, Search,
  Store, HelpCircle, ExternalLink, Percent, FileBarChart, Megaphone, History,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ResellerProvider } from '@/contexts/ResellerContext';
import { useState } from 'react';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger,
  SidebarHeader, SidebarFooter, useSidebar,
} from '@/components/ui/sidebar';

const groups = [
  {
    label: 'Overview',
    items: [
      { to: '/reseller/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Sales',
    items: [
      { to: '/reseller/leads', label: 'Referrals', icon: UserPlus, badge: '6' },
      { to: '/reseller/pipeline', label: 'Pipeline', icon: Kanban },
      { to: '/reseller/contacts', label: 'Clients', icon: BookUser },
    ],
  },
  {
    label: 'Business',
    items: [
      { to: '/reseller/users', label: 'Managed Stores', icon: Store },
      { to: '/reseller/subscriptions', label: 'Subscriptions', icon: CreditCard },
      { to: '/reseller/products', label: 'Apps', icon: Package },
    ],
  },
  {
    label: 'Earnings',
    items: [
      { to: '/reseller/earnings', label: 'Payouts', icon: TrendingUp },
      { to: '/reseller/commissions', label: 'Commissions', icon: Percent },
      { to: '/reseller/payouts-history', label: 'Payout history', icon: History },
    ],
  },
  {
    label: 'Resources',
    items: [
      { to: '/reseller/marketing', label: 'Marketing assets', icon: Megaphone },
      { to: '/reseller/reports', label: 'Reports', icon: FileBarChart },
    ],
  },
  {
    label: 'Account',
    items: [
      { to: '/reseller/settings', label: 'Settings', icon: Settings },
    ],
  },
];

const allItems = groups.flatMap(g => g.items);

const ResellerSidebar = () => {
  const { state } = useSidebar();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const collapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <div className="flex flex-col h-full" style={{ background: '#1a1a1a' }}>
        <SidebarHeader className="px-4 py-4">
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: '#008060' }}>
              <span className="text-sm font-bold text-white">S</span>
            </div>
            {!collapsed && (
              <div>
                <span className="text-[13px] font-semibold text-white block leading-tight">SaaSHub</span>
                <span className="text-[10px] text-white/50 leading-tight">Partner Program</span>
              </div>
            )}
          </NavLink>
        </SidebarHeader>

        {!collapsed && (
          <div className="mx-3 mb-2 rounded-lg px-3 py-2.5" style={{ background: '#2a2a2a' }}>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: '#008060' }}>
                {(user?.name ?? 'P')[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-white truncate">{user?.name ?? 'Partner'}</p>
                <p className="text-[10px] text-white/40 truncate">{user?.email ?? 'partner@example.com'}</p>
              </div>
            </div>
          </div>
        )}

        <SidebarContent className="px-2">
          {groups.map(group => (
            <SidebarGroup key={group.label}>
              {!collapsed && (
                <SidebarGroupLabel className="text-white/40 text-[10px] uppercase tracking-wider px-3 mb-1">
                  {group.label}
                </SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map(item => (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton asChild tooltip={item.label}>
                        <NavLink
                          to={item.to}
                          className={({ isActive }) =>
                            `flex items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13px] font-medium transition-all ${
                              isActive ? 'text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                            }`
                          }
                          style={({ isActive }) => isActive ? { background: '#333333' } : {}}
                        >
                          {({ isActive }: { isActive: boolean }) => (
                            <>
                              <item.icon className="h-[16px] w-[16px] shrink-0" style={isActive ? { color: '#008060' } : {}} />
                              <span>{item.label}</span>
                              {'badge' in item && item.badge && !collapsed && (
                                <span className="ml-auto text-[10px] font-semibold rounded-full px-1.5 py-0.5" style={{ background: '#008060', color: 'white' }}>
                                  {item.badge}
                                </span>
                              )}
                            </>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter className="border-t p-2 space-y-0.5" style={{ borderColor: '#333' }}>
          <NavLink
            to="/"
            className="flex items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
          >
            <ExternalLink className="h-[16px] w-[16px] shrink-0" />
            {!collapsed && <span>Visit Marketplace</span>}
          </NavLink>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13px] font-medium text-white/60 hover:text-red-400 hover:bg-white/5 transition-all"
          >
            <LogOut className="h-[16px] w-[16px] shrink-0" />
            {!collapsed && <span>Log out</span>}
          </button>
        </SidebarFooter>
      </div>
    </Sidebar>
  );
};

const ResellerLayout = () => {
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const currentPage = allItems.find(n => location.pathname.startsWith(n.to));
  const pageTitle = currentPage?.label ?? 'Partner Dashboard';

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full" style={{ background: '#f6f6f7' }}>
        <ResellerSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 shrink-0 flex items-center justify-between px-4 bg-white border-b" style={{ borderColor: '#e1e3e5' }}>
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <h1 className="text-[15px] font-semibold" style={{ color: '#1a1a1a' }}>{pageTitle}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setSearchOpen(!searchOpen)} className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
                <Search className="h-4 w-4" style={{ color: '#6d7175' }} />
              </button>
              <button onClick={() => navigate('/dashboard/notifications')} className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors relative" aria-label="Notifications">
                <Bell className="h-4 w-4" style={{ color: '#6d7175' }} />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full" style={{ background: '#e51c00' }} />
              </button>
              <button onClick={() => window.open('https://docs.lovable.dev', '_blank', 'noopener')} className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors" aria-label="Help">
                <HelpCircle className="h-4 w-4" style={{ color: '#6d7175' }} />
              </button>
            </div>
          </header>
          <ResellerProvider>
            <main className="flex-1 overflow-auto p-6">
              <Outlet />
            </main>
          </ResellerProvider>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ResellerLayout;
