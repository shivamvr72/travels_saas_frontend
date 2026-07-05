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

export const paymentFormSchema = z.object({
  amount: z.coerce.number().positive('Amount must be positive'),
  payment_mode: z.enum(PAYMENT_MODES),
  payment_date: z.string().min(1, 'Date is required'),
  reference_no: z.string().optional(),
  remarks: z.string().optional(),
});

export type PaymentFormValues = z.infer<typeof paymentFormSchema>;

export const invoiceGenerationSchema = z.object({
  due_date: z.string().min(1, 'Due date is required'),
  remarks: z.string().optional(),
});

export type InvoiceGenerationValues = z.infer<typeof invoiceGenerationSchema>;
