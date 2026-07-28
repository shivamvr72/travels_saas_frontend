import { apiClient } from './client';

export interface MaintenanceJobItem {
  id: string;
  item_name: string;
  item_type: string;
  quantity: number;
  unit_cost: number;
  line_total: number;
  sort_order: number;
  notes?: string;
  created_at: string;
}

export interface MaintenanceJob {
  id: string;
  vehicle_id: string;
  job_number: string;
  job_source: 'scheduled' | 'preventive' | 'breakdown' | 'accident' | 'compliance' | 'inspection' | 'other';
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'scheduled' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
  workshop_name?: string;
  scheduled_date: string;
  start_time?: string;
  expected_completion_time?: string;
  actual_completion_time?: string;
  actual_cost: number;
  override_cost?: number;
  notes?: string;
  cancellation_reason?: string;
  hold_reason?: string;
  items: MaintenanceJobItem[];
  created_at: string;
}

export const maintenanceApi = {
  listJobs: async (params?: any) => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.vehicle_id) searchParams.append('vehicle_id', params.vehicle_id);
    if (params?.job_source) searchParams.append('job_source', params.job_source);
    
    return apiClient.get<MaintenanceJob[]>(`/maintenance?${searchParams.toString()}`);
  },
  
  getJob: async (id: string) => {
    return apiClient.get<MaintenanceJob>(`/maintenance/${id}`);
  },
  
  createJob: async (data: any) => {
    return apiClient.post<MaintenanceJob>('/maintenance', data);
  },
  
  startJob: async (id: string) => {
    return apiClient.post<MaintenanceJob>(`/maintenance/${id}/start`, {});
  },
  
  holdJob: async (id: string, reason: string) => {
    return apiClient.post<MaintenanceJob>(`/maintenance/${id}/hold`, { hold_reason: reason });
  },
  
  resumeJob: async (id: string) => {
    return apiClient.post<MaintenanceJob>(`/maintenance/${id}/resume`, {});
  },
  
  completeJob: async (id: string) => {
    return apiClient.post<MaintenanceJob>(`/maintenance/${id}/complete`, {});
  },
  
  cancelJob: async (id: string, reason: string) => {
    return apiClient.post<MaintenanceJob>(`/maintenance/${id}/cancel`, { cancellation_reason: reason });
  },
  
  addItem: async (id: string, data: any) => {
    return apiClient.post<MaintenanceJobItem>(`/maintenance/${id}/items`, data);
  },
  
  removeItem: async (jobId: string, itemId: string) => {
    return apiClient.delete(`/maintenance/${jobId}/items/${itemId}`);
  },
  
  getUpcomingRules: async () => {
    return apiClient.get<any[]>('/maintenance/rules/upcoming');
  }
};
