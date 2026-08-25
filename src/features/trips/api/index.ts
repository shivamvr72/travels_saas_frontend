import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tripApi } from './trip-api';
import { CacheProfiles } from '@/shared/lib/query-factory';
import {
  TripListParams,
  TripAssignPayload,
  TripTransitionPayload,
  BulkAssignPayload,
  BulkStatusPayload,
  BulkCancelPayload,
  BulkExportPayload,
  TripCreate,
  TripUpdate,
  TripDocumentUpload,
  ActivityFeedResponse,
} from '../domain/trip-types';

// Re-export domain types as the public contract
export * from '../domain/trip-types';

// ─── Query Keys ─────────────────────────────────────────────────────────────
export const tripQueryKeys = {
  all: ['trips'] as const,
  lists: () => [...tripQueryKeys.all, 'list'] as const,
  list: (params?: TripListParams) => [...tripQueryKeys.lists(), params] as const,
  details: () => [...tripQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...tripQueryKeys.details(), id] as const,
  activity: (id: string) => [...tripQueryKeys.all, 'activity', id] as const,
  stats: () => [...tripQueryKeys.all, 'stats'] as const,
  documents: (id: string) => [...tripQueryKeys.all, 'documents', id] as const,
};

// ─── Queries ────────────────────────────────────────────────────────────────
export const useTripList = (params?: TripListParams) => {
  return useQuery({
    queryKey: tripQueryKeys.list(params),
    queryFn: () => tripApi.list(params),
    ...CacheProfiles.Operational,
  });
};

export const useTripDetail = (id: string) => {
  return useQuery({
    queryKey: tripQueryKeys.detail(id),
    queryFn: () => tripApi.get(id),
    enabled: !!id,
    ...CacheProfiles.Operational,
  });
};

import { apiClient } from '@/shared/lib/axios';

export const useTripActivityFeed = (id: string) => {
  return useQuery({
    queryKey: tripQueryKeys.activity(id),
    queryFn: () => apiClient.get(`/api/v1/trips/${id}/activity`).then(r => r.data as ActivityFeedResponse),
    enabled: !!id,
    ...CacheProfiles.Operational,
  });
};

export const useTripDashboardStats = () => {
  return useQuery({
    queryKey: tripQueryKeys.stats(),
    queryFn: () => tripApi.getDashboardStats(),
    ...CacheProfiles.Operational,
  });
};

export const useTripDocuments = (id: string) => {
  return useQuery({
    queryKey: tripQueryKeys.documents(id),
    queryFn: () => tripApi.getDocuments(id),
    enabled: !!id,
    ...CacheProfiles.Operational,
  });
};

// ─── Mutations ──────────────────────────────────────────────────────────────
export const useCreateTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TripCreate) => tripApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.stats() });
    },
  });
};

export const useUpdateTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TripUpdate }) => tripApi.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.lists() });
    },
  });
};

export const useDeleteTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tripApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.stats() });
    },
  });
};

import { 
  tripLifecycleApi, 
  DispatchTripPayload, 
  StartTripPayload, 
  CompleteTripPayload, 
  CancelTripPayload 
} from './trip-lifecycle-api';

export const useTripTransition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action, payload }: { id: string; action: string; payload?: TripTransitionPayload }) =>
      tripApi.transition(id, action, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.activity(variables.id) });
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.stats() });
    },
  });
};

export const useDispatchTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: DispatchTripPayload }) =>
      tripLifecycleApi.dispatch(id, payload),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(tripQueryKeys.detail(variables.id), data);
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.activity(variables.id) });
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.stats() });
    },
  });
};

export const useStartTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: StartTripPayload }) =>
      tripLifecycleApi.start(id, payload),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(tripQueryKeys.detail(variables.id), data);
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.activity(variables.id) });
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.stats() });
    },
  });
};

export const useCompleteTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CompleteTripPayload }) =>
      tripLifecycleApi.complete(id, payload),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(tripQueryKeys.detail(variables.id), data);
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.activity(variables.id) });
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.stats() });
    },
  });
};

export const useCancelTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CancelTripPayload }) =>
      tripLifecycleApi.cancel(id, payload),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(tripQueryKeys.detail(variables.id), data);
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.activity(variables.id) });
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.stats() });
    },
  });
};

export const useTripAssign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, assignment }: { id: string; assignment: TripAssignPayload }) =>
      tripApi.assign(id, assignment),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.activity(variables.id) });
    },
  });
};

export const useTripAssignExternalVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      tripApi.assignExternalVehicle(id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.activity(variables.id) });
    },
  });
};

export const useTripAssignExternalDriver = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      tripApi.assignExternalDriver(id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.activity(variables.id) });
    },
  });
};

export const useUploadTripDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: TripDocumentUpload }) =>
      tripApi.uploadDocument(id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.documents(variables.id) });
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.activity(variables.id) });
    },
  });
};

export const useDeleteTripDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, docId }: { id: string; docId: string }) =>
      tripApi.deleteDocument(id, docId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.documents(variables.id) });
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.activity(variables.id) });
    },
  });
};

export const useAddTripNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) => tripApi.addNote(id, note),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.activity(variables.id) });
    },
  });
};

// ─── Bulk Operations ────────────────────────────────────────────────────────
export const useBulkTripAssign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BulkAssignPayload) => tripApi.bulkAssign(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.lists() });
    },
  });
};

export const useBulkTripStatusUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BulkStatusPayload) => tripApi.bulkStatusUpdate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.stats() });
    },
  });
};

export const useBulkTripDispatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => tripApi.bulkDispatch(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.stats() });
    },
  });
};

export const useBulkTripCancel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BulkCancelPayload) => tripApi.bulkCancel(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.stats() });
    },
  });
};

export const useBulkTripExport = () => {
  return useMutation({
    mutationFn: (payload: BulkExportPayload) => tripApi.bulkExport(payload),
    // Export doesn't invalidate cache, just returns a blob
  });
};
