/**
 * Feature Initialization
 * 
 * This file explicitly imports all feature configuration files to ensure they are
 * registered in the FeatureRegistry during application startup.
 * 
 * IMPORTANT: Do NOT import this file inside feature-registry.ts to avoid circular dependencies.
 * Import this file in the root layout or application entry point instead.
 */

import '@/features/company/config';
import '@/features/customers/config';
import '@/features/drivers/config';
import '@/features/vehicles/config';
import '@/features/routes/config';
import '@/features/external-hiring/config';
