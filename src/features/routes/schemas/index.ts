import * as z from 'zod';

export const routeSchema = z.object({
  from_location: z.string().trim().min(2, 'Origin must be at least 2 characters').max(50, 'Origin cannot exceed 50 characters').regex(/^[a-zA-Z0-9\s,.-]+$/, 'Please enter a valid origin name'),
  to_location: z.string().trim().min(2, 'Destination must be at least 2 characters').max(50, 'Destination cannot exceed 50 characters').regex(/^[a-zA-Z0-9\s,.-]+$/, 'Please enter a valid destination name'),
  distance_km: z.preprocess(
    (val) => (val === '' || val == null ? null : Number(val)),
    z.number({ invalid_type_error: 'Distance must be a valid number' }).min(0.1, 'Distance must be > 0').max(10000, 'Distance is too large').nullable().optional()
  ),
  hours_occupied: z.preprocess(
    (val) => (val === '' || val == null ? null : Number(val)),
    z.number({ invalid_type_error: 'Duration must be a valid number' }).min(0.1, 'Duration must be > 0').max(1000, 'Duration is too large').nullable().optional()
  ),
  notes: z.string().trim().max(500, 'Notes cannot exceed 500 characters').nullable().optional(),
  is_active: z.boolean().default(true),
}).superRefine((data, ctx) => {
  if (data.from_location && data.to_location && data.from_location.toLowerCase().trim() === data.to_location.toLowerCase().trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Origin and Destination cannot be the same',
      path: ['to_location'],
    });
  }
});

export type RouteFormValues = z.infer<typeof routeSchema>;
