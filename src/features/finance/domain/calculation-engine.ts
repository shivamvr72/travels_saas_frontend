import { DECIMAL_PRECISION } from './finance-constants';
import { Invoice, TripExpense } from './finance-types';

/**
 * Reusable calculation engine for deterministic financial computations.
 * Uses integer multiplication to avoid floating point precision issues.
 */
export const CalculationEngine = {
  /**
   * Helper to ensure precise addition
   */
  add: (a: number, b: number): number => {
    return Math.round(a * DECIMAL_PRECISION + b * DECIMAL_PRECISION) / DECIMAL_PRECISION;
  },

  /**
   * Helper to ensure precise subtraction
   */
  subtract: (a: number, b: number): number => {
    return Math.round(a * DECIMAL_PRECISION - b * DECIMAL_PRECISION) / DECIMAL_PRECISION;
  },

  /**
   * Helper to ensure precise multiplication
   */
  multiply: (a: number, b: number): number => {
    return Math.round((a * DECIMAL_PRECISION) * b) / DECIMAL_PRECISION;
  },

  /**
   * Calculate total amount from a list of expenses
   */
  aggregateExpenses: (expenses: TripExpense[]): number => {
    return expenses.reduce((total, exp) => CalculationEngine.add(total, exp.amount || 0), 0);
  },

  /**
   * Calculate outstanding balance
   */
  calculateOutstanding: (totalPayment: number, advancePayment: number, otherPayment: number): number => {
    const totalPaid = CalculationEngine.add(advancePayment, otherPayment);
    return Math.max(0, CalculationEngine.subtract(totalPayment, totalPaid));
  },

  /**
   * Calculate invoice totals (subtotal, gst, grand total)
   */
  calculateInvoiceTotals: (invoiceBase: Partial<Invoice>): { subtotal: number; gst_amount: number; total_amount: number } => {
    let subtotal = 0;
    subtotal = CalculationEngine.add(subtotal, invoiceBase.base_rate || 0);
    subtotal = CalculationEngine.add(subtotal, invoiceBase.extra_km_amount || 0);
    subtotal = CalculationEngine.add(subtotal, invoiceBase.extra_hr_amount || 0);
    subtotal = CalculationEngine.add(subtotal, invoiceBase.night_charge || 0);
    subtotal = CalculationEngine.add(subtotal, invoiceBase.driver_meal || 0);
    subtotal = CalculationEngine.add(subtotal, invoiceBase.toll_tax || 0);
    subtotal = CalculationEngine.add(subtotal, invoiceBase.parking_charge || 0);
    subtotal = CalculationEngine.add(subtotal, invoiceBase.other_charges || 0);

    const gstPercent = invoiceBase.gst_percent || 0;
    const gstAmount = CalculationEngine.multiply(subtotal, gstPercent / 100);
    const totalAmount = CalculationEngine.add(subtotal, gstAmount);

    return {
      subtotal,
      gst_amount: gstAmount,
      total_amount: totalAmount,
    };
  },

  /**
   * Calculate profitability and margin
   */
  calculateProfitability: (grossRevenue: number, totalExpenses: number): { net_profit: number; profit_margin_percent: number } => {
    const netProfit = CalculationEngine.subtract(grossRevenue, totalExpenses);
    
    let profitMargin = 0;
    if (grossRevenue > 0) {
      // (net_profit / gross_revenue) * 100
      profitMargin = (netProfit / grossRevenue) * 100;
      // Round to 2 decimal places
      profitMargin = Math.round(profitMargin * 100) / 100;
    }

    return {
      net_profit: netProfit,
      profit_margin_percent: profitMargin,
    };
  },
};
