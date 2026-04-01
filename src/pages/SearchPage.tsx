import { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/marketplace/Navbar';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { products, categories } from '@/lib/marketplaceData';
import { Search } from 'lucide-react';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const results = useMemo(() => {
    if (!query.trim()) return products;
    const q = query.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [query]);

  // Group category matches
  const categoryMatches = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return categories.filter(c => c.name.toLowerCase().includes(q) || c.slug.includes(q));
  }, [query]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 px-6 max-w-[1440px] mx-auto">
        <div className="mb-6 flex items-center gap-3">
          <Search className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-xl font-semibold text-foreground">
            {query ? (
              <>Results for <span className="text-primary">"{query}"</span></>
            ) : (
              'All Products'
            )}
          </h1>
          <span className="text-sm text-muted-foreground">({results.length} found)</span>
        </div>

        {categoryMatches.length > 0 && (
          <div className="mb-6">
            <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Categories</p>
            <div className="flex flex-wrap gap-2">
              {categoryMatches.map(c => (
                <Link
                  key={c.slug}
                  to={`/category/${c.slug}`}
                  className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
                >
                  {c.name}
                  <span className="ml-2 text-xs text-muted-foreground">{c.count}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {results.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center">
            <Search className="mb-4 h-12 w-12 text-muted-foreground/30" />
            <p className="text-lg font-medium text-foreground">No results found</p>
            <p className="mt-1 text-sm text-muted-foreground">Try a different search term</p>
            <Link to="/" className="mt-6 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              Browse All Apps
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {results.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
