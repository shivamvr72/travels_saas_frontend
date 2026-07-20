'use client';

import React from 'react';
import { AppSectionCard } from '@/components/shared/app-section-card';
import { AppDataTable, ColumnDef } from '@/components/shared/app-data-table';
import { formatCurrency, formatDateTime } from '@/shared/utils/formatters';
import { SettlementSummaryResponse, TripPaymentTransactionResponse } from '../types';
import { cn } from '@/shared/lib/utils';

interface PaymentLedgerCardProps {
  summary: SettlementSummaryResponse;
}

export function PaymentLedgerCard({ summary }: PaymentLedgerCardProps) {
  const payments = summary.transactions || [];

  const columns: ColumnDef<TripPaymentTransactionResponse>[] = [
    {
      header: 'Date',
      accessorKey: 'payment_date',
      cell: (item) => formatDateTime(item.payment_date),
    },
    {
      header: 'Mode',
      accessorKey: 'payment_mode',
      cell: (item) => <span className="capitalize">{item.payment_mode?.replace('_', ' ')}</span>,
    },
    {
      header: 'Reference',
      accessorKey: 'reference_no',
      cell: (item) => item.reference_no || '-',
    },
    {
      header: 'Amount',
      accessorKey: 'amount',
      cell: (item) => <span className="font-medium text-emerald-600">{formatCurrency(Number(item.amount))}</span>,
      className: 'text-right'
    },
  ];

  return (
    <AppSectionCard title="Payment Ledger">
      <AppDataTable
        columns={columns}
        data={payments}
        rowKey={(item) => item.id}
        emptyState={{
          title: 'No Payments',
          description: 'No payments have been recorded for this trip.',
        }}
      />
      
      <div className="mt-4 flex flex-col gap-2 p-4 bg-muted/20 rounded-md border">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Total Billed</span>
          <span className="font-medium">{formatCurrency(Number(summary.billing?.total_amount || 0))}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Total Paid</span>
          <span className="font-medium text-emerald-600">{formatCurrency(Number(summary.payment_summary?.total_payment || 0))}</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t mt-1">
          <span className="font-bold">Balance Due</span>
          <span className={cn("font-bold text-lg", Number(summary.payment_summary?.balance_due) > 0 ? "text-orange-600" : "text-emerald-600")}>
            {formatCurrency(Number(summary.payment_summary?.balance_due || 0))}
          </span>
        </div>
      </div>
    </AppSectionCard>
  );
}
