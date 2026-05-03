import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star, ShoppingCart, ShoppingBag, Check, ChevronLeft, ChevronRight,
  Users, Download, Heart, Share2, Calendar, Tag, Shield, Code, Globe,
  Monitor, MessageSquare, ThumbsUp, Reply, ExternalLink, Info, FileText
} from 'lucide-react';
import { Navbar } from '@/components/marketplace/Navbar';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';
import { toast } from 'sonner';
import { useProduct, useProductReviews, useRelatedProducts } from '@/hooks/useProduct';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | 'lifetime'>('yearly');
  const [screenshotIdx, setScreenshotIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'features' | 'reviews' | 'comments' | 'support'>('description');
  const [commentText, setCommentText] = useState('');
  const [postedComments, setPostedComments] = useState<Array<{ id: number; user: string; avatar: string; date: string; text: string; replies: any[] }>>([]);
  const [helpful, setHelpful] = useState<Set<number>>(new Set());
  const [wishlisted, setWishlisted] = useState(false);

  const toggleWishlist = () => {
    setWishlisted(v => !v);
    toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };
  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ url, title: document.title });
      else { await navigator.clipboard.writeText(url); toast.success('Link copied'); }
    } catch { /* user cancelled */ }
  };
  const postComment = () => {
    if (!commentText.trim()) { toast.error('Comment cannot be empty'); return; }
    setPostedComments(p => [{ id: Date.now(), user: 'You', avatar: 'YO', date: 'just now', text: commentText.trim(), replies: [] }, ...p]);
    setCommentText('');
    toast.success('Comment posted');
  };
  const toggleHelpful = (id: number) => {
    setHelpful(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const { data: product, isLoading } = useProduct(id);
  const { data: reviews = [] } = useProductReviews(id);
  const { data: related = [] } = useRelatedProducts(id);

  if (isLoading) return null;

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

  const planPrice = selectedPlan === 'monthly' ? product.subscription.monthly : selectedPlan === 'yearly' ? product.subscription.yearly : product.price;
  const planLabel = selectedPlan === 'monthly' ? '/mo' : selectedPlan === 'yearly' ? '/yr' : ' one-time';
  const totalSales = Math.floor(product.users * 1.8);

  // Rating breakdown
  const ratingBreakdown = [
    { stars: 5, pct: 62 },
    { stars: 4, pct: 24 },
    { stars: 3, pct: 9 },
    { stars: 2, pct: 3 },
    { stars: 1, pct: 2 },
  ];

  const comments = [
    { id: 1, user: 'David Kim', avatar: 'DK', date: '3 days ago', text: 'Does this support multi-language?', replies: [{ user: 'SaaSHub Team', avatar: 'ST', date: '2 days ago', text: 'Yes! We support 20+ languages out of the box.' }] },
    { id: 2, user: 'Anna Lopez', avatar: 'AL', date: '1 week ago', text: 'Can I integrate this with Stripe for payments?', replies: [{ user: 'SaaSHub Team', avatar: 'ST', date: '6 days ago', text: 'Absolutely, Stripe integration is included in all plans.' }] },
    { id: 3, user: 'Raj Mehta', avatar: 'RM', date: '2 weeks ago', text: 'Great product! Working perfectly for our team.', replies: [] },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Breadcrumb */}
        <div className="border-b border-border bg-card/50">
          <div className="mx-auto max-w-[1320px] px-6 py-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <span>/</span>
              <Link to={`/category/${product.categorySlug}`} className="hover:text-foreground transition-colors">{product.category}</Link>
              <span>/</span>
              <span className="text-foreground">{product.name}</span>
            </div>
          </div>
        </div>

        {/* ===== TOP HEADER AREA ===== */}
        <div className="border-b border-border bg-card/30">
          <div className="mx-auto max-w-[1320px] px-6 py-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">{product.name}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{product.category}</p>
                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? 'fill-mp-gold text-mp-gold' : 'text-muted-foreground/30'}`} />
                    ))}
                    <span className="ml-1 text-sm font-medium text-foreground">{product.rating.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">({product.reviews} ratings)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Download className="h-4 w-4" />
                    <span>{totalSales.toLocaleString()} Sales</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{product.users.toLocaleString()} Active Users</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">Wishlist</span>
                </button>
                <button className="flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                  <Share2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ===== MAIN 2-COLUMN LAYOUT ===== */}
        <div className="mx-auto max-w-[1320px] px-6 py-8">
          <div className="flex gap-8 flex-col lg:flex-row">

            {/* LEFT SIDE (70%) */}
            <div className="flex-1 min-w-0">
              {/* Product Preview - Main Image */}
              <div className="relative overflow-hidden rounded-xl border border-border bg-card">
                <img
                  src={product.screenshots[screenshotIdx]}
                  alt={`${product.name} preview`}
                  className="w-full h-[420px] object-cover"
                />
                <button
                  onClick={() => setScreenshotIdx(p => (p - 1 + product.screenshots.length) % product.screenshots.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-sm border border-border transition-colors hover:bg-background"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setScreenshotIdx(p => (p + 1) % product.screenshots.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-sm border border-border transition-colors hover:bg-background"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                {/* Image counter */}
                <div className="absolute bottom-3 right-3 rounded-full bg-background/80 px-3 py-1 text-xs text-foreground backdrop-blur-sm">
                  {screenshotIdx + 1} / {product.screenshots.length}
                </div>
              </div>
              {/* Thumbnail strip */}
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {product.screenshots.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setScreenshotIdx(i)}
                    className={`flex-shrink-0 h-16 w-24 rounded-lg border-2 overflow-hidden transition-all ${i === screenshotIdx ? 'border-primary' : 'border-border opacity-60 hover:opacity-80'}`}
                  >
                    <img src={s} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>

              {/* ===== TABBED CONTENT ===== */}
              <div className="mt-8">
                <div className="flex gap-0 border-b border-border overflow-x-auto">
                  {(['description', 'features', 'reviews', 'comments', 'support'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-5 py-3 text-sm font-medium capitalize whitespace-nowrap transition-colors border-b-2 -mb-[1px] ${
                        activeTab === tab
                          ? 'border-primary text-primary'
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="py-6">
                  {/* DESCRIPTION TAB */}
                  {activeTab === 'description' && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-lg font-bold text-foreground mb-3">About {product.name}</h2>
                        <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>
                        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                          With an intuitive interface and powerful backend, {product.name} streamlines operations, reduces manual work, and provides real-time insights. Whether you're a small startup or an enterprise, this solution scales with your needs.
                        </p>
                        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                          Our dedicated team ensures regular updates, security patches, and new feature releases every month. Join thousands of satisfied customers who trust {product.name} for their daily operations.
                        </p>
                      </div>

                      {/* Modules / What's Included */}
                      <div>
                        <h3 className="text-base font-bold text-foreground mb-3">Modules Included</h3>
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          {product.modules.map(m => (
                            <div key={m} className="flex items-center gap-2.5 rounded-lg border border-border bg-card p-3">
                              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                <Code className="h-4 w-4 text-primary" />
                              </div>
                              <span className="text-sm font-medium text-foreground">{m}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Requirements */}
                      <div>
                        <h3 className="text-base font-bold text-foreground mb-3">Requirements</h3>
                        <ul className="space-y-2">
                          {['PHP 8.1+ / Node.js 18+', 'MySQL 8.0+ / PostgreSQL 14+', 'Minimum 2GB RAM, 10GB Storage', 'SSL Certificate (included with hosting)', 'Modern browser (Chrome, Firefox, Safari, Edge)'].map(r => (
                            <li key={r} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <Info className="h-4 w-4 flex-shrink-0 text-primary mt-0.5" />
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Installation Guide */}
                      <div>
                        <h3 className="text-base font-bold text-foreground mb-3">Installation Guide</h3>
                        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                          {[
                            '1. Download the package from your dashboard after purchase',
                            '2. Extract the archive and upload files to your server',
                            '3. Create a database and configure the .env file',
                            '4. Run the installer at yourdomain.com/install',
                            '5. Follow the setup wizard to complete configuration',
                          ].map(step => (
                            <p key={step} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground mt-0.5" />
                              {step}
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* Demo Link */}
                      <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
                        <Globe className="h-5 w-5 text-primary" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">Live Demo Available</p>
                          <p className="text-xs text-muted-foreground">Try before you buy — full demo with sample data</p>
                        </div>
                        <button className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                          <ExternalLink className="h-3.5 w-3.5" />
                          View Demo
                        </button>
                      </div>
                    </div>
                  )}

                  {/* FEATURES TAB */}
                  {activeTab === 'features' && (
                    <div className="space-y-6">
                      <h2 className="text-lg font-bold text-foreground">Key Features</h2>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {product.features.map(f => (
                          <div key={f} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-mp-success/20 mt-0.5">
                              <Check className="h-3.5 w-3.5 text-mp-success" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{f}</p>
                              <p className="mt-1 text-xs text-muted-foreground">Fully integrated and production-ready out of the box.</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-foreground mb-3">Additional Highlights</h3>
                        <ul className="space-y-2">
                          {['Responsive design — works on all devices', 'Dark & light mode support', 'Role-based access control (RBAC)', 'RESTful API with documentation', 'Email notification system', 'Export to PDF, CSV, Excel', 'Multi-language support (20+ languages)', 'Two-factor authentication (2FA)'].map(h => (
                            <li key={h} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                              {h}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* REVIEWS TAB */}
                  {activeTab === 'reviews' && (
                    <div className="space-y-6">
                      {/* Rating breakdown */}
                      <div className="flex flex-col sm:flex-row gap-8">
                        <div className="text-center sm:text-left">
                          <div className="text-5xl font-bold text-foreground">{product.rating.toFixed(1)}</div>
                          <div className="mt-1 flex items-center justify-center sm:justify-start gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? 'fill-mp-gold text-mp-gold' : 'text-muted-foreground/30'}`} />
                            ))}
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{product.reviews} reviews</p>
                        </div>
                        <div className="flex-1 space-y-2">
                          {ratingBreakdown.map(r => (
                            <div key={r.stars} className="flex items-center gap-3">
                              <span className="w-8 text-right text-sm text-muted-foreground">{r.stars}★</span>
                              <div className="flex-1 h-2.5 rounded-full bg-secondary overflow-hidden">
                                <div className="h-full rounded-full bg-mp-gold transition-all" style={{ width: `${r.pct}%` }} />
                              </div>
                              <span className="w-10 text-right text-xs text-muted-foreground">{r.pct}%</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Review list */}
                      <div className="space-y-4">
                        {reviews.map(r => (
                          <div key={r.id} className="rounded-lg border border-border bg-card p-5">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-bold text-foreground">{r.avatar}</div>
                                <div>
                                  <p className="text-sm font-semibold text-foreground">{r.user}</p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <div className="flex items-center gap-0.5">
                                      {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`h-3 w-3 ${i < r.rating ? 'fill-mp-gold text-mp-gold' : 'text-muted-foreground/30'}`} />
                                      ))}
                                    </div>
                                    <span className="text-xs text-muted-foreground">{r.date}</span>
                                  </div>
                                </div>
                              </div>
                              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                                <ThumbsUp className="h-3 w-3" /> Helpful
                              </button>
                            </div>
                            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* COMMENTS TAB */}
                  {activeTab === 'comments' && (
                    <div className="space-y-6">
                      <h2 className="text-lg font-bold text-foreground">Comments ({comments.length})</h2>

                      {/* New comment */}
                      <div className="rounded-lg border border-border bg-card p-4">
                        <textarea
                          value={commentText}
                          onChange={e => setCommentText(e.target.value)}
                          placeholder="Ask a question or leave a comment..."
                          className="w-full resize-none rounded-lg border border-border bg-background p-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                          rows={3}
                        />
                        <div className="mt-2 flex justify-end">
                          <button className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                            Post Comment
                          </button>
                        </div>
                      </div>

                      {/* Comments list */}
                      <div className="space-y-4">
                        {comments.map(c => (
                          <div key={c.id} className="rounded-lg border border-border bg-card p-5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-xs font-bold text-foreground">{c.avatar}</div>
                              <div>
                                <p className="text-sm font-semibold text-foreground">{c.user}</p>
                                <p className="text-xs text-muted-foreground">{c.date}</p>
                              </div>
                            </div>
                            <p className="mt-3 text-sm text-muted-foreground">{c.text}</p>
                            <button className="mt-2 flex items-center gap-1 text-xs text-primary hover:underline">
                              <Reply className="h-3 w-3" /> Reply
                            </button>

                            {/* Replies */}
                            {c.replies.length > 0 && (
                              <div className="mt-3 ml-6 space-y-3 border-l-2 border-border pl-4">
                                {c.replies.map((rep, ri) => (
                                  <div key={ri}>
                                    <div className="flex items-center gap-2">
                                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{rep.avatar}</div>
                                      <div>
                                        <p className="text-xs font-semibold text-foreground">{rep.user}</p>
                                        <p className="text-[10px] text-muted-foreground">{rep.date}</p>
                                      </div>
                                    </div>
                                    <p className="mt-1.5 text-xs text-muted-foreground">{rep.text}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SUPPORT TAB */}
                  {activeTab === 'support' && (
                    <div className="space-y-6">
                      <h2 className="text-lg font-bold text-foreground">Item Support</h2>
                      <div className="rounded-lg border border-border bg-card p-5 space-y-4">
                        <div className="flex items-start gap-3">
                          <Shield className="h-5 w-5 text-mp-success mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-foreground">6 Months Support Included</p>
                            <p className="text-xs text-muted-foreground mt-1">Get direct access to our support team via ticket system. Average response time: under 24 hours.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Monitor className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-foreground">What's Included</p>
                            <ul className="mt-1 space-y-1">
                              {['Availability of the author to answer questions', 'Answering technical questions about item features', 'Assistance with reported bugs and issues', 'Help with included third-party assets'].map(s => (
                                <li key={s} className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Check className="h-3 w-3 text-mp-success" /> {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE — STICKY SIDEBAR (30%) */}
            <div className="w-full lg:w-[360px] flex-shrink-0">
              <div className="sticky top-20 space-y-4">
                {/* Price Box */}
                <div className="rounded-xl border border-border bg-card p-6">
                  <div className="mb-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-3xl font-bold text-foreground">${planPrice}</span>
                      <span className="text-sm text-muted-foreground">{planLabel}</span>
                    </div>
                    {selectedPlan === 'lifetime' && product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                    )}
                  </div>

                  {/* Plan selector */}
                  <div className="mt-4 mb-5 space-y-2">
                    {([['monthly', `$${product.subscription.monthly}/mo`], ['yearly', `$${product.subscription.yearly}/yr — Save 17%`], ['lifetime', `$${product.price} one-time`]] as const).map(([plan, label]) => (
                      <button
                        key={plan}
                        onClick={() => setSelectedPlan(plan)}
                        className={`flex w-full items-center justify-between rounded-lg border p-3 text-sm transition-all ${selectedPlan === plan ? 'border-primary bg-primary/10 text-foreground' : 'border-border text-muted-foreground hover:border-muted-foreground'}`}
                      >
                        <span className="capitalize font-medium">{plan}</span>
                        <span className="text-xs">{label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={() => navigate(`/checkout?productId=${product.id}&plan=${selectedPlan}`)}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      <ShoppingBag className="h-4 w-4" /> Buy Now
                    </button>
                    <button
                      onClick={() => addToCart(product, selectedPlan)}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-border py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                    >
                      <ShoppingCart className="h-4 w-4" /> Add to Cart
                    </button>
                  </div>
                </div>

                {/* Product Meta */}
                <div className="rounded-xl border border-border bg-card p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Item Details</h3>
                  <div className="space-y-3">
                    {[
                      { icon: Calendar, label: 'Last Update', value: '2 days ago' },
                      { icon: Tag, label: 'Version', value: '4.2.1' },
                      { icon: Code, label: 'Framework', value: 'React / Laravel' },
                      { icon: Globe, label: 'Browser', value: 'All Modern Browsers' },
                      { icon: Monitor, label: 'Resolution', value: 'Fully Responsive' },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{label}</span>
                        </div>
                        <span className="text-xs font-medium text-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Author / Seller */}
                <div className="rounded-xl border border-border bg-card p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Author</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">SH</div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">SaaSHub Team</p>
                      <p className="text-xs text-muted-foreground">Elite Author • Power Elite</p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    {[
                      { label: 'Rating', val: '4.9' },
                      { label: 'Sales', val: '12K+' },
                      { label: 'Items', val: '24' },
                    ].map(s => (
                      <div key={s.label} className="rounded-lg bg-secondary p-2">
                        <p className="text-sm font-bold text-foreground">{s.val}</p>
                        <p className="text-[10px] text-muted-foreground">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-border py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                    <MessageSquare className="h-3.5 w-3.5" /> Contact Author
                  </button>
                </div>

                {/* Tags */}
                <div className="rounded-xl border border-border bg-card p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {[...product.tags, 'admin panel', 'dashboard', 'web app', 'responsive'].map(t => (
                      <span key={t} className="rounded-full bg-secondary px-3 py-1 text-[11px] text-secondary-foreground hover:bg-accent cursor-pointer transition-colors">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== RELATED PRODUCTS ===== */}
          {related.length > 0 && (
            <div className="mt-12 border-t border-border pt-8">
              <h2 className="font-display text-xl font-bold text-foreground mb-6">Related Products</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {related.map(p => (
                  <Link
                    key={p.id}
                    to={`/product/${p.id}`}
                    className="group rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-primary/30 hover:shadow-lg"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img src={p.thumbnail} alt={p.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-foreground truncate">{p.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{p.category}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-mp-gold text-mp-gold" />
                          <span className="text-xs text-foreground">{p.rating.toFixed(1)}</span>
                        </div>
                        <span className="text-sm font-bold text-foreground">${p.price}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
