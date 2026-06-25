import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { ReactNode } from 'react';

interface AppMetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: ReactNode;
  trend?: {
    value: string | number;
    direction: 'up' | 'down' | 'neutral';
  };
  isLoading?: boolean;
}

export function AppMetricCard({
  title,
  value,
  description,
  icon,
  trend,
  isLoading,
}: AppMetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            {(description || trend) && (
              <div className="flex items-center gap-2 mt-1">
                {trend && (
                  <span className={`flex items-center text-xs font-medium ${
                    trend.direction === 'up' ? 'text-green-600 dark:text-green-400' :
                    trend.direction === 'down' ? 'text-destructive' :
                    'text-muted-foreground'
                  }`}>
                    {trend.direction === 'up' && <TrendingUp className="mr-1 h-3 w-3" />}
                    {trend.direction === 'down' && <TrendingDown className="mr-1 h-3 w-3" />}
                    {trend.direction === 'neutral' && <Minus className="mr-1 h-3 w-3" />}
                    {trend.value}
                  </span>
                )}
                {description && (
                  <p className="text-xs text-muted-foreground">{description}</p>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
