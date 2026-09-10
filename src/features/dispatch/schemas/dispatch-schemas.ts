import { z } from 'zod';

// AvailableVehicleRead
export const AvailableVehicleSchema = z.object({
  id: z.string().uuid(),
  reg_number: z.string(),
  vehicle_name: z.string().nullable().optional(),
  vehicle_type: z.string().nullable().optional(),
  seating_capacity: z.number().nullable().optional(),
  ownership_type: z.string().nullable().optional(),
  insurance_expiry: z.string().nullable().optional(), // dates returned as ISO strings
  fitness_expiry: z.string().nullable().optional(),
  permit_expiry: z.string().nullable().optional(),
  rc_expiry: z.string().nullable().optional(),
});
export type AvailableVehicle = z.infer<typeof AvailableVehicleSchema>;

// AvailableDriverRead
export const AvailableDriverSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  phone: z.string().nullable().optional(),
  license_expiry: z.string().nullable().optional(),
});
export type AvailableDriver = z.infer<typeof AvailableDriverSchema>;

// TripDispatchSummary
export const TripDispatchSummarySchema = z.object({
  id: z.string().uuid(),
  trip_date: z.string(), // YYYY-MM-DD string
  status: z.string(),
  scheduled_start_time: z.string().nullable().optional(),
  vehicle_id: z.string().uuid().nullable().optional(),
  vehicle_reg_number: z.string().nullable().optional(),
  driver_id: z.string().uuid().nullable().optional(),
  driver_name: z.string().nullable().optional(),
  external_hiring_id: z.string().uuid().nullable().optional(),
  customer_name: z.string().nullable().optional(),
  trip_type: z.string().nullable().optional(),
  priority: z.string().nullable().optional(),
  reporting_address: z.string().nullable().optional(),
});
export type TripDispatchSummary = z.infer<typeof TripDispatchSummarySchema>;

// DispatchBoardRead
export const DispatchBoardReadSchema = z.object({
  date: z.string(),
  available_vehicles_count: z.number(),
  available_drivers_count: z.number(),
  pending_trips: z.array(TripDispatchSummarySchema),
  assigned_trips: z.array(TripDispatchSummarySchema),
  in_progress_trips: z.array(TripDispatchSummarySchema),
});
export type DispatchBoardData = z.infer<typeof DispatchBoardReadSchema>;

// AssignTripRequest
export const AssignTripRequestSchema = z.object({
  vehicle_id: z.string().uuid().nullable().optional(),
  driver_id: z.string().uuid().nullable().optional(),
  external_hiring_id: z.string().uuid().nullable().optional(),
  scheduled_start_time: z.string().nullable().optional(), // ISO datetime string
  scheduled_end_time: z.string().nullable().optional(),
  estimated_duration_hrs: z.number().nullable().optional(),
}).refine(data => data.vehicle_id != null || data.driver_id != null || data.external_hiring_id != null, {
  message: 'At least one resource (vehicle, driver, or external hiring) must be selected',
  path: ['vehicle_id'], // attach the error to the vehicle_id field
});
export type AssignTripRequest = z.infer<typeof AssignTripRequestSchema>;

// BulkAssignItem
export const BulkAssignItemSchema = z.object({
  trip_id: z.string().uuid(),
  vehicle_id: z.string().uuid().nullable().optional(),
  driver_id: z.string().uuid().nullable().optional(),
  external_hiring_id: z.string().uuid().nullable().optional(),
  scheduled_start_time: z.string().nullable().optional(),
  scheduled_end_time: z.string().nullable().optional(),
  estimated_duration_hrs: z.number().nullable().optional(),
});
export type BulkAssignItem = z.infer<typeof BulkAssignItemSchema>;

// BulkAssignRequest
export const BulkAssignRequestSchema = z.object({
  assignments: z.array(BulkAssignItemSchema).min(1).max(50),
});
export type BulkAssignRequest = z.infer<typeof BulkAssignRequestSchema>;

// BulkAssignItemResult
export const BulkAssignItemResultSchema = z.object({
  trip_id: z.string().uuid(),
  success: z.boolean(),
  error_code: z.string().nullable().optional(),
  error_message: z.string().nullable().optional(),
});
export type BulkAssignItemResult = z.infer<typeof BulkAssignItemResultSchema>;

// BulkAssignResponse
export const BulkAssignResponseSchema = z.object({
  total: z.number(),
  succeeded: z.number(),
  failed: z.number(),
  results: z.array(BulkAssignItemResultSchema),
});
export type BulkAssignResponse = z.infer<typeof BulkAssignResponseSchema>;
