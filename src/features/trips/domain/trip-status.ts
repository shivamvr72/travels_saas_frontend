import { TripStatus } from './trip-types';

export const VALID_TRANSITIONS: Record<TripStatus, TripStatus[]> = {
  pending:     ['in_progress', 'cancelled'],
  in_progress: ['completed', 'cancelled'],
  completed:   ['billed', 'cancelled'],
  billed:      ['paid'],
  paid:        ['billed'],
  cancelled:   [],
};

export function canTransitionTo(current: TripStatus, target: TripStatus): boolean {
  return VALID_TRANSITIONS[current].includes(target);
}

export function getAvailableTransitions(current: TripStatus): TripStatus[] {
  return VALID_TRANSITIONS[current] ?? [];
}

// Returns human-readable action labels per transition target
export function getActionLabel(target: TripStatus): string {
  const labels: Record<TripStatus, string> = {
    pending:     'Revert to Pending',
    in_progress: 'Dispatch Trip',
    completed:   'Complete Trip',
    billed:      'Mark as Billed',
    paid:        'Mark as Paid',
    cancelled:   'Cancel Trip',
  };
  return labels[target];
}

// Whether a transition requires a confirmation dialog
export function requiresConfirmation(target: TripStatus): boolean {
  return ['cancelled', 'completed', 'billed', 'paid'].includes(target);
}

// Check if a state is a terminal state
export function isTerminalState(status: TripStatus): boolean {
  return ['paid', 'cancelled'].includes(status);
}
