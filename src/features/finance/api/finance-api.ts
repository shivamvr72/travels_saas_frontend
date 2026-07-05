import { apiClient } from '@/shared/lib/axios';
import { Invoice, TripExpense, TripPaymentDetails, ProfitabilitySummary } from '../domain/finance-types';
import { ExpenseFormValues, PaymentFormValues, InvoiceGenerationValues } from '../schemas/finance-schemas';

// --- MOCK STORAGE (Since DBML does not have a trip_expenses table yet) ---
const mockExpenses: Record<string, TripExpense[]> = {};
const mockInvoices: Record<string, Invoice> = {};
const mockPayments: Record<string, TripPaymentDetails> = {};

/**
 * Temporary mock API client for Finance endpoints.
 * These methods will be replaced with actual `apiClient` calls once backend DB changes are applied.
 */

export const FinanceApi = {
  // ─── EXPENSES ─────────────────────────────────────────────────────────────
  
  getTripExpenses: async (tripId: string): Promise<TripExpense[]> => {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockExpenses[tripId] || [];
  },

  addTripExpense: async (tripId: string, data: ExpenseFormValues): Promise<TripExpense> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newExpense: TripExpense = {
      id: `exp-${Math.random().toString(36).substring(7)}`,
      trip_id: tripId,
      ...data,
      approval_status: 'approved',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    if (!mockExpenses[tripId]) mockExpenses[tripId] = [];
    mockExpenses[tripId].push(newExpense);
    return newExpense;
  },

  deleteTripExpense: async (expenseId: string, tripId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (mockExpenses[tripId]) {
      mockExpenses[tripId] = mockExpenses[tripId].filter(e => e.id !== expenseId);
    }
  },

  // ─── BILLING & INVOICING ──────────────────────────────────────────────────
  
  getTripInvoice: async (tripId: string): Promise<Invoice | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockInvoices[tripId] || null;
  },

  generateDraftInvoice: async (tripId: string, invoiceBase: Partial<Invoice>): Promise<Invoice> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newInvoice: Invoice = {
      ...invoiceBase,
      id: `inv-${Math.random().toString(36).substring(7)}`,
      invoice_number: `DRAFT-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      trip_id: tripId,
      status: 'Draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Invoice;
    mockInvoices[tripId] = newInvoice;
    return newInvoice;
  },

  finalizeInvoice: async (invoiceId: string, tripId: string, values: InvoiceGenerationValues): Promise<Invoice> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const invoice = mockInvoices[tripId];
    if (!invoice) throw new Error('Invoice not found');
    invoice.status = 'Generated';
    invoice.invoice_number = `KT-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`;
    invoice.due_date = values.due_date;
    invoice.updated_at = new Date().toISOString();
    return invoice;
  },

  // ─── PAYMENTS ──────────────────────────────────────────────────────────────
  
  getTripPaymentDetails: async (tripId: string): Promise<TripPaymentDetails | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockPayments[tripId] || null;
  },

  recordPayment: async (tripId: string, data: PaymentFormValues): Promise<TripPaymentDetails> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    let payment = mockPayments[tripId];
    
    // Create default if not exists
    if (!payment) {
      payment = {
        id: `pay-${Math.random().toString(36).substring(7)}`,
        trip_id: tripId,
        advance_payment: 0,
        other_payment: 0,
        total_payment: mockInvoices[tripId]?.total_amount || 0,
        balance_due: mockInvoices[tripId]?.total_amount || 0,
        is_settled: false,
        status: 'Pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      mockPayments[tripId] = payment;
    }

    payment.other_payment += data.amount;
    payment.balance_due = Math.max(0, payment.total_payment - (payment.advance_payment + payment.other_payment));
    payment.status = payment.balance_due === 0 ? 'Completed' : 'Partial';
    payment.is_settled = payment.balance_due === 0;
    payment.payment_mode = data.payment_mode;
    payment.payment_date = data.payment_date;
    payment.reference_no = data.reference_no;
    payment.updated_at = new Date().toISOString();

    return payment;
  }
};
