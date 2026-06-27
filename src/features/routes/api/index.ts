import { createCrudApi } from '@/shared/lib/api-factory';
import { createCrudHooks } from '@/shared/lib/query-factory';
import { components } from '@/shared/types/api';

export type Route = components['schemas']['RouteResponse'];
export type RouteCreate = components['schemas']['RouteCreate'];
export type RouteUpdate = components['schemas']['RouteUpdate'];


export const routeApi = createCrudApi<Route, RouteCreate, RouteUpdate>('/api/v1/routes');
export const routeHooks = createCrudHooks('routes', routeApi);

export const {
  useList: useRoutes,
  useDetail: useRoute,
  useCreate: useCreateRoute,
  useUpdate: useUpdateRoute,
  useDelete: useDeleteRoute,
} = routeHooks;
