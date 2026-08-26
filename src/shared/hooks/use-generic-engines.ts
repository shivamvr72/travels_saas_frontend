import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient as api } from '@/shared/lib/axios';
import { components } from '@/shared/types/api';

type ActivityResponse = components['schemas']['ActivityResponse'];
type PaginatedActivity = components['schemas']['PaginatedResponse_ActivityResponse_'];
export interface FleetSummaryResponse {
  vehicles_available: number;
  vehicles_on_trip: number;
  vehicles_in_maintenance: number;
  drivers_available: number;
  drivers_on_trip: number;
  drivers_on_leave: number;
  documents_expiring_soon: number;
  documents_awaiting_verification: number;
  unread_notifications: number;
  blocked_resources: number;
}
type NotificationResponse = components['schemas']['NotificationResponse'];
type AvailabilityResponse = components['schemas']['AvailabilityResponse'];

export function useActivity(entityType: string, entityId: string) {
  return useQuery({
    queryKey: ['activity', entityType, entityId],
    queryFn: async () => {
      const { data } = await api.get<PaginatedActivity>('/api/v1/activity/', {
        params: { entity_type: entityType, entity_id: entityId }
      });
      return data;
    },
    enabled: !!entityId,
  });
}

export function useFleetSummary() {
  return useQuery({
    queryKey: ['fleet', 'summary'],
    queryFn: async () => {
      const { data } = await api.get<FleetSummaryResponse>('/api/v1/fleet/summary');
      return data;
    },
  });
}

export function useNotifications() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data } = await api.get<any>('/api/v1/notifications/');
      return data.data || [];
    },
  });

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      await api.post(`/api/v1/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      await api.post('/api/v1/notifications/read-all');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return { ...query, markAsRead, markAllAsRead };
}

export function useAvailability(entityType: string, entityId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['availability', entityType, entityId],
    queryFn: async () => {
      const { data } = await api.get<any>('/api/v1/availability/', {
        params: { resource_type: entityType, resource_id: entityId }
      });
      return data.data || [];
    },
    enabled: !!entityId,
  });

  const addBlock = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post('/api/v1/availability/', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability', entityType, entityId] });
    },
  });

  const deleteBlock = useMutation({
    mutationFn: async (blockId: string) => {
      await api.delete(`/api/v1/availability/${blockId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability', entityType, entityId] });
    },
  });

  return { ...query, addBlock, deleteBlock };
}
