import * as z from 'zod';

export const customerSchema = z.object({
  name: z.string().min(2, 'Full name is required').max(100).regex(/^[a-zA-Z\s]+$/, 'Please use valid characters for name (Firstname Middle Lastname)'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(15, 'Phone number cannot exceed 15 digits').regex(/^\+?[0-9]{10,15}$/, 'Invalid phone format'),
  alternate_phone: z.string().max(15, 'Phone number cannot exceed 15 digits').regex(/^\+?[0-9]{10,15}$/, 'Invalid phone format').nullable().optional().or(z.literal('')),
  email: z.string().email('Invalid email').nullable().optional().or(z.literal('')),
  id_proof_type: z.string().max(50).nullable().optional(),
  id_proof_number: z.string().max(100).toUpperCase().nullable().optional(),
  address: z.string().max(500).nullable().optional(),
  city: z.string().max(100).nullable().optional(),
  state: z.string().max(100).nullable().optional(),
}).superRefine((data, ctx) => {
  if (data.id_proof_type && data.id_proof_number) {
    if (data.id_proof_type === 'PAN') {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(data.id_proof_number)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid PAN format (e.g., ABCDE1234F)',
          path: ['id_proof_number'],
        });
      }
    } else if (data.id_proof_type === 'Aadhaar') {
      const aadhaarRegex = /^\d{12}$/;
      if (!aadhaarRegex.test(data.id_proof_number)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Aadhaar must be exactly 12 digits',
          path: ['id_proof_number'],
        });
      }
    } else if (data.id_proof_type === 'Voter ID') {
      const voterRegex = /^[A-Z]{3}[0-9]{7}$/;
      if (!voterRegex.test(data.id_proof_number)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid Voter ID format (e.g., ABC1234567)',
          path: ['id_proof_number'],
        });
      }
    } else if (data.id_proof_type === 'Driving License') {
      const dlRegex = /^[A-Z]{2}[0-9]{2}[ -]?[0-9]{11}$/;
      if (!dlRegex.test(data.id_proof_number)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid Driving License format (e.g., MH1420110012345)',
          path: ['id_proof_number'],
        });
      }
    } else if (data.id_proof_type === 'Passport') {
      const passportRegex = /^[A-Z]{1}[0-9]{7}$/;
      if (!passportRegex.test(data.id_proof_number)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid Passport format (e.g., A1234567)',
          path: ['id_proof_number'],
        });
      }
    }
  }
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
