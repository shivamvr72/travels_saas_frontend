import * as z from 'zod';

export const driverSchema = z.object({
  name: z.string().min(2, 'Full name is required').max(100),
  phone: z.string().min(10, 'Valid phone required').max(20),
  alternate_phone: z.string().max(20).nullable().optional().or(z.literal('')),
  date_of_birth: z.string().nullable().optional().or(z.literal('')),
  address: z.string().max(500).nullable().optional(),
  joining_date: z.string().nullable().optional().or(z.literal('')),
  monthly_salary: z.preprocess((val) => (val === '' ? null : Number(val)), z.number().min(0).nullable().optional()),
  license_no: z.string().min(5, 'License number is required').max(50),
  license_expiry: z.string().min(10, 'License expiry date is required'),
  notes: z.string().nullable().optional(),
  is_active: z.boolean().default(true),
});

export type DriverFormValues = z.infer<typeof driverSchema>;
