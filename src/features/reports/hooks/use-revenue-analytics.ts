import { useQuery } from '@tanstack/react-query';
import { reportKeys } from '@/shared/query-keys';
import { ReportsApi } from '../api/reports-api';
import { ReportDateFilter } from '../domain/reports-types';

export function useRevenueTrend(granularity: 'daily' | 'weekly' | 'monthly', filter: ReportDateFilter) {
  return useQuery({
    queryKey: reportKeys.revenue(granularity, filter),
    queryFn: () => ReportsApi.getRevenueTrend(granularity, filter),
    staleTime: 5 * 60 * 1000,
  });
}

export function useTopEntities(
  dimension: 'by-customer' | 'by-vehicle' | 'by-driver' | 'by-route',
  filter: ReportDateFilter,
  limit: number = 10
) {
  return useQuery({
    queryKey: reportKeys.revenue(dimension, { ...filter, limit }),
    queryFn: () => ReportsApi.getTopEntities(dimension, { ...filter, limit }),
    staleTime: 5 * 60 * 1000,
  });
}
