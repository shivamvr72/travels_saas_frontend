import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/lib/axios';
import { CacheProfiles } from '@/shared/lib/query-factory';
import {
  SettlementSummaryResponse,
  TripBillingRequest,
  TripBillingResponse,
  TripPaymentTransactionRequest,
  TripPaymentTransactionResponse,
  TripExpenseRequest,
  TripExpenseResponse,
} from '../types';

export interface SettlementDashboardMetrics {
  pending_count: number;
  settled_count: number;
  total_outstanding: number;
  total_settled_revenue: number;
  avg_settlement_days: number;
}

export const settlementKeys = {
  all: ['trip-settlement'] as const,
  summaries: () => [...settlementKeys.all, 'summaries'] as const,
  summary: (tripId: string) => [...settlementKeys.summaries(), tripId] as const,
  // We can reuse trip list queries if needed, but here's a specific one if a dashboard needs it
  dashboard: () => [...settlementKeys.all, 'dashboard'] as const,
};

// Fetch Settlement Summary
export function useSettlementSummary(tripId: string) {
  return useQuery({
    queryKey: settlementKeys.summary(tripId),
    queryFn: async (): Promise<SettlementSummaryResponse> => {
      const response = await apiClient.get(`/api/v1/trips/${tripId}/settlement-summary`);
      return response.data;
    },
    enabled: !!tripId,
    staleTime: CacheProfiles.Operational.staleTime,
    gcTime: CacheProfiles.Operational.gcTime,
  });
}

// Fetch Trips requiring settlement or already settled
export function useSettlementTrips(status?: string) {
  return useQuery({
    queryKey: [...settlementKeys.all, 'trips', status],
    queryFn: async () => {
      // Fetching all trips. In reality, filter by status=COMPLETED or status=SETTLED
      // If the backend supports ?status=COMPLETED, we append it.
      const queryParams = status ? `?status=${status}` : '';
      const response = await apiClient.get(`/api/v1/trips/${queryParams}`);
      // Assuming response.data is an array or object containing items
      return (response.data.items || response.data) as any[]; 
    },
    staleTime: CacheProfiles.Operational.staleTime,
    gcTime: CacheProfiles.Operational.gcTime,
  });
}

// Calculate Billing
export function useCalculateBilling() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ tripId, data }: { tripId: string; data: TripBillingRequest }): Promise<TripBillingResponse> => {
      const response = await apiClient.post(`/api/v1/trips/${tripId}/settlement/billing`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: settlementKeys.summary(variables.tripId) });
    },
  });
}

// Record Payment
export function useRecordPayment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ tripId, data }: { tripId: string; data: TripPaymentTransactionRequest }): Promise<TripPaymentTransactionResponse> => {
      const response = await apiClient.post(`/api/v1/trips/${tripId}/settlement/payments`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: settlementKeys.summary(variables.tripId) });
    },
  });
}

// Settle Trip
export function useCompleteSettlement() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (tripId: string) => {
      const response = await apiClient.post(`/api/v1/trips/${tripId}/settlement/settle`);
      return response.data;
    },
    onSuccess: (_, tripId) => {
      queryClient.invalidateQueries({ queryKey: settlementKeys.summary(tripId) });
    },
  });
}

// Record Expense
export function useRecordExpense() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ tripId, data }: { tripId: string; data: TripExpenseRequest }): Promise<TripExpenseResponse> => {
      const response = await apiClient.post(`/api/v1/trips/${tripId}/settlement/expenses`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: settlementKeys.summary(variables.tripId) });
    },
  });
}

// Fetch Dashboard Metrics
export function useSettlementDashboardMetrics() {
  return useQuery({
    queryKey: settlementKeys.dashboard(),
    queryFn: async (): Promise<SettlementDashboardMetrics> => {
      const response = await apiClient.get('/api/v1/settlements/dashboard-metrics');
      return response.data;
    },
    staleTime: CacheProfiles.Operational.staleTime,
    gcTime: CacheProfiles.Operational.gcTime,
  });
}
