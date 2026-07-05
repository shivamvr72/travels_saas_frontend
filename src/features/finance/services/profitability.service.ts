import { ProfitabilitySummary } from '../domain/finance-types';
import { FinanceApi } from '../api/finance-api';
import { CalculationEngine } from '../domain/calculation-engine';

export const ProfitabilityService = {
  /**
   * Orchestrates fetching related trip financial data and calculating profitability.
   */
  getTripProfitability: async (tripId: string): Promise<ProfitabilitySummary> => {
    const [expenses, invoice] = await Promise.all([
      FinanceApi.getTripExpenses(tripId),
      FinanceApi.getTripInvoice(tripId)
    ]);

    // Gross Revenue is the subtotal (excluding GST) or 0 if no invoice yet
    const grossRevenue = invoice?.subtotal || 0;
    
    // Total Expenses
    const totalExpenses = CalculationEngine.aggregateExpenses(expenses);

    // Calculate profitability
    const profitability = CalculationEngine.calculateProfitability(grossRevenue, totalExpenses);

    return {
      gross_revenue: grossRevenue,
      total_expenses: totalExpenses,
      ...profitability,
    };
  }
};
