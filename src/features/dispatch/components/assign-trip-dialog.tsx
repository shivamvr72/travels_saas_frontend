"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AssignTripRequestSchema, AssignTripRequest } from '../schemas/dispatch-schemas';
import { useAssignTrip } from '../hooks/use-assign-trip';
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
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface AssignTripDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripId: string | null;
}

export function AssignTripDialog({ open, onOpenChange, tripId }: AssignTripDialogProps) {
  const assignMutation = useAssignTrip();

  const form = useForm<AssignTripRequest>({
    resolver: zodResolver(AssignTripRequestSchema),
    defaultValues: {
      vehicle_id: null,
      driver_id: null,
      scheduled_start_time: null,
      scheduled_end_time: null,
      estimated_duration_hrs: null,
    },
  });

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const onSubmit = (data: AssignTripRequest) => {
    if (!tripId) return;
    
    assignMutation.mutate(
      { tripId, data },
      {
        onSuccess: () => {
          handleClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Trip</DialogTitle>
          <DialogDescription>
            Select a vehicle and/or driver to assign to this trip.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="vehicle_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle</FormLabel>
                  <FormControl>
                    <AppLookup
                      lookupKey="dispatch-available-vehicles"
                      placeholder="Select a vehicle..."
                      value={field.value ?? undefined}
                      onChange={(val) => field.onChange(val || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="driver_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Driver</FormLabel>
                  <FormControl>
                    <AppLookup
                      lookupKey="dispatch-available-drivers"
                      placeholder="Select a driver..."
                      value={field.value ?? undefined}
                      onChange={(val) => field.onChange(val || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estimated_duration_hrs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Duration (Hrs) - Optional</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="e.g. 2.5"
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={assignMutation.isPending}>
                {assignMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm Assignment
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
