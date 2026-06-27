import { createCrudApi } from '@/shared/lib/api-factory';
import { createCrudHooks } from '@/shared/lib/query-factory';
import { components } from '@/shared/types/api';

export type Company = components['schemas']['CompanyResponse'];
export type CompanyCreate = components['schemas']['CompanyCreate'];
export type CompanyUpdate = components['schemas']['CompanyUpdate'];

export const companyApi = createCrudApi<Company, CompanyCreate, CompanyUpdate>('/api/v1/companies');

export const companyHooks = createCrudHooks('companies', companyApi);

export const {
  useList: useCompanies,
  useDetail: useCompany,
  useCreate: useCreateCompany,
  useUpdate: useUpdateCompany,
  useDelete: useDeleteCompany,
} = companyHooks;
