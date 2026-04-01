import { useQuery } from '@tanstack/react-query';
import { fetchProduct, fetchProductReviews, fetchRelatedProducts } from '@/lib/api';

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

export function useProductReviews(id: string | undefined) {
  return useQuery({
    queryKey: ['product-reviews', id],
    queryFn: () => fetchProductReviews(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

export function useRelatedProducts(id: string | undefined) {
  return useQuery({
    queryKey: ['product-related', id],
    queryFn: () => fetchRelatedProducts(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}
