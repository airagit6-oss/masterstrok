import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User, Bell, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { categories } from '@/lib/marketplaceData';

export const Navbar = () => {
  const { totalItems, items, showMiniCart, setShowMiniCart, removeFromCart, totalPrice } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg mp-gradient-bg">
              <span className="text-sm font-bold text-primary-foreground">S</span>
            </div>
            <span className="font-display text-xl font-bold text-foreground">SaaSHub</span>
          </Link>

          {/* Categories - center */}
          <div className="hidden items-center gap-1 lg:flex">
            {categories.map(cat => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Search className="h-4 w-4" />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              <Bell className="h-4 w-4" />
            </button>
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
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:text-foreground">
              <User className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-border bg-background px-6 py-3">
            <div className="mx-auto flex max-w-2xl items-center gap-3 rounded-lg bg-secondary px-4 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                placeholder="Search apps, categories, features..."
              />
              <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }}>
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Mini Cart Popup */}
      {showMiniCart && totalItems > 0 && (
        <div className="fixed right-6 top-20 z-50 w-80 rounded-lg border border-border bg-card p-4 shadow-2xl">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">Added to Cart</span>
            <button onClick={() => setShowMiniCart(false)}>
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          {items.slice(-3).map(item => (
            <div key={item.product.id} className="mb-2 flex items-center justify-between rounded-md bg-secondary p-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded" style={{ background: item.product.thumbnail }} />
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
              className="rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              View Cart
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
