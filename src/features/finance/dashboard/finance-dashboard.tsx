'use client';

import { useState, useEffect } from 'react';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { FinanceMetricsCards } from './finance-metrics-cards';
import { AppLoadingState } from '@/components/shared/app-loading-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Activity } from 'lucide-react';

// Temporary mock data for Finance Dashboard
const mockMetrics = {
  todaysRevenue: 45000,
  monthlyRevenue: 1250000,
  outstandingAmount: 187000,
  netProfit: 450000,
  collectionRate: 85,
};

export function FinanceDashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <AppLoadingState />;

  return (
    <div className="space-y-6">
      <AppPageHeader 
        title="Financial Overview" 
        description="High-level financial performance, revenue, and profitability metrics."
      />

      <FinanceMetricsCards metrics={mockMetrics} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="min-h-[300px]">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart className="h-4 w-4 text-primary" />
              Revenue vs Expenses (Last 6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[250px] text-muted-foreground border-t border-dashed m-6 mt-0 bg-muted/10 rounded-lg">
            Chart visualization will be implemented here
          </CardContent>
        </Card>

        <Card className="min-h-[300px]">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Recent Financial Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: 1, action: 'Payment Received', entity: 'TCS Operations', amount: 45000, time: '2 hours ago' },
                { id: 2, action: 'Invoice Generated', entity: 'Trip #KT-2026-004', amount: 12500, time: '5 hours ago' },
                { id: 3, action: 'Expense Recorded', entity: 'Fuel (Trip #KT-2026-005)', amount: 3500, time: 'Yesterday' },
                { id: 4, action: 'Payment Received', entity: 'Mankind Pharma', amount: 120000, time: 'Yesterday' },
              ].map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 rounded-md bg-muted/40 border text-sm">
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.entity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      {activity.action === 'Expense Recorded' ? '-' : ''}
                      ₹{activity.amount.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
