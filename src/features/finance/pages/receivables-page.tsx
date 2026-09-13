'use client';

import { useState, useEffect } from 'react';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { AppLoadingState } from '@/components/shared/app-loading-state';
import { AgingBuckets } from '../components/aging-buckets';
import { CustomerOutstandingSummary } from '../components/customer-outstanding-summary';
import { FinanceApi } from '../api/finance-api';
import { CustomerOutstandingItem } from '../domain/finance-types';
import { toast } from 'sonner';

// Temporary mock data for Outstanding Receivables Aging Buckets
const mockAgingBuckets = {
  current: 125000,
  thirtyToSixty: 45000,
  sixtyToNinety: 12000,
  overNinety: 5000,
  total: 187000,
};

export function ReceivablesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<CustomerOutstandingItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const balances = await FinanceApi.getOutstandingBalances();
        
        // Map backend response to frontend schema
        const mappedData: CustomerOutstandingItem[] = balances.map((b: { company_id: string; company_name: string; outstanding_balance: number }) => ({
          id: b.company_id,
          name: b.company_name,
          total_invoices: 0, // Backend doesn't return count currently, detail page fetches invoices
          overdue_invoices: 0, 
          total_outstanding: b.outstanding_balance,
          invoices: []
        }));
        
        // Filter out companies with 0 balance
        setData(mappedData.filter(d => d.total_outstanding > 0));
      } catch (error) {
        console.error('Failed to fetch outstanding balances:', error);
        toast.error('Failed to load receivables data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (isLoading) return <AppLoadingState />;

  return (
    <div className="space-y-6">
      <AppPageHeader 
        title="Outstanding Receivables" 
        description="Track pending payments across all corporate clients and customers."
      />

      <AgingBuckets buckets={mockAgingBuckets} />
      
      <CustomerOutstandingSummary data={data} />
    </div>
  );
}
