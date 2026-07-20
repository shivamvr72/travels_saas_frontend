'use client';

import React from 'react';
import { AppSectionCard } from '@/components/shared/app-section-card';
import { AppDataTable, ColumnDef } from '@/components/shared/app-data-table';
import { formatCurrency, formatDateTime } from '@/shared/utils/formatters';
import { SettlementSummaryResponse, TripExpenseResponse } from '../types';

interface ExpenseSummaryCardProps {
  summary: SettlementSummaryResponse;
}

export function ExpenseSummaryCard({ summary }: ExpenseSummaryCardProps) {
  const expenses = summary.expenses || [];

  const columns: ColumnDef<TripExpenseResponse>[] = [
    {
      header: 'Date',
      accessorKey: 'expense_date',
      cell: (item) => formatDateTime(item.expense_date),
    },
    {
      header: 'Category',
      accessorKey: 'expense_type',
      cell: (item) => <span className="capitalize">{item.expense_type?.replace('_', ' ')}</span>,
    },
    {
      header: 'Amount',
      accessorKey: 'amount',
      cell: (item) => <span className="font-medium text-destructive">{formatCurrency(Number(item.amount))}</span>,
    },
    {
      header: 'Payment Mode',
      accessorKey: 'payment_mode',
      cell: (item) => <span className="capitalize">{item.payment_mode?.replace('_', ' ')}</span>,
    },
  ];

  return (
    <AppSectionCard title="Vehicle Expenses">
      <AppDataTable
        columns={columns}
        data={expenses}
        rowKey={(item) => item.id}
        emptyState={{
          title: 'No Expenses',
          description: 'No expenses have been recorded for this trip.',
        }}
      />
    </AppSectionCard>
  );
}
