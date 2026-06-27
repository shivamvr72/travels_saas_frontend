# ERP Developer Guide: Generic CRUD Framework

This document outlines the metadata-driven Generic CRUD framework used in this application (FE-3.5+). The system is built to minimize boilerplate and enforce 100% consistency across all administrative modules (Companies, Customers, Trips, Expenses, etc.).

## Core Philosophy

- **Configuration Over Code**: New modules should be defined via JSON-like configurations (`src/features/*/config/index.tsx`), rather than custom React components.
- **Single Source of Truth**: The `FeatureRegistry` maps standard routes to these feature configurations.
- **Factory Pattern**: The API client and React Query hooks are generated automatically by generic factories.

## Architecture Components

### 1. The API & Query Factory

Instead of writing 5 API calls per entity, you use the factory:

```typescript
// src/features/my-feature/api/index.ts
import { createCrudApi } from '@/shared/lib/api-factory';
import { createCrudHooks } from '@/shared/lib/query-factory';

export const myFeatureApi = createCrudApi<Response, Create, Update>('/api/v1/my-feature');
export const myFeatureHooks = createCrudHooks('my-feature', myFeatureApi);
```

This automatically provides optimistic updates, cache invalidation, and standard `useList`, `useDetail`, `useCreate`, `useUpdate`, `useDelete` hooks.

### 2. Feature Configuration

Define your entity's lists, columns, forms, and filters in the `config/index.tsx` file:

```typescript
import { CrudModuleConfig } from '@/components/layout/crud/crud-types';
import { featureRegistry } from '@/shared/config/feature-registry';

export const myFeatureConfig: CrudModuleConfig = {
  entityName: 'Item',
  entityNamePlural: 'Items',
  modulePermissions: 'MY_FEATURE', // From AppModule permissions enum
  routeBase: '/items',
  schema: zodSchema, // Validation
  hooks: myFeatureHooks, // From factory
  
  // Table Configuration
  list: {
    columns: [
      { key: 'name', header: 'Name', sortable: true, type: 'text' },
      { key: 'status', header: 'Status', type: 'status' } // Auto-renders badges
    ],
    // Optional Search/Filters
    filters: [
      { name: 'status', label: 'Status', type: 'select', options: [...] }
    ]
  },
  
  // Form Configuration
  form: {
    layout: 'default',
    sections: [
      {
        title: 'Basic Info',
        fields: [
          { name: 'name', label: 'Item Name', type: 'text', required: true }
        ]
      }
    ]
  }
};

featureRegistry.register('items', myFeatureConfig);
```

### 3. Page Generation

The Next.js App Router pages are now 100% generic wrappers. Simply create the Next.js standard directories and import `MetadataCrudView`:

```tsx
// app/(dashboard)/items/page.tsx
import { MetadataCrudView } from '@/components/layout/crud/metadata-crud-view';

export default function ListPage() {
  return <MetadataCrudView feature="items" view="list" />;
}
```

## Adding a New Field Type

If you need a new input type (e.g., `location-picker`), you only need to:
1. Add it to `FieldType` in `src/components/layout/crud/metadata-types.ts`.
2. Add the rendering logic inside `src/components/layout/crud/field-renderer.tsx`.
3. You can now use `type: 'location-picker'` in any config file!

## Supported Standard Formatter Types
- `currency`
- `date`, `datetime`
- `status` (renders `AppStatusBadge`)
- `phone`, `email`
- `distance`, `duration`, `capacity`
