import { TripStatus } from './trip-types';

export const VALID_TRANSITIONS: Record<TripStatus, TripStatus[]> = {
  draft:      ['assigned', 'cancelled'],
  assigned:   ['dispatched', 'draft', 'cancelled'],
  dispatched: ['started', 'cancelled'],
  started:    ['completed', 'cancelled'],
  completed:  [],
  cancelled:  [],
};

export function canTransitionTo(current: TripStatus, target: TripStatus): boolean {
  return VALID_TRANSITIONS[current]?.includes(target) ?? false;
}

export function getAvailableTransitions(current: TripStatus): TripStatus[] {
  return VALID_TRANSITIONS[current] ?? [];
}

// Returns human-readable action labels per transition target
export function getActionLabel(target: TripStatus): string {
  const labels: Partial<Record<TripStatus, string>> = {
    assigned:   'Assign Trip',
    draft:      'Unassign Trip',
    dispatched: 'Dispatch Trip',
    started:    'Start Trip',
    completed:  'Complete Trip',
    cancelled:  'Cancel Trip',
  };
  return labels[target] || target;
}

// Whether a transition requires a confirmation dialog
export function requiresConfirmation(target: TripStatus): boolean {
  return ['cancelled', 'completed', 'dispatched', 'started'].includes(target);
}

// Check if a state is a terminal state
export function isTerminalState(status: TripStatus): boolean {
  return ['completed', 'cancelled'].includes(status);
}
