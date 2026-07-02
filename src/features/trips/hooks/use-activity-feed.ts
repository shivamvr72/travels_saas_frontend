import { useQuery } from '@tanstack/react-query';
import { ActivityFeedResponse } from '../domain/trip-types';
import { apiClient } from '@/shared/lib/axios';

export function useActivityFeed(tripId: string) {
  return useQuery({
    queryKey: ['trips', tripId, 'activity'],
    queryFn: async (): Promise<ActivityFeedResponse> => {
      try {
        const res = await apiClient.get(`/trips/${tripId}/activity`);
        return res.data;
      } catch (err) {
        // Fallback for FE-4 if endpoint is missing
        console.warn('Activity feed endpoint not available, using fallback data', err);
        return {
          events: [
            {
              id: 'evt-1',
              event_type: 'trip_created',
              title: 'Trip Created',
              description: 'Trip was created and saved as Draft.',
              actor: 'System Admin',
              timestamp: new Date(Date.now() - 86400000).toISOString(),
            },
            {
              id: 'evt-2',
              event_type: 'details_updated',
              title: 'Trip Details Updated',
              description: 'Updated trip priority to High.',
              actor: 'System Admin',
              timestamp: new Date(Date.now() - 3600000).toISOString(),
            }
          ],
          total: 2,
        };
      }
    },
    staleTime: 1000 * 60, // 1 min
  });
}
