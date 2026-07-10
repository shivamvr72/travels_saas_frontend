import { useQuery } from '@tanstack/react-query';
import { reportKeys } from '@/shared/query-keys';
import { ReportsApi } from '../api/reports-api';
import { ReportDateFilter } from '../domain/reports-types';

export function useExecutiveSummary(filter: ReportDateFilter) {
  return useQuery({
    queryKey: reportKeys.executiveSummary(filter),
    queryFn: () => ReportsApi.getExecutiveSummary(filter),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
}
