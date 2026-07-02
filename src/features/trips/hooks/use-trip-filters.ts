import { useState, useCallback, useMemo } from 'react';
import { TripListParams, TripStatus, TripType, TripPriority } from '../domain/trip-types';
import { useDebounce } from '@/shared/hooks';

export function useTripFilters() {
  const [filters, setFilters] = useState<Omit<TripListParams, 'page' | 'page_size'>>({});
  
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebounce(searchValue, 500);

  const updateFilter = useCallback((key: keyof Omit<TripListParams, 'page' | 'page_size'>, value: any) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      if (value === undefined || value === null || value === '') {
        delete newFilters[key];
      }
      return newFilters;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({});
    setSearchValue('');
  }, []);

  const activeFilterCount = useMemo(() => {
    return Object.keys(filters).length;
  }, [filters]);

  const queryParams: TripListParams = useMemo(() => {
    const params: TripListParams = { ...filters };
    if (debouncedSearch) {
      params.search = debouncedSearch;
    }
    return params;
  }, [filters, debouncedSearch]);

  return {
    filters,
    searchValue,
    setSearchValue,
    updateFilter,
    resetFilters,
    activeFilterCount,
    queryParams,
  };
}
