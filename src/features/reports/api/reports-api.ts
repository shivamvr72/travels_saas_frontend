import { apiClient } from '@/shared/lib/axios';
import type { AxiosResponse } from 'axios';
import {
  AlertItem,
  DriverAnalytics,
  ExecutiveSummary,
  ExpenseBreakdown,
  FleetSummary,
  ReportDateFilter,
  RevenueByPeriod,
  TopEntity,
} from '../domain/reports-types';

const getData = <T>(r: AxiosResponse<T>) => r.data;

export const ReportsApi = {
  getExecutiveSummary: (params: ReportDateFilter): Promise<ExecutiveSummary> =>
    apiClient.get<ExecutiveSummary>('/analytics/executive-summary', { params }).then(getData),

  getRevenueTrend: (
    granularity: 'daily' | 'weekly' | 'monthly',
    params: ReportDateFilter
  ): Promise<RevenueByPeriod[]> =>
    apiClient.get<RevenueByPeriod[]>(`/analytics/revenue/${granularity}`, { params }).then(getData),

  getTopEntities: (
    dimension: 'by-customer' | 'by-vehicle' | 'by-driver' | 'by-route',
    params: ReportDateFilter & { limit?: number }
  ): Promise<TopEntity[]> =>
    apiClient.get<TopEntity[]>(`/analytics/revenue/${dimension}`, { params }).then(getData),

  getExpenseBreakdown: (params: ReportDateFilter): Promise<ExpenseBreakdown[]> =>
    apiClient.get<ExpenseBreakdown[]>('/analytics/expenses/breakdown', { params }).then(getData),

  getFleetSummary: (params: ReportDateFilter): Promise<FleetSummary[]> =>
    apiClient.get<FleetSummary[]>('/analytics/fleet/summary', { params }).then(getData),

  getDriverAnalytics: (params: ReportDateFilter): Promise<DriverAnalytics[]> =>
    apiClient.get<DriverAnalytics[]>('/analytics/drivers/summary', { params }).then(getData),

  getCustomerAnalytics: (
    params: ReportDateFilter & { limit?: number }
  ): Promise<TopEntity[]> =>
    apiClient.get<TopEntity[]>('/analytics/customers/summary', { params }).then(getData),

  getInvoiceRegister: (params: ReportDateFilter & { page: number; page_size: number }) =>
    apiClient.get('/analytics/registers/invoices', { params }).then(getData),

  getAlerts: (): Promise<AlertItem[]> =>
    apiClient.get<AlertItem[]>('/analytics/alerts').then(getData),
};
