import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export interface TableState {
  page: number;
  pageSize: number;
  search: string;
  sortBy: string;
  sortDir: 'asc' | 'desc';
  filters: Record<string, string | null>;
}

interface UseTableStateProps {
  defaultPageSize?: number;
  defaultSortBy?: string;
  defaultSortDir?: 'asc' | 'desc';
  defaultFilters?: Record<string, string | null>;
}

export function useTableState({
  defaultPageSize = 10,
  defaultSortBy = 'created_at',
  defaultSortDir = 'desc',
  defaultFilters = {},
}: UseTableStateProps = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read initial state from URL or defaults
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('page_size')) || defaultPageSize;
  const search = searchParams.get('search') || '';
  const sortBy = searchParams.get('sort_by') || defaultSortBy;
  const sortDir = (searchParams.get('sort_dir') as 'asc' | 'desc') || defaultSortDir;

  // Extract all other searchParams as filters
  const filters = useMemo(() => {
    const f: Record<string, string | null> = { ...defaultFilters };
    searchParams.forEach((value, key) => {
      if (!['page', 'page_size', 'search', 'sort_by', 'sort_dir'].includes(key)) {
        f[key] = value;
      }
    });
    return f;
  }, [searchParams, defaultFilters]);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter((val) => val !== null && val !== '').length;
  }, [filters]);

  // Update URL helper
  const updateUrl = useCallback(
    (updates: Record<string, string | number | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  // Setters
  const setPage = useCallback(
    (newPage: number) => {
      updateUrl({ page: newPage });
    },
    [updateUrl]
  );

  const setSearch = useCallback(
    (newSearch: string) => {
      updateUrl({ search: newSearch, page: 1 }); // reset page on search
    },
    [updateUrl]
  );

  const setSorting = useCallback(
    (newSortBy: string, newSortDir: 'asc' | 'desc') => {
      updateUrl({ sort_by: newSortBy, sort_dir: newSortDir, page: 1 });
    },
    [updateUrl]
  );

  const setFilter = useCallback(
    (key: string, value: string | null) => {
      updateUrl({ [key]: value, page: 1 });
    },
    [updateUrl]
  );

  const resetFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    // Remove all keys except page_size, sort_by, sort_dir
    const keepKeys = ['page_size', 'sort_by', 'sort_dir'];
    const keysToDelete: string[] = [];
    
    params.forEach((_, key) => {
      if (!keepKeys.includes(key)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => params.delete(key));
    params.set('page', '1');
    
    // re-apply default filters
    Object.entries(defaultFilters).forEach(([k, v]) => {
        if(v !== null) params.set(k, v);
    });

    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams, defaultFilters]);

  // API Params converter
  const toApiParams = useCallback(() => {
    return {
      page,
      page_size: pageSize,
      ...(search ? { search } : {}),
      ...(sortBy ? { order_by: sortBy } : {}),
      ...(sortDir ? { order_dir: sortDir } : {}),
      ...filters,
    };
  }, [page, pageSize, search, sortBy, sortDir, filters]);

  return {
    state: { page, pageSize, search, sortBy, sortDir, filters },
    setPage,
    setSearch,
    setSorting,
    setFilter,
    resetFilters,
    activeFilterCount,
    toApiParams,
  };
}
