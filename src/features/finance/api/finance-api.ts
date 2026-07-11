import { apiClient } from '@/shared/lib/axios';
import { Invoice, TripExpense, TripPaymentDetails, ProfitabilitySummary } from '../domain/finance-types';
import { ExpenseFormValues, PaymentFormValues, InvoiceGenerationValues } from '../schemas/finance-schemas';
import { ExpenseCategory } from '../domain/finance-constants';

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

const mockExpenses: Record<string, TripExpense[]> = getStorage('svr_mockExpenses', {});
const mockInvoices: Record<string, Invoice> = getStorage('svr_mockInvoices', {});
const mockPayments: Record<string, TripPaymentDetails> = getStorage('svr_mockPayments', {});

/**
 * Temporary mock API client for Finance endpoints.
 * These methods will be replaced with actual `apiClient` calls once backend DB changes are applied.
 */

const mapBackendToFrontendCategory = (backendType: string): ExpenseCategory => {
  const mapping: Record<string, ExpenseCategory> = {
    fuel: 'Fuel',
    toll: 'Toll',
    parking: 'Parking',
    repair: 'Repair',
    service: 'Maintenance',
    permit: 'Permit Charges',
    driver_allowance: 'Driver Allowance',
    food: 'Food',
    accommodation: 'Accommodation',
    police: 'Police / Checkpost',
  };
  return mapping[backendType] || 'Miscellaneous';
};

const mapFrontendToBackendCategory = (frontendType: ExpenseCategory): string => {
  const mapping: Record<ExpenseCategory, string> = {
    'Fuel': 'fuel',
    'Toll': 'toll',
    'Parking': 'parking',
    'Repair': 'repair',
    'Maintenance': 'service',
    'Permit Charges': 'permit',
    'Driver Allowance': 'driver_allowance',
    'Food': 'food',
    'Accommodation': 'accommodation',
    'Police / Checkpost': 'police',
    'Miscellaneous': 'other',
  };
  return mapping[frontendType] || 'other';
};

export const FinanceApi = {
  // ─── EXPENSES ─────────────────────────────────────────────────────────────
  
  getTripExpenses: async (tripId: string): Promise<TripExpense[]> => {
    const response = await apiClient.get(`/api/v1/trips/${tripId}/expenses`);
    return response.data.map((exp: any) => ({
      id: exp.id,
      trip_id: exp.trip_id,
      amount: exp.amount,
      category: mapBackendToFrontendCategory(exp.expense_type),
      payment_mode: exp.payment_mode || 'cash',
      paid_by: exp.vendor_name,
      expense_date: exp.expense_date,
      remarks: exp.notes,
      receipt_url: exp.receipt_url,
      approval_status: 'approved',
      created_at: exp.created_at,
      updated_at: exp.created_at,
    }));
  },

  addTripExpense: async (tripId: string, data: ExpenseFormValues): Promise<TripExpense> => {
    const response = await apiClient.post(`/api/v1/trips/${tripId}/expenses`, {
      expense_date: new Date().toISOString().split('T')[0], // ensure format YYYY-MM-DD
      expense_type: mapFrontendToBackendCategory(data.category),
      amount: data.amount,
      payment_mode: data.payment_mode,
      vendor_name: data.paid_by,
      notes: data.remarks,
      receipt_url: data.receipt_url,
    });
    const exp = response.data;
    return {
      id: exp.id,
      trip_id: exp.trip_id,
      amount: exp.amount,
      category: mapBackendToFrontendCategory(exp.expense_type),
      payment_mode: exp.payment_mode || data.payment_mode || 'cash',
      paid_by: exp.vendor_name,
      expense_date: exp.expense_date,
      remarks: exp.notes,
      receipt_url: exp.receipt_url,
      approval_status: 'approved',
      created_at: exp.created_at,
      updated_at: exp.created_at,
    };
  },

  deleteTripExpense: async (expenseId: string, tripId: string): Promise<void> => {
    await apiClient.delete(`/api/v1/trips/${tripId}/expenses/${expenseId}`);
  },

  // ─── BILLING & INVOICING ──────────────────────────────────────────────────
  
  getTripInvoice: async (tripId: string): Promise<Invoice | null> => {
    try {
      const response = await apiClient.get(`/api/v1/trips/${tripId}/billing`);
      const billing = response.data;
      return {
        ...billing,
        invoice_number: billing.invoice_id,
        status: billing.invoice_id ? 'Generated' : 'Draft',
      } as Invoice;
    } catch (e: any) {
      if (e.response?.status === 404) return null;
      throw e;
    }
  },

  generateDraftInvoice: async (tripId: string, invoiceBase: Partial<Invoice>): Promise<Invoice> => {
    const response = await apiClient.put(`/api/v1/trips/${tripId}/billing`, invoiceBase);
    const billing = response.data;
    return {
      ...billing,
      invoice_number: billing.invoice_id,
      status: billing.invoice_id ? 'Generated' : 'Draft',
    } as Invoice;
  },

  updateDraftInvoice: async (tripId: string, invoiceId: string, updates: Partial<Invoice>): Promise<Invoice> => {
    const response = await apiClient.put(`/api/v1/trips/${tripId}/billing`, updates);
    const billing = response.data;
    return {
      ...billing,
      invoice_number: billing.invoice_id,
      status: billing.invoice_id ? 'Generated' : 'Draft',
    } as Invoice;
  },

  syncExpenses: async (tripId: string): Promise<Invoice> => {
    const response = await apiClient.post(`/api/v1/trips/${tripId}/billing/sync-expenses`);
    const billing = response.data;
    return {
      ...billing,
      invoice_number: billing.invoice_id,
      status: billing.invoice_id ? 'Generated' : 'Draft',
    } as Invoice;
  },

  finalizeInvoice: async (invoiceId: string, tripId: string, values: InvoiceGenerationValues): Promise<Invoice> => {
    // values.due_date is not supported in the backend yet, ignoring for now.
    const response = await apiClient.post(`/api/v1/trips/${tripId}/billing/finalize`);
    const billing = response.data;
    return {
      ...billing,
      invoice_number: billing.invoice_id,
      status: billing.invoice_id ? 'Generated' : 'Draft',
    } as Invoice;
  },

  revertInvoice: async (tripId: string): Promise<Invoice> => {
    const response = await apiClient.post(`/api/v1/trips/${tripId}/billing/revert`);
    const billing = response.data;
    return {
      ...billing,
      invoice_number: billing.invoice_id,
      status: billing.invoice_id ? 'Generated' : 'Draft',
    } as Invoice;
  },

  // ─── PAYMENTS ──────────────────────────────────────────────────────────────
  
  getTripPaymentDetails: async (tripId: string): Promise<TripPaymentDetails | null> => {
    try {
      const response = await apiClient.get(`/api/v1/trips/${tripId}/payment`);
      return response.data;
    } catch (e: any) {
      if (e.response?.status === 404) return null;
      throw e;
    }
  },

  recordPayment: async (tripId: string, data: PaymentFormValues): Promise<TripPaymentDetails> => {
    const response = await apiClient.post(`/api/v1/trips/${tripId}/payment/record`, data);
    return response.data;
  },

  resetPayments: async (tripId: string): Promise<void> => {
    await apiClient.delete(`/api/v1/trips/${tripId}/payment/clear`);
  }
};
