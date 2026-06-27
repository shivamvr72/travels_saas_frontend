import * as z from 'zod';

export const vehicleSchema = z.object({
  registration_number: z.string().min(2, 'Registration number required').max(50),
  make: z.string().min(2, 'Make is required').max(100),
  model: z.string().min(2, 'Model is required').max(100),
  year: z.number().int().min(1990).max(new Date().getFullYear() + 1).nullable().optional(),
  type: z.string().max(50).nullable().optional(),
  seating_capacity: z.number().int().min(1).default(4),
  fuel_type: z.string().max(50).nullable().optional(),
  rc_number: z.string().max(50).nullable().optional(),
  rc_expiry: z.string().nullable().optional().or(z.literal('')),
  insurance_provider: z.string().max(100).nullable().optional(),
  insurance_policy_number: z.string().max(100).nullable().optional(),
  insurance_expiry: z.string().nullable().optional().or(z.literal('')),
  fitness_certificate_number: z.string().max(50).nullable().optional(),
  fitness_expiry: z.string().nullable().optional().or(z.literal('')),
  pollution_certificate_number: z.string().max(50).nullable().optional(),
  pollution_expiry: z.string().nullable().optional().or(z.literal('')),
  permit_number: z.string().max(50).nullable().optional(),
  permit_expiry: z.string().nullable().optional().or(z.literal('')),
  is_active: z.boolean().default(true),
  status: z.string().default('available'),
});

export type VehicleFormValues = z.infer<typeof vehicleSchema>;
