import { useMemo } from 'react';
import { Trip, TripStatus } from '../domain/trip-types';
import { tripLifecycleService } from '../services/trip-lifecycle.service';
import { useDispatchTrip, useStartTrip, useCompleteTrip, useCancelTrip, tripQueryKeys } from '../api';
import { getActionDef } from '../domain/trip-actions';
import { toast } from 'sonner';
import { isTerminalState } from '../domain/trip-status';
import { useQueryClient } from '@tanstack/react-query';
import { tripApi } from '../api/trip-api';

export function useTripLifecycle(trip: Trip | undefined | null) {
  const dispatchMutation = useDispatchTrip();
  const startMutation = useStartTrip();
  const completeMutation = useCompleteTrip();
  const cancelMutation = useCancelTrip();
  const queryClient = useQueryClient();

  // ─── Computations ────────────────────────────────────────────────────────
  
  const canTransitionTo = useMemo(() => {
    if (!trip) return () => false;
    return (target: TripStatus) => tripLifecycleService.canTransitionTo(trip.status, target);
  }, [trip]);

  const availableTransitions = useMemo(() => {
    if (!trip) return [];
    return tripLifecycleService.getAvailableTransitions(trip.status);
  }, [trip]);

  const availableActions = useMemo(() => {
    return availableTransitions.map(target => getActionDef(target, trip?.status));
  }, [availableTransitions, trip?.status]);

  const isTerminal = useMemo(() => {
    if (!trip) return false;
    return isTerminalState(trip.status);
  }, [trip]);

  // ─── Execution ────────────────────────────────────────────────────────────
  
  const isPending =
    dispatchMutation.isPending ||
    startMutation.isPending ||
    completeMutation.isPending ||
    cancelMutation.isPending;

  const execute = async (
    target: TripStatus,
    payload?: { reason?: string; notes?: string; actual_start_time?: string; actual_end_time?: string; total_km?: number; reporting_address?: string }
  ) => {
    if (!trip) {
      toast.error('Trip data is missing.');
      return;
    }

    // Always fetch the latest trip data from server before executing to
    // avoid stale-status race conditions (e.g. navigating from list with cached data)
    let currentTrip = trip;
    try {
      const freshTrip = await tripApi.get(trip.id);
      if (freshTrip) {
        currentTrip = freshTrip;
        // Update the cache so the UI reflects the real status
        queryClient.setQueryData(tripQueryKeys.detail(trip.id), freshTrip);
      }
    } catch (_) {
      // If refresh fails, proceed with the prop we have — backend will still validate
    }

    // Run business rule validations before firing API call
    const violations = tripLifecycleService.validateTransition(currentTrip, target);
    if (violations.length > 0) {
      // Display the most critical violation
      const error = violations.find(v => v.severity === 'error') || violations[0];
      toast.error(error.message);
      return; // Block execution
    }

    try {
      switch (target) {
        case 'dispatched':
          await dispatchMutation.mutateAsync({
            id: currentTrip.id,
            payload: { confirmation_notes: payload?.notes ?? null },
          });
          toast.success('Trip dispatched successfully.');
          break;
        case 'started':
          await startMutation.mutateAsync({
            id: currentTrip.id,
            payload: {
              actual_start_time: payload?.actual_start_time ?? null,
              reporting_address: payload?.reporting_address ?? null,
            },
          });
          toast.success('Trip started successfully.');
          break;
        case 'completed':
          await completeMutation.mutateAsync({
            id: currentTrip.id,
            payload: {
              actual_end_time: payload?.actual_end_time ?? null,
              total_km: payload?.total_km ?? null,
            },
          });
          toast.success('Trip completed successfully.');
          break;
        case 'cancelled':
          await cancelMutation.mutateAsync({
            id: currentTrip.id,
            payload: { cancellation_reason: payload?.reason ?? '' },
          });
          toast.success('Trip cancelled.');
          break;
        default:
          toast.error(`Action for status "${target}" is not supported.`);
      }
    } catch (error: any) {
      let errorMessage = 'An error occurred during transition.';
      
      const apiMessage = error?.response?.data?.message || error?.response?.data?.detail;
      
      if (typeof apiMessage === 'string') {
        errorMessage = apiMessage;
      } else if (Array.isArray(apiMessage)) {
        errorMessage = apiMessage.map((d: any) => d.msg).join(', ');
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast.error(`Action failed: ${errorMessage}`);
    }
  };

  return {
    canTransitionTo,
    availableTransitions,
    availableActions,
    isTerminal,
    execute,
    isPending,
  };
}
