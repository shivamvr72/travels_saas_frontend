import { apiClient } from '@/shared/lib/axios';
import { 
  DispatchBoardData, 
  AvailableVehicle, 
  AvailableDriver, 
  AssignTripRequest,
  BulkAssignRequest,
  BulkAssignResponse 
} from '../schemas/dispatch-schemas';

export const dispatchApi = {
  getBoard: async (date: string): Promise<DispatchBoardData> => {
    const res = await apiClient.get<DispatchBoardData>('/api/v1/dispatch/board', {
      params: { date }
    });
    return res.data;
  },

  getAvailableVehicles: async (): Promise<AvailableVehicle[]> => {
    const res = await apiClient.get<AvailableVehicle[]>('/api/v1/dispatch/vehicles/available');
    return res.data;
  },

  getAvailableDrivers: async (): Promise<AvailableDriver[]> => {
    const res = await apiClient.get<AvailableDriver[]>('/api/v1/dispatch/drivers/available');
    return res.data;
  },

  assignTrip: async (tripId: string, data: AssignTripRequest): Promise<void> => {
    await apiClient.post(`/api/v1/dispatch/trips/${tripId}/assign`, data);
  },

  bulkAssign: async (data: BulkAssignRequest): Promise<BulkAssignResponse> => {
    const res = await apiClient.post<BulkAssignResponse>('/api/v1/dispatch/trips/bulk-assign', data);
    return res.data;
  }
};
