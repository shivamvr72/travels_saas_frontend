import { useQuery } from '@tanstack/react-query';
import { reportKeys } from '@/shared/query-keys';
import { ReportsApi } from '../api/reports-api';
import { ReportDateFilter } from '../domain/reports-types';

export function useDriverAnalytics(filter: ReportDateFilter) {
  return useQuery({
    queryKey: reportKeys.drivers(filter),
    queryFn: () => ReportsApi.getDriverAnalytics(filter),
    staleTime: 5 * 60 * 1000,
  });
}

export function useDriverSummaryKpis(filter: ReportDateFilter) {
  return useQuery({
    queryKey: reportKeys.driverKpis(filter),
    queryFn: () => ReportsApi.getDriverSummaryKpis(filter),
    staleTime: 5 * 60 * 1000,
  });
}

export function useDriverPerformanceTrend(
  granularity: 'daily' | 'weekly' | 'monthly',
  filter: ReportDateFilter
) {
  return useQuery({
    queryKey: reportKeys.driverPerformanceTrend(granularity, filter),
    queryFn: () => ReportsApi.getDriverPerformanceTrend(granularity, filter),
    staleTime: 5 * 60 * 1000,
  });
}
