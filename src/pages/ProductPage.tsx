import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, ShoppingBag, Zap, Check, ChevronLeft, ChevronRight, Users, Download } from 'lucide-react';
import { Navbar } from '@/components/marketplace/Navbar';
import { ProductRow } from '@/components/marketplace/ProductRow';
import { products, getReviews } from '@/lib/marketplaceData';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';

const ProductPage = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const { addToCart } = useCart();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | 'lifetime'>('yearly');
  const [screenshotIdx, setScreenshotIdx] = useState(0);
  const reviews = getReviews();

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex h-[60vh] items-center justify-center pt-16">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">Product not found</p>
            <Link to="/" className="mt-4 inline-block text-sm text-primary hover:underline">Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  const related = products.filter(p => p.categorySlug === product.categorySlug && p.id !== product.id);
  const planPrice = selectedPlan === 'monthly' ? product.subscription.monthly : selectedPlan === 'yearly' ? product.subscription.yearly : product.price;
  const planLabel = selectedPlan === 'monthly' ? '/mo' : selectedPlan === 'yearly' ? '/yr' : ' one-time';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Breadcrumb */}
        <div className="mx-auto max-w-[1440px] px-6 py-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span>{product.category}</span>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>

        {/* Main content */}
        <div className="mx-auto max-w-[1440px] px-6 pb-12">
          {/* Top: Title row */}
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="mb-2 inline-block rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
                {product.category}
              </span>
              <h1 className="font-display text-3xl font-bold text-foreground">{product.name}</h1>
              <div className="mt-2 flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? 'fill-mp-gold text-mp-gold' : 'text-muted-foreground/30'}`} />
                  ))}
                  <span className="ml-1 text-sm text-muted-foreground">{product.rating.toFixed(1)} ({product.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" /> {product.users.toLocaleString()} users
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Download className="h-4 w-4" /> {Math.floor(product.users * 1.5).toLocaleString()} installs
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left: Screenshots */}
            <div className="lg:col-span-2">
              <div className="relative overflow-hidden rounded-xl border border-border" style={{ background: product.screenshots[screenshotIdx] }}>
                <div className="flex h-[360px] items-center justify-center">
                  <span className="font-display text-3xl font-bold text-primary-foreground/40">{product.name}</span>
                </div>
                <button onClick={() => setScreenshotIdx(p => (p - 1 + product.screenshots.length) % product.screenshots.length)} className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-background/70 text-foreground backdrop-blur-sm">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button onClick={() => setScreenshotIdx(p => (p + 1) % product.screenshots.length)} className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-background/70 text-foreground backdrop-blur-sm">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 flex gap-2">
                {product.screenshots.map((s, i) => (
                  <button key={i} onClick={() => setScreenshotIdx(i)} className={`h-16 w-24 rounded-md border transition-all ${i === screenshotIdx ? 'border-primary' : 'border-border opacity-60'}`} style={{ background: s }} />
                ))}
              </div>

              {/* Description */}
              <div className="mt-8">
                <h2 className="font-display mb-4 text-xl font-bold text-foreground">Description</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>
              </div>

              {/* Features */}
              <div className="mt-8">
                <h2 className="font-display mb-4 text-xl font-bold text-foreground">Features</h2>
                <div className="grid gap-2 sm:grid-cols-2">
                  {product.features.map(f => (
                    <div key={f} className="flex items-center gap-2 rounded-md bg-secondary p-3">
                      <Check className="h-4 w-4 text-mp-success" />
                      <span className="text-sm text-foreground">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modules */}
              <div className="mt-8">
                <h2 className="font-display mb-4 text-xl font-bold text-foreground">Modules</h2>
                <div className="flex flex-wrap gap-2">
                  {product.modules.map(m => (
                    <span key={m} className="rounded-full border border-border bg-secondary px-4 py-1.5 text-xs font-medium text-secondary-foreground">{m}</span>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div className="mt-8">
                <h2 className="font-display mb-4 text-xl font-bold text-foreground">Reviews</h2>
                <div className="space-y-4">
                  {reviews.map(r => (
                    <div key={r.id} className="rounded-lg border border-border bg-card p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-xs font-bold text-foreground">{r.avatar}</div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{r.user}</p>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-3 w-3 ${i < r.rating ? 'fill-mp-gold text-mp-gold' : 'text-muted-foreground/30'}`} />
                            ))}
                            <span className="ml-2 text-xs text-muted-foreground">{r.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Pricing sidebar */}
            <div>
              <div className="sticky top-20 space-y-4">
                <div className="rounded-xl border border-border bg-card p-6">
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-3xl font-bold text-foreground">${planPrice}</span>
                      <span className="text-sm text-muted-foreground">{planLabel}</span>
                    </div>
                    {selectedPlan === 'lifetime' && product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                    )}
                  </div>

                  {/* Plan selector */}
                  <div className="mb-4 space-y-2">
                    {([['monthly', `$${product.subscription.monthly}/mo`], ['yearly', `$${product.subscription.yearly}/yr`], ['lifetime', `$${product.price} one-time`]] as const).map(([plan, label]) => (
                      <button
                        key={plan}
                        onClick={() => setSelectedPlan(plan)}
                        className={`flex w-full items-center justify-between rounded-lg border p-3 text-sm transition-all ${selectedPlan === plan ? 'border-primary bg-primary/10 text-foreground' : 'border-border text-muted-foreground hover:border-muted-foreground'}`}
                      >
                        <span className="capitalize font-medium">{plan}</span>
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => addToCart(product, selectedPlan)}
                      className="flex w-full items-center justify-center gap-2 rounded-lg mp-gradient-bg py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
                    >
                      <ShoppingBag className="h-4 w-4" /> Buy Now
                    </button>
                    <button
                      onClick={() => addToCart(product, selectedPlan)}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-secondary py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                    >
                      <ShoppingCart className="h-4 w-4" /> Add to Cart
                    </button>
                    <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary/30 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/10">
                      <Zap className="h-4 w-4" /> Access Demo
                    </button>
                  </div>
                </div>

                {/* Quick info */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                  {[
                    ['Last updated', '2 days ago'],
                    ['Version', '4.2.1'],
                    ['License', 'Commercial'],
                    ['Support', '6 months included'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{k}</span>
                      <span className="text-xs font-medium text-foreground">{v}</span>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {product.tags.map(t => (
                    <span key={t} className="rounded-full bg-secondary px-3 py-1 text-[11px] text-secondary-foreground">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-12">
              <ProductRow title="Related Products" products={related} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
