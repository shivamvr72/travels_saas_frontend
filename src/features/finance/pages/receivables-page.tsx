'use client';

import { useState, useEffect } from 'react';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { AgingBuckets } from '../components/aging-buckets';
import { CustomerOutstandingSummary } from '../components/customer-outstanding-summary';
import { AppLoadingState } from '@/components/shared/app-loading-state';

// Temporary mock data for Outstanding Receivables
const mockAgingBuckets = {
  current: 125000,
  thirtyToSixty: 45000,
  sixtyToNinety: 12000,
  overNinety: 5000,
  total: 187000,
};

export const mockCustomerOutstanding = [
  {
    id: '1',
    name: 'Mankind Pharma',
    total_invoices: 12,
    overdue_invoices: 2,
    total_outstanding: 45000,
    invoices: [
      {
        id: 'inv-101',
        invoice_number: 'INV-2026-089',
        trip_number: 'TRP-379E345F',
        issue_date: '2026-08-01',
        due_date: '2026-08-15',
        amount: 25000,
        balance_due: 25000,
        status: 'overdue' as const,
      },
      {
        id: 'inv-102',
        invoice_number: 'INV-2026-092',
        trip_number: 'TRP-6527F4F1',
        issue_date: '2026-08-10',
        due_date: '2026-08-25',
        amount: 20000,
        balance_due: 20000,
        status: 'overdue' as const,
      },
      {
        id: 'inv-103',
        invoice_number: 'INV-2026-105',
        trip_number: 'TRP-B912B884',
        issue_date: '2026-09-02',
        due_date: '2026-09-17',
        amount: 15000,
        balance_due: 0,
        status: 'paid' as const,
      },
    ],
  },
  {
    id: '2',
    name: 'TCS Operations',
    total_invoices: 8,
    overdue_invoices: 0,
    total_outstanding: 120000,
    invoices: [
      {
        id: 'inv-201',
        invoice_number: 'INV-2026-077',
        trip_number: 'TRP-104928A',
        issue_date: '2026-08-28',
        due_date: '2026-09-15',
        amount: 80000,
        balance_due: 80000,
        status: 'pending' as const,
      },
      {
        id: 'inv-202',
        invoice_number: 'INV-2026-081',
        trip_number: 'TRP-104929B',
        issue_date: '2026-09-01',
        due_date: '2026-09-20',
        amount: 40000,
        balance_due: 40000,
        status: 'pending' as const,
      },
    ],
  },
  {
    id: '3',
    name: 'Infosys Admin',
    total_invoices: 4,
    overdue_invoices: 1,
    total_outstanding: 22000,
    invoices: [
      {
        id: 'inv-301',
        invoice_number: 'INV-2026-061',
        trip_number: 'TRP-20391A',
        issue_date: '2026-08-05',
        due_date: '2026-08-20',
        amount: 22000,
        balance_due: 22000,
        status: 'overdue' as const,
      },
    ],
  },
];

export function ReceivablesPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <AppLoadingState />;

  return (
    <div className="space-y-6">
      <AppPageHeader 
        title="Outstanding Receivables" 
        description="Track pending payments across all corporate clients and customers."
      />

      <AgingBuckets buckets={mockAgingBuckets} />
      
      <CustomerOutstandingSummary data={mockCustomerOutstanding} />
    </div>
  );
}
