import { useQuery } from '@tanstack/react-query';
import { reportKeys } from '@/shared/query-keys';
import { ReportsApi } from '../api/reports-api';
import { ReportDateFilter } from '../domain/reports-types';

const STALE_TIME = 5 * 60 * 1000; // 5 minutes

export function useProfitabilitySummaryKpis(filter: ReportDateFilter) {
  return useQuery({
    queryKey: reportKeys.profitabilitySummaryKpis(filter),
    queryFn: () => ReportsApi.getProfitabilitySummaryKpis(filter),
    staleTime: STALE_TIME,
  });
}

export function useProfitTrend(granularity: 'daily' | 'weekly' | 'monthly', filter: ReportDateFilter) {
  return useQuery({
    queryKey: reportKeys.profitabilityTrend(granularity, filter),
    queryFn: () => ReportsApi.getProfitTrend(granularity, filter),
    staleTime: STALE_TIME,
  });
}

export function useProfitByVehicle(filter: ReportDateFilter) {
  return useQuery({
    queryKey: reportKeys.profitabilityByVehicle(filter),
    queryFn: () => ReportsApi.getProfitByVehicle(filter),
    staleTime: STALE_TIME,
  });
}

export function useProfitByDriver(filter: ReportDateFilter) {
  return useQuery({
    queryKey: reportKeys.profitabilityByDriver(filter),
    queryFn: () => ReportsApi.getProfitByDriver(filter),
    staleTime: STALE_TIME,
  });
}

export function useProfitByCustomer(filter: ReportDateFilter) {
  return useQuery({
    queryKey: reportKeys.profitabilityByCustomer(filter),
    queryFn: () => ReportsApi.getProfitByCustomer(filter),
    staleTime: STALE_TIME,
  });
}

export function useProfitByRoute(filter: ReportDateFilter) {
  return useQuery({
    queryKey: reportKeys.profitabilityByRoute(filter),
    queryFn: () => ReportsApi.getProfitByRoute(filter),
    staleTime: STALE_TIME,
  });
}
