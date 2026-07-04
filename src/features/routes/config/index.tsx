import { DurationPicker } from '../components/duration-picker';
import {
  useRoutes,
  useRoute,
  useCreateRoute,
  useUpdateRoute,
  useDeleteRoute,
  Route,
  RouteCreate,
  RouteUpdate,
} from '../api';
import { routeSchema } from '../schemas';
import { featureRegistry } from '@/shared/config/feature-registry';
import { FeatureConfig } from '@/components/layout/crud/crud-types';

export const routeConfig: FeatureConfig<Route, Route, RouteCreate, RouteUpdate> = {
  entityName: 'Route',
  entityNamePlural: 'Routes',
  modulePermissions: 'ROUTES',
  routeBase: '/routes',
  schema: routeSchema,
  hooks: {
    useList: useRoutes,
    useDetail: useRoute,
    useCreate: useCreateRoute,
    useUpdate: useUpdateRoute,
    useDelete: useDeleteRoute,
  },
  list: {
    defaultSortBy: 'name',
    defaultSortDir: 'asc',
    table: {
      columns: [
        {
          key: 'route',
          header: 'Route',
          sortable: true,
          className: 'font-medium',
          render: (item: Route) => `${item.from_location} → ${item.to_location}`,
        },
        {
          key: 'distance_km',
          header: 'Distance (km)',
          sortable: true,
          type: 'distance',
        },
        {
          key: 'hours_occupied',
          header: 'Duration',
          sortable: true,
          type: 'duration',
        },
        {
          key: 'is_active',
          header: 'Status',
          sortable: true,
          type: 'status',
        },
      ]
    }
  },
  form: {
    layout: 'default',
    sections: [
      {
        title: 'Route Details',
        fields: [
          { name: 'from_location', label: 'Origin', type: 'text', placeholder: 'e.g. Mumbai', required: true },
          { name: 'to_location', label: 'Destination', type: 'text', placeholder: 'e.g. Pune', required: true },
          { name: 'distance_km', label: 'Total Distance (km)', type: 'number', placeholder: 'e.g. 150', min: 0, step: 0.1 },
          { 
            name: 'hours_occupied', 
            label: 'Est. Duration', 
            type: 'custom', 
            render: (form) => <DurationPicker form={form} /> 
          },
          { name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'e.g. Highway route via Expressway' },
        ],
      },
      {
        title: 'Settings',
        fields: [
          { name: 'is_active', label: 'Active Status', type: 'switch', description: 'Enable to allow trips on this route.' },
        ],
      },
      // Note: Stops array requires a custom array field renderer for perfect UX.
      // In a real ERP, we'd add type: 'array' with sub-fields, but for now we'll 
      // rely on custom layout or advanced forms if needed. We will keep it simple here.
    ],
  },
  detail: {
    metadata: {
      cards: [
        {
          title: 'Route Details',
          fields: [
            { name: 'from_location', label: 'Origin' },
            { name: 'to_location', label: 'Destination' },
            { name: 'distance_km', label: 'Distance', type: 'distance' },
            { name: 'hours_occupied', label: 'Duration', type: 'duration' },
            { name: 'is_active', label: 'Status', type: 'status' },
          ],
        },
        {
          title: 'Additional Information',
          fields: [
            { name: 'notes', label: 'Internal Notes' },
          ],
        },
      ]
    }
  }
};

featureRegistry.register('routes', routeConfig);
