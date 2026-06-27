import { createCrudApi } from '@/shared/lib/api-factory';
import { createCrudHooks } from '@/shared/lib/query-factory';
import { components } from '@/shared/types/api';

export type Driver = components['schemas']['DriverResponse'];
export type DriverCreate = components['schemas']['DriverCreate'];
export type DriverUpdate = components['schemas']['DriverUpdate'];

export const driverApi = createCrudApi<Driver, DriverCreate, DriverUpdate>('/api/v1/drivers');
export const driverHooks = createCrudHooks('drivers', driverApi);

export const {
  useList: useDrivers,
  useDetail: useDriver,
  useCreate: useCreateDriver,
  useUpdate: useUpdateDriver,
  useDelete: useDeleteDriver,
} = driverHooks;
