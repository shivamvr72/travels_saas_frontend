export interface ExecutiveSummaryResponse {
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

export interface RevenueByPeriodResponse {
  period_label: string;
  revenue: number;
  expenses: number;
  profit: number;
  trip_count: number;
  avg_per_trip: number;
}

export interface ExpenseBreakdownResponse {
  expense_type: string;
  total: number;
  count: number;
  pct_of_total: number;
}

export interface TopEntityResponse {
  entity_id: string;
  entity_name: string;
  total_revenue: number;
  total_trips: number;
  net_profit: number;
  margin_pct: number | null;
}
