import { apiClient } from '@/shared/lib/axios';
import { components } from '@/shared/types/api';
import {
  Trip,
  TripStatus,
  TripType,
  TripPriority,
  TripCreate,
  TripUpdate,
  TripListParams,
  TripListResponse,
  TripAssignPayload,
  TripTransitionPayload,
  BulkAssignPayload,
  BulkStatusPayload,
  BulkCancelPayload,
  BulkExportPayload,
  BulkOperationResult,
  TripDocument,
  TripDocumentUpload,
  ActivityFeedResponse,
  ActivityFeedEvent,
  TripDashboardStats,
} from '../domain/trip-types';

type BETrip = components['schemas']['TripResponse'];

// ─── Local Cache for Lookups ─────────────────────────────────────────────────
let cachedVehicles: any[] | null = null;
let cachedDrivers: any[] | null = null;
let cachedCustomers: any[] | null = null;
let cachedCompanies: any[] | null = null;
let lastCacheTime = 0;

export async function refreshLookupsIfNeeded() {
  const now = Date.now();
  // Fetch every 30 seconds or if empty
  if (now - lastCacheTime > 30000 || !cachedVehicles) {
    try {
      const [vehiclesRes, driversRes, customersRes, companiesRes] = await Promise.all([
        apiClient.get('/api/v1/vehicles/?page_size=100').catch(() => ({ data: { data: [] } })),
        apiClient.get('/api/v1/drivers/?page_size=100').catch(() => ({ data: { data: [] } })),
        apiClient.get('/api/v1/customers/?page_size=100').catch(() => ({ data: { data: [] } })),
        apiClient.get('/api/v1/companies/?page_size=100').catch(() => ({ data: { data: [] } })),
      ]);
      cachedVehicles = vehiclesRes.data?.data || vehiclesRes.data?.items || [];
      cachedDrivers = driversRes.data?.data || driversRes.data?.items || [];
      cachedCustomers = customersRes.data?.data || customersRes.data?.items || [];
      cachedCompanies = companiesRes.data?.data || companiesRes.data?.items || [];
      lastCacheTime = now;
    } catch (err) {
      console.error('Failed to pre-fetch lookups for trips:', err);
    }
  }
}

// ─── Local cache lookup has been preserved ─────────────────────────────────────

function resolveTripRelations(be: BETrip, customerId?: string | null) {
  const vehicle = cachedVehicles?.find(v => v.id === be.vehicle_id);
  const driver = cachedDrivers?.find(d => d.id === be.driver_id);
  const coDriver = cachedDrivers?.find(d => d.id === be.co_driver_id);
  const company = cachedCompanies?.find(c => c.id === be.company_id);
  const targetCustId = customerId || (be as any).customer_id || be.customer_booking_id;
  const customer = cachedCustomers?.find(c => c.id === targetCustId);

  return {
    vehicle: vehicle ? {
      id: vehicle.id,
      license_plate: vehicle.reg_number,
      make: vehicle.brand_name,
      model: vehicle.model_type,
      type: vehicle.vehicle_type,
    } : null,
    driver: driver ? {
      id: driver.id,
      name: driver.name,
      phone: driver.phone,
      license_no: driver.license_no,
      is_external: driver.is_external,
    } : null,
    co_driver: coDriver ? {
      id: coDriver.id,
      name: coDriver.name,
      phone: coDriver.phone,
      license_no: coDriver.license_no,
      is_external: coDriver.is_external,
    } : null,
    company: company ? {
      id: company.id,
      name: company.name,
    } : null,
    customer: customer ? {
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
    } : null,
  };
}

