import * as z from 'zod';

export const routeSchema = z.object({
  from_location: z.string().min(2, 'Origin is required').max(100),
  to_location: z.string().min(2, 'Destination is required').max(100),
  distance_km: z.preprocess((val) => (val === '' ? null : Number(val)), z.number().min(0.1, 'Distance must be > 0').nullable().optional()),
  hours_occupied: z.preprocess((val) => (val === '' ? null : Number(val)), z.number().min(0.1, 'Duration must be > 0').nullable().optional()),
  notes: z.string().nullable().optional(),
  is_active: z.boolean().default(true),
});

export type RouteFormValues = z.infer<typeof routeSchema>;
