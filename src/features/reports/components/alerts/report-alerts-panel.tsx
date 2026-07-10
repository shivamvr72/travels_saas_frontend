import React from 'react';
import { useAlerts } from '../../hooks/use-alerts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export function ReportAlertsPanel() {
  const { data: alerts, isLoading } = useAlerts();

  if (isLoading) {
    return <Skeleton className="h-[200px] w-full" />;
  }

  if (!alerts || alerts.length === 0) {
    return null; // Don't show panel if no alerts
  }

  return (
    <Card className="border-l-4 border-l-warning">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning" />
          Business Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {alerts.map((alert, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm">
              {alert.severity === 'critical' && <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />}
              {alert.severity === 'warning' && <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />}
              {alert.severity === 'info' && <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />}
              
              <div>
                <span className="font-medium">{alert.entity_name}: </span>
                <span className="text-muted-foreground">{alert.message}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
