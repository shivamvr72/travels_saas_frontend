import * as z from 'zod';

export const driverSchema = z.object({
  first_name: z.string().min(2, 'First name is required').max(50),
  last_name: z.string().max(50).nullable().optional(),
  phone: z.string().min(10, 'Valid phone required').max(20),
  alternate_phone: z.string().max(20).nullable().optional(),
  license_number: z.string().min(5, 'License required').max(50),
  license_expiry: z.string().min(10, 'Expiry date required'),
  license_type: z.string().max(50).nullable().optional(),
  blood_group: z.string().max(10).nullable().optional(),
  address: z.string().max(500).nullable().optional(),
  is_active: z.boolean().default(true),
  notes: z.string().nullable().optional(),
});

export type DriverFormValues = z.infer<typeof driverSchema>;
