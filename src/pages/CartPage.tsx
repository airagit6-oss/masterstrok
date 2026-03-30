import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowLeft, Shield, Zap, RotateCcw } from 'lucide-react';
import { Navbar } from '@/components/marketplace/Navbar';
import { useCart } from '@/contexts/CartContext';

const CartPage = () => {
  const { items, removeFromCart, clearCart, totalPrice } = useCart();

  const tax = Math.round(totalPrice * 0.1 * 100) / 100;
  const grandTotal = Math.round((totalPrice + tax) * 100) / 100;

  const getItemPrice = (item: typeof items[0]) =>
    item.plan === 'monthly' ? item.product.subscription.monthly
    : item.plan === 'yearly' ? item.product.subscription.yearly
    : item.product.price;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-[960px] px-6 pt-24 pb-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Your Cart</h1>
            <p className="mt-1 text-sm text-muted-foreground">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
          </div>
          <Link to="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Continue Shopping
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="flex h-[40vh] flex-col items-center justify-center rounded-xl border border-border bg-card">
            <ShoppingBag className="mb-4 h-14 w-14 text-muted-foreground/20" />
            <p className="text-lg font-medium text-foreground">Your cart is empty</p>
            <p className="mt-1 text-sm text-muted-foreground">Add some products to get started</p>
            <Link to="/" className="mt-6 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              Browse Marketplace
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Cart Items */}
            <div className="lg:col-span-3 space-y-3">
              {items.map(item => (
                <div key={item.product.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-border">
                  <img src={item.product.thumbnail} alt={item.product.name} className="h-16 w-16 flex-shrink-0 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground truncate">{item.product.name}</h3>
                    <p className="text-xs text-muted-foreground">{item.product.category}</p>
                    <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary capitalize">{item.plan} plan</span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-base font-bold text-foreground">${getItemPrice(item)}</p>
                    {item.plan !== 'lifetime' && (
                      <p className="text-[10px] text-muted-foreground">/{item.plan === 'monthly' ? 'mo' : 'yr'}</p>
                    )}
                    <button onClick={() => removeFromCart(item.product.id)} className="mt-1 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              {items.length > 1 && (
                <button onClick={clearCart} className="text-xs text-muted-foreground hover:text-destructive transition-colors">
                  Remove all items
                </button>
              )}
            </div>

            {/* Summary Box */}
            <div className="lg:col-span-2">
              <div className="sticky top-20 rounded-xl border border-border bg-card p-6">
                <h3 className="font-display text-base font-bold text-foreground mb-4">Order Summary</h3>
                <div className="space-y-2 border-b border-border pb-4">
                  {items.map(item => (
                    <div key={item.product.id} className="flex justify-between text-xs">
                      <span className="text-muted-foreground truncate mr-2">{item.product.name}</span>
                      <span className="text-foreground font-medium flex-shrink-0">${getItemPrice(item)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">${totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Tax (10%)</span>
                    <span className="text-foreground">${tax}</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-between border-t border-border pt-4">
                  <span className="text-sm font-semibold text-foreground">Total</span>
                  <span className="font-display text-xl font-bold text-foreground">${grandTotal}</span>
                </div>

                <Link
                  to="/checkout"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <ShoppingBag className="h-4 w-4" /> Proceed to Checkout
                </Link>

                <div className="mt-4 space-y-2">
                  {[
                    { icon: Shield, text: 'Secure SSL payment' },
                    { icon: Zap, text: 'Instant digital access' },
                    { icon: RotateCcw, text: '30-day money-back guarantee' },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <Icon className="h-3 w-3" />
                      {text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
