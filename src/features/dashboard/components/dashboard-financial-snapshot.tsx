'use client';

import { AppSectionCard } from '@/components/shared';
import { useDashboardStats } from '../hooks/use-dashboard-stats';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardFinancialSnapshot() {
  const { data, isLoading } = useDashboardStats();

  return (
    <AppSectionCard title="Financial Snapshot">
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[80%]" />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Receivables</span>
            <span className="font-semibold text-green-600 dark:text-green-400">{data?.financials.receivables}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Payables</span>
            <span className="font-semibold text-destructive">{data?.financials.payables}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Expenses This Month</span>
            <span className="font-semibold">{data?.financials.monthlyExpenses}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Collection Rate</span>
            <span className="font-semibold">{data?.financials.collectionRate}</span>
          </div>
        </div>
      )}
    </AppSectionCard>
  );
}
