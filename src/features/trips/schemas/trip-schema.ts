import * as z from 'zod';

const TRIP_TYPES = ['One Way', 'Round Trip', 'Multi-Stop', 'Local', 'Outstation'] as const;
const PRIORITIES = ['Low', 'Normal', 'High', 'Urgent'] as const;

export const tripSchema = z.object({
  // Section 1 — Trip Identity
  trip_type: z.enum(['One Way', 'Round Trip', 'Multi-Stop', 'Local', 'Outstation']),
  priority: z.enum(['Low', 'Normal', 'High', 'Urgent']).default('Normal'),
  booking_reference: z.string().max(100).nullable().optional().or(z.literal('')),
  remarks: z.string().max(1000).nullable().optional(),

  // Section 2 — Schedule & Geography
  start_date: z.string().min(1, 'Start date is required')
    .refine(val => !isNaN(Date.parse(val)), 'Invalid date format'),
  expected_end_date: z.string().nullable().optional()
    .refine(val => !val || !isNaN(Date.parse(val)), 'Invalid date format'),
  origin: z.string()
    .min(2, 'Origin must be at least 2 characters')
    .max(200),
  destination: z.string()
    .min(2, 'Destination must be at least 2 characters')
    .max(200),
  distance_km: z.coerce.number().positive().nullable().optional(),
  estimated_duration_mins: z.coerce.number().positive().nullable().optional(),

  // Section 3 — Route & Parties
  route_id: z.string().uuid('Invalid Route selection').nullable().optional().or(z.literal('')),
  company_id: z.string().uuid('Invalid Company selection').nullable().optional().or(z.literal('')),
  customer_id: z.string().uuid('Invalid Customer selection').nullable().optional().or(z.literal('')),

  // Section 4 — Resources (Required by Backend)
  vehicle_id: z.string().uuid('Please select a vehicle'),
  driver_id: z.string().uuid('Please select a driver'),
  co_driver_id: z.string().uuid('Invalid Co-driver selection').nullable().optional().or(z.literal('')),
  dispatcher_id: z.string().uuid('Invalid Dispatcher selection').nullable().optional().or(z.literal('')),

}).superRefine((data, ctx) => {
  // Cross-field: expected_end_date must be after start_date
  if (data.start_date && data.expected_end_date) {
    if (new Date(data.expected_end_date) <= new Date(data.start_date)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Expected end date must be after start date',
        path: ['expected_end_date'],
      });
    }
  }

  // Cross-field: co_driver requires driver
  if (data.co_driver_id && !data.driver_id) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'A primary driver must be assigned before assigning a co-driver',
      path: ['co_driver_id'],
    });
  }
});

export type TripFormValues = z.infer<typeof tripSchema>;

// ─── Transition & Operation Schemas ─────────────────────────────────────────

export const tripCancelSchema = z.object({
  reason: z.string()
    .min(10, 'Please provide a reason of at least 10 characters')
    .max(500, 'Reason cannot exceed 500 characters'),
});
export type TripCancelValues = z.infer<typeof tripCancelSchema>;

export const bulkCancelSchema = z.object({
  reason: z.string()
    .min(10, 'Please provide a shared reason of at least 10 characters')
    .max(500),
  confirm_count: z.coerce.number().int().positive(),
});
export type BulkCancelValues = z.infer<typeof bulkCancelSchema>;

export const addNoteSchema = z.object({
  note: z.string()
    .min(1, 'Note cannot be empty')
    .max(1000, 'Note cannot exceed 1000 characters'),
});
export type AddNoteValues = z.infer<typeof addNoteSchema>;

export const dispatchTripSchema = z.object({
  confirmation_notes: z.string().max(500).nullable().optional(),
});
export type DispatchTripValues = z.infer<typeof dispatchTripSchema>;

export const startTripSchema = z.object({
  actual_start_time: z.string().nullable().optional(),
  reporting_address: z.string().max(200).nullable().optional(),
});
export type StartTripValues = z.infer<typeof startTripSchema>;

export const completeTripSchema = z.object({
  actual_end_time: z.string().nullable().optional(),
  total_km: z.coerce.number().int().positive().nullable().optional(),
});
export type CompleteTripValues = z.infer<typeof completeTripSchema>;
