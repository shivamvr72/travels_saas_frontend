export const EXPENSE_CATEGORIES = [
  'Fuel',
  'Toll',
  'Parking',
  'Driver Allowance',
  'Food',
  'Accommodation',
  'Repair',
  'Maintenance',
  'Permit Charges',
  'Police / Checkpost',
  'Miscellaneous',
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];

export const PAYMENT_MODES = ['cash', 'upi', 'bank', 'cheque'] as const;
export type PaymentMode = typeof PAYMENT_MODES[number];

export const INVOICE_STATUSES = ['Draft', 'Generated', 'Sent', 'Partially Paid', 'Paid', 'Closed', 'Cancelled'] as const;
export type InvoiceStatus = typeof INVOICE_STATUSES[number];

export const PAYMENT_STATUSES = ['Pending', 'Partial', 'Completed', 'Refunded'] as const;
export type PaymentStatus = typeof PAYMENT_STATUSES[number];

export const CURRENCY_CONFIG = {
  locale: 'en-IN',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

// Standard precision multiplier for avoiding floating point issues (e.g. 100 for cents/paise)
export const DECIMAL_PRECISION = 100;
