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

const mockCustomerOutstanding = [
  {
    id: '1',
    name: 'Mankind Pharma',
    total_invoices: 12,
    overdue_invoices: 2,
    total_outstanding: 45000,
  },
  {
    id: '2',
    name: 'TCS Operations',
    total_invoices: 8,
    overdue_invoices: 0,
    total_outstanding: 120000,
  },
  {
    id: '3',
    name: 'Infosys Admin',
    total_invoices: 4,
    overdue_invoices: 1,
    total_outstanding: 22000,
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
