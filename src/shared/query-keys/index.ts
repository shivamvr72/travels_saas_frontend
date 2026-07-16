export const tripKeys = {
  all: ['trips'] as const,
  lists: () => [...tripKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...tripKeys.lists(), { filters }] as const,
  details: () => [...tripKeys.all, 'detail'] as const,
  detail: (id: string) => [...tripKeys.details(), id] as const,
};

export const vehicleKeys = {
  all: ['vehicles'] as const,
  lists: () => [...vehicleKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...vehicleKeys.lists(), { filters }] as const,
  details: () => [...vehicleKeys.all, 'detail'] as const,
  detail: (id: string) => [...vehicleKeys.details(), id] as const,
};

export const driverKeys = {
  all: ['drivers'] as const,
  lists: () => [...driverKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...driverKeys.lists(), { filters }] as const,
  details: () => [...driverKeys.all, 'detail'] as const,
  detail: (id: string) => [...driverKeys.details(), id] as const,
};

export const companyKeys = {
  all: ['companies'] as const,
  lists: () => [...companyKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...companyKeys.lists(), { filters }] as const,
  details: () => [...companyKeys.all, 'detail'] as const,
  detail: (id: string) => [...companyKeys.details(), id] as const,
};

export const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...customerKeys.lists(), { filters }] as const,
  details: () => [...customerKeys.all, 'detail'] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
};

export const reportKeys = {
  all: ['reports'] as const,
  executiveSummary: (f: any) => [...reportKeys.all, 'executive', f] as const,
  revenue: (g: string, f: any) => [...reportKeys.all, 'revenue', g, f] as const,
  expenses: (f: any) => [...reportKeys.all, 'expenses', f] as const,
  fleet: (f: any) => [...reportKeys.all, 'fleet', f] as const,
  drivers: (f: any) => [...reportKeys.all, 'drivers', f] as const,
  customers: (f: any) => [...reportKeys.all, 'customers', f] as const,
  routes: (f: any) => [...reportKeys.all, 'routes', f] as const,
  registers: (t: string, f: any) => [...reportKeys.all, 'registers', t, f] as const,
  pnl: (f: any) => [...reportKeys.all, 'pnl', f] as const,
  alerts: () => [...reportKeys.all, 'alerts'] as const,
};

export const expenseKeys = {
  all: ['expenses'] as const,
  lists: () => [...expenseKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...expenseKeys.lists(), { filters }] as const,
  details: () => [...expenseKeys.all, 'detail'] as const,
  detail: (id: string) => [...expenseKeys.details(), id] as const,
};

export const routeKeys = {
  all: ['routes'] as const,
  lists: () => [...routeKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...routeKeys.lists(), { filters }] as const,
  details: () => [...routeKeys.all, 'detail'] as const,
  detail: (id: string) => [...routeKeys.details(), id] as const,
};

export const myCompanyKeys = {
  all: ['my-company'] as const,
  detail: () => [...myCompanyKeys.all, 'detail'] as const,
};

export const dispatchKeys = {
  all: ['dispatch'] as const,
  board: (date: string) => [...dispatchKeys.all, 'board', { date }] as const,
  availableVehicles: () => [...dispatchKeys.all, 'vehicles', 'available'] as const,
  availableDrivers: () => [...dispatchKeys.all, 'drivers', 'available'] as const,
};
