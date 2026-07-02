import { Trip } from '../../domain/trip-types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InfoIcon, Banknote } from 'lucide-react';

interface TripExpensesTabProps {
  trip: Trip;
}

export function TripExpensesTab({ trip }: TripExpensesTabProps) {
  return (
    <Card className="max-w-2xl mx-auto mt-6">
      <CardContent className="p-8">
        <div className="flex items-center gap-3 mb-6 border-b pb-4">
          <div className="bg-primary/10 p-2 rounded-full">
            <Banknote className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Trip Expenses Summary</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-muted/30 rounded-lg p-5 border h-full">
              <h3 className="font-medium text-sm text-muted-foreground mb-4 uppercase tracking-wider">Financial Overview</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Expenses</span>
                  <span className="font-medium text-muted-foreground">No expenses logged</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Advances Issued</span>
                  <span className="font-medium text-muted-foreground">No advances logged</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Estimated Cost</span>
                  <span className="font-medium">—</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="font-medium">Net Profitability</span>
                  <span className="font-medium text-muted-foreground">Pending FE-5</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-muted/30 rounded-lg p-5 border h-full">
              <h3 className="font-medium text-sm text-muted-foreground mb-4 uppercase tracking-wider">Operational Metrics</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Est. Distance</span>
                  <span className="font-medium">{trip.route?.distance_km || 0} km</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Est. Duration</span>
                  <span className="font-medium">{trip.route?.estimated_duration_mins ? Math.round(trip.route.estimated_duration_mins / 60) : 0} hrs</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Fuel Efficiency</span>
                  <span className="font-medium text-muted-foreground">Waiting for logs</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="font-medium">On-Time Performance</span>
                  <span className="font-medium text-muted-foreground">Pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg p-5 border border-blue-100 dark:border-blue-900 flex gap-4">
          <InfoIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed">
              Full expense tracking, driver advances, and detailed operational analytics will be available in the <strong>Expense Management module (FE-5)</strong>.
            </p>
            <p className="text-sm text-blue-800/80 dark:text-blue-300/80">
              This trip's financial and operational data will automatically populate here once integrated.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
