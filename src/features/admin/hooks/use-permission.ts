import { useMemo } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { PermissionService } from '../services/permission.service';
import { Role } from '@/shared/permissions';

export function usePermission(key: string): boolean {
  const user = useAuthStore(state => state.user);
  
  // Memoize the service instance per role
  const permissionService = useMemo(() => {
    return new PermissionService((user?.role as Role) || 'viewer');
  }, [user?.role]);

  return useMemo(() => permissionService.can(key), [permissionService, key]);
}

export function usePermissions(): PermissionService {
  const user = useAuthStore(state => state.user);
  
  return useMemo(() => {
    return new PermissionService((user?.role as Role) || 'viewer');
  }, [user?.role]);
}
