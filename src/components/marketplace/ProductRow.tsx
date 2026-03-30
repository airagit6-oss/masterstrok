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
    const amount = dir === 'left' ? -800 : 800;
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  if (products.length === 0) return null;

  return (
    <section className="py-6">
      <div className="px-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-foreground">{title}</h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="mp-hide-scrollbar grid auto-cols-[calc(25%-15px)] grid-flow-col gap-5 overflow-x-auto px-6 pb-4"
      >
        {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
};
