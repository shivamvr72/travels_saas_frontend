import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DriverAnalytics } from '../../domain/reports-types';
import { CHART_COLORS } from '../../domain/reports-constants';
import { Skeleton } from '@/components/ui/skeleton';

interface DriverWorkloadDonutProps {
  data: DriverAnalytics[];
  isLoading: boolean;
  title?: string;
  description?: string;
  height?: number;
}

export function DriverWorkloadDonut({
  data,
  isLoading,
  title = "Driver Workload",
  description = "Trip distribution (Top 8)",
  height = 350,
}: DriverWorkloadDonutProps) {
  
  if (isLoading) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="pb-0">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div style={{ height }} className="flex items-center justify-center">
            <Skeleton className="h-48 w-48 rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Take top 8 drivers by trips for the donut chart, group rest as "Other"
  const sortedData = [...data].sort((a, b) => b.trips_completed - a.trips_completed);
  let chartData: { name: string; value: number }[] = [];
  
  if (sortedData.length > 8) {
    chartData = sortedData.slice(0, 7).map(d => ({
      name: d.driver_name,
      value: d.trips_completed,
    }));
    
    const otherTrips = sortedData.slice(7).reduce((sum, d) => sum + d.trips_completed, 0);
    if (otherTrips > 0) {
      chartData.push({ name: 'Other Drivers', value: otherTrips });
    }
  } else {
    chartData = sortedData.map(d => ({
      name: d.driver_name,
      value: d.trips_completed,
    }));
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center text-muted-foreground" style={{ height }}>
            No workload data available.
          </div>
        ) : (
          <div style={{ height }} className="relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="hsl(var(--background))"
                  strokeWidth={2}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  // @ts-expect-error Recharts ValueType is broader than number|string at runtime
                  formatter={(value: number) => [`${value} Trips`, 'Workload']}
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
                />
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right"
                  wrapperStyle={{ fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
