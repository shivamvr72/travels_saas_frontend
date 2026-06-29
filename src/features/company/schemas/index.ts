import * as z from 'zod';

export const companySchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  gstin: z.string().max(15).nullable().optional(),
  contact_person: z.string().max(100).nullable().optional(),
  email: z.string().email('Invalid email').nullable().optional().or(z.literal('')),
  phone: z.string().max(20).nullable().optional(),
  address: z.string().max(500).nullable().optional(),
  city: z.string().max(100).nullable().optional(),
  state: z.string().max(100).nullable().optional(),
  pincode: z.string().max(20).nullable().optional(),
  credit_period_days: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
});

export type CompanyFormValues = z.infer<typeof companySchema>;
