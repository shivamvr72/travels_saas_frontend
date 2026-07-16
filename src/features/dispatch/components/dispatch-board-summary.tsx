import { Car, Users, ClipboardList, Activity, CheckCircle2 } from 'lucide-react';
import { AppMetricCard } from '@/components/shared/app-metric-card';

interface DispatchBoardSummaryProps {
  pendingTripsCount: number;
  assignedTripsCount: number;
  inProgressTripsCount: number;
  availableVehiclesCount: number;
  availableDriversCount: number;
  isLoading?: boolean;
}

export function DispatchBoardSummary({
  pendingTripsCount,
  assignedTripsCount,
  inProgressTripsCount,
  availableVehiclesCount,
  availableDriversCount,
  isLoading,
}: DispatchBoardSummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <AppMetricCard
        title="Pending Trips"
        value={pendingTripsCount}
        icon={<ClipboardList className="h-4 w-4 text-muted-foreground" />}
        isLoading={isLoading}
      />
      <AppMetricCard
        title="Assigned Trips"
        value={assignedTripsCount}
        icon={<CheckCircle2 className="h-4 w-4 text-muted-foreground" />}
        isLoading={isLoading}
      />
      <AppMetricCard
        title="In Progress"
        value={inProgressTripsCount}
        icon={<Activity className="h-4 w-4 text-muted-foreground" />}
        isLoading={isLoading}
      />
      <AppMetricCard
        title="Available Vehicles"
        value={availableVehiclesCount}
        icon={<Car className="h-4 w-4 text-muted-foreground" />}
        isLoading={isLoading}
      />
      <AppMetricCard
        title="Available Drivers"
        value={availableDriversCount}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        isLoading={isLoading}
      />
    </div>
  );
}
