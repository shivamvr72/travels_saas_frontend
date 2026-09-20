'use client';

import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';

export interface MonthlyFinancialPoint {
  period_label: string;
  display_label: string;
  revenue: number;
  expenses: number;
  profit: number;
  trip_count?: number;
}

interface RevenueExpenseChartProps {
  data: MonthlyFinancialPoint[];
  isLoading: boolean;
  height?: number;
}

const formatRupeeShort = (val: number) => {
  const abs = Math.abs(val);
  if (abs >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
  if (abs >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (abs >= 1000) return `₹${(val / 1000).toFixed(1)}k`;
  return `₹${val}`;
};

export function RevenueExpenseChart({
  data,
  isLoading,
  height = 260,
}: RevenueExpenseChartProps) {
  if (isLoading) {
    return (
      <div style={{ height }} className="flex items-end justify-between gap-3 p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
            <Skeleton
              className="w-full rounded-t-md"
              style={{ height: `${20 + ((i * 17) % 60)}%` }}
            />
            <Skeleton className="w-10 h-3 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const hasData = data && data.length > 0;
  const hasNonZero = data && data.some((d) => d.revenue > 0 || d.expenses > 0);

  if (!hasData) {
    return (
      <div
        style={{ height }}
        className="flex flex-col items-center justify-center text-muted-foreground text-sm border-t border-dashed m-4 mt-0 bg-muted/10 rounded-lg"
      >
        <p>No financial data available for the last 6 months.</p>
      </div>
    );
  }

  return (
    <div style={{ height }} className="w-full pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 12, right: 12, left: -4, bottom: 4 }}
          barGap={6}
        >
          <defs>
            <linearGradient id="finRevGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#059669" stopOpacity={0.7} />
            </linearGradient>
            <linearGradient id="finExpGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#e11d48" stopOpacity={0.7} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="hsl(var(--border))"
            opacity={0.6}
          />

          <XAxis
            dataKey="display_label"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dy={8}
          />

          <YAxis
            yAxisId="left"
            tickFormatter={formatRupeeShort}
            stroke="hsl(var(--muted-foreground))"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            dx={-6}
          />

          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={formatRupeeShort}
            stroke="hsl(var(--muted-foreground))"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            dx={6}
            hide={!hasNonZero}
          />

          <Tooltip
            cursor={{ fill: 'hsl(var(--muted) / 0.15)' }}
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              borderColor: 'hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--card-foreground))',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
              fontSize: '12px',
              padding: '10px 14px',
            }}
            formatter={(value: any, name: any) => {
              const numVal = Number(value) || 0;
              const formatted = formatCurrency(numVal);
              if (name === 'revenue') return [formatted, 'Gross Revenue'];
              if (name === 'expenses') return [formatted, 'Total Expenses'];
              if (name === 'profit') return [formatted, 'Net Profit'];
              return [formatted, name];
            }}
            labelFormatter={(label) => `Month: ${label}`}
          />

          <Legend
            iconType="circle"
            wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
            formatter={(value) => {
              if (value === 'revenue') return 'Revenue';
              if (value === 'expenses') return 'Expenses';
              if (value === 'profit') return 'Net Profit';
              return value;
            }}
          />

          <Bar
            yAxisId="left"
            dataKey="revenue"
            name="revenue"
            fill="url(#finRevGradient)"
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
          />

          <Bar
            yAxisId="left"
            dataKey="expenses"
            name="expenses"
            fill="url(#finExpGradient)"
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
          />

          <Line
            yAxisId="left"
            type="monotone"
            dataKey="profit"
            name="profit"
            stroke="#3b82f6"
            strokeWidth={2.5}
            dot={{ r: 3, fill: '#3b82f6', strokeWidth: 1, stroke: '#fff' }}
            activeDot={{ r: 5, fill: '#3b82f6' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
