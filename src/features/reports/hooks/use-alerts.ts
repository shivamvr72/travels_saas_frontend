import { useQuery } from '@tanstack/react-query';
import { reportKeys } from '@/shared/query-keys';
import { ReportsApi } from '../api/reports-api';

export function useAlerts() {
  return useQuery({
    queryKey: reportKeys.alerts(),
    queryFn: () => ReportsApi.getAlerts(),
    staleTime: 5 * 60 * 1000,
  });
}
