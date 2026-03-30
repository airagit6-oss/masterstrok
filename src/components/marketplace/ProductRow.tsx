import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import type { Product } from '@/lib/marketplaceData';

interface Props {
  title: string;
  products: Product[];
}

export const ProductRow = ({ title, products }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = dir === 'left' ? -600 : 600;
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  if (products.length === 0) return null;

  return (
    <section className="py-4">
      <div className="mx-auto max-w-[1440px] px-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-foreground">{title}</h2>
          <div className="flex gap-1">
            <button
              onClick={() => scroll('left')}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="mp-hide-scrollbar flex gap-4 overflow-x-auto px-6 pb-4"
        style={{ paddingLeft: 'max(1.5rem, calc((100vw - 1440px) / 2 + 1.5rem))' }}
      >
        {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
};
