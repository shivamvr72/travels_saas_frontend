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
    case 'dispatched':
      // To dispatch, must have both vehicle (internal or external) and driver assigned
      const hasVehicle = Boolean(trip.vehicle_id || trip.external_hiring_id || trip.vehicle || trip.external_hiring);
      const hasDriver = Boolean(trip.driver_id || trip.driver);
      if (!hasVehicle || !hasDriver) {
        violations.push({
          code: 'INCOMPLETE_ASSIGNMENT',
          message: 'Vehicle and Driver are required before dispatching.',
          severity: 'error',
        });
      }
      break;

    case 'started':
    case 'completed':
    case 'cancelled':
      // No strict resource rules — handled by UI and Backend
      break;
  }

  return violations;
}
