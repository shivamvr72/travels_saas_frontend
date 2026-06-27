export type Role = 'admin' | 'manager' | 'viewer';

/**
 * Define which roles can access which modules globally.
 */
export const PERMISSIONS = {
  // Master Data
  COMPANIES_VIEW: ['admin', 'manager', 'viewer'],
  COMPANIES_MANAGE: ['admin', 'manager'],
  
  CUSTOMERS_VIEW: ['admin', 'manager', 'viewer'],
  CUSTOMERS_MANAGE: ['admin', 'manager'],
  
  ROUTES_VIEW: ['admin', 'manager', 'viewer'],
  ROUTES_MANAGE: ['admin', 'manager'],
  
  DRIVERS_VIEW: ['admin', 'manager', 'viewer'],
  DRIVERS_MANAGE: ['admin', 'manager'],
  
  VEHICLES_VIEW: ['admin', 'manager', 'viewer'],
  VEHICLES_MANAGE: ['admin', 'manager'],
  
  // Operations
  TRIPS_VIEW: ['admin', 'manager', 'viewer'],
  TRIPS_MANAGE: ['admin', 'manager'],
  
  // Finance
  FINANCE_VIEW: ['admin', 'manager'],
  FINANCE_MANAGE: ['admin'],
  
  // Settings
  SETTINGS_MANAGE: ['admin'],
} as const;

export const hasPermission = (userRole: Role, allowedRoles: readonly Role[]): boolean => {
  return allowedRoles.includes(userRole);
};

// Generic module-based permission helpers
export type AppModule = 'COMPANIES' | 'CUSTOMERS' | 'DRIVERS' | 'VEHICLES' | 'ROUTES' | 'TRIPS' | 'FINANCE' | 'SETTINGS';

export const canView = (module: AppModule, role: Role): boolean => {
  const permissionKey = `${module}_VIEW` as keyof typeof PERMISSIONS;
  if (permissionKey in PERMISSIONS) {
    return hasPermission(role, PERMISSIONS[permissionKey]);
  }
  // If no explicit VIEW permission, check MANAGE
  const manageKey = `${module}_MANAGE` as keyof typeof PERMISSIONS;
  if (manageKey in PERMISSIONS) {
    return hasPermission(role, PERMISSIONS[manageKey]);
  }
  return false;
};

export const canCreate = (module: AppModule, role: Role): boolean => {
  const permissionKey = `${module}_MANAGE` as keyof typeof PERMISSIONS;
  return permissionKey in PERMISSIONS ? hasPermission(role, PERMISSIONS[permissionKey]) : false;
};

export const canUpdate = (module: AppModule, role: Role): boolean => {
  const permissionKey = `${module}_MANAGE` as keyof typeof PERMISSIONS;
  return permissionKey in PERMISSIONS ? hasPermission(role, PERMISSIONS[permissionKey]) : false;
};

// Restrict destructive actions to admin only by default unless explicitly configured otherwise
export const canDelete = (module: AppModule, role: Role): boolean => {
  return role === 'admin';
};
