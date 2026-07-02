import { Trip, TripStatus } from '../domain/trip-types';
import { canTransitionTo, getAvailableTransitions, getActionLabel, requiresConfirmation } from '../domain/trip-status';
import { validateTransition, RuleViolation } from '../domain/trip-rules';

/**
 * Trip Lifecycle Service
 * 
 * Encapsulates state machine logic independently of the React component tree.
 * Consumed by: use-trip-lifecycle.ts hook
 * 
 * This service acts as an orchestrator for the domain rules defined in trip-status.ts and trip-rules.ts.
 */
export const tripLifecycleService = {
  /**
   * Check if a transition between two states is structurally allowed by the state machine
   */
  canTransitionTo(current: TripStatus, target: TripStatus): boolean {
    return canTransitionTo(current, target);
  },

  /**
   * Get all structurally allowed target states from a given current state
   */
  getAvailableTransitions(current: TripStatus): TripStatus[] {
    return getAvailableTransitions(current);
  },

  /**
   * Get a human-readable action label for transitioning to the target state
   */
  getActionLabel(target: TripStatus): string {
    return getActionLabel(target);
  },

  /**
   * Check if a transition to the target state requires a confirmation dialog
   */
  requiresConfirmation(target: TripStatus): boolean {
    return requiresConfirmation(target);
  },

  /**
   * Validate whether a specific trip can execute a transition to the target state right now,
   * evaluating all business rules (e.g. resource assignment checks).
   * 
   * @returns Array of violations. If empty, transition is valid.
   */
  validateTransition(trip: Trip, target: TripStatus): RuleViolation[] {
    // 1. Check structural validity
    if (!this.canTransitionTo(trip.status, target)) {
      return [{
        code: 'INVALID_TRANSITION',
        message: `Cannot transition from ${trip.status} to ${target}.`,
        severity: 'error'
      }];
    }

    // 2. Evaluate business rules
    return validateTransition(trip, target);
  }
};
