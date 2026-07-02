import { AppStatusBadge } from '@/components/shared/app-status-badge';
import { TripStatus } from '../domain/trip-types';

interface TripStatusBadgeProps {
  status: TripStatus | string | null | undefined;
  size?: 'sm' | 'md';
  showIcon?: boolean;
  className?: string;
}

export function TripStatusBadge({ status, size = 'md', showIcon = true, className }: TripStatusBadgeProps) {
  return (
    <AppStatusBadge
      status={status}
      domain="trip"
      size={size}
      showIcon={showIcon}
      className={className}
    />
  );
}
