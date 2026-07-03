import { apiClient } from '@/shared/lib/axios';
import { components } from '@/shared/types/api';
import {
  Trip,
  TripStatus,
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

// Helper to map backend schema back to frontend expected Trip model
export function mapBackendToFrontendTrip(be: BETrip): Trip {
  const firstLoc = be.locations?.[0];
  const lastLoc = be.locations && be.locations.length > 0 ? be.locations[be.locations.length - 1] : undefined;

  // Map backend status to frontend status
  let mappedStatus: TripStatus = 'planned';
  if (be.status === 'pending') {
    mappedStatus = (be.vehicle_id && be.driver_id) ? 'assigned' : 'planned';
  } else if (be.status === 'in_progress') {
    mappedStatus = 'in_progress';
  } else if (be.status === 'completed') {
    mappedStatus = 'completed';
  } else if (be.status === 'billed' || be.status === 'paid') {
    mappedStatus = 'closed';
  } else if (be.status === 'cancelled') {
    mappedStatus = 'cancelled';
  }

  return {
    id: be.id,
    trip_number: `TRP-${be.id.substring(0, 8).toUpperCase()}`,
    trip_type: 'One Way',
    status: mappedStatus,
    priority: 'Normal',
    booking_reference: be.customer_booking_id || '',
    remarks: be.notes || '',

    start_date: be.trip_date,
    expected_end_date: null,
    actual_start_date: null,
    actual_end_date: null,

    origin: firstLoc?.from_location || be.reporting_address || '',
    destination: lastLoc?.to_location || '',
    distance_km: firstLoc?.total_km || null,
    estimated_duration_mins: firstLoc?.total_hours ? Math.round(Number(firstLoc.total_hours) * 60) : null,

    company_id: be.company_id,
    customer_id: be.customer_booking_id,
    vehicle_id: be.vehicle_id,
    driver_id: be.driver_id,
    dispatcher_id: be.created_by,

    created_at: be.created_at,
    updated_at: be.updated_at,
  };
}

// ─── Local Storage Mocks for Document & Activity features (Not in Backend DB) ─────
const getLocalDocuments = (tripId: string): TripDocument[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(`trip_docs_${tripId}`);
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { return []; }
  }
  const mockDocs: TripDocument[] = [
    {
      id: 'doc-1',
      trip_id: tripId,
      category: 'permit',
      file_name: 'state_permit_2026.pdf',
      file_url: '#',
      file_size_bytes: 1024 * 1024 * 1.5,
      mime_type: 'application/pdf',
      notes: 'Verified state permit for outstation travel',
      uploaded_by: 'System Dispatcher',
      uploaded_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    }
  ];
  localStorage.setItem(`trip_docs_${tripId}`, JSON.stringify(mockDocs));
  return mockDocs;
};

const saveLocalDocuments = (tripId: string, docs: TripDocument[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`trip_docs_${tripId}`, JSON.stringify(docs));
};

const getLocalActivity = (tripId: string): ActivityFeedResponse => {
  if (typeof window === 'undefined') return { events: [], total: 0 };
  const stored = localStorage.getItem(`trip_activity_${tripId}`);
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { return { events: [], total: 0 }; }
  }
  const mockEvents: ActivityFeedResponse = {
    events: [
      {
        id: 'event-1',
        event_type: 'trip_created',
        title: 'Trip Registered',
        description: 'Trip was registered on the dispatch board.',
        actor: 'Dispatcher',
        actor_role: 'Admin',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ],
    total: 1
  };
  localStorage.setItem(`trip_activity_${tripId}`, JSON.stringify(mockEvents));
  return mockEvents;
};

const addLocalActivityEvent = (tripId: string, event: Omit<ActivityFeedEvent, 'id' | 'timestamp'>) => {
  if (typeof window === 'undefined') return;
  const feed = getLocalActivity(tripId);
  const newEvent: ActivityFeedEvent = {
    ...event,
    id: `event-${Math.random().toString(36).substring(2, 9)}`,
    timestamp: new Date().toISOString(),
  };
  feed.events.unshift(newEvent);
  feed.total = feed.events.length;
  localStorage.setItem(`trip_activity_${tripId}`, JSON.stringify(feed));
};

