import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, CreditCard, ArrowLeft, Shield, Check } from 'lucide-react';
import { Navbar } from '@/components/marketplace/Navbar';
import { useCart } from '@/contexts/CartContext';
import { fetchProduct } from '@/lib/api';
import type { CartItem } from '@/contexts/CartContext';

const VALID_PLANS = new Set<CartItem['plan']>(['monthly', 'yearly', 'lifetime']);
function toValidPlan(value: string | null): CartItem['plan'] {
  return (value && VALID_PLANS.has(value as CartItem['plan'])) ? (value as CartItem['plan']) : 'lifetime';
}

const CheckoutPage = () => {
  const { items, totalPrice, clearCart, addToCart } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const directProductId = searchParams.get('productId');
  const directPlan = toValidPlan(searchParams.get('plan'));
  const hasAutoAdded = useRef(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (directProductId && items.length === 0 && !hasAutoAdded.current) {
      hasAutoAdded.current = true;
      fetchProduct(directProductId)
        .then(product => addToCart(product, directPlan))
        .catch(() => {});
    }
  }, [directProductId, directPlan, items.length, addToCart]);

  const [form, setForm] = useState({
    name: '', email: '',
    cardNumber: '', expiry: '', cvc: '',
    country: '', address: '', city: '', zip: '',
  });

  const tax = Math.round(totalPrice * 0.1 * 100) / 100;
  const grandTotal = Math.round((totalPrice + tax) * 100) / 100;

  const getItemPrice = (item: typeof items[0]) =>
    item.plan === 'monthly' ? item.product.subscription.monthly
    : item.plan === 'yearly' ? item.product.subscription.yearly
    : item.product.price;

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      clearCart();
      navigate('/success');
    }, 2000);
  };

  if (items.length === 0 && !directProductId) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex h-[60vh] flex-col items-center justify-center pt-16">
          <p className="text-lg text-muted-foreground">Your cart is empty</p>
          <Link to="/" className="mt-4 text-sm text-primary hover:underline">Back to Marketplace</Link>
        </div>
      </div>
    );
  }

  const inputCls = "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-[960px] px-6 pt-24 pb-16">
        <Link to="/cart" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Cart
        </Link>

        <h1 className="font-display text-2xl font-bold text-foreground mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-5">
          {/* Left — Form */}
          <div className="lg:col-span-3 space-y-6">
            {/* User Info */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-sm font-bold text-foreground mb-4">Contact Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Full Name</label>
                  <input value={form.name} onChange={update('name')} placeholder="John Doe" className={inputCls} required />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Email Address</label>
                  <input value={form.email} onChange={update('email')} type="email" placeholder="john@example.com" className={inputCls} required />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-foreground">Payment Details</h2>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Lock className="h-3 w-3" /> Encrypted & Secure
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Card Number</label>
                  <div className="relative">
                    <input value={form.cardNumber} onChange={update('cardNumber')} placeholder="4242 4242 4242 4242" className={inputCls} required />
                    <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">Expiry</label>
                    <input value={form.expiry} onChange={update('expiry')} placeholder="MM / YY" className={inputCls} required />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">CVC</label>
                    <input value={form.cvc} onChange={update('cvc')} placeholder="123" className={inputCls} required />
                  </div>
                </div>
              </div>
            </div>

            {/* Billing */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-sm font-bold text-foreground mb-4">Billing Address <span className="text-muted-foreground font-normal">(Optional)</span></h2>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Country</label>
                  <input value={form.country} onChange={update('country')} placeholder="United States" className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Street Address</label>
                  <input value={form.address} onChange={update('address')} placeholder="123 Main St" className={inputCls} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">City</label>
                    <input value={form.city} onChange={update('city')} placeholder="New York" className={inputCls} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">ZIP Code</label>
                    <input value={form.zip} onChange={update('zip')} placeholder="10001" className={inputCls} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Order Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-20 space-y-4">
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-sm font-bold text-foreground mb-4">Order Summary</h3>
                <div className="space-y-3 border-b border-border pb-4">
                  {items.map(item => (
                    <div key={item.product.id} className="flex items-center gap-3">
                      <img src={item.product.thumbnail} alt="" className="h-10 w-10 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{item.product.name}</p>
                        <p className="text-[10px] text-muted-foreground capitalize">{item.plan} plan</p>
                      </div>
                      <span className="text-xs font-bold text-foreground flex-shrink-0">${getItemPrice(item)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">${totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="text-foreground">${tax}</span>
                  </div>
                </div>
                <div className="mt-3 flex justify-between border-t border-border pt-3">
                  <span className="text-sm font-semibold text-foreground">Total</span>
                  <span className="font-display text-xl font-bold text-foreground">${grandTotal}</span>
                </div>

                {items.some(i => i.plan !== 'lifetime') && (
                  <p className="mt-2 text-[10px] text-mp-gold">
                    ⚡ Includes recurring subscription — cancel anytime
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={processing}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
              >
                {processing ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" /> Pay ${grandTotal}
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> SSL Secured</span>
                <span className="flex items-center gap-1"><Check className="h-3 w-3" /> 30-day guarantee</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
