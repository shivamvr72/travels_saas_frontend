import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CrudApi } from './api-factory';

export const CacheProfiles = {
  Lookup: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
  },
  MasterData: {
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000,
  },
  Operational: {
    staleTime: 0, // Always fresh
    gcTime: 1 * 60 * 1000,
  },
  Dashboard: {
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
  },
};

export function createCrudHooks<TResponse, TCreate, TUpdate>(
  queryKeyBase: string,
  api: CrudApi<TResponse, TCreate, TUpdate>,
  cacheProfile: typeof CacheProfiles[keyof typeof CacheProfiles] = CacheProfiles.MasterData
) {
  const keys = {
    all: [queryKeyBase] as const,
    lists: () => [...keys.all, 'list'] as const,
    list: (params: Record<string, unknown>) => [...keys.lists(), params] as const,
    details: () => [...keys.all, 'detail'] as const,
    detail: (id: string) => [...keys.details(), id] as const,
  };

  return {
    queryKeys: keys,
    
    useList: (params?: Record<string, unknown>) => {
      return useQuery({
        queryKey: keys.list(params || {}),
        queryFn: () => api.list(params),
        staleTime: cacheProfile.staleTime,
        gcTime: cacheProfile.gcTime,
      });
    },

    useDetail: (id: string) => {
      return useQuery({
        queryKey: keys.detail(id),
        queryFn: () => api.get(id),
        enabled: !!id,
        staleTime: cacheProfile.staleTime,
        gcTime: cacheProfile.gcTime,
      });
    },

    useCreate: () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: api.create,
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: keys.lists() });
        },
      });
    },

    useUpdate: () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: ({ id, data }: { id: string; data: TUpdate }) => api.update(id, data),
        // Optimistic update pattern can be extended here
        onMutate: async ({ id, data }) => {
          await queryClient.cancelQueries({ queryKey: keys.detail(id) });
          const previous = queryClient.getQueryData(keys.detail(id));
          queryClient.setQueryData(keys.detail(id), (old: unknown) => ({ ...(old as object), ...data }));
          return { previous };
        },
        onError: (err, variables, context: unknown) => {
          if (context && typeof context === 'object' && 'previous' in context && context.previous) {
            queryClient.setQueryData(keys.detail(variables.id), context.previous);
          }
        },
        onSettled: (data, error, variables) => {
          queryClient.invalidateQueries({ queryKey: keys.detail(variables.id) });
          queryClient.invalidateQueries({ queryKey: keys.lists() });
        },
      });
    },

    useDelete: () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: api.delete,
        onSuccess: (_, id) => {
          queryClient.invalidateQueries({ queryKey: keys.lists() });
          queryClient.invalidateQueries({ queryKey: keys.detail(id) });
        },
      });
    },
  };
}
