'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { AppLoadingState } from '@/components/shared/app-loading-state';
import { AppErrorState } from '@/components/shared/app-error-state';
import { useSettlementSummary } from '@/features/trip-settlement/api/trip-settlement-api';
import { BillingBreakdownCard } from '@/features/trip-settlement/components/billing-breakdown-card';
import { ExpenseSummaryCard } from '@/features/trip-settlement/components/expense-summary-card';
import { PaymentLedgerCard } from '@/features/trip-settlement/components/payment-ledger-card';
import { SettlementActionPanel } from '@/features/trip-settlement/components/settlement-action-panel';
import { RequirePermission } from '@/shared/permissions/require-permission';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function SettlementDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params.tripId as string;

  const { data: summary, isLoading, error, refetch } = useSettlementSummary(tripId);

  if (isLoading) {
    return <div className="p-6"><AppLoadingState /></div>;
  }

  if (error || !summary) {
    return <div className="p-6"><AppErrorState error={error || new Error('Summary not found')} retry={refetch} /></div>;
  }

  return (
    <RequirePermission roles={['admin', 'manager']}>
      <div className="flex flex-col gap-6 p-6 pb-24">
        <Button variant="ghost" className="w-fit -ml-4" onClick={() => router.push('/settlements')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Settlements
        </Button>
        
        <AppPageHeader 
          title="Trip Settlement" 
          description={`Trip Status: ${summary.status}`}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <BillingBreakdownCard summary={summary} />
            <ExpenseSummaryCard summary={summary} />
            <PaymentLedgerCard summary={summary} />
          </div>
          
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <SettlementActionPanel summary={summary} />
            </div>
          </div>
        </div>
      </div>
    </RequirePermission>
  );
}
