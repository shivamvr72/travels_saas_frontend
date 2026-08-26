'use client';

import { useState, useEffect } from 'react';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { FinanceMetricsCards } from './finance-metrics-cards';
import { AppLoadingState } from '@/components/shared/app-loading-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Activity } from 'lucide-react';

import { apiClient } from '@/shared/lib/axios';
import { formatDistanceToNow } from 'date-fns';

export function FinanceDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    todaysRevenue: 0,
    monthlyRevenue: 0,
    outstandingAmount: 0,
    netProfit: 0,
    collectionRate: 0,
  });
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [metricsRes, activityRes] = await Promise.all([
          apiClient.get('/api/v1/analytics/executive-summary'),
          apiClient.get('/api/v1/activity?entity_type=TRIP&page_size=10')
        ]);
        
        const m = metricsRes?.data?.data || metricsRes?.data || {};
        setMetrics({
          todaysRevenue: m.today_revenue || 0,
          monthlyRevenue: m.monthly_revenue || 0,
          outstandingAmount: m.outstanding_receivables || 0,
          netProfit: m.net_profit || 0,
          collectionRate: m.collection_rate_pct || 0,
        });

        const rawEvents = Array.isArray(activityRes?.data?.data)
          ? activityRes.data.data
          : Array.isArray(activityRes?.data?.items)
          ? activityRes.data.items
          : Array.isArray(activityRes?.data?.events)
          ? activityRes.data.events
          : Array.isArray(activityRes?.data)
          ? activityRes.data
          : [];

        const financeEvents = rawEvents.filter((e: any) => 
          ['payment_received', 'invoice_generated', 'expense_added', 'trip.settled', 'trip.assigned'].includes(e.event_type) || true
        );
        setActivities((financeEvents.length > 0 ? financeEvents : rawEvents).slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch finance dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) return <AppLoadingState />;

  return (
    <div className="space-y-6">
      <AppPageHeader 
        title="Financial Overview" 
        description="High-level financial performance, revenue, and profitability metrics."
      />

      <FinanceMetricsCards metrics={metrics} />
      
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
              {activities.length === 0 ? (
                <div className="text-sm text-muted-foreground p-4 text-center">No recent financial activity found.</div>
              ) : (
                activities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 rounded-md bg-muted/40 border text-sm">
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {activity.created_at || activity.timestamp
                          ? formatDistanceToNow(new Date(activity.created_at || activity.timestamp), { addSuffix: true })
                          : ''}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
