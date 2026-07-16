import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dispatchKeys, tripKeys } from '@/shared/query-keys';
import { dispatchApi } from '../api/dispatch-api';
import { AssignTripRequest } from '../schemas/dispatch-schemas';
import { toast } from 'sonner';

interface AssignTripParams {
  tripId: string;
  data: AssignTripRequest;
}

export function useAssignTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tripId, data }: AssignTripParams) => dispatchApi.assignTrip(tripId, data),
    onSuccess: () => {
      toast.success('Trip assigned successfully');
      queryClient.invalidateQueries({ queryKey: dispatchKeys.all });
      queryClient.invalidateQueries({ queryKey: tripKeys.all });
    },
    onError: (error: unknown) => {
      // 409 and 422 errors might be parsed by standard api-factory interceptors, 
      // but we handle specifically if needed.
      const err = error as { response?: { data?: { detail?: string } }, message?: string };
      const message = err?.response?.data?.detail || err?.message || 'Failed to assign trip';
      toast.error(message);
    }
  });
}
