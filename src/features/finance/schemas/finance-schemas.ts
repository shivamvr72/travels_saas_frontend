import { z } from 'zod';
import { EXPENSE_CATEGORIES, PAYMENT_MODES } from '../domain/finance-constants';

export const expenseFormSchema = z.object({
  amount: z.coerce.number().positive('Amount must be positive'),
  category: z.enum(EXPENSE_CATEGORIES),
  payment_mode: z.enum(PAYMENT_MODES),
  paid_by: z.string().optional(),
  expense_date: z.string().min(1, 'Date is required'),
  remarks: z.string().optional(),
  receipt_url: z.string().url().optional().or(z.literal('')),
});

export type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

export const createPaymentFormSchema = (maxAmount?: number) =>
  z.object({
    amount: z.coerce
      .number()
      .positive('Amount must be positive')
      .refine(
        (val) => maxAmount === undefined || maxAmount <= 0 || val <= maxAmount,
        { message: `Amount cannot exceed balance due of ₹${maxAmount?.toFixed(2) ?? 0}` }
      ),
    payment_mode: z.enum(PAYMENT_MODES),
    payment_date: z.string().min(1, 'Date is required'),
    reference_no: z.string().optional(),
    remarks: z.string().optional(),
  });

// Default schema without max constraint (for backward compat)
export const paymentFormSchema = createPaymentFormSchema();

export type PaymentFormValues = z.infer<ReturnType<typeof createPaymentFormSchema>>;

export const invoiceGenerationSchema = z.object({
  due_date: z.string().min(1, 'Due date is required'),
  remarks: z.string().optional(),
});

export type InvoiceGenerationValues = z.infer<typeof invoiceGenerationSchema>;
export const invoiceUpdateSchema = z.object({
  base_rate: z.coerce.number().min(0, 'Base rate cannot be negative'),
  included_km: z.coerce.number().min(0, 'Included KM cannot be negative'),
  included_hrs: z.coerce.number().min(0, 'Included Hrs cannot be negative'),
  extra_km: z.coerce.number().min(0, 'Extra KM cannot be negative'),
  extra_km_rate: z.coerce.number().min(0, 'Rate cannot be negative'),
  extra_hrs: z.coerce.number().min(0, 'Extra Hrs cannot be negative'),
  extra_hr_rate: z.coerce.number().min(0, 'Rate cannot be negative'),
  night_charge: z.coerce.number().min(0, 'Charge cannot be negative'),
  driver_meal: z.coerce.number().min(0, 'Allowance cannot be negative'),
  toll_tax: z.coerce.number().min(0, 'Tax cannot be negative'),
  parking_charge: z.coerce.number().min(0, 'Charge cannot be negative'),
  other_charges: z.coerce.number().min(0, 'Charge cannot be negative'),
  gst_percent: z.coerce.number().min(0, 'GST cannot be negative').max(100, 'GST cannot exceed 100%'),
});

export type InvoiceUpdateValues = z.infer<typeof invoiceUpdateSchema>;
