import * as z from 'zod';

export const vehicleSchema = z.object({
  reg_number: z.string().min(2, 'Registration number is required').max(50),
  brand_name: z.string().min(2, 'Brand name is required').max(100),
  model_type: z.string().min(2, 'Model is required').max(100),
  vehicle_type: z.string().max(50).nullable().optional(),
  seating_capacity: z.preprocess((val) => (val === '' ? null : Number(val)), z.number().int().min(1).default(4)),
  fuel_type: z.string().max(50).nullable().optional(),
  rc_expiry: z.string().nullable().optional().or(z.literal('')),
  insurance_expiry: z.string().nullable().optional().or(z.literal('')),
  fitness_expiry: z.string().nullable().optional().or(z.literal('')),
  permit_expiry: z.string().nullable().optional().or(z.literal('')),
  is_active: z.boolean().default(true),
});

export type VehicleFormValues = z.infer<typeof vehicleSchema>;
