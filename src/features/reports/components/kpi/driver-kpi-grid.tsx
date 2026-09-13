import React from 'react';
import { ReportKpiGrid } from './report-kpi-grid';
import { ReportKpiCard } from './report-kpi-card';
import { DriverSummaryKpis } from '../../domain/reports-types';
import { formatCurrency } from '@/lib/utils';
import { Users, UserCheck, Route, IndianRupee, BarChart2, TrendingUp } from 'lucide-react';

interface DriverKpiGridProps {
  data?: DriverSummaryKpis;
  isLoading?: boolean;
}

export function DriverKpiGrid({ data, isLoading }: DriverKpiGridProps) {
  return (
    <ReportKpiGrid className="lg:grid-cols-6">
      <ReportKpiCard
        title="Total Drivers"
        value={data ? data.total_drivers : 0}
        icon={<Users className="h-4 w-4" />}
        isLoading={isLoading}
        color="default"
      />
      <ReportKpiCard
        title="Active Drivers"
        value={data ? data.active_drivers : 0}
        icon={<UserCheck className="h-4 w-4" />}
        isLoading={isLoading}
        color="success"
      />
      <ReportKpiCard
        title="Total Trips"
        value={data ? data.total_trips : 0}
        icon={<Route className="h-4 w-4" />}
        isLoading={isLoading}
        color="primary"
      />
      <ReportKpiCard
        title="Total Revenue"
        value={data ? formatCurrency(data.total_revenue) : 0}
        icon={<IndianRupee className="h-4 w-4" />}
        isLoading={isLoading}
        color="success"
      />
      <ReportKpiCard
        title="Avg Trips / Driver"
        value={data ? data.avg_trips_per_driver : 0}
        icon={<BarChart2 className="h-4 w-4" />}
        isLoading={isLoading}
        color="default"
      />
      <ReportKpiCard
        title="Avg Revenue / Driver"
        value={data ? formatCurrency(data.avg_revenue_per_driver) : 0}
        icon={<TrendingUp className="h-4 w-4" />}
        isLoading={isLoading}
        color="primary"
      />
    </ReportKpiGrid>
  );
}
