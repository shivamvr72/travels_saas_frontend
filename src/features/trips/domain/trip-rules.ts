import { Trip, TripStatus } from './trip-types';

export interface RuleViolation {
  code: string;
  message: string;
  severity: 'error' | 'warning';
}

/**
 * Validates whether a trip can transition to a target state based on its current data.
 * @returns Array of violations. If empty, the transition is valid.
 */
export function validateTransition(trip: Trip, targetStatus: TripStatus): RuleViolation[] {
  const violations: RuleViolation[] = [];

  switch (targetStatus) {
    case 'in_progress':
      // To dispatch, must have both vehicle and driver assigned
      if (!trip.vehicle_id || !trip.driver_id) {
        violations.push({
          code: 'INCOMPLETE_ASSIGNMENT',
          message: 'Vehicle and Driver are required before dispatching.',
          severity: 'error',
        });
      }
      break;

    case 'completed':
      // No strict resource rules — handled by UI
      break;

    case 'billed':
      // Trip must be completed first (or reverting from paid)
      if (trip.status !== 'completed' && trip.status !== 'paid') {
        violations.push({
          code: 'NOT_COMPLETED',
          message: 'Trip must be completed before marking as billed.',
          severity: 'error',
        });
      }
      break;

    case 'paid':
      // Trip must be billed first
      if (trip.status !== 'billed') {
        violations.push({
          code: 'NOT_BILLED',
          message: 'Trip must be billed before marking as paid.',
          severity: 'error',
        });
      }
      break;
  }

  return violations;
}
