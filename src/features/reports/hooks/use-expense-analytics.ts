import { useQuery } from '@tanstack/react-query';
import { reportKeys } from '@/shared/query-keys';
import { ReportsApi } from '../api/reports-api';
import { ReportDateFilter } from '../domain/reports-types';

export function useExpenseBreakdown(filter: ReportDateFilter) {
  return useQuery({
    queryKey: reportKeys.expenses(filter),
    queryFn: () => ReportsApi.getExpenseBreakdown(filter),
    staleTime: 5 * 60 * 1000,
  });
}

export function useExpenseTrend(granularity: 'daily' | 'weekly' | 'monthly', filter: ReportDateFilter) {
  return useQuery({
    queryKey: reportKeys.expensesTrend(granularity, filter),
    queryFn: () => ReportsApi.getExpenseTrend(granularity, filter),
    staleTime: 5 * 60 * 1000,
  });
}

export function useExpenseByVehicle(filter: ReportDateFilter) {
  return useQuery({
    queryKey: reportKeys.expensesByVehicle(filter),
    queryFn: () => ReportsApi.getExpenseByVehicle(filter),
    staleTime: 5 * 60 * 1000,
  });
}

export function useExpenseByDriver(filter: ReportDateFilter) {
  return useQuery({
    queryKey: reportKeys.expensesByDriver(filter),
    queryFn: () => ReportsApi.getExpenseByDriver(filter),
    staleTime: 5 * 60 * 1000,
  });
}

export function useExpenseSummaryKpis(filter: ReportDateFilter) {
  return useQuery({
    queryKey: reportKeys.expensesSummaryKpis(filter),
    queryFn: () => ReportsApi.getExpenseSummaryKpis(filter),
    staleTime: 5 * 60 * 1000,
  });
}
