'use client';

import React, { useState } from 'react';
import { useDriverSummaryKpis, useDriverPerformanceTrend, useDriverAnalytics } from '../hooks/use-driver-analytics';
import { ReportDateFilterComponent } from '../components/filters/report-date-filter';
import { DriverKpiGrid } from '../components/kpi/driver-kpi-grid';
import { DriverPerformanceChart } from '../components/charts/driver-performance-chart';
import { DriverWorkloadDonut } from '../components/charts/driver-workload-donut';
import { DriverAnalyticsTable } from '../components/tables/driver-analytics-table';
import { ReportDateFilter } from '../domain/reports-types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function DriverAnalyticsPage() {
  const [filter, setFilter] = useState<ReportDateFilter>({ period: 'this_month' });
  const [granularity, setGranularity] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  
  const { data: summaryKpis, isLoading: isSummaryLoading } = useDriverSummaryKpis(filter);
  const { data: performanceTrend, isLoading: isTrendLoading } = useDriverPerformanceTrend(granularity, filter);
  const { data: driverAnalytics, isLoading: isAnalyticsLoading } = useDriverAnalytics(filter);

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
          <h1 className="text-3xl font-bold tracking-tight">Driver Analytics</h1>
          <p className="text-muted-foreground text-sm">Analyze driver performance and workload.</p>
        </div>
        <div className="flex items-center gap-3">
          <ReportDateFilterComponent value={filter} onChange={setFilter} />
        </div>
      </div>

      <DriverKpiGrid data={summaryKpis} isLoading={isSummaryLoading} />

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
          <DriverPerformanceChart
            data={performanceTrend || []}
            isLoading={isTrendLoading}
          />
        </div>
        <div>
          <DriverWorkloadDonut
            data={driverAnalytics || []}
            isLoading={isAnalyticsLoading}
          />
        </div>
      </div>

      <DriverAnalyticsTable data={driverAnalytics || []} isLoading={isAnalyticsLoading} />
    </div>
  );
}
