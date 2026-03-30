import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, ShoppingCart, ShoppingBag, Zap, Star } from 'lucide-react';
import type { Product } from '@/lib/marketplaceData';
import { useCart } from '@/contexts/CartContext';

interface Props {
  product: Product;
}

export const ProductCard = ({ product }: Props) => {
  const [hovered, setHovered] = useState(false);
  const { addToCart } = useCart();

  return (
    <div
      className="group relative flex-shrink-0 cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ width: 220 }}
    >
      {/* Base card */}
      <div className="overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-lg group-hover:shadow-primary/5">
        {/* Thumbnail */}
        <div
          className="relative h-32 w-full transition-all duration-300"
          style={{ background: product.thumbnail }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-lg font-bold text-primary-foreground/80">
              {product.name.split(' ')[0]}
            </span>
          </div>
          {product.status === 'trending' && (
            <span className="absolute left-2 top-2 rounded bg-primary/90 px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
              TRENDING
            </span>
          )}
          {product.status === 'new' && (
            <span className="absolute left-2 top-2 rounded bg-mp-success/90 px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
              NEW
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <p className="text-xs text-muted-foreground">{product.category}</p>
          <h3 className="mt-1 text-sm font-semibold text-foreground truncate">{product.name}</h3>
          <div className="mt-1.5 flex items-center gap-1">
            <Star className="h-3 w-3 fill-mp-gold text-mp-gold" />
            <span className="text-xs text-muted-foreground">{product.rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">{product.users.toLocaleString()} users</span>
          </div>
        </div>
      </div>

      {/* Hover expand (Netflix effect) */}
      {hovered && (
        <div className="absolute -left-4 top-0 z-30 w-[260px] animate-in fade-in zoom-in-95 duration-200 rounded-lg border border-primary/20 bg-card shadow-2xl shadow-primary/10">
          <div className="relative h-36 w-full rounded-t-lg" style={{ background: product.thumbnail }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-xl font-bold text-primary-foreground/80">
                {product.name.split(' ')[0]}
              </span>
            </div>
          </div>
          <div className="p-4">
            <p className="text-xs font-medium text-primary">{product.category}</p>
            <h3 className="mt-1 text-sm font-bold text-foreground">{product.name}</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
              {product.shortDescription}
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {product.features.slice(0, 3).map(f => (
                <span key={f} className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-secondary-foreground">
                  {f}
                </span>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <Link
                to={`/product/${product.id}`}
                className="flex flex-1 items-center justify-center gap-1 rounded-md bg-secondary py-1.5 text-[11px] font-medium text-foreground transition-colors hover:bg-accent"
              >
                <Eye className="h-3 w-3" /> Details
              </Link>
              <button
                onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                className="flex flex-1 items-center justify-center gap-1 rounded-md bg-secondary py-1.5 text-[11px] font-medium text-foreground transition-colors hover:bg-accent"
              >
                <ShoppingCart className="h-3 w-3" /> Cart
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                className="flex flex-1 items-center justify-center gap-1 rounded-md mp-gradient-bg py-1.5 text-[11px] font-semibold text-primary-foreground"
              >
                <ShoppingBag className="h-3 w-3" /> Buy
              </button>
            </div>
            <button className="mt-2 flex w-full items-center justify-center gap-1 rounded-md border border-border py-1.5 text-[11px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
              <Zap className="h-3 w-3" /> Quick Access
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
