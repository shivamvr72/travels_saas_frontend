import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export function useQueryHelpers() {
  const queryClient = useQueryClient();

  const invalidateList = useCallback(
    async (keys: readonly unknown[]) => {
      await queryClient.invalidateQueries({ queryKey: keys });
    },
    [queryClient]
  );

  const invalidateDetail = useCallback(
    async (keys: readonly unknown[]) => {
      await queryClient.invalidateQueries({ queryKey: keys });
    },
    [queryClient]
  );

  const invalidateEntity = useCallback(
    async (listKeys: readonly unknown[], detailKeys: readonly unknown[]) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: listKeys }),
        queryClient.invalidateQueries({ queryKey: detailKeys }),
      ]);
    },
    [queryClient]
  );

  return {
    invalidateList,
    invalidateDetail,
    invalidateEntity,
  };
}
