import * as z from 'zod';

export const routeSchema = z.object({
  name: z.string().min(2, 'Route name is required').max(100),
  origin: z.string().min(2, 'Origin is required').max(100),
  destination: z.string().min(2, 'Destination is required').max(100),
  distance_km: z.number().min(0.1, 'Distance must be > 0').nullable().optional(),
  estimated_duration_mins: z.number().int().min(1, 'Duration must be > 0').nullable().optional(),
  is_active: z.boolean().default(true),
  stops: z.array(
    z.object({
      stop_name: z.string().min(1, 'Stop name required'),
      order: z.number().int().min(0),
      distance_from_start: z.number().min(0).nullable().optional(),
    })
  ).optional().default([]),
});

export type RouteFormValues = z.infer<typeof routeSchema>;
