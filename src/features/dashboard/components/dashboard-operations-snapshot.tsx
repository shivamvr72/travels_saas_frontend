'use client';

import { AppSectionCard } from '@/components/shared';
import { useDashboardStats } from '../hooks/use-dashboard-stats';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardOperationsSnapshot() {
  const { data, isLoading } = useDashboardStats();

  return (
    <AppSectionCard title="Operations Snapshot">
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[80%]" />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Upcoming Trips (7 days)</span>
            <span className="font-semibold">{data?.operations.upcomingTrips}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Vehicles Active Today</span>
            <span className="font-semibold">{data?.operations.activeVehicles}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Drivers Assigned</span>
            <span className="font-semibold">{data?.operations.assignedDrivers}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">External Vehicles Hired</span>
            <span className="font-semibold">{data?.operations.externalHired}</span>
          </div>
        </div>
      )}
    </AppSectionCard>
  );
}
