import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  BarChart2, Users, ShoppingBag, CreditCard, FileText, AlertCircle, Activity, Settings,
  LogOut, LayoutDashboard, Server, GitBranch, LayoutGrid, Image, Store, FolderTree,
  Star, Ticket, FileBarChart, Mail,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger,
  SidebarHeader, SidebarFooter, useSidebar,
} from '@/components/ui/sidebar';

const groups = [
  {
    label: 'Overview',
    items: [
      { to: '/admin', label: 'Overview', icon: BarChart2, end: true },
      { to: '/admin/revenue', label: 'Revenue', icon: BarChart2 },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { to: '/admin/products', label: 'Products', icon: ShoppingBag },
      { to: '/admin/categories', label: 'Categories', icon: FolderTree },
      { to: '/admin/gallery', label: 'Gallery', icon: Image },
      { to: '/admin/reviews', label: 'Reviews', icon: Star },
      { to: '/admin/coupons', label: 'Coupons', icon: Ticket },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { to: '/admin/orders', label: 'Orders', icon: CreditCard },
      { to: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
    ],
  },
  {
    label: 'People',
    items: [
      { to: '/admin/users', label: 'Users', icon: Users },
      { to: '/admin/vendors', label: 'Vendors', icon: Store },
    ],
  },
  {
    label: 'Operations',
    items: [
      { to: '/admin/apps', label: 'Apps Monitor', icon: Activity },
      { to: '/admin/infrastructure', label: 'Infrastructure', icon: Server },
      { to: '/admin/metrics', label: 'Metrics', icon: LayoutDashboard },
      { to: '/admin/traces', label: 'Traces', icon: GitBranch },
      { to: '/admin/dashboards', label: 'Dashboards', icon: LayoutGrid },
      { to: '/admin/logs', label: 'Logs', icon: FileText },
      { to: '/admin/alerts', label: 'Alerts', icon: AlertCircle },
    ],
  },
  {
    label: 'Reporting',
    items: [
      { to: '/admin/reports', label: 'Reports', icon: FileBarChart },
      { to: '/admin/email-templates', label: 'Email templates', icon: Mail },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/admin/settings', label: 'Settings', icon: Settings },
    ],
  },
];

const AdminSidebar = () => {
  const { state } = useSidebar();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const collapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-border p-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg mp-gradient-bg">
            <span className="text-xs font-bold text-primary-foreground">S</span>
          </div>
          {!collapsed && <span className="font-display text-base font-bold text-foreground">SaaSHub</span>}
        </Link>
      </SidebarHeader>

      {!collapsed && (
        <div className="p-3 border-b border-border">
          <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/30 px-3 py-2">
            <p className="text-xs font-semibold text-yellow-400 uppercase tracking-wider mb-0.5">👑 Boss Panel</p>
            <p className="truncate text-sm font-medium text-foreground">{user?.name ?? 'Admin'}</p>
          </div>
        </div>
      )}

      <SidebarContent>
        {groups.map(group => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map(item => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild tooltip={item.label}>
                      <NavLink
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) =>
                          `flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                            isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                          }`
                        }
                      >
                        <item.icon className="h-3.5 w-3.5 shrink-0" />
                        <span>{item.label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => { logout(); navigate('/'); }} tooltip="Logout">
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

const AdminLayout = () => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-12 shrink-0 flex items-center border-b border-border bg-card px-2">
          <SidebarTrigger />
          <span className="ml-2 text-sm font-medium text-foreground">Boss Panel</span>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  </SidebarProvider>
);

export default AdminLayout;
