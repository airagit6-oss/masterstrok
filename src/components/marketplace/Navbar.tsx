import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, X, Headset, LogIn, LogOut, Users, Menu, Crown, LayoutDashboard } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar = ({ onToggleSidebar }: NavbarProps) => {
  const { totalItems, items, showMiniCart, setShowMiniCart, removeFromCart, totalPrice } = useCart();
  const { isLoggedIn, isAdmin, isReseller, logout } = useAuth();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-6">
          {/* Left: Menu + Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg mp-gradient-bg">
                <span className="text-sm font-bold text-primary-foreground">S</span>
              </div>
              <span className="font-display text-xl font-bold text-foreground hidden sm:inline">SaaSHub</span>
            </Link>
          </div>

          {/* Center: Search */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="flex w-full items-center gap-2 rounded-full bg-secondary px-4 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                placeholder="Search apps, categories, features..."
              />
            </form>
          </div>

          {/* Right */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Search className="h-4 w-4" />
            </button>
            <Link
              to="/reseller-apply"
              className="hidden lg:flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Users className="h-3.5 w-3.5" />
              Reseller Apply
            </Link>
            <Link
              to="/support"
              className="hidden lg:flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Headset className="h-3.5 w-3.5" />
              Support
            </Link>
            <Link
              to="/login"
              className="hidden lg:flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <LogIn className="h-3.5 w-3.5" />
              Login
            </Link>
            <Link
              to="/cart"
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <ShoppingCart className="h-4 w-4" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link
              to={isLoggedIn ? (isAdmin ? '/admin' : '/dashboard') : '/login'}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:text-foreground"
            >
              <User className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Mobile search */}
        {searchOpen && (
          <div className="border-t border-border bg-background px-6 py-3 md:hidden">
            <form onSubmit={handleSearch} className="flex items-center gap-3 rounded-full bg-secondary px-4 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                placeholder="Search apps..."
              />
              <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(''); }}>
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </form>
          </div>
        )}
      </nav>

      {/* Mini Cart Popup */}
      {showMiniCart && totalItems > 0 && (
        <div className="fixed right-6 top-20 z-50 w-80 rounded-xl border border-border bg-card p-4 shadow-2xl">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">Added to Cart</span>
            <button onClick={() => setShowMiniCart(false)}>
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          {items.slice(-3).map(item => (
            <div key={item.product.id} className="mb-2 flex items-center justify-between rounded-lg bg-secondary p-2">
              <div className="flex items-center gap-2">
                <img src={item.product.thumbnail} alt="" className="h-8 w-8 rounded object-cover" />
                <div>
                  <p className="text-xs font-medium text-foreground">{item.product.name}</p>
                  <p className="text-[10px] text-muted-foreground">${item.plan === 'monthly' ? item.product.subscription.monthly + '/mo' : item.plan === 'yearly' ? item.product.subscription.yearly + '/yr' : item.product.price}</p>
                </div>
              </div>
              <button onClick={() => removeFromCart(item.product.id)}>
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            </div>
          ))}
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <span className="text-sm font-semibold text-foreground">${totalPrice}</span>
            <Link
              to="/cart"
              onClick={() => setShowMiniCart(false)}
              className="rounded-lg bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              View Cart
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
