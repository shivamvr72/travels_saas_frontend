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