// Helper to map backend schema back to frontend expected Trip model
export function mapBackendToFrontendTrip(be: BETrip): Trip {
  const firstLoc = be.locations?.[0];
  const lastLoc = be.locations && be.locations.length > 0 ? be.locations[be.locations.length - 1] : undefined;

  // Backend status maps 1:1 to frontend status — use directly
  const mappedStatus = be.status as TripStatus;

  const relations = resolveTripRelations(be, (be as any).customer_id || be.customer_booking_id);

  return {
    id: be.id,
    trip_number: `TRP-${be.id.substring(0, 8).toUpperCase()}`,
    trip_type: (be as any).trip_type || 'One Way',
    status: mappedStatus,
    cancellation_reason: (be as any).cancellation_reason ?? null,
    priority: (be as any).priority || 'Normal',
    booking_reference: be.customer_booking_id || '',
    remarks: be.notes || '',

    start_date: be.trip_date,
    expected_end_date: be.scheduled_end_time || null,
    actual_start_date: be.actual_start_time || null,
    actual_end_date: be.actual_end_time || null,

    origin: firstLoc?.from_location || be.reporting_address || '',
    destination: lastLoc?.to_location || '',
    distance_km: firstLoc?.total_km || null,
    estimated_duration_mins: firstLoc?.total_hours ? Math.round(Number(firstLoc.total_hours) * 60) : null,

    company_id: be.company_id,
    customer_id: (be as any).customer_id || be.customer_booking_id || null,
    vehicle_id: be.vehicle_id,
    driver_id: be.driver_id,
    route_id: firstLoc?.route_id || null,
    dispatcher_id: be.dispatcher_id || be.created_by,
    co_driver_id: be.co_driver_id || null,
    external_hiring_id: (be as any).external_hiring_id || null,

    ...relations,

    created_at: be.created_at,
    updated_at: be.updated_at,
  };
}

// Helper to resolve missing relations (like newly created external vehicles/hirings/drivers/customers)
export async function resolveMissingRelations(trip: Trip): Promise<Trip> {
  // 1. Resolve vehicle
  if (trip.vehicle_id && !trip.vehicle) {
    try {
      const v = await apiClient.get(`/api/v1/vehicles/${trip.vehicle_id}`).then(res => res.data);
      trip.vehicle = {
        id: v.id,
        license_plate: v.reg_number,
        make: v.brand_name,
        model: v.model_type,
        type: v.vehicle_type,
      };
      if (cachedVehicles && !cachedVehicles.some(item => item.id === v.id)) {
        cachedVehicles.push(v);
      }
    } catch (e) {
      console.error('Failed to fetch missing vehicle', e);
    }
  }

  // 2. Resolve external hiring
  if (trip.external_hiring_id && !trip.external_hiring) {
    try {
      const h = await apiClient.get(`/api/v1/external-hirings/${trip.external_hiring_id}`).then(res => res.data);
      trip.external_hiring = {
        id: h.id,
        provider_name: h.provider_name,
        provider_phone: h.provider_phone,
        external_vehicle_reg: h.external_vehicle_reg || trip.vehicle?.license_plate || null,
        vehicle_description: h.vehicle_description || null,
        external_driver_name: h.external_driver_name,
        agreed_rate: h.agreed_rate,
        status: h.status,
      };
    } catch (e) {
      console.error('Failed to fetch missing external hiring', e);
    }
  }

  // 3. Resolve driver
  if (trip.driver_id && !trip.driver) {
    try {
      const d = await apiClient.get(`/api/v1/drivers/${trip.driver_id}`).then(res => res.data);
      trip.driver = { id: d.id, name: d.name, phone: d.phone, license_no: d.license_no, is_external: d.is_external };
      if (cachedDrivers && !cachedDrivers.some(item => item.id === d.id)) cachedDrivers.push(d);
    } catch (e) {
      console.error('Failed to fetch missing driver', e);
    }
  }

  // 4. Resolve co-driver
  if (trip.co_driver_id && !trip.co_driver) {
    try {
      const d = await apiClient.get(`/api/v1/drivers/${trip.co_driver_id}`).then(res => res.data);
      trip.co_driver = { id: d.id, name: d.name, phone: d.phone, license_no: d.license_no, is_external: d.is_external };
      if (cachedDrivers && !cachedDrivers.some(item => item.id === d.id)) cachedDrivers.push(d);
    } catch (e) {
      console.error('Failed to fetch missing co-driver', e);
    }
  }

  // 5. Resolve customer
  if (trip.customer_id && !trip.customer) {
    try {
      const c = await apiClient.get(`/api/v1/customers/${trip.customer_id}`).then(res => res.data);
      trip.customer = { id: c.id, name: c.name, phone: c.phone };
      if (cachedCustomers && !cachedCustomers.some(item => item.id === c.id)) cachedCustomers.push(c);
    } catch (e) {
      console.error('Failed to fetch missing customer', e);
    }
  }

  // 6. Resolve dispatcher
  if (trip.dispatcher_id && !trip.dispatcher) {
    trip.dispatcher = { id: trip.dispatcher_id, full_name: 'Dispatcher' };
  }

  return trip;
}

