# Query Keys Factory

This directory contains the TanStack Query Key factories for every domain in the application.

## Why use Query Key Factories?

Hardcoding string arrays for query keys (e.g., `['trips', 'list', filters]`) leads to typos and makes it difficult to reliably invalidate cache across the application when a mutation occurs.

By using factories, we ensure that:
1. Keys are strictly typed.
2. The hierarchy is consistent (all lists fall under the domain root).
3. Cache invalidation is centralized and predictable.

## Usage

### In a Query Hook

```typescript
import { useQuery } from '@tanstack/react-query';
import { tripKeys } from '@/shared/query-keys';

export const useTrips = (filters: Record<string, any>) => {
  return useQuery({
    queryKey: tripKeys.list(filters),
    queryFn: () => fetchTrips(filters),
  });
};
```

### In a Mutation Hook (Invalidation)

```typescript
import { useMutation } from '@tanstack/react-query';
import { tripKeys } from '@/shared/query-keys';
import { queryClient } from '@/shared/lib/query-client';

export const useCreateTrip = () => {
  return useMutation({
    mutationFn: (newTrip) => createTripApi(newTrip),
    onSuccess: () => {
      // Invalidate all trip lists so the new trip appears immediately
      queryClient.invalidateQueries({ queryKey: tripKeys.lists() });
    },
  });
};
```

## Structure

Each factory should at minimum provide:
- `all`: The root key `['domain']`
- `lists()`: Key for all list views `['domain', 'list']`
- `list(filters)`: Key for specific list `['domain', 'list', { filters }]`
- `details()`: Key for all detail views `['domain', 'detail']`
- `detail(id)`: Key for specific detail `['domain', 'detail', id]`
