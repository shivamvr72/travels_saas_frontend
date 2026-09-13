import { useQuery } from '@tanstack/react-query';
import { reportKeys } from '@/shared/query-keys';
import { ReportsApi } from '../api/reports-api';
import { ReportDateFilter } from '../domain/reports-types';

export function useFleetSummary(filter: ReportDateFilter) {
  return useQuery({
    queryKey: reportKeys.fleet(filter),
    queryFn: () => ReportsApi.getFleetSummary(filter),
    staleTime: 5 * 60 * 1000,
  });
}

export function useFleetSummaryKpis(filter: ReportDateFilter) {
  return useQuery({
    queryKey: reportKeys.fleetKpis(filter),
    queryFn: () => ReportsApi.getFleetSummaryKpis(filter),
    staleTime: 5 * 60 * 1000,
  });
}

export function useFleetUtilizationTrend(
  granularity: 'daily' | 'weekly' | 'monthly',
  filter: ReportDateFilter
) {
  return useQuery({
    queryKey: reportKeys.fleetUtilizationTrend(granularity, filter),
    queryFn: () => ReportsApi.getFleetUtilizationTrend(granularity, filter),
    staleTime: 5 * 60 * 1000,
  });
}
