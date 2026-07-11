import { apiClient as api } from '@/shared/lib/axios';
import { 
  AdminUser, 
  AdminUserUpdate, 
  SystemSetting, 
  NumberSequence, 
  SecurityPolicy, 
  AuditLog 
} from '../domain/admin.types';

export const adminApi = {
  // Users
  getUsers: async (search?: string) => {
    const { data } = await api.get<AdminUser[]>('/admin/users', { params: { search } });
    return data;
  },
  getUser: async (id: string) => {
    const { data } = await api.get<AdminUser>(`/admin/users/${id}`);
    return data;
  },
  updateUser: async (id: string, payload: AdminUserUpdate) => {
    const { data } = await api.put<AdminUser>(`/admin/users/${id}`, payload);
    return data;
  },
  resetPassword: async (id: string, newPassword: string, forceChange: boolean = true) => {
    const { data } = await api.post<AdminUser>(`/admin/users/${id}/reset-password`, {
      new_password: newPassword,
      force_password_change: forceChange
    });
    return data;
  },

  // Settings
  getSettings: async () => {
    const { data } = await api.get<SystemSetting[]>('/admin/settings');
    return data;
  },
  updateSetting: async (key: string, value: string, category: string) => {
    const { data } = await api.put<SystemSetting>(`/admin/settings/${key}`, { value, category });
    return data;
  },

  // Number Sequences
  getNumberSequences: async () => {
    const { data } = await api.get<NumberSequence[]>('/admin/settings/number-sequences');
    return data;
  },
  updateNumberSequence: async (entityType: string, payload: Partial<NumberSequence>) => {
    const { data } = await api.put<NumberSequence>(`/admin/settings/number-sequences/${entityType}`, payload);
    return data;
  },

  // Security Policy
  getSecurityPolicy: async () => {
    const { data } = await api.get<SecurityPolicy>('/admin/settings/security-policy');
    return data;
  },
  updateSecurityPolicy: async (payload: Partial<SecurityPolicy>) => {
    const { data } = await api.put<SecurityPolicy>('/admin/settings/security-policy', payload);
    return data;
  },

  // Audit Logs
  getAuditLogs: async () => {
    const { data } = await api.get<AuditLog[]>('/admin/audit-logs');
    return data;
  }
};
