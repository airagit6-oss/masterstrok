import { useParams, Link } from 'react-router-dom';
import { products } from '@/lib/marketplaceData';
import { ExternalLink, ArrowLeft, Zap } from 'lucide-react';

const AppAccessPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const product = products.find(p => p.id === productId);

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">App Not Found</h1>
          <p className="text-muted-foreground mb-6">The app you're looking for doesn't exist.</p>
          <Link to="/dashboard/apps" className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            My Apps
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* App Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex h-12 items-center justify-between border-b border-border bg-card px-4">
        <div className="flex items-center gap-3">
          <Link to="/dashboard/apps" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <span className="text-border">/</span>
          <span className="text-sm font-medium text-foreground">{product.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-green-500/20 px-3 py-0.5 text-xs font-medium text-green-400">
            <Zap className="h-3 w-3" />
            Live
          </span>
          <a
            href={`/product/${product.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Open in new tab
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </header>

      {/* App iframe area */}
      <div className="pt-12 flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center bg-secondary/30 m-4 rounded-xl border border-border min-h-[80vh]">
          <div className="text-center px-6">
            <img
              src={product.thumbnail}
              alt={product.name}
              className="mx-auto mb-6 h-20 w-20 rounded-2xl object-cover shadow-lg"
            />
            <h2 className="text-2xl font-bold text-foreground mb-2">{product.name}</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">{product.shortDescription}</p>
            <div className="inline-flex items-center gap-2 rounded-lg bg-primary/10 border border-primary/30 px-6 py-3 text-sm text-primary">
              <Zap className="h-4 w-4" />
              App loading... (Connect your live SaaS URL)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppAccessPage;
