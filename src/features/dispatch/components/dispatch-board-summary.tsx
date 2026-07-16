import { Car, Users, ClipboardList, Activity } from 'lucide-react';
import { AppMetricCard } from '@/components/shared/app-metric-card';

interface DispatchBoardSummaryProps {
  availableVehiclesCount: number;
  availableDriversCount: number;
  pendingTripsCount: number;
  inProgressTripsCount: number;
  isLoading?: boolean;
}

export function DispatchBoardSummary({
  availableVehiclesCount,
  availableDriversCount,
  pendingTripsCount,
  inProgressTripsCount,
  isLoading,
}: DispatchBoardSummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <AppMetricCard
        title="Available Vehicles"
        value={availableVehiclesCount}
        icon={<Car className="h-4 w-4" />}
        isLoading={isLoading}
      />
      <AppMetricCard
        title="Available Drivers"
        value={availableDriversCount}
        icon={<Users className="h-4 w-4" />}
        isLoading={isLoading}
      />
      <AppMetricCard
        title="Pending Dispatch"
        value={pendingTripsCount}
        icon={<ClipboardList className="h-4 w-4" />}
        isLoading={isLoading}
      />
      <AppMetricCard
        title="In Progress"
        value={inProgressTripsCount}
        icon={<Activity className="h-4 w-4" />}
        isLoading={isLoading}
      />
    </div>
  );
}
