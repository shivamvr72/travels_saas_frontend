'use client';

import { AppMetricCard } from '@/components/shared';
import { useDashboardStats } from '../hooks/use-dashboard-stats';
import { Briefcase, DollarSign, CreditCard, TrendingUp } from 'lucide-react';

export function DashboardKpiCards() {
  const { data, isLoading } = useDashboardStats();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <AppMetricCard
        title="Active Trips"
        value={data?.kpis.activeTrips ?? 0}
        icon={<Briefcase className="h-4 w-4 text-muted-foreground" />}
        trend={data?.kpis.activeTripsTrend}
        isLoading={isLoading}
      />
      <AppMetricCard
        title="Revenue This Month"
        value={data?.kpis.monthlyRevenue ?? '$0'}
        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        trend={data?.kpis.monthlyRevenueTrend}
        isLoading={isLoading}
      />
      <AppMetricCard
        title="Outstanding Payments"
        value={data?.kpis.outstandingPayments ?? '$0'}
        icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
        trend={data?.kpis.outstandingPaymentsTrend}
        isLoading={isLoading}
      />
      <AppMetricCard
        title="Net Profit This Month"
        value={data?.kpis.netProfit ?? '$0'}
        icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        trend={data?.kpis.netProfitTrend}
        isLoading={isLoading}
      />
    </div>
  );
}
