/**
 * Trip Number Service — FRONTEND DISPLAY ONLY
 * 
 * Trip numbers are ALWAYS assigned by the backend.
 * This service provides display helpers and placeholder generation
 * strictly for frontend development and demonstration purposes.
 * 
 * ⚠️ NEVER use generatePlaceholder() in production flows.
 *    Production trip_number always comes from the API response.
 */
export const tripNumberService = {
  /**
   * Format a trip number for display.
   * Can be extended later if specific formatting rules are required (e.g. inserting dashes).
   */
  format(tripNumber: string | undefined | null): string {
    if (!tripNumber) return 'TRP-PENDING';
    return tripNumber.toUpperCase();
  },

  /**
   * Generates a placeholder trip number for optimistic UI updates during development.
   */
  generatePlaceholder(): string {
    return `TRP-DEMO-${Math.floor(Math.random() * 9000 + 1000)}`;
  },

  /**
   * Checks if a trip number is a placeholder.
   */
  isPlaceholder(tripNumber: string | undefined | null): boolean {
    if (!tripNumber) return true;
    return tripNumber.startsWith('TRP-DEMO-');
  },
};
