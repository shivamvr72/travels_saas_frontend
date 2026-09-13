import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ProfitMarginGaugeProps {
  marginPct: number;
  isLoading: boolean;
  title?: string;
  description?: string;
  height?: number;
}

export function ProfitMarginGauge({
  marginPct,
  isLoading,
  title = "Profit Margin",
  description = "Overall profitability health",
  height = 350,
}: ProfitMarginGaugeProps) {
  
  if (isLoading) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="flex h-full items-center justify-center pt-8">
            <Skeleton className="h-48 w-48 rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Determine color based on margin percentage
  let color = 'hsl(var(--destructive))';
  if (marginPct >= 25) {
    color = 'hsl(var(--success))';
  } else if (marginPct >= 10) {
    color = 'hsl(var(--warning))';
  }

  // Cap at 100% for the visual representation, though it could technically be higher
  const visualValue = Math.min(Math.max(marginPct, 0), 100);

  const data = [
    {
      name: 'Margin',
      value: visualValue,
      fill: color,
    }
  ];

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div style={{ height }} className="relative flex h-full items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart 
              cx="50%" 
              cy="50%" 
              innerRadius="70%" 
              outerRadius="90%" 
              barSize={20} 
              data={data}
              startAngle={90} 
              endAngle={-270}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                angleAxisId={0}
                tick={false}
              />
              <RadialBar
                background={{ fill: 'hsl(var(--muted))' }}
                dataKey="value"
                cornerRadius={10}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className={cn(
              "text-4xl font-bold tracking-tighter",
              marginPct >= 25 ? "text-green-500" : marginPct >= 10 ? "text-amber-500" : "text-destructive"
            )}>
              {marginPct.toFixed(1)}%
            </span>
            <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
              Net Margin
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
