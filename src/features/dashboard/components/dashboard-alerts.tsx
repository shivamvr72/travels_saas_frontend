'use client';

import { AppSectionCard } from '@/components/shared';
import { useDashboardStats } from '../hooks/use-dashboard-stats';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export function DashboardAlerts() {
  const { data, isLoading } = useDashboardStats();

  return (
    <AppSectionCard title="Attention Required" className="col-span-full">
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <div className="space-y-3">
          {data?.alerts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No alerts at this time.</p>
          ) : (
            data?.alerts.map((alert) => (
              <div 
                key={alert.id}
                className={cn(
                  "flex items-start gap-3 rounded-md border p-3 text-sm",
                  alert.type === 'destructive' 
                    ? "border-destructive/50 bg-destructive/5 text-destructive" 
                    : "border-orange-500/50 bg-orange-500/5 text-orange-600 dark:text-orange-400"
                )}
              >
                {alert.type === 'destructive' ? (
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                ) : (
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                )}
                <span>{alert.message}</span>
              </div>
            ))
          )}
        </div>
      )}
    </AppSectionCard>
  );
}
