import React from 'react';
import { useAlerts } from '../../hooks/use-alerts';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { AlertCircle, AlertTriangle, Info, Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function ReportAlertsPanel() {
  const { data: alerts, isLoading } = useAlerts();

  if (isLoading || !alerts || alerts.length === 0) {
    return null;
  }

  const criticalCount = alerts.filter(a => a.severity === 'critical').length;

  return (
    <Popover>
      <PopoverTrigger render={
        <Button variant="outline" size="sm" className="relative gap-2 h-9">
          <Bell className="h-4 w-4" />
          <span>Alerts</span>
          <Badge variant={criticalCount > 0 ? "destructive" : "secondary"} className="ml-1 h-5 px-1.5 py-0 flex items-center justify-center text-xs">
            {alerts.length}
          </Badge>
        </Button>
      } />
      <PopoverContent align="end" className="w-[350px] p-0 shadow-lg">
        <div className="flex flex-col">
          <div className="border-b px-4 py-3 bg-muted/50">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Business Alerts
            </h4>
          </div>
          <div className="p-4 space-y-4 max-h-[300px] overflow-y-auto no-scrollbar">
            {alerts.map((alert, idx) => (
              <div key={idx} className="flex items-start gap-3 text-sm">
                {alert.severity === 'critical' && <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />}
                {alert.severity === 'warning' && <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />}
                {alert.severity === 'info' && <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />}
                
                <div className="leading-tight flex flex-col gap-0.5">
                  <span className="font-medium text-foreground">{alert.entity_name}</span>
                  <span className="text-muted-foreground text-xs">{alert.message}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
