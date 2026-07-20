import { SettlementSummaryResponse } from '../types';

/**
 * Pure functions to derive UI state based on the settlement summary.
 * These strictly enforce the UI workflows without duplicating backend math.
 */

export function canCalculateBilling(summary: SettlementSummaryResponse | undefined | null): boolean {
  if (!summary) return false;
  // Can only calculate if not yet settled. (Even if billing exists, we can recalculate before settlement).
  return !summary.payment_summary?.is_settled;
}

export function canRecordPayment(summary: SettlementSummaryResponse | undefined | null): boolean {
  if (!summary) return false;
  // Must have a billing record first, must not be settled, and balance > 0
  if (!summary.billing) return false;
  if (summary.payment_summary?.is_settled) return false;
  
  // Safe string to number check just to ensure it's > 0
  const balance = Number(summary.payment_summary?.balance_due || 0);
  return balance > 0;
}

export function canCompleteSettlement(summary: SettlementSummaryResponse | undefined | null): boolean {
  if (!summary) return false;
  // Must have a billing record, must not be settled, and balance must be exactly 0
  if (!summary.billing) return false;
  if (summary.payment_summary?.is_settled) return false;
  
  const balance = Number(summary.payment_summary?.balance_due || 0);
  return balance === 0;
}
