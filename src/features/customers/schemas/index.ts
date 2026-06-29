import * as z from 'zod';

export const customerSchema = z.object({
  name: z.string().min(2, 'Full name is required').max(100),
  phone: z.string().min(10, 'Valid phone required').max(20),
  alternate_phone: z.string().max(20).nullable().optional().or(z.literal('')),
  email: z.string().email('Invalid email').nullable().optional().or(z.literal('')),
  id_proof_type: z.string().max(50).nullable().optional(),
  id_proof_number: z.string().max(100).nullable().optional(),
  address: z.string().max(500).nullable().optional(),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
