"use client";

import { useState } from 'react';
import { TripDispatchSummary } from '../schemas/dispatch-schemas';
import { AppSectionCard } from '@/components/shared/app-section-card';
import { AppStatusBadge } from '@/components/shared/app-status-badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { AssignTripDialog } from './assign-trip-dialog';
import { BulkAssignDialog } from './bulk-assign-dialog';
import { Can } from '@/shared/permissions/can';
import { PERMISSION_KEYS } from '@/shared/permissions';

interface DispatchTripListProps {
  title: string;
  description?: string;
  trips: TripDispatchSummary[];
  selectable?: boolean;
  onSelectionChange?: (selectedTrips: TripDispatchSummary[]) => void;
  selectedTripIds?: Set<string>;
}

export function DispatchTripList({
  title,
  description,
  trips,
  selectable,
  onSelectionChange,
  selectedTripIds = new Set(),
}: DispatchTripListProps) {
  const [assignDialogTripId, setAssignDialogTripId] = useState<string | null>(null);
  const [isBulkAssignOpen, setIsBulkAssignOpen] = useState(false);

  const toggleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return;
    if (checked) {
      onSelectionChange(trips);
    } else {
      onSelectionChange([]);
    }
  };

  const toggleTripSelection = (trip: TripDispatchSummary, checked: boolean) => {
    if (!onSelectionChange) return;
    const currentlySelected = trips.filter(t => selectedTripIds.has(t.id));
    if (checked) {
      onSelectionChange([...currentlySelected, trip]);
    } else {
      onSelectionChange(currentlySelected.filter(t => t.id !== trip.id));
    }
  };

  const allSelected = trips.length > 0 && trips.every(t => selectedTripIds.has(t.id));
  const someSelected = trips.length > 0 && trips.some(t => selectedTripIds.has(t.id)) && !allSelected;
  const selectedTripsArray = trips.filter(t => selectedTripIds.has(t.id));

  return (
    <>
      <AppSectionCard title={title} description={description} noPadding className="mb-6">
        {trips.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No trips found.
          </div>
        ) : (
          <div className="divide-y">
            {selectable && (
              <div className="flex items-center justify-between px-4 py-3 bg-muted/50">
                <div className="flex items-center">
                  <Checkbox 
                    checked={allSelected}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all"
                  />
                  <span className="ml-3 text-sm font-medium">Select All</span>
                </div>
                {selectedTripsArray.length > 0 && (
                  <Can permission={PERMISSION_KEYS.TRIPS_ASSIGN}>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => setIsBulkAssignOpen(true)}
                    >
                      Bulk Assign ({selectedTripsArray.length})
                    </Button>
                  </Can>
                )}
              </div>
            )}
            
            {trips.map((trip) => (
              <div key={trip.id} className="flex items-center justify-between px-4 py-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-start gap-4">
                  {selectable && (
                    <div className="mt-1">
                      <Checkbox 
                        checked={selectedTripIds.has(trip.id)}
                        onCheckedChange={(checked) => toggleTripSelection(trip, checked === true)}
                        aria-label={`Select trip ${trip.id}`}
                      />
                    </div>
                  )}
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">Trip {trip.id.substring(0, 8)}</span>
                      <AppStatusBadge status={trip.status} />
                    </div>
                    
                    <div className="text-sm text-muted-foreground grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 mt-2">
                      <div>
                        <span className="font-medium text-foreground">Date:</span> {trip.trip_date}
                      </div>
                      {trip.scheduled_start_time && (
                        <div>
                          <span className="font-medium text-foreground">Time:</span> {new Date(trip.scheduled_start_time).toLocaleString()}
                        </div>
                      )}
                      {trip.vehicle_reg_number && (
                        <div>
                          <span className="font-medium text-foreground">Vehicle:</span> {trip.vehicle_reg_number}
                        </div>
                      )}
                      {trip.driver_name && (
                        <div>
                          <span className="font-medium text-foreground">Driver:</span> {trip.driver_name}
                        </div>
                      )}
                      {trip.customer_name && (
                        <div>
                          <span className="font-medium text-foreground">Customer:</span> {trip.customer_name}
                        </div>
                      )}
                      {trip.trip_type && (
                        <div>
                          <span className="font-medium text-foreground">Type:</span> {trip.trip_type}
                        </div>
                      )}
                      {trip.priority && (
                        <div>
                          <span className="font-medium text-foreground">Priority:</span> {trip.priority}
                        </div>
                      )}
                      {trip.reporting_address && (
                        <div className="col-span-full">
                          <span className="font-medium text-foreground">Route/Address:</span> {trip.reporting_address}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 gap-2">
                  <Can permission={PERMISSION_KEYS.TRIPS_ASSIGN}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setAssignDialogTripId(trip.id)}
                    >
                      {trip.status === 'ASSIGNED' ? 'Re-Assign' : 'Assign'}
                    </Button>
                  </Can>
                </div>
              </div>
            ))}
          </div>
        )}
      </AppSectionCard>

      <AssignTripDialog 
        open={!!assignDialogTripId} 
        onOpenChange={(open) => !open && setAssignDialogTripId(null)}
        tripId={assignDialogTripId}
      />
      <BulkAssignDialog
        open={isBulkAssignOpen}
        onOpenChange={setIsBulkAssignOpen}
        selectedTrips={selectedTripsArray}
        onSuccess={() => onSelectionChange?.([])}
      />
    </>
  );
}
