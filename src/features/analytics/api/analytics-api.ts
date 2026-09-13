import { apiClient } from '@/shared/lib/axios';
import {
  ExecutiveSummaryResponse,
  RevenueByPeriodResponse,
  ExpenseBreakdownResponse,
  TopEntityResponse,
} from '../domain/analytics-types';

interface DateRangeParams {
  startDate?: string;
  endDate?: string;
}

const buildQueryString = (params?: DateRangeParams, additional?: Record<string, string | number>) => {
  const query = new URLSearchParams();
  if (params?.startDate) query.append('start_date', params.startDate);
  if (params?.endDate) query.append('end_date', params.endDate);
  
  if (additional) {
    Object.entries(additional).forEach(([key, value]) => {
      query.append(key, String(value));
    });
  }
  
  const queryString = query.toString();
  return queryString ? `?${queryString}` : '';
};

export const AnalyticsApi = {
  getExecutiveSummary: async (params?: DateRangeParams): Promise<ExecutiveSummaryResponse> => {
    const response = await apiClient.get(`/api/v1/analytics/executive-summary${buildQueryString(params)}`);
    return response.data;
  },

  getRevenueDaily: async (params?: DateRangeParams): Promise<RevenueByPeriodResponse[]> => {
    const response = await apiClient.get(`/api/v1/analytics/revenue/daily${buildQueryString(params)}`);
    return response.data;
  },

  getRevenueMonthly: async (params?: DateRangeParams): Promise<RevenueByPeriodResponse[]> => {
    const response = await apiClient.get(`/api/v1/analytics/revenue/monthly${buildQueryString(params)}`);
    return response.data;
  },

  getExpenseBreakdown: async (params?: DateRangeParams): Promise<ExpenseBreakdownResponse[]> => {
    const response = await apiClient.get(`/api/v1/analytics/expenses/breakdown${buildQueryString(params)}`);
    return response.data;
  },

  getTopCustomers: async (params?: DateRangeParams, limit: number = 10): Promise<TopEntityResponse[]> => {
    const response = await apiClient.get(`/api/v1/analytics/customers/summary${buildQueryString(params, { limit })}`);
    return response.data;
  },
};
