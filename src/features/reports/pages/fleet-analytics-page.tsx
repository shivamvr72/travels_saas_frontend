'use client';

import React, { useState } from 'react';
import { useFleetSummary, useFleetSummaryKpis, useFleetUtilizationTrend } from '../hooks/use-fleet-analytics';
import { ReportDateFilterComponent } from '../components/filters/report-date-filter';
import { FleetKpiGrid } from '../components/kpi/fleet-kpi-grid';
import { FleetUtilizationChart } from '../components/charts/fleet-utilization-chart';
import { VehicleStatusDonut } from '../components/charts/vehicle-status-donut';
import { FleetSummaryTable } from '../components/tables/fleet-summary-table';
import { ReportDateFilter } from '../domain/reports-types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function FleetAnalyticsPage() {
  const [filter, setFilter] = useState<ReportDateFilter>({ period: 'this_month' });
  const [granularity, setGranularity] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  
  const { data: summaryKpis, isLoading: isSummaryLoading } = useFleetSummaryKpis(filter);
  const { data: utilizationTrend, isLoading: isTrendLoading } = useFleetUtilizationTrend(granularity, filter);
  const { data: fleetSummary, isLoading: isFleetSummaryLoading } = useFleetSummary(filter);

  // Update granularity when filter period changes to a longer period
  React.useEffect(() => {
    if (filter.period === 'ytd' || filter.period === 'last_quarter' || filter.period === 'custom') {
      setGranularity('monthly');
    } else if (filter.period === 'this_month' || filter.period === 'last_month') {
      setGranularity('weekly');
    } else {
      setGranularity('daily');
    }
  }, [filter.period]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fleet Analytics</h1>
          <p className="text-muted-foreground text-sm">Monitor fleet utilization and performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <ReportDateFilterComponent value={filter} onChange={setFilter} />
        </div>
      </div>

      <FleetKpiGrid data={summaryKpis} isLoading={isSummaryLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative">
          <div className="absolute right-6 top-6 z-10 w-32">
            <Select value={granularity} onValueChange={(val: any) => setGranularity(val)}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Granularity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <FleetUtilizationChart
            data={utilizationTrend || []}
            isLoading={isTrendLoading}
          />
        </div>
        <div>
          <VehicleStatusDonut
            data={fleetSummary || []}
            isLoading={isFleetSummaryLoading}
          />
        </div>
      </div>

      <FleetSummaryTable data={fleetSummary || []} isLoading={isFleetSummaryLoading} />
    </div>
  );
}
