import * as z from 'zod';

export const customerSchema = z.object({
  first_name: z.string().min(2, 'First name is required').max(50),
  last_name: z.string().max(50).nullable().optional(),
  phone: z.string().min(10, 'Valid phone required').max(20),
  email: z.string().email('Invalid email').nullable().optional().or(z.literal('')),
  id_proof_type: z.string().max(50).nullable().optional(),
  id_proof_number: z.string().max(100).nullable().optional(),
  address: z.string().max(500).nullable().optional(),
  city: z.string().max(100).nullable().optional(),
  state: z.string().max(100).nullable().optional(),
  pincode: z.string().max(20).nullable().optional(),
  notes: z.string().nullable().optional(),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
