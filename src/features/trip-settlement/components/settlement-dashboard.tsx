'use client';

import React from 'react';
import { AppMetricCard } from '@/components/shared/app-metric-card';
import { CheckCircle2, Clock, IndianRupee } from 'lucide-react';
import { formatCurrency } from '@/shared/utils/formatters';

interface SettlementDashboardProps {
  metrics: {
    pendingCount: number;
    completedCount: number;
    totalBalanceDue: number;
  };
  isLoading?: boolean;
}

export function SettlementDashboard({ metrics, isLoading }: SettlementDashboardProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3 mb-8">
      <AppMetricCard
        title="Pending Settlements"
        value={metrics.pendingCount.toString()}
        icon={<Clock className="h-4 w-4 text-orange-500" />}
        description="Trips awaiting settlement"
        isLoading={isLoading}
      />
      <AppMetricCard
        title="Completed Settlements"
        value={metrics.completedCount.toString()}
        icon={<CheckCircle2 className="h-4 w-4 text-green-500" />}
        description="Trips settled this week"
        isLoading={isLoading}
      />
      <AppMetricCard
        title="Total Outstanding Balance"
        value={formatCurrency(metrics.totalBalanceDue)}
        icon={<IndianRupee className="h-4 w-4 text-blue-500" />}
        description="Across all pending settlements"
        isLoading={isLoading}
      />
    </div>
  );
}
