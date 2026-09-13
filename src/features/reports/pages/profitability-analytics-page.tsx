'use client';

import React, { useState } from 'react';
import { 
  useProfitTrend, 
  useProfitByVehicle, 
  useProfitByDriver, 
  useProfitabilitySummaryKpis, 
  useProfitByCustomer, 
  useProfitByRoute 
} from '../hooks/use-profitability-analytics';
import { ReportDateFilterComponent } from '../components/filters/report-date-filter';
import { ProfitabilityKpiGrid } from '../components/kpi/profitability-kpi-grid';
import { ProfitTrendChart } from '../components/charts/profit-trend-chart';
import { ProfitMarginGauge } from '../components/charts/profit-margin-gauge';
import { VehicleProfitTable } from '../components/tables/vehicle-profit-table';
import { DriverProfitTable } from '../components/tables/driver-profit-table';
import { CustomerProfitTable } from '../components/tables/customer-profit-table';
import { RouteProfitTable } from '../components/tables/route-profit-table';
import { ReportDateFilter } from '../domain/reports-types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function ProfitabilityAnalyticsPage() {
  const [filter, setFilter] = useState<ReportDateFilter>({ period: 'this_month' });
  const [granularity, setGranularity] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  
  const { data: summaryKpis, isLoading: isSummaryLoading } = useProfitabilitySummaryKpis(filter);
  const { data: profitTrend, isLoading: isTrendLoading } = useProfitTrend(granularity, filter);
  
  const { data: vehicleProfits, isLoading: isVehicleLoading } = useProfitByVehicle(filter);
  const { data: driverProfits, isLoading: isDriverLoading } = useProfitByDriver(filter);
  const { data: customerProfits, isLoading: isCustomerLoading } = useProfitByCustomer(filter);
  const { data: routeProfits, isLoading: isRouteLoading } = useProfitByRoute(filter);

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
          <h1 className="text-3xl font-bold tracking-tight">Profitability Analytics</h1>
          <p className="text-muted-foreground text-sm">Analyze margins and financial performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <ReportDateFilterComponent value={filter} onChange={setFilter} />
        </div>
      </div>

      <ProfitabilityKpiGrid data={summaryKpis} isLoading={isSummaryLoading} />

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
          <ProfitTrendChart
            data={profitTrend || []}
            isLoading={isTrendLoading}
            formatY={(v: number) => `₹${(v / 1000).toFixed(1)}k`}
          />
        </div>
        <div>
          <ProfitMarginGauge
            marginPct={summaryKpis?.profit_margin_pct ?? 0}
            isLoading={isSummaryLoading}
          />
        </div>
      </div>

      <Tabs defaultValue="vehicles" className="space-y-4">
        <TabsList className="w-full sm:w-auto overflow-x-auto justify-start h-auto p-1">
          <TabsTrigger value="vehicles" className="py-2">Vehicles</TabsTrigger>
          <TabsTrigger value="drivers" className="py-2">Drivers</TabsTrigger>
          <TabsTrigger value="customers" className="py-2">Customers</TabsTrigger>
          <TabsTrigger value="routes" className="py-2">Routes</TabsTrigger>
        </TabsList>
        <TabsContent value="vehicles">
          <VehicleProfitTable data={vehicleProfits || []} isLoading={isVehicleLoading} />
        </TabsContent>
        <TabsContent value="drivers">
          <DriverProfitTable data={driverProfits || []} isLoading={isDriverLoading} />
        </TabsContent>
        <TabsContent value="customers">
          <CustomerProfitTable data={customerProfits || []} isLoading={isCustomerLoading} />
        </TabsContent>
        <TabsContent value="routes">
          <RouteProfitTable data={routeProfits || []} isLoading={isRouteLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
