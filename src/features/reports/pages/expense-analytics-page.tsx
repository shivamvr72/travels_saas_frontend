'use client';

import React, { useState } from 'react';
import { useExpenseTrend, useExpenseByVehicle, useExpenseByDriver, useExpenseSummaryKpis, useExpenseBreakdown } from '../hooks/use-expense-analytics';
import { ReportDateFilterComponent } from '../components/filters/report-date-filter';
import { ExpenseKpiGrid } from '../components/kpi/expense-kpi-grid';
import { ExpenseTrendChart } from '../components/charts/expense-trend-chart';
import { ReportPieChart } from '../components/charts/report-pie-chart';
import { VehicleExpenseTable } from '../components/tables/vehicle-expense-table';
import { DriverExpenseTable } from '../components/tables/driver-expense-table';
import { ReportDateFilter } from '../domain/reports-types';
import { formatCurrency } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function ExpenseAnalyticsPage() {
  const [filter, setFilter] = useState<ReportDateFilter>({ period: 'this_month' });
  const [granularity, setGranularity] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  
  const { data: summaryKpis, isLoading: isSummaryLoading } = useExpenseSummaryKpis(filter);
  const { data: expenseTrend, isLoading: isTrendLoading } = useExpenseTrend(granularity, filter);
  const { data: expenseBreakdown, isLoading: isBreakdownLoading } = useExpenseBreakdown(filter);
  const { data: vehicleExpenses, isLoading: isVehicleLoading } = useExpenseByVehicle(filter);
  const { data: driverExpenses, isLoading: isDriverLoading } = useExpenseByDriver(filter);

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
          <h1 className="text-3xl font-bold tracking-tight">Expense Analytics</h1>
          <p className="text-muted-foreground text-sm">Understand where your money goes.</p>
        </div>
        <div className="flex items-center gap-3">
          <ReportDateFilterComponent value={filter} onChange={setFilter} />
        </div>
      </div>

      <ExpenseKpiGrid data={summaryKpis} isLoading={isSummaryLoading} />

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
          <ExpenseTrendChart
            data={expenseTrend || []}
            isLoading={isTrendLoading}
            formatY={(v: number) => `₹${(v / 1000).toFixed(1)}k`}
          />
        </div>
        <div>
          <ReportPieChart
            title="Expense Categories"
            description="Overall distribution of expenses"
            data={expenseBreakdown || []}
            nameKey="expense_type"
            valueKey="total"
            formatValue={(v: number) => formatCurrency(v)}
          />
        </div>
      </div>

      <Tabs defaultValue="vehicles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vehicles">Vehicle Costs</TabsTrigger>
          <TabsTrigger value="drivers">Driver Costs</TabsTrigger>
        </TabsList>
        <TabsContent value="vehicles">
          <VehicleExpenseTable data={vehicleExpenses || []} isLoading={isVehicleLoading} />
        </TabsContent>
        <TabsContent value="drivers">
          <DriverExpenseTable data={driverExpenses || []} isLoading={isDriverLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
