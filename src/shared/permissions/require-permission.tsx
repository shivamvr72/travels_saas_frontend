'use client';

import { ReactNode } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { hasPermission, Role } from './index';

interface RequirePermissionProps {
  roles: readonly Role[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function RequirePermission({ roles, children, fallback = null }: RequirePermissionProps) {
  const user = useAuthStore((state) => state.user);

  if (!user || !hasPermission(user.role, roles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
