import { useQuery } from '@tanstack/react-query';
import { dispatchKeys } from '@/shared/query-keys';
import { dispatchApi } from '../api/dispatch-api';
import { CacheProfiles } from '@/shared/lib/query-factory';

export function useDispatchBoard(date: string) {
  return useQuery({
    queryKey: dispatchKeys.board(date),
    queryFn: () => dispatchApi.getBoard(date),
    staleTime: CacheProfiles.Operational.staleTime,
    gcTime: CacheProfiles.Operational.gcTime,
  });
}
