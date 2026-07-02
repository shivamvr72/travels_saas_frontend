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
    case 'planned':
      // Basic check, usually no strict rules for draft -> planned
      break;

    case 'assigned':
      // To be assigned, must have at least one resource assigned
      if (!trip.vehicle_id && !trip.driver_id) {
        violations.push({
          code: 'MISSING_RESOURCES',
          message: 'At least a vehicle or a driver must be assigned.',
          severity: 'error',
        });
      }
      break;

    case 'dispatched':
      // To dispatch, must have both vehicle and driver
      if (!trip.vehicle_id || !trip.driver_id) {
        violations.push({
          code: 'INCOMPLETE_ASSIGNMENT',
          message: 'Vehicle and Driver are required before dispatching.',
          severity: 'error',
        });
      }
      break;

    case 'in_progress':
      // Usually transition happens when actual trip starts
      if (trip.status !== 'dispatched') {
        violations.push({
          code: 'NOT_DISPATCHED',
          message: 'Trip must be dispatched before it can be started.',
          severity: 'error',
        });
      }
      break;

    case 'completed':
      // No strict resource rules here, handled mostly by UI logic (e.g. entering end date)
      break;
      
    case 'closed':
      // Final lock check
      if (trip.status !== 'completed') {
        violations.push({
          code: 'NOT_COMPLETED',
          message: 'Trip must be completed before closing.',
          severity: 'error',
        });
      }
      break;
  }

  return violations;
}
