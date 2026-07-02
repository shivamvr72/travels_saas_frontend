import { TripStatus } from './trip-types';

export const VALID_TRANSITIONS: Record<TripStatus, TripStatus[]> = {
  draft:       ['planned', 'cancelled'],
  planned:     ['assigned', 'cancelled'],
  assigned:    ['dispatched', 'planned', 'cancelled'],
  dispatched:  ['in_progress', 'assigned', 'cancelled'],
  in_progress: ['completed', 'cancelled'],
  completed:   ['closed'],
  closed:      [],
  cancelled:   [],
};

export function canTransitionTo(current: TripStatus, target: TripStatus): boolean {
  return VALID_TRANSITIONS[current].includes(target);
}

export function getAvailableTransitions(current: TripStatus): TripStatus[] {
  return VALID_TRANSITIONS[current];
}

// Returns human-readable action labels per transition target
export function getActionLabel(target: TripStatus): string {
  const labels: Record<TripStatus, string> = {
    draft: 'Revert to Draft',
    planned: 'Plan Trip',
    assigned: 'Assign',
    dispatched: 'Dispatch',
    in_progress: 'Start Trip',
    completed: 'Complete Trip',
    closed: 'Close',
    cancelled: 'Cancel',
  };
  return labels[target];
}

// Whether a transition requires a confirmation dialog
export function requiresConfirmation(target: TripStatus): boolean {
  return ['cancelled', 'closed', 'completed'].includes(target);
}

// Check if a state is a terminal state
export function isTerminalState(status: TripStatus): boolean {
  return ['closed', 'cancelled'].includes(status);
}
