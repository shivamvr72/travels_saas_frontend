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
    if (currentPaymentDetails && currentPaymentDetails.balance_due <= 0) {
      throw new Error('This trip is already fully paid.');
    }

    if (currentPaymentDetails && !FinanceRules.isValidPaymentAmount(values.amount, currentPaymentDetails.balance_due)) {
      throw new Error('Payment amount is invalid or exceeds the balance due.');
    }

    return await FinanceApi.recordPayment(tripId, values);
  }
};
