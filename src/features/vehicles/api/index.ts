import { createCrudApi } from '@/shared/lib/api-factory';
import { createCrudHooks } from '@/shared/lib/query-factory';
import { components } from '@/shared/types/api';

export type Vehicle = components['schemas']['VehicleResponse'];
export type VehicleCreate = components['schemas']['VehicleCreate'];
export type VehicleUpdate = components['schemas']['VehicleUpdate'];

export const vehicleApi = createCrudApi<Vehicle, VehicleCreate, VehicleUpdate>('/api/v1/vehicles');
export const vehicleHooks = createCrudHooks('vehicles', vehicleApi);

export const {
  useList: useVehicles,
  useDetail: useVehicle,
  useCreate: useCreateVehicle,
  useUpdate: useUpdateVehicle,
  useDelete: useDeleteVehicle,
} = vehicleHooks;
