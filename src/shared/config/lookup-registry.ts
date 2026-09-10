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
  /** Optional function to custom format the display string */
  formatDisplay?: (item: any) => string;
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
    displayField: 'reg_number',
    formatDisplay: (item: any) => `${item.reg_number} • ${item.brand_name || ''} ${item.model_type || ''}`.trim(),
    searchFields: ['reg_number', 'brand_name', 'model_type'],
    defaultSortBy: 'reg_number',
    staleTime: 5 * 60 * 1000,
    permissions: ['VEHICLES'],
  },
  drivers: {
    endpoint: '/api/v1/drivers?is_external=false',
    displayField: 'name',
    searchFields: ['name', 'license_no', 'phone'],
    defaultSortBy: 'name',
    staleTime: 5 * 60 * 1000,
    permissions: ['DRIVERS'],
  },
  routes: {
    endpoint: '/api/v1/routes?active_only=true',
    displayField: 'from_location', 
    formatDisplay: (item: any) => `${item.from_location} → ${item.to_location}`,
    searchFields: ['from_location', 'to_location'],
    defaultSortBy: 'from_location',
    staleTime: 5 * 60 * 1000,
    permissions: ['ROUTES'],
  },
  dispatchers: {
    endpoint: '/api/v1/users?role=dispatcher', // Mock endpoint logic
    displayField: 'full_name',
    searchFields: ['full_name', 'email'],
    defaultSortBy: 'full_name',
    staleTime: 5 * 60 * 1000,
    permissions: [], // Open or specific permission
  },
  'dispatch-available-vehicles': {
    endpoint: '/api/v1/dispatch/vehicles/available',
    displayField: 'reg_number',
    formatDisplay: (item: any) => `${item.reg_number} • ${item.vehicle_name || ''} ${item.vehicle_type || ''}`.trim(),
    searchFields: ['reg_number', 'vehicle_name', 'vehicle_type'],
    defaultSortBy: 'reg_number',
    staleTime: 5 * 60 * 1000,
    permissions: ['TRIPS'], // We map to TRIPS for dispatch for now or add a new permission if needed
  },
  'dispatch-available-drivers': {
    endpoint: '/api/v1/dispatch/drivers/available',
    displayField: 'name',
    searchFields: ['name', 'phone'],
    defaultSortBy: 'name',
    staleTime: 5 * 60 * 1000,
    permissions: ['TRIPS'],
  },
  'dispatch-external-hirings': {
    endpoint: '/api/v1/external-hirings?status=active',
    displayField: 'provider_name',
    formatDisplay: (item: any) => {
      const provider = item.provider_name || 'Internal Agency';
      const vehicle = item.external_vehicle_reg || 'Internal Vehicle';
      return `${provider} - ${vehicle}`;
    },
    searchFields: ['provider_name', 'external_vehicle_reg'],
    defaultSortBy: 'created_at',
    defaultSortDir: 'desc',
    staleTime: 5 * 60 * 1000,
    permissions: ['FINANCE'],
  }
};
