import { z } from 'zod';

// Utility for strict decimal strings
const decimalString = z.string().regex(/^\d+(\.\d{1,2})?$/, 'Must be a valid decimal amount (e.g. 100.50)');

export const TripBillingSchema = z.object({
  rate_type: z.string().min(1, 'Rate type is required'),
  base_rate: decimalString.optional().or(z.literal('')),
  included_km: z.number().int().nonnegative().optional(),
  included_hrs: z.number().int().nonnegative().optional(),
  extra_km: z.number().int().nonnegative().optional(),
  extra_km_rate: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid format').optional().or(z.literal('')),
  extra_hrs: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid format').optional().or(z.literal('')),
  extra_hr_rate: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid format').optional().or(z.literal('')),
  night_charge: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid format').optional().or(z.literal('')),
  driver_meal: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid format').optional().or(z.literal('')),
  toll_tax: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid format').optional().or(z.literal('')),
  parking_charge: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid format').optional().or(z.literal('')),
  other_charges: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid format').optional().or(z.literal('')),
  gst_percent: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid format').optional().or(z.literal('')),
});

export type TripBillingFormData = z.infer<typeof TripBillingSchema>;

export const TripPaymentSchema = z.object({
  payment_date: z.string().min(1, 'Payment date is required'),
  amount: decimalString.min(1, 'Amount is required'),
  payment_mode: z.string().optional(),
  reference_no: z.string().optional(),
});

export type TripPaymentFormData = z.infer<typeof TripPaymentSchema>;
