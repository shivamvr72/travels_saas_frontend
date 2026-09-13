import React from 'react';
import { ReportKpiGrid } from './report-kpi-grid';
import { ReportKpiCard } from './report-kpi-card';
import { ProfitabilitySummaryKpis } from '../../domain/reports-types';
import { formatCurrency } from '@/lib/utils';
import { IndianRupee, PieChart, TrendingDown, TrendingUp, Receipt, Percent, BarChart2 } from 'lucide-react';

interface ProfitabilityKpiGridProps {
  data?: ProfitabilitySummaryKpis;
  isLoading?: boolean;
}

export function ProfitabilityKpiGrid({ data, isLoading }: ProfitabilityKpiGridProps) {
  const getTrendIcon = (change: number | null) => {
    if (change === null) return undefined;
    return change > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  const getTrendColor = (change: number | null) => {
    if (change === null) return 'default';
    return change > 0 ? 'success' : 'destructive';
  };

  const getProfitTrendIcon = (profit: number) => {
    if (profit === 0) return undefined;
    return profit > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  return (
    <ReportKpiGrid className="lg:grid-cols-6">
      <ReportKpiCard
        title="Gross Revenue"
        value={data ? formatCurrency(data.gross_revenue) : 0}
        icon={<IndianRupee className="h-4 w-4" />}
        isLoading={isLoading}
        color="success"
      />
      <ReportKpiCard
        title="Total Expenses"
        value={data ? formatCurrency(data.total_expenses) : 0}
        icon={<Receipt className="h-4 w-4" />}
        isLoading={isLoading}
        color="destructive"
      />
      <ReportKpiCard
        title="Net Profit"
        value={data ? formatCurrency(data.net_profit) : 0}
        icon={data ? getProfitTrendIcon(data.net_profit) : undefined}
        isLoading={isLoading}
        color={data && data.net_profit < 0 ? 'destructive' : 'primary'}
      />
      <ReportKpiCard
        title="Profit Margin"
        value={data ? `${data.profit_margin_pct.toFixed(1)}%` : '0%'}
        icon={<Percent className="h-4 w-4" />}
        isLoading={isLoading}
        color={data && data.profit_margin_pct < 0 ? 'destructive' : 'warning'}
      />
      <ReportKpiCard
        title="Avg Profit / Trip"
        value={data ? formatCurrency(data.avg_profit_per_trip) : 0}
        icon={<BarChart2 className="h-4 w-4" />}
        isLoading={isLoading}
        color="default"
      />
      <ReportKpiCard
        title="MoM Change"
        value={data && data.mom_change_pct !== null ? `${Math.abs(data.mom_change_pct).toFixed(1)}%` : '-'}
        icon={getTrendIcon(data?.mom_change_pct ?? null)}
        isLoading={isLoading}
        color={getTrendColor(data?.mom_change_pct ?? null)}
        trend={data && data.mom_change_pct !== null ? { value: data.mom_change_pct > 0 ? 'Increased' : 'Decreased', isPositive: data.mom_change_pct > 0 } : undefined}
      />
    </ReportKpiGrid>
  );
}
