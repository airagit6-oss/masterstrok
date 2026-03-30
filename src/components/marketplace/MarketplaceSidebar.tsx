import { Link, useLocation } from 'react-router-dom';
import { Home, Grid3X3, AppWindow, Heart, Clock, CreditCard, ChevronLeft } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
}

const menuItems = [
  { label: 'Home', icon: Home, path: '/' },
  { label: 'Categories', icon: Grid3X3, path: '/categories' },
  { label: 'My Apps', icon: AppWindow, path: '/my-apps' },
  { label: 'Favorites', icon: Heart, path: '/favorites' },
  { label: 'Recently Used', icon: Clock, path: '/recent' },
  { label: 'Subscriptions', icon: CreditCard, path: '/subscriptions' },
];

export const MarketplaceSidebar = ({ open, onClose }: Props) => {
  const location = useLocation();

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] border-r border-border bg-background transition-all duration-300 ${
          open ? 'w-56' : 'w-0 lg:w-16'
        } overflow-hidden`}
      >
        <div className="flex h-full flex-col py-4">
          {/* Collapse button (desktop) */}
          <button
            onClick={onClose}
            className={`mx-auto mb-4 hidden lg:flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground ${
              open ? '' : 'rotate-180'
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Menu */}
          <nav className="flex-1 space-y-1 px-2">
            {menuItems.map(item => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    active
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  } ${!open ? 'justify-center lg:justify-center' : ''}`}
                >
                  <item.icon className="h-4.5 w-4.5 flex-shrink-0" />
                  {open && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};
