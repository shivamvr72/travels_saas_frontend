import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DriverPerformanceTrend } from '../../domain/reports-types';
import { DRIVER_CHART_COLORS } from '../../domain/reports-constants';
import { Skeleton } from '@/components/ui/skeleton';

interface DriverPerformanceChartProps {
  data: DriverPerformanceTrend[];
  isLoading: boolean;
  title?: string;
  description?: string;
  height?: number;
}

export function DriverPerformanceChart({
  data,
  isLoading,
  title = "Performance Trend",
  description = "Trips and revenue over time",
  height = 350,
}: DriverPerformanceChartProps) {
  
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
            No performance data available for this period.
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
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dx={-10}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(val) => `₹${(val / 1000).toFixed(1)}k`}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dx={10}
                />
                <Tooltip
                  // @ts-expect-error Recharts ValueType is broader than number|string at runtime
                  formatter={(value: number, name: string) => {
                    if (name === 'revenue') return [`₹${value.toLocaleString()}`, 'Revenue'];
                    return [value, name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())];
                  }}
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
                
                <Bar yAxisId="left" dataKey="trips" name="Trips" fill={DRIVER_CHART_COLORS.trips} radius={[4, 4, 0, 0]} barSize={32} />
                <Line yAxisId="right" type="monotone" dataKey="revenue" name="Revenue" stroke={DRIVER_CHART_COLORS.revenue} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
