'use client';

import React, { useState } from 'react';
import { useExecutiveSummary } from '../hooks/use-executive-summary';
import { useRevenueTrend } from '../hooks/use-revenue-analytics';
import { useExpenseBreakdown } from '../hooks/use-expense-analytics';
import { ReportDateFilterComponent } from '../components/filters/report-date-filter';
import { ReportKpiGrid } from '../components/kpi/report-kpi-grid';
import { ReportKpiCard } from '../components/kpi/report-kpi-card';
import { ReportAreaChart } from '../components/charts/report-area-chart';
import { ReportPieChart } from '../components/charts/report-pie-chart';
import { ReportAlertsPanel } from '../components/alerts/report-alerts-panel';
import { ReportDateFilter } from '../domain/reports-types';
import { formatCurrency } from '@/lib/utils';
import { IndianRupee, Briefcase, Car, TrendingUp } from 'lucide-react';

export function ExecutiveDashboardPage() {
  const [filter, setFilter] = useState<ReportDateFilter>({ period: 'this_month' });
  
  const { data: summary, isLoading: isSummaryLoading } = useExecutiveSummary(filter);
  const { data: revenueTrend } = useRevenueTrend('daily', filter);
  const { data: expenseBreakdown } = useExpenseBreakdown(filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Executive Dashboard</h1>
          <p className="text-muted-foreground text-sm">Key performance indicators and business overview.</p>
        </div>
        <ReportDateFilterComponent value={filter} onChange={setFilter} />
      </div>

      <ReportAlertsPanel />

      <ReportKpiGrid>
        <ReportKpiCard
          title="Revenue"
          value={summary ? formatCurrency(summary.monthly_revenue) : 0}
          icon={<IndianRupee className="h-4 w-4" />}
          isLoading={isSummaryLoading}
          color="primary"
        />
        <ReportKpiCard
          title="Net Profit"
          value={summary ? formatCurrency(summary.net_profit) : 0}
          icon={<TrendingUp className="h-4 w-4" />}
          isLoading={isSummaryLoading}
          color="success"
        />
        <ReportKpiCard
          title="Active Trips"
          value={summary?.active_trips || 0}
          icon={<Briefcase className="h-4 w-4" />}
          isLoading={isSummaryLoading}
          color="warning"
        />
        <ReportKpiCard
          title="Fleet Utilization"
          value={summary ? `${summary.fleet_utilization_pct.toFixed(1)}%` : '0%'}
          icon={<Car className="h-4 w-4" />}
          isLoading={isSummaryLoading}
          color="default"
        />
      </ReportKpiGrid>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ReportAreaChart
            title="Revenue Trend"
            description="Daily revenue over the selected period"
            data={revenueTrend || []}
            xKey="period_label"
            yKey="revenue"
            formatY={(v: number) => `₹${(v / 1000).toFixed(1)}k`}
          />
        </div>
        <div>
          <ReportPieChart
            title="Expense Breakdown"
            description="Distribution of vehicle expenses"
            data={expenseBreakdown || []}
            nameKey="expense_type"
            valueKey="total"
            formatValue={(v: number) => formatCurrency(v)}
          />
        </div>
      </div>
    </div>
  );
}
