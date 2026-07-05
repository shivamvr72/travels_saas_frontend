import { Invoice } from '../domain/finance-types';
import { FinanceApi } from '../api/finance-api';
import { CalculationEngine } from '../domain/calculation-engine';
import { FinanceRules } from '../domain/finance-rules';
import { InvoiceGenerationValues } from '../schemas/finance-schemas';
import { TripStatus } from '@/features/trips/domain/trip-types';

export const BillingService = {
  /**
   * Fetches or generates a draft invoice for a trip.
   * Enforces rules about when an invoice can be generated.
   */
  getOrCreateDraftInvoice: async (tripId: string, tripStatus: TripStatus): Promise<Invoice | null> => {
    // Check if an invoice already exists
    let invoice = await FinanceApi.getTripInvoice(tripId);
    if (invoice) return invoice;

    // Validate if a new invoice can be generated
    if (!FinanceRules.canGenerateInvoice(tripStatus)) {
      return null;
    }

    // Default parameters for a draft invoice (this would usually come from the backend's route_rates)
    const baseInvoice: Partial<Invoice> = {
      base_rate: 0,
      included_km: 80,
      included_hrs: 8,
      extra_km: 0,
      extra_km_rate: 0,
      extra_km_amount: 0,
      extra_hrs: 0,
      extra_hr_rate: 0,
      extra_hr_amount: 0,
      night_charge: 0,
      driver_meal: 0,
      toll_tax: 0,
      parking_charge: 0,
      other_charges: 0,
      gst_percent: 5, // Default 5% GST for transport
    };

    // Calculate totals using pure functions
    const totals = CalculationEngine.calculateInvoiceTotals(baseInvoice);
    const draftData = { ...baseInvoice, ...totals };

    invoice = await FinanceApi.generateDraftInvoice(tripId, draftData);
    return invoice;
  },

  /**
   * Finalizes a draft invoice.
   */
  finalizeInvoice: async (tripId: string, invoiceId: string, values: InvoiceGenerationValues): Promise<Invoice> => {
    const currentInvoice = await FinanceApi.getTripInvoice(tripId);
    if (!currentInvoice || !FinanceRules.canEditInvoice(currentInvoice.status)) {
      throw new Error('Invoice cannot be finalized in its current state.');
    }

    return await FinanceApi.finalizeInvoice(invoiceId, tripId, values);
  },

  /**
   * Calculates dynamic totals based on user edits to a draft invoice.
   */
  recalculateTotals: (invoiceBase: Partial<Invoice>): { subtotal: number; gst_amount: number; total_amount: number } => {
    // If we wanted to also recalculate extra_km_amount = extra_km * extra_km_rate here, we could
    // but the engine currently aggregates the final components. We'll pre-calculate multipliers first.
    
    const extraKmAmount = CalculationEngine.multiply(invoiceBase.extra_km || 0, invoiceBase.extra_km_rate || 0);
    const extraHrAmount = CalculationEngine.multiply(invoiceBase.extra_hrs || 0, invoiceBase.extra_hr_rate || 0);
    
    const preparedBase = {
      ...invoiceBase,
      extra_km_amount: extraKmAmount,
      extra_hr_amount: extraHrAmount,
    };

    return CalculationEngine.calculateInvoiceTotals(preparedBase);
  }
};
