/**
 * @file validators.ts
 * @description Centralized Zod validation library for enterprise SaaS schemas.
 */

import * as z from 'zod';

export const validators = {
  /** Standard non-empty string */
  requiredString: (message = 'This field is required') => 
    z.string().min(1, message),

  /** Phone number (10 digits) */
  phone: (message = 'Invalid phone number') => 
    z.string().regex(/^\d{10}$/, message).optional().or(z.literal('')),

  /** GSTIN format (15 characters) */
  gstin: (message = 'Invalid GSTIN format') => 
    z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, message).optional().or(z.literal('')),

  /** PAN format (10 characters) */
  pan: (message = 'Invalid PAN format') => 
    z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, message).optional().or(z.literal('')),

  /** Vehicle Registration Number (e.g. MH01AB1234) */
  vehicleReg: (message = 'Invalid Vehicle Registration format') => 
    z.string().regex(/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/i, message),

  /** Pincode (6 digits) */
  pincode: (message = 'Invalid Pincode') => 
    z.string().regex(/^\d{6}$/, message).optional().or(z.literal('')),
    
  /** Positive Number */
  positiveNumber: (message = 'Must be a positive number') =>
    z.number().min(0, message),
    
  /** Percentage (0 to 100) */
  percentage: (message = 'Percentage must be between 0 and 100') =>
    z.number().min(0, message).max(100, message),
};
