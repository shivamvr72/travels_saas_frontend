/**
 * Trip Types (Domain Layer)
 * 
 * TEMPORARY compatibility types for frontend-only development.
 * When backend OpenAPI schema exposes TripResponse, TripCreate, etc.,
 * replace these with: import { components } from '@/shared/types/api'
 */

// ─── Enumerations ────────────────────────────────────────────────────────────

export type TripStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'billed'
  | 'paid'
  | 'cancelled';

export type TripType =
  | 'One Way'
  | 'Round Trip'
  | 'Multi-Stop'
  | 'Local'
  | 'Outstation';

export type TripPriority = 'Low' | 'Normal' | 'High' | 'Urgent';

export type TripDocumentCategory =
  | 'permit'
  | 'invoice'
  | 'lr_consignment'
  | 'proof_of_delivery'
  | 'driver_document'
  | 'vehicle_document'
  | 'image'
  | 'other';

// ─── Embedded Relations (read-only, from API responses) ──────────────────────

export interface TripVehicleSummary {
  id: string;
  license_plate: string;
  make: string;
  model: string;
  type?: string;
}

export interface TripDriverSummary {
  id: string;
  name: string;
  phone: string;
  license_no?: string;
}

export interface TripCompanySummary {
  id: string;
  name: string;
}

export interface TripCustomerSummary {
  id: string;
  name: string;
  phone?: string;
}

export interface TripRouteSummary {
  id: string;
  from_location: string;
  to_location: string;
  distance_km?: number;
  estimated_duration_mins?: number;
}

// ─── Main Trip Entity ─────────────────────────────────────────────────────────

export interface Trip {
  id: string;
  /**
   * Always assigned by the backend.
   * Frontend displays 'TRP-DEMO-XXXX' during development only.
   */
  trip_number: string;
  trip_type: TripType;
  status: TripStatus;
  priority: TripPriority;
  booking_reference?: string | null;
  remarks?: string | null;

  // Schedule
  start_date: string;                // ISO 8601
  expected_end_date?: string | null;
  actual_start_date?: string | null;
  actual_end_date?: string | null;

  // Geography
  origin: string;
  destination: string;
  distance_km?: number | null;
  estimated_duration_mins?: number | null;

  // Relations (IDs for mutations, objects for display)
  company_id?: string | null;
  company?: TripCompanySummary | null;

  customer_id?: string | null;
  customer?: TripCustomerSummary | null;

  route_id?: string | null;
  route?: TripRouteSummary | null;

  vehicle_id?: string | null;
  vehicle?: TripVehicleSummary | null;

  driver_id?: string | null;
  driver?: TripDriverSummary | null;

  co_driver_id?: string | null;
  co_driver?: TripDriverSummary | null;

  dispatcher_id?: string | null;
  dispatcher?: { id: string; full_name: string } | null;

  // Metadata
  created_at: string;
  updated_at: string;
  created_by?: string | null;
  updated_by?: string | null;
}

// ─── Mutation Payloads ────────────────────────────────────────────────────────

export interface TripCreate {
  trip_type: TripType;
  priority?: TripPriority;
  booking_reference?: string | null;
  remarks?: string | null;
  start_date: string;
  expected_end_date?: string | null;
  origin: string;
  destination: string;
  distance_km?: number | null;
  estimated_duration_mins?: number | null;
  company_id?: string | null;
  customer_id?: string | null;
  route_id?: string | null;
  vehicle_id?: string | null;
  driver_id?: string | null;
  co_driver_id?: string | null;
  dispatcher_id?: string | null;
}

export interface TripUpdate extends Partial<TripCreate> {}

export interface TripAssignPayload {
  vehicle_id?: string | null;
  driver_id?: string | null;
  co_driver_id?: string | null;
  dispatcher_id?: string | null;
}

export interface TripTransitionPayload {
  reason?: string;    // Required for cancellation
  notes?: string;
}

// ─── Bulk Operation Payloads ──────────────────────────────────────────────────

export interface BulkAssignPayload {
  ids: string[];
  vehicle_id?: string | null;
  driver_id?: string | null;
  co_driver_id?: string | null;
}

export interface BulkStatusPayload {
  ids: string[];
  status: TripStatus;
  reason?: string;
}

export interface BulkCancelPayload {
  ids: string[];
  reason: string;   // Required for bulk cancel
}

export interface BulkExportPayload {
  ids: string[];
  format: 'csv' | 'pdf';
  fields?: string[];
}

export interface BulkOperationResult {
  succeeded: string[];
  failed: { id: string; reason: string }[];
  total: number;
}

// ─── List & Filtering ─────────────────────────────────────────────────────────

export interface TripListParams {
  page?: number;
  page_size?: number;
  search?: string;
  status?: TripStatus | '';
  trip_type?: TripType | '';
  priority?: TripPriority | '';
  customer_id?: string;
  vehicle_id?: string;
  driver_id?: string;
  company_id?: string;
  route_id?: string;
  dispatcher_id?: string;
  date_from?: string;   // ISO 8601 date
  date_to?: string;     // ISO 8601 date
  order_by?: string;
  order_dir?: 'asc' | 'desc';
}

export interface TripListResponse {
  items: Trip[];
  total: number;
  page: number;
  page_size: number;
}

// ─── Documents ───────────────────────────────────────────────────────────────

export interface TripDocument {
  id: string;
  trip_id: string;
  category: TripDocumentCategory;
  file_name: string;
  file_url: string;
  file_size_bytes: number;
  mime_type: string;
  notes?: string | null;
  uploaded_by?: string | null;
  uploaded_at: string;
}

export interface TripDocumentUpload {
  category: TripDocumentCategory;
  file: File;
  notes?: string;
}

// ─── Activity Feed ────────────────────────────────────────────────────────────

export type ActivityEventType =
  | 'trip_created'
  | 'trip_planned'
  | 'trip_assigned'
  | 'trip_dispatched'
  | 'trip_started'
  | 'trip_completed'
  | 'trip_closed'
  | 'trip_cancelled'
  | 'vehicle_assigned'
  | 'vehicle_changed'
  | 'driver_assigned'
  | 'driver_changed'
  | 'co_driver_assigned'
  | 'note_added'
  | 'document_uploaded'
  | 'details_updated'
  | 'expense_added'
  | 'expense_updated'
  | 'invoice_generated'
  | 'invoice_cancelled'
  | 'payment_received'
  | 'outstanding_updated'
  | 'receipt_uploaded';

export interface ActivityFeedEvent {
  id: string;
  event_type: ActivityEventType;
  title: string;
  description: string;
  actor?: string | null;       // User full_name
  actor_role?: string | null;
  metadata?: Record<string, unknown>;
  timestamp: string;
  is_local?: boolean;          // true = client-side only (not yet persisted)
}

export interface ActivityFeedResponse {
  events: ActivityFeedEvent[];
  total: number;
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export interface TripDashboardStats {
  trips_today: number;
  running_trips: number;
  completed_today: number;
  delayed_trips: number;
  cancelled_today: number;
  vehicle_utilization_pct: number;
  drivers_available: number;
  drivers_total: number;
  upcoming_trips_count: number;
}
