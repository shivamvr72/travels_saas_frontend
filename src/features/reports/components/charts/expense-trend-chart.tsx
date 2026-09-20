import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ExpenseTrend } from '../../domain/reports-types';
import { EXPENSE_COLOR_MAP } from '../../domain/reports-constants';
import { Skeleton } from '@/components/ui/skeleton';

interface ExpenseTrendChartProps {
  data: ExpenseTrend[];
  isLoading: boolean;
  title?: string;
  description?: string;
  formatY?: (value: number) => string;
  height?: number;
}

export function ExpenseTrendChart({
  data,
  isLoading,
  title = "Expense Trend",
  description = "Operational costs over time",
  formatY = (v) => v.toString(),
  height = 350,
}: ExpenseTrendChartProps) {
  
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

  // Ensure chart never renders an isolated single bar if only 1 data point is available
  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    if (data.length === 1) {
      const single = data[0];
      let prevLabel = 'Previous Period';
      if (single.period_label.includes('-W')) {
        const [yStr, wStr] = single.period_label.split('-W');
        const w = parseInt(wStr, 10);
        const y = parseInt(yStr, 10);
        const prevW = w > 1 ? w - 1 : 52;
        const prevY = w > 1 ? y : y - 1;
        prevLabel = `${prevY}-W${String(prevW).padStart(2, '0')}`;
      } else if (single.period_label.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const d = new Date(single.period_label);
        d.setDate(d.getDate() - 1);
        prevLabel = d.toISOString().split('T')[0];
      } else if (single.period_label.match(/^\d{4}-\d{2}$/)) {
        const [yStr, mStr] = single.period_label.split('-');
        const m = parseInt(mStr, 10);
        const y = parseInt(yStr, 10);
        const prevM = m > 1 ? m - 1 : 12;
        const prevY = m > 1 ? y : y - 1;
        prevLabel = `${prevY}-${String(prevM).padStart(2, '0')}`;
      }
      return [
        {
          period_label: prevLabel,
          fuel: 0,
          maintenance: 0,
          toll: 0,
          driver_allowance: 0,
          other: 0,
          total_expenses: 0,
          trip_count: 0,
        },
        single,
      ];
    }
    return data;
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center text-muted-foreground" style={{ height }}>
            No expense data available for this period.
          </div>
        ) : (
          <div style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                  tickFormatter={formatY}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dx={-10}
                />
                <Tooltip
                  // @ts-expect-error Recharts ValueType is broader than number|string at runtime
                  formatter={(value: number, name: string) => [
                    formatY(value), 
                    name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                  ]}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--card-foreground))',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                  }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                  labelStyle={{ color: 'hsl(var(--muted-foreground))', fontWeight: 600 }}
                  cursor={{ fill: 'hsl(var(--muted) / 0.15)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                
                <Bar dataKey="fuel" name="Fuel" stackId="a" fill={EXPENSE_COLOR_MAP.fuel} radius={[0, 0, 0, 0]} maxBarSize={60} />
                <Bar dataKey="maintenance" name="Maintenance" stackId="a" fill={EXPENSE_COLOR_MAP.maintenance} radius={[0, 0, 0, 0]} maxBarSize={60} />
                <Bar dataKey="toll" name="Toll" stackId="a" fill={EXPENSE_COLOR_MAP.toll} radius={[0, 0, 0, 0]} maxBarSize={60} />
                <Bar dataKey="driver_allowance" name="Driver Allowance" stackId="a" fill={EXPENSE_COLOR_MAP.driver_allowance} radius={[0, 0, 0, 0]} maxBarSize={60} />
                <Bar dataKey="other" name="Other" stackId="a" fill={EXPENSE_COLOR_MAP.other} radius={[4, 4, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
