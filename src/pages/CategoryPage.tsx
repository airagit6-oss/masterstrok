import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/marketplace/Navbar';
import { MarketplaceSidebar } from '@/components/marketplace/MarketplaceSidebar';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { products as fallbackProducts } from '@/lib/marketplaceData';
import { ChevronRight } from 'lucide-react';

const CategoryPage = () => {
  const { macro, sub, micro } = useParams<{ macro: string; sub?: string; micro?: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: apiProducts } = useProducts({ macro, sub, micro });

  // Fallback: filter client-side from mock data if API not available
  const products = apiProducts ?? (() => {
    if (!macro) return fallbackProducts;
    return fallbackProducts.filter(p =>
      p.categorySlug === macro ||
      p.category.toLowerCase().replace(/\s+/g, '-') === macro
    );
  })();

  const breadcrumbs = [
    { label: 'Home', to: '/' },
    macro ? { label: macro.replace(/-/g, ' '), to: `/category/${macro}` } : null,
    sub ? { label: sub.replace(/-/g, ' '), to: `/category/${macro}/${sub}` } : null,
    micro ? { label: micro.replace(/-/g, ' '), to: `/category/${macro}/${sub}/${micro}` } : null,
  ].filter(Boolean) as { label: string; to: string }[];

  const pageTitle = (micro ?? sub ?? macro ?? 'All').replace(/-/g, ' ');

  return (
    <div className="min-h-screen bg-background">
      <Navbar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
      <MarketplaceSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className={`pt-16 transition-all duration-300 ${sidebarOpen ? 'lg:pl-56' : 'lg:pl-16'}`}>
        <div className="px-6 pt-6 pb-2 max-w-[1440px] mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1 mb-4 text-xs text-muted-foreground" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.to} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-3 w-3" />}
                {i < breadcrumbs.length - 1 ? (
                  <Link to={crumb.to} className="hover:text-foreground capitalize transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-foreground font-medium capitalize">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>

          <h1 className="text-2xl font-bold text-foreground capitalize mb-6">{pageTitle}</h1>

          {products.length === 0 ? (
            <div className="flex flex-col items-center py-24 text-center">
              <p className="text-lg font-medium text-foreground">No products found</p>
              <p className="mt-1 text-sm text-muted-foreground">Try browsing another category</p>
              <Link
                to="/"
                className="mt-6 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Browse All Apps
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
