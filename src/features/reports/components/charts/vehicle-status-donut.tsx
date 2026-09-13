import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FleetSummary } from '../../domain/reports-types';
import { VEHICLE_STATUS_COLORS } from '../../domain/reports-constants';
import { Skeleton } from '@/components/ui/skeleton';

interface VehicleStatusDonutProps {
  data: FleetSummary[];
  isLoading: boolean;
  title?: string;
  description?: string;
  height?: number;
}

export function VehicleStatusDonut({
  data,
  isLoading,
  title = "Vehicle Status",
  description = "Current fleet distribution",
  height = 350,
}: VehicleStatusDonutProps) {
  
  const aggregatedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const statusCounts = data.reduce((acc, curr) => {
      const status = curr.status.toLowerCase();
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      color: VEHICLE_STATUS_COLORS[status] || VEHICLE_STATUS_COLORS.inactive,
    }));
  }, [data]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ height }} className="flex items-center justify-center">
            <Skeleton className="w-[200px] h-[200px] rounded-full" />
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
        {aggregatedData.length === 0 ? (
          <div className="flex items-center justify-center text-muted-foreground" style={{ height }}>
            No status data available.
          </div>
        ) : (
          <div style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={aggregatedData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {aggregatedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  // @ts-expect-error Recharts ValueType is broader than number|string at runtime
                  formatter={(value: number) => [value, 'Vehicles']}
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
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
