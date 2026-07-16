import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dispatchKeys, tripKeys } from '@/shared/query-keys';
import { dispatchApi } from '../api/dispatch-api';
import { BulkAssignRequest } from '../schemas/dispatch-schemas';
import { toast } from 'sonner';

export function useBulkAssign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkAssignRequest) => dispatchApi.bulkAssign(data),
    onSuccess: (response) => {
      if (response.failed === 0) {
        toast.success(`Successfully assigned ${response.succeeded} trips`);
      } else {
        toast.warning(`Assigned ${response.succeeded}, failed ${response.failed}`);
      }
      queryClient.invalidateQueries({ queryKey: dispatchKeys.all });
      queryClient.invalidateQueries({ queryKey: tripKeys.all });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.detail || error?.message || 'Bulk assignment failed';
      toast.error(message);
    }
  });
}
