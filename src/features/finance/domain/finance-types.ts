import { ExpenseCategory, InvoiceStatus, PaymentMode, PaymentStatus } from './finance-constants';
import { TripStatus } from '@/features/trips/domain/trip-types';

export interface TripExpense {
  id: string;
  trip_id: string;
  amount: number;
  category: ExpenseCategory;
  payment_mode: PaymentMode;
  paid_by?: string;
  expense_date: string; // ISO string
  remarks?: string;
  receipt_url?: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  trip_id: string;
  status: InvoiceStatus;
  rate_type?: string;
  
  // Amounts
  base_rate: number;
  included_km: number;
  included_hrs: number;
  
  extra_km: number;
  extra_km_rate: number;
  extra_km_amount: number;
  
  extra_hrs: number;
  extra_hr_rate: number;
  extra_hr_amount: number;
  
  night_charge: number;
  driver_meal: number;
  toll_tax: number;
  parking_charge: number;
  other_charges: number;
  
  subtotal: number;
  gst_percent: number;
  gst_amount: number;
  total_amount: number;
  
  invoice_date?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentTransaction {
  id: string;
  amount: number;
  payment_date: string;
  payment_mode: PaymentMode;
  reference_no?: string;
}

export interface TripPaymentDetails {
  id: string;
  trip_id: string;
  advance_payment: number;
  total_payment: number;
  other_payment: number; // Aggregate sum for backward compatibility
  transactions: PaymentTransaction[];
  balance_due: number;
  is_settled: boolean;
  status: PaymentStatus;
  created_at: string;
  updated_at: string;
}

export interface ProfitabilitySummary {
  gross_revenue: number;
  total_expenses: number;
  net_profit: number;
  profit_margin_percent: number;
}
