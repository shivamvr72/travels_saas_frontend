import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ProfitTrend } from '../../domain/reports-types';
import { PROFIT_CHART_COLORS } from '../../domain/reports-constants';
import { Skeleton } from '@/components/ui/skeleton';

interface ProfitTrendChartProps {
  data: ProfitTrend[];
  isLoading: boolean;
  title?: string;
  description?: string;
  formatY?: (value: number) => string;
  height?: number;
}

export function ProfitTrendChart({
  data,
  isLoading,
  title = "Profitability Trend",
  description = "Revenue vs Expenses over time",
  formatY = (v) => v.toString(),
  height = 350,
}: ProfitTrendChartProps) {
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ height }} className="flex items-end justify-between gap-2 pb-6 px-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="w-full h-full" style={{ height: `${Math.random() * 60 + 20}%` }} />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex items-center justify-center text-muted-foreground" style={{ height }}>
            No profitability data available for this period.
          </div>
        ) : (
          <div style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="period_label" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  yAxisId="left"
                  tickFormatter={formatY}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dx={-10}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={formatY}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dx={10}
                />
                <Tooltip
                  // @ts-expect-error Recharts ValueType is broader than number|string at runtime
                  formatter={(value: number, name: string) => {
                    if (name === 'margin_pct') return [`${value.toFixed(1)}%`, 'Profit Margin'];
                    return [formatY(value), name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())];
                  }}
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                
                <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill={PROFIT_CHART_COLORS.revenue} radius={[4, 4, 0, 0]} barSize={32} />
                <Bar yAxisId="left" dataKey="expenses" name="Expenses" fill={PROFIT_CHART_COLORS.expenses} radius={[4, 4, 0, 0]} barSize={32} />
                <Line yAxisId="right" type="monotone" dataKey="profit" name="Net Profit" stroke={PROFIT_CHART_COLORS.profit} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
