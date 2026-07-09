import { useMemo } from 'react';
import { Trip, TripStatus } from '../domain/trip-types';
import { tripLifecycleService } from '../services/trip-lifecycle.service';
import { useTripTransition, tripQueryKeys } from '../api';
import { getActionDef } from '../domain/trip-actions';
import { toast } from 'sonner';
import { isTerminalState } from '../domain/trip-status';
import { useQueryClient } from '@tanstack/react-query';
import { tripApi } from '../api/trip-api';

export function useTripLifecycle(trip: Trip | undefined | null) {
  const transition = useTripTransition();
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
  
  const execute = async (target: TripStatus, payload?: { reason?: string; notes?: string }) => {
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
      await transition.mutateAsync({ id: currentTrip.id, action: target, payload });
      toast.success(`Trip status updated to ${tripLifecycleService.getActionLabel(target)}`);
    } catch (error: any) {
      // Handle known API error formats
      const errorDetail = error.response?.data?.detail || error.message || 'An error occurred during transition.';
      toast.error(`Transition failed: ${errorDetail}`);
      throw error; // Re-throw if component needs to handle (e.g. keeping dialog open)
    }
  };

  return {
    canTransitionTo,
    availableTransitions,
    availableActions,
    isTerminal,
    execute,
    isPending: transition.isPending,
  };
}
