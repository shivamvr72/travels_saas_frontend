import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ReportAreaChartProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  xKey: string;
  yKey: string;
  secondaryYKey?: string;
  title?: string;
  description?: string;
  formatY?: (value: number) => string;
  height?: number;
  color?: string;
  secondaryColor?: string;
}

export function ReportAreaChart({
  data,
  xKey,
  yKey,
  secondaryYKey,
  title,
  description,
  formatY = (v) => v.toString(),
  height = 350,
  color = 'hsl(var(--primary))',
  secondaryColor = 'hsl(var(--destructive))',
}: ReportAreaChartProps) {
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
          <div style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                <linearGradient id="colorY" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
                {secondaryYKey && (
                  <linearGradient id="colorY2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={secondaryColor} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={secondaryColor} stopOpacity={0} />
                  </linearGradient>
                )}
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis 
                dataKey={xKey} 
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
                formatter={(value: number | string, name: string) => [formatY(Number(value)), name]}
                contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
              />
              <Area 
                type="monotone" 
                dataKey={yKey} 
                name={yKey.charAt(0).toUpperCase() + yKey.slice(1)}
                stroke={color} 
                fillOpacity={1} 
                fill="url(#colorY)" 
                strokeWidth={2}
                dot={data.length === 1 ? { r: 4, fill: color, strokeWidth: 2, stroke: 'hsl(var(--background))' } : false}
                activeDot={{ r: 6, fill: color, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
              />
              {secondaryYKey && (
                <Area 
                  type="monotone" 
                  dataKey={secondaryYKey} 
                  name={secondaryYKey.charAt(0).toUpperCase() + secondaryYKey.slice(1)}
                  stroke={secondaryColor} 
                  fillOpacity={1} 
                  fill="url(#colorY2)" 
                  strokeWidth={2}
                  dot={data.length === 1 ? { r: 4, fill: secondaryColor, strokeWidth: 2, stroke: 'hsl(var(--background))' } : false}
                  activeDot={{ r: 6, fill: secondaryColor, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        )}
      </CardContent>
    </Card>
  );
}
