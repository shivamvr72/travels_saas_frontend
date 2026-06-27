import { apiClient } from './axios';

export interface CrudApi<TResponse, TCreate, TUpdate> {
  list: (params?: Record<string, unknown>) => Promise<{ items: TResponse[]; total: number; page: number; size: number }>;
  get: (id: string) => Promise<TResponse>;
  create: (data: TCreate) => Promise<TResponse>;
  update: (id: string, data: TUpdate) => Promise<TResponse>;
  delete: (id: string) => Promise<void>;
}

export function createCrudApi<TResponse, TCreate, TUpdate>(basePath: string): CrudApi<TResponse, TCreate, TUpdate> {
  const normalizedBasePath = basePath.endsWith('/') ? basePath : `${basePath}/`;

  return {
    list: async (params) => {
      return apiClient.get(normalizedBasePath, { params });
    },
    get: async (id: string) => {
      return apiClient.get(`${normalizedBasePath}${id}`);
    },
    create: async (data: TCreate) => {
      return apiClient.post(normalizedBasePath, data);
    },
    update: async (id: string, data: TUpdate) => {
      return apiClient.put(`${normalizedBasePath}${id}`, data);
    },
    delete: async (id: string) => {
      return apiClient.delete(`${normalizedBasePath}${id}`);
    },
  };
}
