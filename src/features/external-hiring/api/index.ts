import { createCrudApi } from '@/shared/lib/api-factory';
import { createCrudHooks } from '@/shared/lib/query-factory';
import { components } from '@/shared/types/api';

export type ExternalHiring = components['schemas']['ExternalVehicleHiringResponse'];
export type ExternalHiringCreate = components['schemas']['ExternalVehicleHiringCreate'];
export type ExternalHiringUpdate = components['schemas']['ExternalVehicleHiringUpdate'];

export const externalHiringApi = createCrudApi<ExternalHiring, ExternalHiringCreate, ExternalHiringUpdate>('/api/v1/external-hirings');
export const externalHiringHooks = createCrudHooks('external-hiring', externalHiringApi);

export const {
  useList: useExternalHirings,
  useDetail: useExternalHiring,
  useCreate: useCreateExternalHiring,
  useUpdate: useUpdateExternalHiring,
  useDelete: useDeleteExternalHiring,
} = externalHiringHooks;
