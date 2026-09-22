import { useQuery } from '@tanstack/react-query';
import { TripDocument } from '../domain/trip-types';
import { apiClient } from '@/shared/lib/axios';

export function useTripDocuments(tripId: string) {
  return useQuery({
    queryKey: ['trips', tripId, 'documents'],
    queryFn: async (): Promise<{ items: TripDocument[] }> => {
      let items: TripDocument[] = [];
      try {
        const res = await apiClient.get('/api/v1/documents', {
          params: { entity_type: 'TRIP', entity_id: tripId }
        });
        const raw = res.data?.items || res.data?.data || res.data || [];
        if (Array.isArray(raw)) {
          items = raw.map((d: any) => ({
            id: d.id,
            trip_id: tripId,
            category: d.document_category || d.category || 'other',
            file_name: d.original_filename || d.file_name || 'document.pdf',
            file_url: `/api/v1/documents/${d.id}/download`,
            file_size_bytes: d.file_size_bytes || 0,
            mime_type: d.mime_type || 'application/pdf',
            uploaded_by: d.uploader?.full_name || 'System',
            uploaded_at: d.created_at || new Date().toISOString(),
          }));
        }
      } catch (err) {
        console.warn('Documents API error, checking fallback:', err);
      }

      // Always ensure the trip invoice is available under Invoices category if not already uploaded
      const hasInvoice = items.some(d => d.category === 'invoice');
      if (!hasInvoice) {
        items.unshift({
          id: `invoice-${tripId}`,
          trip_id: tripId,
          category: 'invoice',
          file_name: `invoice-${tripId.slice(0, 8)}.pdf`,
          file_url: '#generate-invoice',
          file_size_bytes: 1024 * 125,
          mime_type: 'application/pdf',
          uploaded_by: 'Billing Engine',
          uploaded_at: new Date().toISOString(),
        });
      }

      return { items };
    },
    staleTime: 1000 * 60, // 1 min
  });
}
