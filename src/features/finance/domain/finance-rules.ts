import { InvoiceStatus, PaymentStatus } from './finance-constants';
import { TripStatus } from '@/features/trips/domain/trip-types';
import { Invoice, TripPaymentDetails } from './finance-types';

/**
 * Domain rules validating state transitions and permissions for financial operations.
 */
export const FinanceRules = {
  /**
   * Constraint: Invoices cannot be generated before trip completion.
   * Allowed statuses: 'completed', 'billed', 'paid'
   */
  canGenerateInvoice: (tripStatus: TripStatus): boolean => {
    return tripStatus === 'completed';
  },

  /**
   * Constraint: Once finalized/sent, the invoice amounts lock.
   * Can edit only if draft/generated.
   */
  canEditInvoice: (invoiceStatus?: InvoiceStatus): boolean => {
    if (!invoiceStatus) return true;
    return ['Draft', 'Generated'].includes(invoiceStatus);
  },

  /**
   * Constraint: Payments require an existing invoice that is not cancelled.
   * Draft invoices cannot be paid. Must be at least Generated.
   */
  canReceivePayment: (invoice?: Invoice | null, paymentDetails?: TripPaymentDetails | null): boolean => {
    if (!invoice) return false;
    if (paymentDetails && paymentDetails.balance_due <= 0) return false;
    return ['Generated', 'Sent', 'Partially Paid', 'Paid'].includes(invoice.status);
  },

  /**
   * Constraint: Expenses cannot be added/deleted if financials are closed or trip is paid.
   */
  canModifyExpenses: (tripStatus: TripStatus): boolean => {
    return tripStatus !== 'cancelled';
  },

  /**
   * Constraint: Payment amount must be positive.
   * (Overpayments are allowed to accommodate round-offs or tips)
   */
  isValidPaymentAmount: (amountToPay: number, currentBalanceDue: number): boolean => {
    return amountToPay > 0;
  },

  /**
   * Checks if financials can be closed (balance due is 0 and invoice is fully paid).
   */
  canCloseFinancials: (paymentDetails?: TripPaymentDetails | null, invoice?: Invoice | null): boolean => {
    if (!paymentDetails || !invoice) return false;
    return paymentDetails.balance_due <= 0 && invoice.status === 'Paid';
  },
};
