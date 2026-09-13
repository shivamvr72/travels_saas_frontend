import React from 'react';
import { ReportKpiGrid } from './report-kpi-grid';
import { ReportKpiCard } from './report-kpi-card';
import { ExpenseSummaryKpis } from '../../domain/reports-types';
import { formatCurrency } from '@/lib/utils';
import { IndianRupee, PieChart, TrendingDown, TrendingUp, AlertCircle, Percent } from 'lucide-react';

interface ExpenseKpiGridProps {
  data?: ExpenseSummaryKpis;
  isLoading?: boolean;
}

export function ExpenseKpiGrid({ data, isLoading }: ExpenseKpiGridProps) {
  const getTrendIcon = (change: number | null) => {
    if (change === null) return undefined;
    return change > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  const getTrendColor = (change: number | null) => {
    if (change === null) return 'default';
    // For expenses, going down is good (success), going up is bad (destructive)
    return change > 0 ? 'destructive' : 'success';
  };

  return (
    <ReportKpiGrid className="lg:grid-cols-5">
      <ReportKpiCard
        title="Total Expenses"
        value={data ? formatCurrency(data.total_expenses_period) : 0}
        icon={<IndianRupee className="h-4 w-4" />}
        isLoading={isLoading}
        color="destructive"
      />
      <ReportKpiCard
        title="Avg Cost / Trip"
        value={data ? formatCurrency(data.avg_expense_per_trip) : 0}
        icon={<PieChart className="h-4 w-4" />}
        isLoading={isLoading}
        color="warning"
      />
      <ReportKpiCard
        title="Expense Ratio"
        value={data ? `${data.expense_to_revenue_ratio.toFixed(1)}%` : '0%'}
        icon={<Percent className="h-4 w-4" />}
        isLoading={isLoading}
        color="default"
      />
      <ReportKpiCard
        title="Top Category"
        value={data ? data.highest_category : '-'}
        icon={<AlertCircle className="h-4 w-4" />}
        isLoading={isLoading}
        color="primary"
        trend={data && data.highest_category_amount ? { value: formatCurrency(data.highest_category_amount), isPositive: null } : undefined}
      />
      <ReportKpiCard
        title="MoM Change"
        value={data && data.mom_change_pct !== null ? `${Math.abs(data.mom_change_pct).toFixed(1)}%` : '-'}
        icon={getTrendIcon(data?.mom_change_pct ?? null)}
        isLoading={isLoading}
        color={getTrendColor(data?.mom_change_pct ?? null)}
        trend={data && data.mom_change_pct !== null ? { value: data.mom_change_pct > 0 ? 'Increased' : 'Decreased', isPositive: data.mom_change_pct < 0 } : undefined}
      />
    </ReportKpiGrid>
  );
}
