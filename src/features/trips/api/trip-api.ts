import { apiClient } from '@/shared/lib/axios';
import {
  Trip,
  TripCreate,
  TripUpdate,
  TripListParams,
  TripListResponse,
  TripAssignPayload,
  TripTransitionPayload,
  BulkAssignPayload,
  BulkStatusPayload,
  BulkCancelPayload,
  BulkExportPayload,
  BulkOperationResult,
  TripDocument,
  TripDocumentUpload,
  ActivityFeedResponse,
  TripDashboardStats,
} from '../domain/trip-types';

export const tripApi = {
  // ─── CRUD ─────────────────────────────────────────────────────────────
  list: (params?: TripListParams): Promise<TripListResponse> =>
    apiClient.get('/api/v1/trips', { params }).then((r) => r.data),
  
  get: (id: string): Promise<Trip> =>
    apiClient.get(`/api/v1/trips/${id}`).then((r) => r.data),
  
  create: (data: TripCreate): Promise<Trip> =>
    apiClient.post('/api/v1/trips/', data).then((r) => r.data),
  
  update: (id: string, data: TripUpdate): Promise<Trip> =>
    apiClient.put(`/api/v1/trips/${id}`, data).then((r) => r.data),
  
  delete: (id: string): Promise<{ message: string }> =>
    apiClient.delete(`/api/v1/trips/${id}`).then((r) => r.data),

  // ─── Lifecycle Actions ───────────────────────────────────────────────
  transition: (id: string, action: string, payload?: TripTransitionPayload): Promise<Trip> =>
    apiClient.post(`/api/v1/trips/${id}/actions/${action}`, payload).then((r) => r.data),

  // ─── Assignment ──────────────────────────────────────────────────────
  assign: (id: string, assignment: TripAssignPayload): Promise<Trip> =>
    apiClient.post(`/api/v1/trips/${id}/assign`, assignment).then((r) => r.data),

  // ─── Activity Feed ───────────────────────────────────────────────────
  getActivityFeed: (id: string): Promise<ActivityFeedResponse> =>
    apiClient.get(`/api/v1/trips/${id}/activity`).then((r) => r.data),

  // ─── Dashboard Stats ─────────────────────────────────────────────────
  getDashboardStats: (): Promise<TripDashboardStats> =>
    apiClient.get('/api/v1/trips/stats').then((r) => r.data),

  // ─── Documents ───────────────────────────────────────────────────────
  getDocuments: (id: string): Promise<{ items: TripDocument[] }> =>
    apiClient.get(`/api/v1/trips/${id}/documents`).then((r) => r.data),

  uploadDocument: (id: string, payload: TripDocumentUpload): Promise<TripDocument> => {
    const formData = new FormData();
    formData.append('category', payload.category);
    formData.append('file', payload.file);
    if (payload.notes) {
      formData.append('notes', payload.notes);
    }
    return apiClient.post(`/api/v1/trips/${id}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then((r) => r.data);
  },
  
  deleteDocument: (id: string, docId: string): Promise<{ message: string }> =>
    apiClient.delete(`/api/v1/trips/${id}/documents/${docId}`).then((r) => r.data),

  // ─── Bulk Operations ─────────────────────────────────────────────────
  bulkAssign: (payload: BulkAssignPayload): Promise<BulkOperationResult> =>
    apiClient.post('/api/v1/trips/bulk/assign', payload).then((r) => r.data),
  
  bulkStatusUpdate: (payload: BulkStatusPayload): Promise<BulkOperationResult> =>
    apiClient.post('/api/v1/trips/bulk/status', payload).then((r) => r.data),
  
  bulkDispatch: (ids: string[]): Promise<BulkOperationResult> =>
    apiClient.post('/api/v1/trips/bulk/dispatch', { ids }).then((r) => r.data),
  
  bulkCancel: (payload: BulkCancelPayload): Promise<BulkOperationResult> =>
    apiClient.post('/api/v1/trips/bulk/cancel', payload).then((r) => r.data),
  
  bulkExport: (payload: BulkExportPayload): Promise<Blob> =>
    apiClient.post('/api/v1/trips/bulk/export', payload, { responseType: 'blob' }).then((r) => r.data),
};
