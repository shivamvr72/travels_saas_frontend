import * as z from 'zod';

// ExpenseType values exactly matching backend enum
export const EXPENSE_TYPES = [
  'fuel',
  'service',
  'tyre',
  'repair',
  'insurance',
  'tax',
  'permit',
  'cleaning',
  'external_hire',
  'toll',
  'parking',
  'driver_allowance',
  'food',
  'accommodation',
  'police',
  'other',
] as const;

export type ExpenseType = typeof EXPENSE_TYPES[number];

export const EXPENSE_TYPE_LABELS: Record<ExpenseType, string> = {
  fuel: 'Fuel',
  service: 'Service / Maintenance',
  tyre: 'Tyre',
  repair: 'Repair',
  insurance: 'Insurance',
  tax: 'Tax',
  permit: 'Permit',
  cleaning: 'Cleaning',
  external_hire: 'External Hire',
  toll: 'Toll',
  parking: 'Parking',
  driver_allowance: 'Driver Allowance',
  food: 'Food',
  accommodation: 'Accommodation',
  police: 'Police / Checkpost',
  other: 'Other',
};

export const PAYMENT_MODES = ['cash', 'upi', 'bank', 'cheque'] as const;
export type PaymentMode = typeof PAYMENT_MODES[number];

export const vehicleExpenseSchema = z.object({
  expense_date: z.string().min(1, 'Date is required'),
  expense_type: z.enum(EXPENSE_TYPES, { message: 'Category is required' }),
  amount: z.coerce.number().positive('Amount must be positive'),
  payment_mode: z.enum(PAYMENT_MODES).optional().nullable(),
  vehicle_id: z.string().min(1, 'Vehicle is required'),
  vendor_name: z.string().max(100, 'Vendor name too long').optional().nullable(),
  km_at_expense: z.preprocess(
    (val) => (val === '' || val == null ? null : Number(val)), 
    z.number().int().min(0, 'Must be positive').nullable().optional()
  ),
  next_service_km: z.preprocess(
    (val) => (val === '' || val == null ? null : Number(val)), 
    z.number().int().min(0, 'Must be positive').nullable().optional()
  ),
  receipt_url: z.string().url('Must be a valid URL').optional().nullable().or(z.literal('')),
  notes: z.string().optional().nullable(),
});

export type VehicleExpenseFormValues = z.infer<typeof vehicleExpenseSchema>;
