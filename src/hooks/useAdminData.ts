import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { fetchAdminMetrics, fetchAdminLogs, fetchAdminUsers } from '@/lib/api';

const METRICS_INTERVAL = 5000;
const LOGS_INTERVAL = 2000;
const USERS_INTERVAL = 4000;

export function useAdminMetrics() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['admin', 'metrics'],
    queryFn: fetchAdminMetrics,
    staleTime: 0,
    retry: false,
  });

  // Poll for live updates
  useEffect(() => {
    const iv = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'metrics'] });
    }, METRICS_INTERVAL);
    return () => clearInterval(iv);
  }, [queryClient]);

  return query;
}

export function useAdminLogs(limit = 80) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['admin', 'logs', limit],
    queryFn: () => fetchAdminLogs(limit),
    staleTime: 0,
    retry: false,
  });

  // Poll for live updates
  useEffect(() => {
    const iv = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'logs'] });
    }, LOGS_INTERVAL);
    return () => clearInterval(iv);
  }, [queryClient]);

  return query;
}

export function useAdminUsers(count = 30) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['admin', 'users', count],
    queryFn: () => fetchAdminUsers(count),
    staleTime: 0,
    retry: false,
  });

  // Poll for live updates
  useEffect(() => {
    const iv = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    }, USERS_INTERVAL);
    return () => clearInterval(iv);
  }, [queryClient]);

  return query;
}
