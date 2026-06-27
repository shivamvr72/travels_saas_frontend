import * as z from 'zod';

export const zodValidators = {
  // Common primitives
  name: z.string().min(2, 'Must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address').nullable().optional().or(z.literal('')),
  phone: z.string().min(10, 'Valid phone required').max(20),
  optionalPhone: z.string().max(20).nullable().optional(),
  
  // Business primitives
  amount: z.number().min(0, 'Amount must be positive'),
  percentage: z.number().min(0).max(100, 'Percentage must be between 0 and 100'),
  
  // Specific domains
  gstin: z.string().max(15, 'GSTIN cannot exceed 15 characters').nullable().optional(),
  pan: z.string().length(10, 'PAN must be exactly 10 characters').nullable().optional(),
  vehicleRegistration: z.string().min(4, 'Invalid registration number').max(20),
  licenseNumber: z.string().min(5, 'Invalid license number').max(50),
  
  // Dates
  pastDate: z.string().refine((val) => !val || new Date(val) <= new Date(), { message: 'Date cannot be in the future' }),
  futureDate: z.string().refine((val) => !val || new Date(val) > new Date(), { message: 'Date must be in the future' }),
  dateString: z.string().nullable().optional().or(z.literal('')),
};
