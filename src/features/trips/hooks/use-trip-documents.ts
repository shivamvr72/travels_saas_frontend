import { useQuery } from '@tanstack/react-query';
import { TripDocument } from '../domain/trip-types';
import { apiClient } from '@/shared/lib/axios';

export function useTripDocuments(tripId: string) {
  return useQuery({
    queryKey: ['trips', tripId, 'documents'],
    queryFn: async (): Promise<{ items: TripDocument[] }> => {
      try {
        const res = await apiClient.get(`/trips/${tripId}/documents`);
        return res.data;
      } catch (err) {
        // Fallback for FE-4 if endpoint is missing
        console.warn('Documents endpoint not available, using fallback data', err);
        return {
          items: [
            {
              id: 'doc-1',
              trip_id: tripId,
              category: 'invoice',
              file_name: 'invoice-001.pdf',
              file_url: '#',
              file_size_bytes: 1024 * 500,
              mime_type: 'application/pdf',
              uploaded_by: 'System Admin',
              uploaded_at: new Date(Date.now() - 3600000).toISOString(),
            }
          ],
        };
      }
    },
    staleTime: 1000 * 60, // 1 min
  });
}
