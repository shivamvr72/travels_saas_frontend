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
      const res = await apiClient.get(normalizedBasePath, { params });
      return res.data;
    },
    get: async (id: string) => {
      const res = await apiClient.get(`${normalizedBasePath}${id}`);
      return res.data;
    },
    create: async (data: TCreate) => {
      const res = await apiClient.post(normalizedBasePath, data);
      return res.data;
    },
    update: async (id: string, data: TUpdate) => {
      const res = await apiClient.put(`${normalizedBasePath}${id}`, data);
      return res.data;
    },
    delete: async (id: string) => {
      const res = await apiClient.delete(`${normalizedBasePath}${id}`);
      return res.data;
    },
  };
}
