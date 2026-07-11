import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/admin.api';
import { AdminUserUpdate, SecurityPolicy, SystemSetting } from '../domain/admin.types';

export function useAdminUsers(search?: string) {
  return useQuery({
    queryKey: ['admin', 'users', search],
    queryFn: () => adminApi.getUsers(search),
  });
}

export function useAdminUserUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string, payload: AdminUserUpdate }) => 
      adminApi.updateUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

export function useAdminPasswordReset() {
  return useMutation({
    mutationFn: ({ id, password, force }: { id: string, password: string, force: boolean }) => 
      adminApi.resetPassword(id, password, force),
  });
}

export function useSystemSettings() {
  return useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: () => adminApi.getSettings(),
  });
}

export function useUpdateSystemSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ key, value, category }: { key: string, value: string, category: string }) => 
      adminApi.updateSetting(key, value, category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
    },
  });
}

export function useSecurityPolicy() {
  return useQuery({
    queryKey: ['admin', 'security-policy'],
    queryFn: () => adminApi.getSecurityPolicy(),
  });
}

export function useUpdateSecurityPolicy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<SecurityPolicy>) => adminApi.updateSecurityPolicy(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'security-policy'] });
    }
  });
}

export function useAuditLogs() {
  return useQuery({
    queryKey: ['admin', 'audit-logs'],
    queryFn: () => adminApi.getAuditLogs(),
  });
}
