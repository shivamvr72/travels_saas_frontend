"use client";

import { useState } from 'react';
import { format } from 'date-fns';
import { useDispatchBoard } from '../hooks/use-dispatch-board';
import { DispatchBoardSummary } from '../components/dispatch-board-summary';
import { DispatchTripList } from '../components/dispatch-trip-list';
import { BulkAssignDialog } from '../components/bulk-assign-dialog';
import { TripDispatchSummary } from '../schemas/dispatch-schemas';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { AppLoadingState } from '@/components/shared/app-loading-state';
import { AppErrorState } from '@/components/shared/app-error-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Can } from '@/shared/permissions/can';
import { PERMISSION_KEYS } from '@/shared/permissions';
import { Layers } from 'lucide-react';

export function DispatchPage() {
  const [date, setDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [selectedTrips, setSelectedTrips] = useState<TripDispatchSummary[]>([]);
  const [isBulkAssignOpen, setIsBulkAssignOpen] = useState(false);

  const { data, isLoading, isError, error, refetch } = useDispatchBoard(date);

  const handleBulkAssignClick = () => {
    if (selectedTrips.length > 0) {
      setIsBulkAssignOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <AppPageHeader title="Dispatch Board" />
        <AppLoadingState />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <AppPageHeader title="Dispatch Board" />
        <AppErrorState 
          error={(error as Error)?.message || "An unknown error occurred"}
          message="Failed to load dispatch board"
          retry={() => { refetch(); }}
        />
      </div>
    );
  }

  const selectedIds = new Set(selectedTrips.map(t => t.id));

  return (
    <div className="space-y-6 pb-12">
      <AppPageHeader 
        title="Dispatch Board" 
        actions={
          <div className="flex items-center gap-4">
            <Input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              className="w-auto"
            />
            <Can permission={PERMISSION_KEYS.TRIPS_ASSIGN}>
              <Button 
                onClick={handleBulkAssignClick}
                disabled={selectedTrips.length === 0}
              >
                <Layers className="mr-2 h-4 w-4" />
                Bulk Assign ({selectedTrips.length})
              </Button>
            </Can>
          </div>
        }
      />

      <DispatchBoardSummary 
        availableVehiclesCount={data?.available_vehicles_count ?? 0}
        availableDriversCount={data?.available_drivers_count ?? 0}
        pendingTripsCount={data?.pending_trips.length ?? 0}
        inProgressTripsCount={data?.in_progress_trips.length ?? 0}
      />

      <div className="mt-8 space-y-6">
        <DispatchTripList 
          title="Pending Dispatch" 
          description="Trips in DRAFT or SCHEDULED state awaiting vehicle and driver assignment."
          trips={data?.pending_trips ?? []}
          selectable
          selectedTripIds={selectedIds}
          onSelectionChange={(newSelection) => setSelectedTrips(newSelection)}
        />

        <DispatchTripList 
          title="Assigned Trips" 
          description="Trips with a vehicle and driver assigned, ready for dispatch."
          trips={data?.assigned_trips ?? []}
        />

        <DispatchTripList 
          title="In Progress" 
          description="Trips currently underway."
          trips={data?.in_progress_trips ?? []}
        />
      </div>

      <BulkAssignDialog
        open={isBulkAssignOpen}
        onOpenChange={setIsBulkAssignOpen}
        selectedTrips={selectedTrips}
        onSuccess={() => setSelectedTrips([])}
      />
    </div>
  );
}
