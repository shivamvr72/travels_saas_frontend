import * as z from 'zod';

export const vehicleSchema = z.object({
  reg_number: z.string().trim().toUpperCase()
    .min(5, 'Registration number is too short')
    .max(15, 'Registration number cannot exceed 15 characters')
    .regex(/^[A-Z]{2}[\s\-]?[0-9]{1,2}[\s\-]?(?:[A-Z]{1,3}[\s\-]?)?[0-9]{1,4}$/, 'Invalid Vehicle Registration format (e.g., MH 12 AB 1234)'),
  brand_name: z.string().trim().min(2, 'Brand name is required').max(50, 'Brand name cannot exceed 50 characters').regex(/^[a-zA-Z0-9\s.,-]+$/, 'Brand contains invalid characters'),
  model_type: z.string().trim().min(2, 'Model is required').max(50, 'Model cannot exceed 50 characters').regex(/^[a-zA-Z0-9\s.,-]+$/, 'Model contains invalid characters'),
  vehicle_type: z.string().max(50, 'Vehicle type cannot exceed 50 characters').nullable().optional(),
  seating_capacity: z.preprocess(
    (val) => (val === '' || val == null ? null : Number(val)), 
    z.number({ invalid_type_error: 'Seating capacity must be a valid number' })
      .int('Must be a whole number')
      .min(1, 'Capacity must be at least 1')
      .max(100, 'Capacity cannot exceed 100')
      .default(4)
  ),
  fuel_type: z.string().max(50, 'Fuel type cannot exceed 50 characters').nullable().optional(),
  rc_expiry: z.string().nullable().optional().or(z.literal('')),
  insurance_expiry: z.string().nullable().optional().or(z.literal('')),
  fitness_expiry: z.string().nullable().optional().or(z.literal('')),
  permit_expiry: z.string().nullable().optional().or(z.literal('')),
  is_active: z.boolean().default(true),
});

export type VehicleFormValues = z.infer<typeof vehicleSchema>;
