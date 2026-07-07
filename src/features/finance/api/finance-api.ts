import { apiClient } from '@/shared/lib/axios';
import { Invoice, TripExpense, TripPaymentDetails, ProfitabilitySummary } from '../domain/finance-types';
import { ExpenseFormValues, PaymentFormValues, InvoiceGenerationValues } from '../schemas/finance-schemas';

// --- MOCK STORAGE with localStorage persistence ---
const getStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

const setStorage = (key: string, value: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

let mockExpenses: Record<string, TripExpense[]> = getStorage('svr_mockExpenses', {});
let mockInvoices: Record<string, Invoice> = getStorage('svr_mockInvoices', {});
let mockPayments: Record<string, TripPaymentDetails> = getStorage('svr_mockPayments', {});

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
    setStorage('svr_mockExpenses', mockExpenses);
    return newExpense;
  },

  deleteTripExpense: async (expenseId: string, tripId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (mockExpenses[tripId]) {
      mockExpenses[tripId] = mockExpenses[tripId].filter(e => e.id !== expenseId);
      setStorage('svr_mockExpenses', mockExpenses);
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
    setStorage('svr_mockInvoices', mockInvoices);
    return newInvoice;
  },

  updateDraftInvoice: async (tripId: string, invoiceId: string, updates: Partial<Invoice>): Promise<Invoice> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const invoice = mockInvoices[tripId];
    if (!invoice || invoice.id !== invoiceId) throw new Error('Invoice not found');
    if (invoice.status !== 'Draft') throw new Error('Only draft invoices can be updated');
    
    Object.assign(invoice, updates);
    invoice.updated_at = new Date().toISOString();
    mockInvoices[tripId] = invoice;
    setStorage('svr_mockInvoices', mockInvoices);
    return invoice;
  },

  finalizeInvoice: async (invoiceId: string, tripId: string, values: InvoiceGenerationValues): Promise<Invoice> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const invoice = mockInvoices[tripId];
    if (!invoice) throw new Error('Invoice not found');
    invoice.status = 'Generated';
    invoice.invoice_number = `KT-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`;
    invoice.due_date = values.due_date;
    invoice.updated_at = new Date().toISOString();
    mockInvoices[tripId] = invoice;
    setStorage('svr_mockInvoices', mockInvoices);
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
        transactions: [],
        total_payment: mockInvoices[tripId]?.total_amount || 0,
        balance_due: mockInvoices[tripId]?.total_amount || 0,
        is_settled: false,
        status: 'Pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      mockPayments[tripId] = payment;
    }

    const newTransaction = {
      id: `txn-${Math.random().toString(36).substring(7)}`,
      amount: data.amount,
      payment_date: data.payment_date,
      payment_mode: data.payment_mode as any,
      reference_no: data.reference_no,
    };

    if (!payment.transactions) {
      payment.transactions = [];
    }
    payment.transactions.push(newTransaction);

    payment.other_payment += data.amount;
    payment.balance_due = Math.max(0, payment.total_payment - (payment.advance_payment + payment.other_payment));
    payment.status = payment.balance_due === 0 ? 'Completed' : 'Partial';
    payment.is_settled = payment.balance_due === 0;
    payment.updated_at = new Date().toISOString();

    mockPayments[tripId] = payment;
    setStorage('svr_mockPayments', mockPayments);
    return payment;
  },

  resetPayments: async (tripId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (mockPayments[tripId]) {
      const payment = mockPayments[tripId];
      payment.other_payment = 0;
      payment.advance_payment = 0;
      payment.transactions = [];
      payment.balance_due = payment.total_payment;
      payment.status = 'Pending';
      payment.is_settled = false;
      setStorage('svr_mockPayments', mockPayments);
    }
  }
};
