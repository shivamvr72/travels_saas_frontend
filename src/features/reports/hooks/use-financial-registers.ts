import { useQuery } from '@tanstack/react-query';
import { reportKeys } from '@/shared/query-keys';
import { ReportsApi } from '../api/reports-api';
import { ReportDateFilter } from '../domain/reports-types';

export function useInvoiceRegister(filter: ReportDateFilter, page: number, pageSize: number) {
  return useQuery({
    queryKey: reportKeys.registers('invoices', { ...filter, page, pageSize }),
    queryFn: () => ReportsApi.getInvoiceRegister({ ...filter, page, page_size: pageSize }),
    staleTime: 2 * 60 * 1000,
  });
}
