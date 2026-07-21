import { createCrudHooks } from '@/shared/lib/query-factory';
import { documentApi, uploadDocument } from '@/lib/api/documents';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const documentHooks = createCrudHooks('documents', documentApi);

export const {
  useList: useDocuments,
  useDetail: useDocument,
  useUpdate: useUpdateDocument,
  useDelete: useDeleteDocument,
} = documentHooks;

export const useUploadDocument = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: uploadDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
};
