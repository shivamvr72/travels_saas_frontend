import { createCrudApi } from '@/shared/lib/api-factory';
import { components } from '@/shared/types/api';
import { apiClient } from '@/shared/lib/axios';

export type Document = components['schemas']['DocumentResponse'];
export type DocumentUpdate = components['schemas']['DocumentUpdate'];

export const documentApi = createCrudApi<Document, any, DocumentUpdate>('/api/v1/documents');

export const uploadDocument = async (formData: FormData): Promise<Document> => {
  const { data } = await apiClient.post<Document>('/api/v1/documents/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

