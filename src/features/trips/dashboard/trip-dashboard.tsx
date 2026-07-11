'use client';

import { useTripDashboardStats } from '../api';
import { AppToolbar } from '@/components/layout/crud/app-toolbar';
import { AppMetricCard } from '@/components/shared/app-metric-card';
import { AppLoadingState } from '@/components/shared/app-loading-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Play, CheckCircle2, AlertTriangle, XCircle, Car, Users } from 'lucide-react';
import { PERMISSION_KEYS } from '@/shared/permissions';
import { useRouter } from 'next/navigation';

export function TripDashboard() {
  const router = useRouter();
  const { data: stats, isLoading, refetch } = useTripDashboardStats();

  if (isLoading || !stats) {
    return (
      <div className="space-y-6">
        <AppToolbar title="Trip Operations" description="Loading operations metrics..." />
        <AppLoadingState />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AppToolbar
        title="Trip Operations"
        description="Monitor current dispatch and operational health"
        primaryAction={{
          label: 'New Trip',
          onClick: () => router.push('/trips/new'),
          permission: PERMISSION_KEYS.TRIPS_CREATE as any,
        }}
        onRefresh={() => refetch()}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4">
        <AppMetricCard
          title="Trips Today"
          value={stats.trips_today}
          icon={<CalendarDays className="h-4 w-4" />}
          description="vs yesterday"
        />
        <AppMetricCard
          title="Running"
          value={stats.running_trips}
          icon={<Play className="h-4 w-4 text-blue-500" />}
        />
        <AppMetricCard
          title="Completed"
          value={stats.completed_today}
          icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
          description="vs yesterday"
        />
        <AppMetricCard
          title="Delayed"
          value={stats.delayed_trips}
          icon={<AlertTriangle className="h-4 w-4 text-amber-500" />}
        />
        <AppMetricCard
          title="Cancelled"
          value={stats.cancelled_today}
          icon={<XCircle className="h-4 w-4 text-rose-500" />}
          description="vs yesterday"
        />
        <AppMetricCard
          title="Vehicle Util."
          value={`${stats.vehicle_utilization_pct}%`}
          icon={<Car className="h-4 w-4" />}
          description="vs last week"
        />
        <AppMetricCard
          title="Driver Avail."
          value={`${stats.drivers_available}/${stats.drivers_total}`}
          icon={<Users className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
              <p>Global activity feed will be available in FE-4.2.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Trips (Next 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
              <p>Upcoming trips list will be populated in FE-4.2.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
