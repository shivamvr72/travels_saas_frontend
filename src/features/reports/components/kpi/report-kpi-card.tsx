import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ReportKpiCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean | null;
  };
  isLoading?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'destructive' | 'default';
  className?: string;
}

export function ReportKpiCard({
  title,
  value,
  icon,
  trend,
  isLoading,
  color = 'default',
  className,
}: ReportKpiCardProps) {
  const colorMap = {
    primary: 'border-l-primary',
    success: 'border-l-green-500',
    warning: 'border-l-yellow-500',
    destructive: 'border-l-destructive',
    default: 'border-l-border',
  };

  return (
    <Card className={cn('border-l-4 shadow-sm', colorMap[color], className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <h2 className="text-3xl font-bold tracking-tight">{value}</h2>
          )}
        </div>
        {trend && !isLoading && (
          <p
            className={cn(
              'mt-1 flex items-center text-xs',
              trend.isPositive === true && 'text-green-600 dark:text-green-400',
              trend.isPositive === false && 'text-destructive',
              trend.isPositive === null && 'text-muted-foreground'
            )}
          >
            {trend.isPositive === true && <TrendingUp className="mr-1 h-3 w-3" />}
            {trend.isPositive === false && <TrendingDown className="mr-1 h-3 w-3" />}
            {trend.isPositive === null && <Minus className="mr-1 h-3 w-3" />}
            {trend.value}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