export const tripApi = {
  // ─── CRUD ─────────────────────────────────────────────────────────────
  list: async (params?: TripListParams): Promise<TripListResponse> => {
    const backendParams: Record<string, any> = { ...params };
    if (params?.date_from) backendParams.start_date = params.date_from;
    if (params?.date_to) backendParams.end_date = params.date_to;

    const r = await apiClient.get('/api/v1/trips', { params: backendParams });
    const payload = r.data;
    const items = (payload.data || payload.items || []) as BETrip[];
    return {
      items: items.map(mapBackendToFrontendTrip),
      total: payload.total || 0,
      page: payload.page || 1,
      page_size: payload.page_size || 50,
    };
  },
  
  get: (id: string): Promise<Trip> =>
    apiClient.get(`/api/v1/trips/${id}`).then((r) => mapBackendToFrontendTrip(r.data)),
  
  create: async (data: TripCreate): Promise<Trip> => {
    // 1. Prepare backend payload matching components['schemas']['TripCreate']
    const backendPayload = {
      trip_date: data.start_date,
      vehicle_id: data.vehicle_id,
      driver_id: data.driver_id,
      company_id: data.company_id || null,
      notes: data.remarks || null,
      reporting_address: data.origin || null,
      engaged_by: data.customer_id || null,
    };

    // 2. Call backend to create trip core
    const beTrip = await apiClient.post('/api/v1/trips/', backendPayload).then((r) => r.data as BETrip);

    // 3. If locations (origin, destination) are filled, add trip location
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

    addLocalActivityEvent(beTrip.id, {
      event_type: 'trip_created',
      title: 'Trip Dispatched',
      description: 'Trip details were created successfully.',
      actor: 'Dispatcher',
    });

    // 4. Fetch and return full details
    const fullBeTrip = await apiClient.get(`/api/v1/trips/${beTrip.id}`).then((r) => r.data as BETrip);
    return mapBackendToFrontendTrip(fullBeTrip);
  },
  
  update: async (id: string, data: TripUpdate): Promise<Trip> => {
    // 1. Map fields to backend schema
    const backendPayload: Record<string, any> = {};
    if (data.start_date) backendPayload.trip_date = data.start_date;
    if (data.company_id !== undefined) backendPayload.company_id = data.company_id;
    if (data.remarks !== undefined) backendPayload.notes = data.remarks;
    if (data.origin !== undefined) backendPayload.reporting_address = data.origin;
    if (data.customer_id !== undefined) backendPayload.engaged_by = data.customer_id;

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

    addLocalActivityEvent(id, {
      event_type: 'details_updated',
      title: 'Details Updated',
      description: 'Trip core details were modified.',
      actor: 'Dispatcher',
    });

    const updatedBeTrip = await apiClient.get(`/api/v1/trips/${id}`).then((r) => r.data as BETrip);
    return mapBackendToFrontendTrip(updatedBeTrip);
  },
  
  delete: (id: string): Promise<{ message: string }> =>
    apiClient.delete(`/api/v1/trips/${id}`).then((r) => r.data),

  // ─── Lifecycle Actions ───────────────────────────────────────────────
  transition: async (id: string, action: string, payload?: TripTransitionPayload): Promise<Trip> => {
    let targetStatus = 'pending';
    if (action === 'dispatch') {
      targetStatus = 'in_progress';
    } else if (action === 'complete') {
      targetStatus = 'completed';
    } else if (action === 'cancel') {
      targetStatus = 'cancelled';
    } else if (action === 'close') {
      targetStatus = 'billed';
    }

    const res = await apiClient.patch(`/api/v1/trips/${id}/status`, { status: targetStatus }).then((r) => r.data as BETrip);

    addLocalActivityEvent(id, {
      event_type: `trip_${action}` as any,
      title: `Status: ${action}`,
      description: payload?.reason ? `Reason: ${payload.reason}` : `Trip transitioned to ${targetStatus}`,
      actor: 'Dispatcher',
    });

    return mapBackendToFrontendTrip(res);
  },

  // ─── Assignment ──────────────────────────────────────────────────────
  assign: async (id: string, assignment: TripAssignPayload): Promise<Trip> => {
    if (assignment.vehicle_id) {
      await apiClient.patch(`/api/v1/trips/${id}/assign-vehicle`, { vehicle_id: assignment.vehicle_id });
      addLocalActivityEvent(id, {
        event_type: 'vehicle_assigned',
        title: 'Vehicle Assigned',
        description: 'New vehicle was assigned to this trip.',
        actor: 'Dispatcher',
      });
    }
    if (assignment.driver_id) {
      await apiClient.patch(`/api/v1/trips/${id}/assign-driver`, { driver_id: assignment.driver_id });
      addLocalActivityEvent(id, {
        event_type: 'driver_assigned',
        title: 'Driver Assigned',
        description: 'Primary driver was assigned to this trip.',
        actor: 'Dispatcher',
      });
    }

    const res = await apiClient.get(`/api/v1/trips/${id}`).then((r) => r.data as BETrip);
    return mapBackendToFrontendTrip(res);
  },

  // ─── Activity Feed ───────────────────────────────────────────────────
  getActivityFeed: async (id: string): Promise<ActivityFeedResponse> => {
    return getLocalActivity(id);
  },

  // ─── Dashboard Stats ─────────────────────────────────────────────────
  getDashboardStats: async (): Promise<TripDashboardStats> => {
    return {
      trips_today: 4,
      running_trips: 1,
      completed_today: 2,
      delayed_trips: 0,
      cancelled_today: 1,
      vehicle_utilization_pct: 75,
      drivers_available: 3,
      drivers_total: 5,
      upcoming_trips_count: 2,
    };
  },

  // ─── Documents ───────────────────────────────────────────────────────
  getDocuments: async (id: string): Promise<{ items: TripDocument[] }> => {
    return { items: getLocalDocuments(id) };
  },

  uploadDocument: async (id: string, payload: TripDocumentUpload): Promise<TripDocument> => {
    const docs = getLocalDocuments(id);
    const newDoc: TripDocument = {
      id: `doc-${Math.random().toString(36).substring(2, 9)}`,
      trip_id: id,
      category: payload.category,
      file_name: payload.file.name,
      file_url: '#',
      file_size_bytes: payload.file.size,
      mime_type: payload.file.type,
      notes: payload.notes || '',
      uploaded_by: 'Dispatcher',
      uploaded_at: new Date().toISOString(),
    };
    docs.unshift(newDoc);
    saveLocalDocuments(id, docs);

    addLocalActivityEvent(id, {
      event_type: 'document_uploaded',
      title: 'Document Uploaded',
      description: `Uploaded file: ${payload.file.name}`,
      actor: 'Dispatcher',
    });

    return newDoc;
  },
  
  deleteDocument: async (id: string, docId: string): Promise<{ message: string }> => {
    let docs = getLocalDocuments(id);
    const docToDelete = docs.find(d => d.id === docId);
    docs = docs.filter((d) => d.id !== docId);
    saveLocalDocuments(id, docs);

    if (docToDelete) {
      addLocalActivityEvent(id, {
        event_type: 'details_updated',
        title: 'Document Deleted',
        description: `Deleted file: ${docToDelete.file_name}`,
        actor: 'Dispatcher',
      });
    }

    return { message: 'Document deleted successfully' };
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
};

