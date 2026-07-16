import { apiClient } from '@/shared/lib/axios';
import { 
  DispatchBoardData,
  DispatchBoardReadSchema,
  AvailableVehicle,
  AvailableVehicleSchema,
  AvailableDriver,
  AvailableDriverSchema,
  AssignTripRequest,
  BulkAssignRequest,
  BulkAssignResponse,
  BulkAssignResponseSchema
} from '../schemas/dispatch-schemas';
import { z } from 'zod';

export const dispatchApi = {
  getBoard: async (date: string): Promise<DispatchBoardData> => {
    const res = await apiClient.get('/api/v1/dispatch/board', {
      params: { date }
    });
    return DispatchBoardReadSchema.parse(res.data);
  },

  getAvailableVehicles: async (): Promise<AvailableVehicle[]> => {
    const res = await apiClient.get('/api/v1/dispatch/vehicles/available');
    return z.array(AvailableVehicleSchema).parse(res.data);
  },

  getAvailableDrivers: async (): Promise<AvailableDriver[]> => {
    const res = await apiClient.get('/api/v1/dispatch/drivers/available');
    return z.array(AvailableDriverSchema).parse(res.data);
  },

  assignTrip: async (tripId: string, data: AssignTripRequest): Promise<void> => {
    await apiClient.post(`/api/v1/dispatch/trips/${tripId}/assign`, data);
  },

  bulkAssign: async (data: BulkAssignRequest): Promise<BulkAssignResponse> => {
    const res = await apiClient.post('/api/v1/dispatch/trips/bulk-assign', data);
    return BulkAssignResponseSchema.parse(res.data);
  }
};
