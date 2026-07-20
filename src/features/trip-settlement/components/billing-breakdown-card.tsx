'use client';

import React from 'react';
import { AppSectionCard } from '@/components/shared/app-section-card';
import { formatCurrency } from '@/shared/utils/formatters';
import { SettlementSummaryResponse } from '../types';

interface BillingBreakdownCardProps {
  summary: SettlementSummaryResponse;
}

export function BillingBreakdownCard({ summary }: BillingBreakdownCardProps) {
  const billing = summary.billing;

  if (!billing) {
    return (
      <AppSectionCard title="Billing Breakdown">
        <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
          Billing has not been calculated for this trip yet.
        </div>
      </AppSectionCard>
    );
  }

  return (
    <AppSectionCard title="Billing Breakdown">
      <div className="flex flex-col gap-3 text-sm">
        <div className="flex justify-between py-1 border-b">
          <span className="text-muted-foreground">Rate Type</span>
          <span className="font-medium capitalize">{billing.rate_type.replace('_', ' ')}</span>
        </div>
        <div className="flex justify-between py-1 border-b">
          <span className="text-muted-foreground">Base Rate</span>
          <span className="font-medium">{formatCurrency(Number(billing.base_rate))}</span>
        </div>
        
        {/* We can list extra charges here if they exist in the response. 
            For now, subtotal and GST are always returned by the backend. */}
            
        <div className="flex justify-between py-1 border-b mt-2">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">{formatCurrency(Number(billing.subtotal))}</span>
        </div>
        <div className="flex justify-between py-1 border-b">
          <span className="text-muted-foreground">GST Amount</span>
          <span className="font-medium">{formatCurrency(Number(billing.gst_amount))}</span>
        </div>
        
        <div className="flex justify-between py-2 mt-4 bg-muted/30 px-3 rounded-md items-center">
          <span className="font-bold text-foreground">Grand Total</span>
          <span className="font-bold text-lg text-primary">{formatCurrency(Number(billing.total_amount))}</span>
        </div>
      </div>
    </AppSectionCard>
  );
}