export const tripApi = {
  // ─── CRUD ─────────────────────────────────────────────────────────────
  list: async (params?: TripListParams): Promise<TripListResponse> => {
    await refreshLookupsIfNeeded();

    // Sanitize query params: strip empty strings so backend doesn't reject them
    const backendParams: Record<string, any> = {};
    if (params) {
      Object.keys(params).forEach((key) => {
        const val = (params as any)[key];
        if (val !== undefined && val !== null && val !== '') {
          backendParams[key] = val;
        }
      });
    }

    if (params?.date_from && params.date_from.trim() !== '') {
      backendParams.start_date = params.date_from;
    }
    if (params?.date_to && params.date_to.trim() !== '') {
      backendParams.end_date = params.date_to;
    }

    // Client-only params are removed to avoid poluting request query
    delete backendParams.date_from;
    delete backendParams.date_to;
    
    // Backend handles filtering directly
    const r = await apiClient.get('/api/v1/trips', { params: backendParams });
    const payload = r.data;
    const beItems = (payload.data || payload.items || []) as BETrip[];
    
    const items = beItems.map(mapBackendToFrontendTrip);

    return {
      items,
      total: payload.total || 0,
      page: payload.page || 1,
      page_size: payload.page_size || 50,
    };
  },
  
  get: async (id: string): Promise<Trip> => {
    await refreshLookupsIfNeeded();
    const beTrip = await apiClient.get(`/api/v1/trips/${id}`).then((r) => r.data as BETrip);
    const trip = mapBackendToFrontendTrip(beTrip);
    return resolveMissingRelations(trip);
  },
  
  create: async (data: TripCreate): Promise<Trip> => {
    await refreshLookupsIfNeeded();

    // Helper: treat empty strings as null for backend UUID fields
    const uuid = (v: string | null | undefined) => (v && v.trim() !== '' ? v : null);

    // 1. Prepare backend payload matching components['schemas']['TripCreate']
    const backendPayload = {
      trip_date: data.start_date,
      vehicle_id: data.vehicle_id,   // required - already validated by zod
      driver_id: data.driver_id,     // required - already validated by zod
      co_driver_id: uuid(data.co_driver_id),
      dispatcher_id: uuid(data.dispatcher_id),
      company_id: uuid(data.company_id),
      customer_id: uuid(data.customer_id),
      notes: data.remarks?.trim() || null,
      reporting_address: data.origin?.trim() || null,
      trip_type: data.trip_type || 'One Way',
      priority: data.priority || 'Normal',
      engaged_by: null,
    };

    // 2. Call backend to create trip core
    const beTrip = await apiClient.post('/api/v1/trips/', backendPayload).then((r) => r.data as BETrip);

    // 4. If locations (origin, destination) are filled, add trip location
    if (data.origin && data.destination) {
      try {
        await apiClient.post(`/api/v1/trips/${beTrip.id}/locations`, {
          route_id: data.route_id || null,
          from_location: data.origin,
          to_location: data.destination,
          total_km: data.distance_km || null,
          total_hours: data.estimated_duration_mins ? data.estimated_duration_mins / 60 : null,
        });
      } catch (err) {
        console.error('Failed to create trip location:', err);
      }
    }

    // 5. Fetch and return full details
    const fullBeTrip = await apiClient.get(`/api/v1/trips/${beTrip.id}`).then((r) => r.data as BETrip);
    const trip = mapBackendToFrontendTrip(fullBeTrip);
    return resolveMissingRelations(trip);
  },
  
  update: async (id: string, data: TripUpdate): Promise<Trip> => {
    await refreshLookupsIfNeeded();
    const uuid = (v: string | null | undefined) => (v && v.trim() !== '' ? v : null);

    // 1. Map fields to backend schema
    const backendPayload: Record<string, any> = {};
    if (data.start_date) backendPayload.trip_date = data.start_date;
    if (data.company_id !== undefined) backendPayload.company_id = uuid(data.company_id);
    if (data.customer_id !== undefined) backendPayload.customer_id = uuid(data.customer_id as string | undefined);
    if (data.co_driver_id !== undefined) backendPayload.co_driver_id = uuid(data.co_driver_id);
    if (data.dispatcher_id !== undefined) backendPayload.dispatcher_id = uuid(data.dispatcher_id);
    if (data.remarks !== undefined) backendPayload.notes = data.remarks?.trim() || null;
    if (data.origin !== undefined) backendPayload.reporting_address = data.origin?.trim() || null;
    if (data.trip_type !== undefined) backendPayload.trip_type = data.trip_type;
    if (data.priority !== undefined) backendPayload.priority = data.priority;
    backendPayload.engaged_by = null;

    if (Object.keys(backendPayload).length > 0) {
      await apiClient.put(`/api/v1/trips/${id}`, backendPayload);
    }

    // 2. Map route updates to location API if locations exist
    if (data.origin || data.destination) {
      try {
        const fullTrip = await apiClient.get(`/api/v1/trips/${id}`).then((r) => r.data as BETrip);
        const loc = fullTrip.locations?.[0];
        if (loc) {
          await apiClient.put(`/api/v1/trips/${id}/locations/${loc.id}`, {
            route_id: data.route_id || loc.route_id,
            from_location: data.origin || loc.from_location,
            to_location: data.destination || loc.to_location,
            total_km: data.distance_km || loc.total_km,
            total_hours: data.estimated_duration_mins ? data.estimated_duration_mins / 60 : loc.total_hours,
          });
        } else {
          await apiClient.post(`/api/v1/trips/${id}/locations`, {
            route_id: data.route_id || null,
            from_location: data.origin || '',
            to_location: data.destination || '',
            total_km: data.distance_km || null,
            total_hours: data.estimated_duration_mins ? data.estimated_duration_mins / 60 : null,
          });
        }
      } catch (err) {
        console.error('Failed to update trip locations:', err);
      }
    }

    const updatedBeTrip = await apiClient.get(`/api/v1/trips/${id}`).then((r) => r.data as BETrip);
    const trip = mapBackendToFrontendTrip(updatedBeTrip);
    return resolveMissingRelations(trip);
  },
  
  delete: (id: string): Promise<{ message: string }> =>
    apiClient.delete(`/api/v1/trips/${id}`).then((r) => r.data),

  // ─── Lifecycle Actions ───────────────────────────────────────────────
  transition: async (id: string, action: string, payload?: TripTransitionPayload): Promise<Trip> => {
    await refreshLookupsIfNeeded();
    let res;
    if (action === 'draft' || action === 'unassigned') {
      res = await apiClient.post(`/api/v1/trips/${id}/unassign`).then((r) => r.data as BETrip);
    } else if (action === 'dispatched') {
      res = await apiClient.post(`/api/v1/trips/${id}/dispatch`, { confirmation_notes: payload?.notes }).then((r) => r.data as BETrip);
    } else if (action === 'started') {
      res = await apiClient.post(`/api/v1/trips/${id}/start`, {}).then((r) => r.data as BETrip);
    } else if (action === 'completed') {
      res = await apiClient.post(`/api/v1/trips/${id}/complete`, {}).then((r) => r.data as BETrip);
    } else {
      res = await apiClient.patch(`/api/v1/trips/${id}/status`, { status: action, reason: payload?.reason }).then((r) => r.data as BETrip);
    }

    const trip = mapBackendToFrontendTrip(res);
    return resolveMissingRelations(trip);
  },

  assign: async (id: string, assignment: TripAssignPayload): Promise<Trip> => {
    await refreshLookupsIfNeeded();
    const uuid = (v: string | null | undefined) => (v && v.trim() !== '' ? v : null);

    const vehicleId = uuid(assignment.vehicle_id);
    const driverId = uuid(assignment.driver_id);
    const coDriverId = uuid(assignment.co_driver_id);
    const dispatcherId = uuid(assignment.dispatcher_id);

    // Call the correct dispatch assignment endpoint
    await apiClient.post(`/api/v1/dispatch/trips/${id}/assign`, {
      vehicle_id: vehicleId,
      driver_id: driverId,
      co_driver_id: coDriverId,
      dispatcher_id: dispatcherId,
    });

    const res = await apiClient.get(`/api/v1/trips/${id}`).then((r) => r.data as BETrip);
    const trip = mapBackendToFrontendTrip(res);
    return resolveMissingRelations(trip);
  },

  assignExternalVehicle: async (id: string, payload: any): Promise<Trip> => {
    lastCacheTime = 0;
    await refreshLookupsIfNeeded();
    await apiClient.post(`/api/v1/dispatch/trips/${id}/assign-external`, payload);
    const res = await apiClient.get(`/api/v1/trips/${id}`).then((r) => r.data as BETrip);
    const trip = mapBackendToFrontendTrip(res);
    return resolveMissingRelations(trip);
  },

  assignExternalDriver: async (id: string, payload: any): Promise<Trip> => {
    lastCacheTime = 0;
    await refreshLookupsIfNeeded();
    await apiClient.post(`/api/v1/dispatch/trips/${id}/assign-external-driver`, payload);
    const res = await apiClient.get(`/api/v1/trips/${id}`).then((r) => r.data as BETrip);
    const trip = mapBackendToFrontendTrip(res);
    return resolveMissingRelations(trip);
  },

  // ─── Activity Feed ───────────────────────────────────────────────────
  // (Activity Feed is now directly queried from backend in hooks)

  // ─── Dashboard Stats ─────────────────────────────────────────────────
  getDashboardStats: async (): Promise<TripDashboardStats> => {
    return apiClient.get('/api/v1/trips/dashboard/stats').then(r => r.data as TripDashboardStats);
  },

  getDocuments: async (id: string): Promise<{ items: TripDocument[] }> => {
    return apiClient.get(`/api/v1/documents?entity_type=TRIP&entity_id=${id}`).then(r => ({ items: r.data.items || r.data.data || [] }));
  },

  uploadDocument: async (id: string, payload: TripDocumentUpload): Promise<TripDocument> => {
    const formData = new FormData();
    formData.append('file', payload.file);
    formData.append('document_category', payload.category);
    formData.append('entity_type', 'TRIP');
    formData.append('entity_id', id);
    if (payload.notes) formData.append('notes', payload.notes);

    const res = await apiClient.post(`/api/v1/documents/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  
  deleteDocument: async (id: string, docId: string): Promise<{ message: string }> => {
    return apiClient.delete(`/api/v1/documents/${docId}`).then(r => r.data);
  },

  // ─── Bulk Operations ─────────────────────────────────────────────────
  bulkAssign: async (payload: BulkAssignPayload): Promise<BulkOperationResult> => {
    const succeeded: string[] = [];
    const failed: { id: string; reason: string }[] = [];

    for (const id of payload.ids) {
      try {
        if (payload.vehicle_id) {
          await apiClient.patch(`/api/v1/trips/${id}/assign-vehicle`, { vehicle_id: payload.vehicle_id });
        }
        if (payload.driver_id) {
          await apiClient.patch(`/api/v1/trips/${id}/assign-driver`, { driver_id: payload.driver_id });
        }
        succeeded.push(id);
      } catch (err: any) {
        failed.push({ id, reason: err.message || 'Assignment failed' });
      }
    }

    return { succeeded, failed, total: payload.ids.length };
  },
  
  bulkStatusUpdate: async (payload: BulkStatusPayload): Promise<BulkOperationResult> => {
    const succeeded: string[] = [];
    const failed: { id: string; reason: string }[] = [];

    for (const id of payload.ids) {
      try {
        await apiClient.patch(`/api/v1/trips/${id}/status`, { status: payload.status });
        succeeded.push(id);
      } catch (err: any) {
        failed.push({ id, reason: err.message || 'Status update failed' });
      }
    }

    return { succeeded, failed, total: payload.ids.length };
  },
  
  bulkDispatch: async (ids: string[]): Promise<BulkOperationResult> => {
    const succeeded: string[] = [];
    const failed: { id: string; reason: string }[] = [];

    for (const id of ids) {
      try {
        await apiClient.patch(`/api/v1/trips/${id}/status`, { status: 'in_progress' });
        succeeded.push(id);
      } catch (err: any) {
        failed.push({ id, reason: err.message || 'Dispatch failed' });
      }
    }

    return { succeeded, failed, total: ids.length };
  },
  
  bulkCancel: async (payload: BulkCancelPayload): Promise<BulkOperationResult> => {
    const succeeded: string[] = [];
    const failed: { id: string; reason: string }[] = [];

    for (const id of payload.ids) {
      try {
        await apiClient.patch(`/api/v1/trips/${id}/status`, { status: 'cancelled' });
        succeeded.push(id);
      } catch (err: any) {
        failed.push({ id, reason: err.message || 'Cancellation failed' });
      }
    }

    return { succeeded, failed, total: payload.ids.length };
  },
  
  bulkExport: (payload: BulkExportPayload): Promise<Blob> =>
    apiClient.post('/api/v1/trips/bulk/export', payload, { responseType: 'blob' }).then((r) => r.data),

  addNote: async (id: string, note: string): Promise<void> => {
    await apiClient.post('/api/v1/activity', {
      entity_type: 'TRIP',
      entity_id: id,
      event_type: 'NOTE_ADDED',
      title: 'Dispatcher Note',
      description: note
    });
  },
};

