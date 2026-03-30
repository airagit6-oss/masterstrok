import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, CreditCard, ArrowLeft, Shield, Check, Repeat } from 'lucide-react';
import { Navbar } from '@/components/marketplace/Navbar';

const planData: Record<string, { name: string; monthly: number; yearly: number }> = {
  basic: { name: 'Basic', monthly: 29, yearly: 290 },
  pro: { name: 'Pro', monthly: 79, yearly: 790 },
  unlimited: { name: 'Unlimited', monthly: 149, yearly: 1490 },
};

const SubscribeCheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const planKey = searchParams.get('plan') || 'pro';
  const billing = (searchParams.get('billing') || 'yearly') as 'monthly' | 'yearly';
  const plan = planData[planKey] || planData.pro;
  const price = billing === 'monthly' ? plan.monthly : plan.yearly;
  const tax = Math.round(price * 0.1 * 100) / 100;
  const total = Math.round((price + tax) * 100) / 100;

  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', cardNumber: '', expiry: '', cvc: '' });

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const inputCls = "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => navigate('/success'), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-[720px] px-6 pt-24 pb-16">
        <Link to="/subscription" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Plans
        </Link>

        <h1 className="font-display text-2xl font-bold text-foreground mb-2">Subscribe to {plan.name}</h1>
        <p className="text-sm text-muted-foreground mb-8">Complete your subscription below</p>

        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-5">
          {/* Form */}
          <div className="lg:col-span-3 space-y-5">
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-sm font-bold text-foreground mb-3">Your Details</h2>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Full Name</label>
                  <input value={form.name} onChange={update('name')} placeholder="John Doe" className={inputCls} required />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Email</label>
                  <input value={form.email} onChange={update('email')} type="email" placeholder="john@example.com" className={inputCls} required />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-foreground">Payment</h2>
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><Lock className="h-3 w-3" /> Secure</span>
              </div>
              <div className="space-y-3">
                <div className="relative">
                  <label className="mb-1 block text-xs text-muted-foreground">Card Number</label>
                  <input value={form.cardNumber} onChange={update('cardNumber')} placeholder="4242 4242 4242 4242" className={inputCls} required />
                  <CreditCard className="absolute right-3 bottom-2.5 h-4 w-4 text-muted-foreground" />
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
          </div>

          {/* Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-20 space-y-4">
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="text-sm font-bold text-foreground mb-3">Subscription Summary</h3>
                <div className="flex items-center gap-2 rounded-lg bg-secondary p-3 mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15">
                    <Repeat className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{plan.name} Plan</p>
                    <p className="text-[10px] text-muted-foreground capitalize">{billing} billing</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Plan price</span>
                    <span className="text-foreground">${price}/{billing === 'monthly' ? 'mo' : 'yr'}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="text-foreground">${tax}</span>
                  </div>
                </div>
                <div className="mt-3 flex justify-between border-t border-border pt-3">
                  <span className="text-sm font-semibold text-foreground">Total</span>
                  <span className="font-display text-lg font-bold text-foreground">${total}</span>
                </div>
                <p className="mt-2 text-[10px] text-mp-gold flex items-center gap-1">
                  <Repeat className="h-3 w-3" /> Recurring — billed {billing}. Cancel anytime.
                </p>
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
                    <Lock className="h-4 w-4" /> Subscribe — ${total}
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> SSL</span>
                <span className="flex items-center gap-1"><Check className="h-3 w-3" /> 14-day trial</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubscribeCheckoutPage;
