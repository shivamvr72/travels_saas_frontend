'use client';

import React, { useState } from 'react';
import { useInvoiceRegister } from '../hooks/use-financial-registers';
import { ReportDateFilterComponent } from '../components/filters/report-date-filter';
import { ReportRegisterTable } from '../components/tables/report-register-table';
import { ReportDateFilter } from '../domain/reports-types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import type { AppDataTableColumn } from '@/components/layout/crud/app-data-table';

type InvoiceRow = { invoice_number: string; date: string; amount: number; [key: string]: unknown };

const invoiceColumns: AppDataTableColumn<InvoiceRow>[] = [
  { key: 'invoice_number', header: 'Invoice Number' },
  {
    key: 'date',
    header: 'Date',
    render: (item) => format(new Date(item.date), 'PPP'),
  },
  {
    key: 'amount',
    header: 'Amount',
    render: (item) => formatCurrency(item.amount),
  },
];

const PAGE_SIZE = 20;

export function FinancialRegistersPage() {
  const [filter, setFilter] = useState<ReportDateFilter>({ period: 'this_month' });
  const [invoicePage, setInvoicePage] = useState(1);

  const { data: invoiceData, isLoading: invoiceLoading } = useInvoiceRegister(filter, invoicePage, PAGE_SIZE);

  const invoiceRows: InvoiceRow[] = (invoiceData?.data ?? []) as InvoiceRow[];
  const invoiceTotal: number = invoiceData?.total ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Financial Registers</h1>
          <p className="text-muted-foreground text-sm">Detailed list views of financial transactions.</p>
        </div>
        <ReportDateFilterComponent value={filter} onChange={setFilter} />
      </div>

      <Tabs defaultValue="invoices" className="w-full">
        <TabsList>
          <TabsTrigger value="invoices">Invoice Register</TabsTrigger>
          <TabsTrigger value="payments" disabled>Payment Register</TabsTrigger>
          <TabsTrigger value="expenses" disabled>Expense Register</TabsTrigger>
        </TabsList>
        <TabsContent value="invoices" className="mt-4">
          <ReportRegisterTable<InvoiceRow>
            title="Invoice Register"
            description="List of all generated invoices within the selected period."
            columns={invoiceColumns}
            data={invoiceRows}
            isLoading={invoiceLoading}
            page={invoicePage}
            total={invoiceTotal}
            pageSize={PAGE_SIZE}
            onPageChange={setInvoicePage}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
