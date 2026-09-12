import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CHART_COLORS } from '../../domain/reports-constants';

interface ReportPieChartProps {
   
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
  const totalValue = React.useMemo(() => {
    return data.reduce((acc, item) => acc + (Number(item[valueKey]) || 0), 0);
  }, [data, valueKey]);

  return (
    <Card>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        {data.length === 0 ? (
          <div className="flex items-center justify-center text-muted-foreground" style={{ height }}>
            No data available for this period.
          </div>
        ) : (
          <div className="relative" style={{ height }}>
            {variant === 'donut' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-9 z-10">
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total</span>
                <span className="text-sm sm:text-base font-bold text-foreground drop-shadow-xs">{formatValue(totalValue)}</span>
              </div>
            )}
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
                  // @ts-expect-error Recharts ValueType is broader than number|string at runtime
                  formatter={(value: number | string) => formatValue(Number(value))}
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
