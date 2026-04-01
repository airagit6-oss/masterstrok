import { useQuery } from '@tanstack/react-query';
import { fetchUserOrders, fetchUserApps, fetchUserSubscription } from '@/lib/api';

export function useUserOrders() {
  return useQuery({
    queryKey: ['user', 'orders'],
    queryFn: fetchUserOrders,
    staleTime: 1000 * 60 * 2,
    retry: false,
  });
}

export function useUserApps() {
  return useQuery({
    queryKey: ['user', 'apps'],
    queryFn: fetchUserApps,
    staleTime: 1000 * 60 * 2,
    retry: false,
  });
}

export function useUserSubscription() {
  return useQuery({
    queryKey: ['user', 'subscription'],
    queryFn: fetchUserSubscription,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}
