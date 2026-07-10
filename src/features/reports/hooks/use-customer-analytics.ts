import { useQuery } from '@tanstack/react-query';
import { reportKeys } from '@/shared/query-keys';
import { ReportsApi } from '../api/reports-api';
import { ReportDateFilter } from '../domain/reports-types';

export function useCustomerAnalytics(filter: ReportDateFilter, limit: number = 10) {
  return useQuery({
    queryKey: reportKeys.customers({ ...filter, limit }),
    queryFn: () => ReportsApi.getCustomerAnalytics({ ...filter, limit }),
    staleTime: 5 * 60 * 1000,
  });
}
