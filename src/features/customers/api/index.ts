import { createCrudApi } from '@/shared/lib/api-factory';
import { createCrudHooks } from '@/shared/lib/query-factory';
import { components } from '@/shared/types/api';

export type Customer = components['schemas']['CustomerResponse'];
export type CustomerCreate = components['schemas']['CustomerCreate'];
export type CustomerUpdate = components['schemas']['CustomerUpdate'];

export const customerApi = createCrudApi<Customer, CustomerCreate, CustomerUpdate>('/api/v1/customers');
export const customerHooks = createCrudHooks('customers', customerApi);

export const {
  useList: useCustomers,
  useDetail: useCustomer,
  useCreate: useCreateCustomer,
  useUpdate: useUpdateCustomer,
  useDelete: useDeleteCustomer,
} = customerHooks;
