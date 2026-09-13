export type PeriodPreset = 'today' | 'yesterday' | 'this_week' | 'last_week' | 'this_month' | 'last_month' | 'last_quarter' | 'ytd' | 'custom';

export interface ReportDateFilter {
  start_date?: string;
  end_date?: string;
  period?: PeriodPreset;
}

export interface ExecutiveSummary {
  today_revenue: number;
  monthly_revenue: number;
  outstanding_receivables: number;
  active_trips: number;
  completed_trips: number;
  total_trips_period: number;
  fleet_utilization_pct: number;
  vehicles_running: number;
  vehicles_idle: number;
  collection_rate_pct: number;
  net_profit: number;
  monthly_expenses: number;
  avg_trip_value: number;
}

export interface RevenueByPeriod {
  period_label: string;
  revenue: number;
  expenses: number;
  profit: number;
  trip_count: number;
  avg_per_trip: number;
}

export interface ExpenseBreakdown {
  expense_type: string;
  total: number;
  count: number;
  pct_of_total: number;
}

export interface TopEntity {
  entity_id: string;
  entity_name: string;
  total_revenue: number;
  total_trips: number;
  net_profit: number;
  margin_pct?: number;
}

export interface DriverAnalytics {
  driver_id: string;
  driver_name: string;
  trips_completed: number;
  revenue_generated: number;
  avg_trip_duration_hours?: number;
  current_assignment?: string;
  ranking: number;
}

export interface DriverSummaryKpis {
  total_drivers: number;
  active_drivers: number;
  total_trips: number;
  total_revenue: number;
  avg_trips_per_driver: number;
  avg_revenue_per_driver: number;
  top_driver_name?: string;
  top_driver_revenue?: number;
}

export interface DriverPerformanceTrend {
  period_label: string;
  trips: number;
  revenue: number;
  avg_duration_hours: number;
  active_drivers: number;
}

export interface FleetSummary {
  vehicle_id: string;
  reg_number: string;
  vehicle_name?: string;
  trips: number;
  revenue: number;
  expenses: number;
  profit: number;
  utilization_pct: number;
  status: string;
}

export interface AlertItem {
  type: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  entity_id?: string;
  entity_name?: string;
}

export interface ExpenseTrend {
  period_label: string;
  total_expenses: number;
  fuel: number;
  maintenance: number;
  toll: number;
  driver_allowance: number;
  other: number;
  trip_count: number;
}

export interface VehicleExpenseRow {
  vehicle_id: string;
  reg_number: string;
  vehicle_name?: string;
  total_expenses: number;
  fuel: number;
  maintenance: number;
  toll: number;
  driver_allowance: number;
  other: number;
  trips: number;
  cost_per_trip: number;
  pct_of_total: number;
}

export interface DriverExpenseRow {
  driver_id: string;
  driver_name: string;
  total_expenses: number;
  allowances: number;
  trips: number;
  cost_per_trip: number;
}

export interface ExpenseSummaryKpis {
  total_expenses_period: number;
  avg_expense_per_trip: number;
  highest_category: string;
  highest_category_amount: number;
  expense_to_revenue_ratio: number;
  mom_change_pct: number | null;
}

export interface ProfitabilitySummaryKpis {
  gross_revenue: number;
  total_expenses: number;
  net_profit: number;
  profit_margin_pct: number;
  avg_profit_per_trip: number;
  mom_change_pct: number | null;
}

export interface ProfitTrend {
  period_label: string;
  revenue: number;
  expenses: number;
  profit: number;
  trip_count: number;
  margin_pct: number;
}

export interface VehicleProfitRow {
  vehicle_id: string;
  reg_number: string;
  vehicle_name?: string;
  revenue: number;
  expenses: number;
  profit: number;
  margin_pct: number;
  trips: number;
  profit_per_trip: number;
}

export interface DriverProfitRow {
  driver_id: string;
  driver_name: string;
  revenue: number;
  expenses: number;
  profit: number;
  margin_pct: number;
  trips: number;
}

export interface CustomerProfitRow {
  customer_id: string;
  customer_name: string;
  revenue: number;
  expenses: number;
  profit: number;
  margin_pct: number;
  trips: number;
}

export interface RouteProfitRow {
  route_id: string;
  route_name: string;
  revenue: number;
  expenses: number;
  profit: number;
  margin_pct: number;
  trips: number;
}

export interface FleetSummaryKpis {
  total_vehicles: number;
  active_vehicles: number;
  idle_vehicles: number;
  fleet_utilization_pct: number;
  avg_trips_per_vehicle: number;
  avg_revenue_per_vehicle: number;
  top_performing_vehicle?: string;
  most_idle_vehicle?: string;
}

export interface FleetUtilizationTrend {
  period_label: string;
  utilization_pct: number;
  vehicles_running: number;
  vehicles_idle: number;
  trips: number;
}
