/**
 * @file lookup-registry.ts
 * @description Centralized registry for all entity lookups in the application.
 * Future modules must consume this registry rather than hardcoding endpoints or query keys.
 */

import { AppModule } from '@/shared/permissions';

export interface LookupConfig {
  /** The API endpoint to fetch data from */
  endpoint: string;
  /** The field to display in the dropdown (e.g., 'name', 'license_plate') */
  displayField: string;
  /** The field to use as the value (defaults to 'id') */
  valueField?: string;
  /** Which fields to search by when typing */
  searchFields: string[];
  /** Default sorting field */
  defaultSortBy?: string;
  /** Default sorting direction */
  defaultSortDir?: 'asc' | 'desc';
  /** How long to cache this lookup (ms) */
  staleTime?: number;
  /** Required permissions to access this lookup */
  permissions?: AppModule[];
}

export const LookupRegistry: Record<string, LookupConfig> = {
  companies: {
    endpoint: '/api/v1/companies',
    displayField: 'name',
    searchFields: ['name', 'email', 'phone'],
    defaultSortBy: 'name',
    staleTime: 5 * 60 * 1000, // 5 minutes
    permissions: ['COMPANIES'],
  },
  customers: {
    endpoint: '/api/v1/customers',
    displayField: 'name',
    searchFields: ['name', 'email', 'phone'],
    defaultSortBy: 'name',
    staleTime: 5 * 60 * 1000,
    permissions: ['CUSTOMERS'],
  },
  vehicles: {
    endpoint: '/api/v1/vehicles',
    displayField: 'license_plate',
    searchFields: ['license_plate', 'make', 'model'],
    defaultSortBy: 'license_plate',
    staleTime: 5 * 60 * 1000,
    permissions: ['VEHICLES'],
  },
  drivers: {
    endpoint: '/api/v1/drivers',
    displayField: 'name',
    searchFields: ['name', 'license_no', 'phone'],
    defaultSortBy: 'name',
    staleTime: 5 * 60 * 1000,
    permissions: ['DRIVERS'],
  },
  routes: {
    endpoint: '/api/v1/routes',
    displayField: 'from_location', // Temporarily using from_location, ideally we'd compute "Origin to Destination"
    searchFields: ['from_location', 'to_location'],
    defaultSortBy: 'from_location',
    staleTime: 5 * 60 * 1000,
    permissions: ['ROUTES'],
  }
};
