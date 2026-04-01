import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  fetchFeaturedProducts,
  fetchProducts,
  fetchSearchResults,
  type ProductFilters,
} from '@/lib/api';
import { products as allProducts, categories } from '@/lib/marketplaceData';

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: fetchFeaturedProducts,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

export function useSearch(q: string) {
  return useQuery({
    queryKey: ['search', q],
    queryFn: () => fetchSearchResults(q),
    enabled: q.trim().length > 0,
    staleTime: 1000 * 30,
    retry: false,
  });
}

export function useAllProducts() {
  return useMemo(() => allProducts, []);
}

export function useCategories() {
  return useMemo(() => categories, []);
}
