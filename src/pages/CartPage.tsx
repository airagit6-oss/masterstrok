import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/marketplace/Navbar';
import { useCart } from '@/contexts/CartContext';

const CartPage = () => {
  const { items, removeFromCart, clearCart, totalPrice } = useCart();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-[1440px] px-6 pt-24 pb-12">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-foreground">Shopping Cart ({items.length})</h1>
          <Link to="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Continue Shopping
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="flex h-[40vh] flex-col items-center justify-center">
            <ShoppingBag className="mb-4 h-12 w-12 text-muted-foreground/30" />
            <p className="text-lg text-muted-foreground">Your cart is empty</p>
            <Link to="/" className="mt-4 rounded-lg mp-gradient-bg px-6 py-2 text-sm font-medium text-primary-foreground">
              Browse Apps
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-3">
              {items.map(item => (
                <div key={item.product.id} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
                  <div className="h-16 w-16 flex-shrink-0 rounded-lg" style={{ background: item.product.thumbnail }} />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground">{item.product.name}</h3>
                    <p className="text-xs text-muted-foreground">{item.product.category}</p>
                    <p className="mt-1 text-xs text-primary capitalize">{item.plan} plan</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">
                      ${item.plan === 'monthly' ? item.product.subscription.monthly : item.plan === 'yearly' ? item.product.subscription.yearly : item.product.price}
                    </p>
                    <button onClick={() => removeFromCart(item.product.id)} className="mt-1 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              <button onClick={clearCart} className="text-xs text-muted-foreground hover:text-destructive transition-colors">
                Clear Cart
              </button>
            </div>

            {/* Summary */}
            <div>
              <div className="sticky top-20 rounded-xl border border-border bg-card p-6">
                <h3 className="mb-4 font-display text-lg font-bold text-foreground">Order Summary</h3>
                <div className="space-y-2 border-b border-border pb-4">
                  {items.map(item => (
                    <div key={item.product.id} className="flex justify-between text-xs">
                      <span className="text-muted-foreground truncate mr-2">{item.product.name}</span>
                      <span className="text-foreground font-medium">
                        ${item.plan === 'monthly' ? item.product.subscription.monthly : item.plan === 'yearly' ? item.product.subscription.yearly : item.product.price}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-between">
                  <span className="text-sm font-semibold text-foreground">Total</span>
                  <span className="font-display text-xl font-bold text-foreground">${totalPrice}</span>
                </div>
                <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg mp-gradient-bg py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]">
                  <ShoppingBag className="h-4 w-4" /> Proceed to Checkout
                </button>
                <p className="mt-3 text-center text-[10px] text-muted-foreground">Secure payment · Instant access · 30-day guarantee</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
