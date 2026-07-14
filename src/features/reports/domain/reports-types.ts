export type PeriodPreset = 'today' | 'yesterday' | 'this_week' | 'last_week' | 'this_month' | 'last_month' | 'custom';

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
