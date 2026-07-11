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

const formatDate = (d: Date) => d.toISOString().split('T')[0];

const parseReportDateFilter = (filter: ReportDateFilter): { start_date?: string, end_date?: string } => {
  if (filter.start_date || filter.end_date) return { start_date: filter.start_date, end_date: filter.end_date };
  if (!filter.period) return {};
  
  const today = new Date();
  switch (filter.period) {
    case 'today':
      return { start_date: formatDate(today), end_date: formatDate(today) };
    case 'yesterday': {
      const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
      return { start_date: formatDate(yesterday), end_date: formatDate(yesterday) };
    }
    case 'this_week': {
      const first = today.getDate() - today.getDay(); 
      const start = new Date(today); start.setDate(first);
      const end = new Date(start); end.setDate(start.getDate() + 6);
      return { start_date: formatDate(start), end_date: formatDate(end) };
    }
    case 'last_week': {
      const first = today.getDate() - today.getDay() - 7;
      const start = new Date(today); start.setDate(first);
      const end = new Date(start); end.setDate(start.getDate() + 6);
      return { start_date: formatDate(start), end_date: formatDate(end) };
    }
    case 'this_month': {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return { start_date: formatDate(start), end_date: formatDate(end) };
    }
    case 'last_month': {
      const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const end = new Date(today.getFullYear(), today.getMonth(), 0);
      return { start_date: formatDate(start), end_date: formatDate(end) };
    }
    default:
      return {};
  }
};

export const ReportsApi = {
  getExecutiveSummary: (params: ReportDateFilter): Promise<ExecutiveSummary> =>
    apiClient.get<ExecutiveSummary>('/api/v1/analytics/executive-summary', { params: parseReportDateFilter(params) }).then(getData),

  getRevenueTrend: (
    granularity: 'daily' | 'weekly' | 'monthly',
    params: ReportDateFilter
  ): Promise<RevenueByPeriod[]> =>
    apiClient.get<RevenueByPeriod[]>(`/api/v1/analytics/revenue/${granularity}`, { params: parseReportDateFilter(params) }).then(getData),

  getTopEntities: (
    dimension: 'by-customer' | 'by-vehicle' | 'by-driver' | 'by-route',
    params: ReportDateFilter & { limit?: number }
  ): Promise<TopEntity[]> =>
    apiClient.get<TopEntity[]>(`/api/v1/analytics/revenue/${dimension}`, { params: { ...parseReportDateFilter(params), limit: params.limit } }).then(getData),

  getExpenseBreakdown: (params: ReportDateFilter): Promise<ExpenseBreakdown[]> =>
    apiClient.get<ExpenseBreakdown[]>('/api/v1/analytics/expenses/breakdown', { params: parseReportDateFilter(params) }).then(getData),

  getFleetSummary: (params: ReportDateFilter): Promise<FleetSummary[]> =>
    apiClient.get<FleetSummary[]>('/api/v1/analytics/fleet/summary', { params: parseReportDateFilter(params) }).then(getData),

  getDriverAnalytics: (params: ReportDateFilter): Promise<DriverAnalytics[]> =>
    apiClient.get<DriverAnalytics[]>('/api/v1/analytics/drivers/summary', { params: parseReportDateFilter(params) }).then(getData),

  getCustomerAnalytics: (
    params: ReportDateFilter & { limit?: number }
  ): Promise<TopEntity[]> =>
    apiClient.get<TopEntity[]>('/api/v1/analytics/customers/summary', { params: { ...parseReportDateFilter(params), limit: params.limit } }).then(getData),

  getInvoiceRegister: (params: ReportDateFilter & { page: number; page_size: number }) =>
    apiClient.get('/api/v1/analytics/registers/invoices', { params: { ...parseReportDateFilter(params), page: params.page, page_size: params.page_size } }).then(getData),

  getAlerts: (): Promise<AlertItem[]> =>
    apiClient.get<AlertItem[]>('/api/v1/analytics/alerts').then(getData),
};
