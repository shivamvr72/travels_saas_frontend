export interface TripBillingRequest {
  rate_type: string;
  base_rate?: string | null;
  included_km?: number;
  included_hrs?: number;
  
  extra_km?: number | null;
  extra_km_rate?: string | null;
  extra_hrs?: string | null;
  extra_hr_rate?: string | null;
  
  night_charge?: string;
  driver_meal?: string;
  toll_tax?: string;
  parking_charge?: string;
  other_charges?: string;
  
  gst_percent?: string;
}

export interface TripBillingResponse {
  id: string;
  trip_id: string;
  rate_type: string;
  base_rate?: string | null;
  included_km: number;
  included_hrs: number;
  
  extra_km?: number | null;
  extra_km_rate?: string | null;
  extra_hrs?: string | null;
  extra_hr_rate?: string | null;
  
  night_charge: string;
  driver_meal: string;
  toll_tax: string;
  parking_charge: string;
  other_charges: string;
  
  gst_percent: string;

  extra_km_amount?: string | null;
  extra_hr_amount?: string | null;
  subtotal?: string | null;
  gst_amount: string;
  total_amount: string;
}

export interface TripExpenseResponse {
  id: string;
  trip_id: string;
  vehicle_id: string;
  expense_date: string;
  expense_type: string;
  amount: string;
  payment_mode?: string | null;
  notes?: string | null;
  receipt_url?: string | null;
}

export interface TripPaymentTransactionRequest {
  amount: string;
  payment_date: string;
  payment_mode?: string | null;
  reference_no?: string | null;
}

export interface TripPaymentTransactionResponse {
  id: string;
  trip_id: string;
  amount: string;
  payment_date: string;
  payment_mode?: string | null;
  reference_no?: string | null;
}

export interface TripPaymentSummaryResponse {
  id: string;
  trip_id: string;
  advance_payment: string;
  total_payment: string;
  other_payment: string;
  balance_due: string;
  is_settled: boolean;
}

export interface SettlementSummaryResponse {
  trip_id: string;
  status: string;
  billing?: TripBillingResponse | null;
  expenses: TripExpenseResponse[];
  payment_summary?: TripPaymentSummaryResponse | null;
  transactions: TripPaymentTransactionResponse[];
  payment_status: string;
}
