import { TripPaymentDetails } from '../domain/finance-types';
import { FinanceApi } from '../api/finance-api';
import { PaymentFormValues } from '../schemas/finance-schemas';
import { FinanceRules } from '../domain/finance-rules';

export const PaymentService = {
  /**
   * Fetches payment details for a trip
   */
  getPaymentDetails: async (tripId: string): Promise<TripPaymentDetails | null> => {
    return await FinanceApi.getTripPaymentDetails(tripId);
  },

  /**
   * Records a payment against a trip.
   */
  recordPayment: async (tripId: string, values: PaymentFormValues): Promise<TripPaymentDetails> => {
    const currentPaymentDetails = await FinanceApi.getTripPaymentDetails(tripId);
    
    // In a real system, we'd also validate against the invoice status,
    // but the API handles the balance_due rules currently.

    if (currentPaymentDetails && !FinanceRules.isValidPaymentAmount(values.amount, currentPaymentDetails.balance_due)) {
      throw new Error('Payment amount is invalid.');
    }

    return await FinanceApi.recordPayment(tripId, values);
  },

  /**
   * Resets all payments for a trip (Mock only)
   */
  resetPayments: async (tripId: string): Promise<void> => {
    await FinanceApi.resetPayments(tripId);
  }
};
