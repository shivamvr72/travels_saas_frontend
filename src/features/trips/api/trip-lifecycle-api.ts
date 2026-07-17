import { apiClient } from '@/shared/lib/axios';
import { mapBackendToFrontendTrip } from './trip-api';
import { Trip } from '../domain/trip-types';
import { components } from '@/shared/types/api';

type BETrip = components['schemas']['TripResponse'];

export interface DispatchTripPayload {
  confirmation_notes?: string | null;
}

export interface StartTripPayload {
  actual_start_time?: string | null;
  reporting_address?: string | null;
}

export interface CompleteTripPayload {
  actual_end_time?: string | null;
  total_km?: number | null;
}

export interface CancelTripPayload {
  cancellation_reason: string;
}

export const tripLifecycleApi = {
  dispatch: (id: string, payload: DispatchTripPayload): Promise<Trip> =>
    apiClient.post(`/api/v1/trips/${id}/dispatch`, payload).then(r => mapBackendToFrontendTrip(r.data as BETrip)),

  start: (id: string, payload: StartTripPayload): Promise<Trip> =>
    apiClient.post(`/api/v1/trips/${id}/start`, payload).then(r => mapBackendToFrontendTrip(r.data as BETrip)),

  complete: (id: string, payload: CompleteTripPayload): Promise<Trip> =>
    apiClient.post(`/api/v1/trips/${id}/complete`, payload).then(r => mapBackendToFrontendTrip(r.data as BETrip)),

  cancel: (id: string, payload: CancelTripPayload): Promise<Trip> =>
    apiClient.post(`/api/v1/trips/${id}/cancel`, payload).then(r => mapBackendToFrontendTrip(r.data as BETrip)),
};
