import React from 'react';
import { Trip } from '../../domain/trip-types';
import { useSettlementSummary } from '@/features/trip-settlement/api/trip-settlement-api';
import { AppLoadingState } from '@/components/shared/app-loading-state';
import { AppErrorState } from '@/components/shared/app-error-state';
import { BillingBreakdownCard } from '@/features/trip-settlement/components/billing-breakdown-card';
import { ExpenseSummaryCard } from '@/features/trip-settlement/components/expense-summary-card';
import { PaymentLedgerCard } from '@/features/trip-settlement/components/payment-ledger-card';
import { SettlementActionPanel } from '@/features/trip-settlement/components/settlement-action-panel';
import { ProfitabilitySummaryCard } from '@/features/trip-settlement/components/profitability-summary-card';

interface TripSettlementTabProps {
  trip: Trip;
}

export function TripSettlementTab({ trip }: TripSettlementTabProps) {
  const { data: summary, isLoading, error, refetch } = useSettlementSummary(trip.id);

  if (isLoading) return <AppLoadingState />;
  if (error || !summary) return <AppErrorState message="Failed to load settlement summary" retry={() => refetch()} />;

  return (
    <div className="max-w-5xl mx-auto space-y-6 mt-6 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <BillingBreakdownCard summary={summary} />
          <ExpenseSummaryCard summary={summary} />
        </div>
        
        <div className="space-y-6">
          <PaymentLedgerCard summary={summary} />
          <ProfitabilitySummaryCard tripId={trip.id} />
        </div>
      </div>

      <SettlementActionPanel summary={summary} />
    </div>
  );
}
