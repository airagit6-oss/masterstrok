import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, ShoppingCart, ShoppingBag, Zap, Heart, Star, Bookmark } from 'lucide-react';
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
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Base card */}
      <div className="overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-lg group-hover:shadow-primary/5 group-hover:scale-[1.03]">
        {/* Thumbnail - real preview image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <img
            src={product.thumbnail}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Overlay on hover */}
          {hovered && (
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-background/70 backdrop-blur-sm animate-in fade-in duration-200">
              <button
                onClick={(e) => { e.stopPropagation(); }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-card/90 text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                title="Wishlist"
              >
                <Heart className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-card/90 text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                title="Favorite"
              >
                <Bookmark className="h-4 w-4" />
              </button>
              <Link
                to={`/product/${product.id}`}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-110"
                title="View Details"
              >
                <Eye className="h-4 w-4" />
              </Link>
              <button
                onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-card/90 text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                title="Add to Cart"
              >
                <ShoppingCart className="h-4 w-4" />
              </button>
            </div>
          )}
          {/* Status badge */}
          {product.status === 'trending' && (
            <span className="absolute left-2 top-2 rounded-md bg-primary/90 px-2 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">
              Trending
            </span>
          )}
          {product.status === 'new' && (
            <span className="absolute left-2 top-2 rounded-md bg-mp-success/90 px-2 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">
              New
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs font-medium text-primary">{product.category}</p>
          <h3 className="mt-1 text-sm font-bold text-foreground truncate">{product.name}</h3>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{product.shortDescription}</p>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-mp-gold text-mp-gold" />
              <span className="text-xs font-medium text-foreground">{product.rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({product.users.toLocaleString()})</span>
            </div>
            <span className="text-sm font-bold text-foreground">${product.price}</span>
          </div>

          {/* Hover action buttons */}
          {hovered && (
            <div className="mt-3 flex gap-2 animate-in slide-in-from-bottom-2 duration-200">
              <Link
                to={`/product/${product.id}`}
                className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-secondary py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent"
              >
                <Eye className="h-3.5 w-3.5" /> Details
              </Link>
              <button
                onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                className="flex flex-1 items-center justify-center gap-1 rounded-lg mp-gradient-bg py-2 text-xs font-semibold text-primary-foreground"
              >
                <ShoppingBag className="h-3.5 w-3.5" /> Buy Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
