import { useMemo } from 'react';
import { Trip, TripStatus } from '../domain/trip-types';
import { tripLifecycleService } from '../services/trip-lifecycle.service';
import { useTripTransition } from '../api';
import { getActionDef, TripActionDef } from '../domain/trip-actions';
import { toast } from 'sonner';
import { isTerminalState } from '../domain/trip-status';

export function useTripLifecycle(trip: Trip | undefined | null) {
  const transition = useTripTransition();

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

    // Run business rule validations before firing API call
    const violations = tripLifecycleService.validateTransition(trip, target);
    if (violations.length > 0) {
      // Display the most critical violation
      const error = violations.find(v => v.severity === 'error') || violations[0];
      toast.error(error.message);
      return; // Block execution
    }

    try {
      await transition.mutateAsync({ id: trip.id, action: target, payload });
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
