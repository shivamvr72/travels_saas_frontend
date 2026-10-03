import { createCrudApi } from '@/shared/lib/api-factory';
import { createCrudHooks, CacheProfiles } from '@/shared/lib/query-factory';
import { components } from '@/shared/types/api';

export type VehicleExpense = components['schemas']['VehicleExpenseResponse'];
export type VehicleExpenseCreate = components['schemas']['VehicleExpenseCreate'];
export type VehicleExpenseUpdate = components['schemas']['VehicleExpenseUpdate'];

export interface TripExpenseGroupResponse {
  trip_id: string | null;
  trip_number: string | null;
  vehicle_id: string | null;
  total_amount: number;
  total_km: number | null;
  expense_count: number;
  latest_expense_date: string | null;
}

export const vehicleExpenseApi = createCrudApi<VehicleExpense, VehicleExpenseCreate, VehicleExpenseUpdate>(
  '/api/v1/vehicle-expenses'
);

export const vehicleExpenseHooks = createCrudHooks(
  'vehicle-expenses',
  vehicleExpenseApi,
  CacheProfiles.Operational
);

export const {
  useList: useVehicleExpenses,
  useDetail: useVehicleExpense,
  useCreate: useCreateVehicleExpense,
  useUpdate: useUpdateVehicleExpense,
  useDelete: useDeleteVehicleExpense,
} = vehicleExpenseHooks;

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/lib/axios';

export function useGroupedTripExpenses(params: any = {}) {
  return useQuery({
    queryKey: ['vehicle-expenses', 'grouped-by-trip', params],
    queryFn: async () => {
      const res = await apiClient.get('/api/v1/vehicle-expenses/grouped-by-trip', { params });
      return res.data; // Expect PaginatedResponse[TripExpenseGroupResponse]
    },
    staleTime: 60 * 1000, // 1 min
  });
}
