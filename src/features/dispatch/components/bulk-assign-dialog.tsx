"use client";

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BulkAssignRequestSchema, BulkAssignRequest } from '../schemas/dispatch-schemas';
import { useBulkAssign } from '../hooks/use-bulk-assign';
import { AppLookup } from '@/components/shared/app-lookup';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2 } from 'lucide-react';
import { TripDispatchSummary } from '../schemas/dispatch-schemas';

interface BulkAssignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTrips: TripDispatchSummary[];
  onSuccess?: () => void;
}

export function BulkAssignDialog({ open, onOpenChange, selectedTrips, onSuccess }: BulkAssignDialogProps) {
  const bulkMutation = useBulkAssign();

  // Initialize form with the selected trips
  const form = useForm<BulkAssignRequest>({
    resolver: zodResolver(BulkAssignRequestSchema),
    defaultValues: {
      assignments: selectedTrips.map(t => ({
        trip_id: t.id,
        vehicle_id: null,
        driver_id: null,
        scheduled_start_time: null,
        scheduled_end_time: null,
        estimated_duration_hrs: null,
      })),
    },
  });

  const { fields, remove } = useFieldArray({
    control: form.control,
    name: 'assignments',
  });

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const onSubmit = (data: BulkAssignRequest) => {
    // Client-side guard: remove any assignments where BOTH vehicle and driver are null
    const validAssignments = data.assignments.filter(a => a.vehicle_id || a.driver_id);
    
    if (validAssignments.length === 0) {
      form.setError('root', { message: 'No valid assignments provided. Select at least one vehicle or driver.' });
      return;
    }

    bulkMutation.mutate(
      { assignments: validAssignments },
      {
        onSuccess: () => {
          onSuccess?.();
          handleClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Bulk Assign Trips</DialogTitle>
          <DialogDescription>
            Assign vehicles and drivers to multiple trips at once.
          </DialogDescription>
        </DialogHeader>

        {form.formState.errors.root && (
          <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
            {form.formState.errors.root.message}
          </div>
        )}

        <Form {...form}>
          <form id="bulk-assign-form" onSubmit={form.handleSubmit(onSubmit)} className="flex-1 overflow-auto space-y-4 pr-2">
            {fields.map((field, index) => {
              const tripName = selectedTrips.find(t => t.id === field.trip_id)?.id.substring(0, 8) || 'Unknown';
              
              return (
                <div key={field.id} className="grid grid-cols-[1fr_2fr_2fr_auto] gap-4 items-start p-4 border rounded-lg bg-card">
                  <div className="pt-2">
                    <p className="text-sm font-medium">Trip {tripName}</p>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name={`assignments.${index}.vehicle_id`}
                    render={({ field: vehicleField }) => (
                      <FormItem>
                        <FormControl>
                          <AppLookup
                            lookupKey="dispatch-available-vehicles"
                            placeholder="Select vehicle..."
                            value={vehicleField.value ?? undefined}
                            onChange={(val) => vehicleField.onChange(val || null)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`assignments.${index}.driver_id`}
                    render={({ field: driverField }) => (
                      <FormItem>
                        <FormControl>
                          <AppLookup
                            lookupKey="dispatch-available-drivers"
                            placeholder="Select driver..."
                            value={driverField.value ?? undefined}
                            onChange={(val) => driverField.onChange(val || null)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
            
            {fields.length === 0 && (
              <div className="p-8 text-center text-muted-foreground border border-dashed rounded-lg">
                No trips selected for bulk assignment.
              </div>
            )}
          </form>
        </Form>

        <DialogFooter className="mt-6 pt-4 border-t">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            form="bulk-assign-form"
            disabled={bulkMutation.isPending || fields.length === 0}
          >
            {bulkMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Bulk Assignment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
