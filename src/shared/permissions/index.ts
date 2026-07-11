export type Role = 'admin' | 'manager' | 'viewer';

export const PERMISSION_KEYS = {
  // Users
  USERS_VIEW: 'users:view',
  USERS_CREATE: 'users:create',
  USERS_EDIT: 'users:edit',
  USERS_DELETE: 'users:delete',
  USERS_LOCK: 'users:lock',
  USERS_RESET_PASSWORD: 'users:reset_password',
  
  // Roles
  ROLES_VIEW: 'roles:view',
  ROLES_MANAGE: 'roles:manage',
  
  // Settings
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_MANAGE: 'settings:manage',
  
  // Audit
  AUDIT_VIEW: 'audit:view',
  
  // Company Admin
  COMPANY_ADMIN: 'company:admin',
  
  // Trips
  TRIPS_VIEW: 'trips:view',
  TRIPS_CREATE: 'trips:create',
  TRIPS_EDIT: 'trips:edit',
  TRIPS_ASSIGN: 'trips:assign',
  TRIPS_DISPATCH: 'trips:dispatch',
  TRIPS_CANCEL: 'trips:cancel',
  TRIPS_CLOSE: 'trips:close',
  TRIPS_DELETE: 'trips:delete',
  
  // Master Data
  COMPANIES_VIEW: 'companies:view',
  COMPANIES_MANAGE: 'companies:manage',
  CUSTOMERS_VIEW: 'customers:view',
  CUSTOMERS_MANAGE: 'customers:manage',
  ROUTES_VIEW: 'routes:view',
  ROUTES_MANAGE: 'routes:manage',
  DRIVERS_VIEW: 'drivers:view',
  DRIVERS_MANAGE: 'drivers:manage',
  VEHICLES_VIEW: 'vehicles:view',
  VEHICLES_MANAGE: 'vehicles:manage',
  
  // Finance
  FINANCE_VIEW: 'finance:view',
  FINANCE_MANAGE: 'finance:manage',
  
  // Reports
  REPORTS_VIEW: 'reports:view',
  REPORTS_MANAGE: 'reports:manage',
} as const;

export type PermissionKey = typeof PERMISSION_KEYS[keyof typeof PERMISSION_KEYS];

export const ROLE_PERMISSION_MATRIX: Record<Role, string[]> = {
  admin: ['*'], // admin has all
  manager: [
    'trips:*', 
    'customers:*', 
    'companies:*',
    'routes:*',
    'drivers:*',
    'vehicles:*',
    'finance:view', 
    'reports:view'
  ],
  viewer: [
    'trips:view', 
    'customers:view',
    'companies:view',
    'routes:view',
    'drivers:view',
    'vehicles:view',
    'finance:view', 
    'reports:view'
  ],
};

// Legacy compatibility layer for existing code
export type AppModule = 'COMPANIES' | 'CUSTOMERS' | 'DRIVERS' | 'VEHICLES' | 'ROUTES' | 'TRIPS' | 'FINANCE' | 'SETTINGS' | 'TRIPS_CREATE' | 'TRIPS_EDIT' | 'TRIPS_ASSIGN' | 'TRIPS_DISPATCH' | 'TRIPS_CANCEL' | 'TRIPS_CLOSE' | 'TRIPS_DELETE' | 'REPORTS' | 'USERS' | 'ROLES' | 'AUDIT';

// We import the permission service lazily to avoid circular dependencies if needed, 
// but since the service uses these constants, we provide the legacy wrappers here.
export const hasPermission = (userRole: Role, allowedRoles: readonly Role[]): boolean => {
  return allowedRoles.includes(userRole);
};

// Legacy functions mapped to new roles
export const canView = (module: AppModule, role: Role): boolean => {
  if (role === 'admin') return true;
  if (module === 'SETTINGS' || module === 'USERS' || module === 'ROLES' || module === 'AUDIT') return false;
  return true; // manager and viewer can view operational modules
};

export const canCreate = (module: AppModule, role: Role): boolean => {
  if (role === 'admin') return true;
  if (role === 'viewer') return false;
  if (module === 'SETTINGS' || module === 'USERS' || module === 'ROLES' || module === 'AUDIT' || module === 'FINANCE') return false;
  return true;
};

export const canUpdate = (module: AppModule, role: Role): boolean => {
  return canCreate(module, role);
};

export const canDelete = (module: AppModule, role: Role): boolean => {
  return role === 'admin';
};
