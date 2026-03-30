import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, Eye, ShoppingBag } from 'lucide-react';
import { heroSlides } from '@/lib/marketplaceData';
import { useCart } from '@/contexts/CartContext';

export const HeroBanner = () => {
  const [current, setCurrent] = useState(0);
  const { addToCart } = useCart();
  const slide = heroSlides[current];

  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p + 1) % heroSlides.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative h-[480px] w-full overflow-hidden lg:h-[540px]">
      {/* Background */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{ background: slide.thumbnail }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

      {/* Content */}
      <div className="relative mx-auto flex h-full max-w-[1440px] items-center px-6">
        <div className="max-w-xl">
          <span className="mb-3 inline-block rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary">
            {slide.category}
          </span>
          <h1 className="font-display mb-4 text-4xl font-bold text-foreground lg:text-5xl">
            {slide.name}
          </h1>
          <p className="mb-6 text-base text-muted-foreground leading-relaxed">
            {slide.shortDescription}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button className="flex items-center gap-2 rounded-lg mp-gradient-bg px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105">
              <Play className="h-4 w-4" /> Access Now
            </button>
            <Link
              to={`/product/${slide.id}`}
              className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <Eye className="h-4 w-4" /> View Details
            </Link>
            <button
              onClick={() => addToCart(slide)}
              className="flex items-center gap-2 rounded-lg border border-primary/30 px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
            >
              <ShoppingBag className="h-4 w-4" /> Buy Now
            </button>
          </div>
          {/* Dots */}
          <div className="mt-8 flex gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all ${i === current ? 'w-8 bg-primary' : 'w-4 bg-muted-foreground/30'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={() => setCurrent(p => (p - 1 + heroSlides.length) % heroSlides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-background/60 text-foreground backdrop-blur-sm transition-colors hover:bg-background/80"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => setCurrent(p => (p + 1) % heroSlides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-background/60 text-foreground backdrop-blur-sm transition-colors hover:bg-background/80"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};
