import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CHART_COLORS } from '../../domain/reports-constants';

interface ReportPieChartProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  nameKey: string;
  valueKey: string;
  title?: string;
  description?: string;
  variant?: 'pie' | 'donut';
  height?: number;
  formatValue?: (value: number) => string;
  colors?: string[];
}

export function ReportPieChart({
  data,
  nameKey,
  valueKey,
  title,
  description,
  variant = 'donut',
  height = 350,
  formatValue = (v) => v.toString(),
  colors = CHART_COLORS,
}: ReportPieChartProps) {
  return (
    <Card>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={variant === 'donut' ? 60 : 0}
                outerRadius={80}
                paddingAngle={variant === 'donut' ? 2 : 0}
                dataKey={valueKey}
                nameKey={nameKey}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error Recharts ValueType is broader than number|string at runtime
                formatter={(value: number | string) => formatValue(Number(value))}
                contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
