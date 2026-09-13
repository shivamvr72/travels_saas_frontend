import React from 'react';
import { ReportKpiGrid } from './report-kpi-grid';
import { ReportKpiCard } from './report-kpi-card';
import { FleetSummaryKpis } from '../../domain/reports-types';
import { formatCurrency } from '@/lib/utils';
import { Truck, CheckCircle2, Clock, Activity, Route, IndianRupee } from 'lucide-react';

interface FleetKpiGridProps {
  data?: FleetSummaryKpis;
  isLoading?: boolean;
}

export function FleetKpiGrid({ data, isLoading }: FleetKpiGridProps) {
  return (
    <ReportKpiGrid className="lg:grid-cols-6">
      <ReportKpiCard
        title="Total Vehicles"
        value={data ? data.total_vehicles : 0}
        icon={<Truck className="h-4 w-4" />}
        isLoading={isLoading}
        color="default"
      />
      <ReportKpiCard
        title="Active Now"
        value={data ? data.active_vehicles : 0}
        icon={<CheckCircle2 className="h-4 w-4" />}
        isLoading={isLoading}
        color="success"
      />
      <ReportKpiCard
        title="Idle"
        value={data ? data.idle_vehicles : 0}
        icon={<Clock className="h-4 w-4" />}
        isLoading={isLoading}
        color="warning"
      />
      <ReportKpiCard
        title="Fleet Utilization"
        value={data ? `${data.fleet_utilization_pct.toFixed(1)}%` : '0%'}
        icon={<Activity className="h-4 w-4" />}
        isLoading={isLoading}
        color={data && data.fleet_utilization_pct < 50 ? 'warning' : 'primary'}
      />
      <ReportKpiCard
        title="Avg Trips / Vehicle"
        value={data ? data.avg_trips_per_vehicle : 0}
        icon={<Route className="h-4 w-4" />}
        isLoading={isLoading}
        color="default"
      />
      <ReportKpiCard
        title="Avg Revenue / Vehicle"
        value={data ? formatCurrency(data.avg_revenue_per_vehicle) : 0}
        icon={<IndianRupee className="h-4 w-4" />}
        isLoading={isLoading}
        color="primary"
      />
    </ReportKpiGrid>
  );
}
