import React from 'react';
import { usePermission } from '@/features/admin/hooks/use-permission';

interface CanProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function Can({ permission, children, fallback = null }: CanProps) {
  const isAllowed = usePermission(permission);
  
  if (!isAllowed) {
    return fallback;
  }
  
  return <>{children}</>;
}
