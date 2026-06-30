import * as z from 'zod';

// Helper for optional string fields that might come in as empty strings
const optionalString = (schema: z.ZodString) => z.union([schema, z.literal(''), z.null(), z.undefined()]).transform(e => e === '' ? null : e);

export const companySchema = z.object({
  name: z.string().trim().min(2, 'Company name must be at least 2 characters').max(100, 'Company name cannot exceed 100 characters'),

  gstin: optionalString(
    z.string().trim().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/, 'Invalid GSTIN format')
  ),

  contact_person: optionalString(
    z.string().trim().min(2, 'Contact person name must be at least 2 characters').max(30, 'Name cannot exceed 30 characters')
  ),

  email: optionalString(
    z.string().trim().email('Please enter a valid email address')
  ),

  phone: optionalString(
    z.string().trim().regex(/^\+?[0-9\s()+-]{10,15}$/, 'Please enter a valid phone number (e.g., +91 9876543210)')
  ),

  address: optionalString(
    z.string().trim().min(5, 'Address must be at least 5 characters').max(200, 'Address cannot exceed 200 characters')
  ),

  city: optionalString(
    z.string().trim().min(2, 'City must be at least 2 characters').max(50, 'City cannot exceed 50 characters')
  ),

  state: optionalString(
    z.string().trim().min(2, 'State must be at least 2 characters').max(50, 'State cannot exceed 50 characters')
  ),

  pincode: optionalString(
    z.string().trim().regex(/^[0-9]{5,6}$/, 'Please enter a valid 5 or 6 digit pincode')
  ),

  credit_period_days: z.coerce.number().int().min(0, 'Credit period cannot be negative').default(0),
  is_active: z.boolean().default(true),
});

export type CompanyFormValues = z.infer<typeof companySchema>;
