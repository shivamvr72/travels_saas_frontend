import { TripStatus } from './trip-types';
import { LucideIcon, FileCheck, CalendarCheck, Users, Send, PlayCircle, CheckCircle2, Lock, Ban, Edit3 } from 'lucide-react';

export interface TripActionDef {
  targetStatus: TripStatus;
  label: string;
  icon: LucideIcon;
  variant: 'default' | 'destructive' | 'outline' | 'secondary';
  requiresConfirmation: boolean;
}

export const TRIP_ACTIONS_MAP: Record<TripStatus, TripActionDef> = {
  draft: { targetStatus: 'draft', label: 'Draft', icon: FileCheck, variant: 'outline', requiresConfirmation: false },
  assigned: { targetStatus: 'assigned', label: 'Assigned', icon: Users, variant: 'outline', requiresConfirmation: false },
  dispatched: { targetStatus: 'dispatched', label: 'Dispatch Trip', icon: Send, variant: 'default', requiresConfirmation: true },
  started: { targetStatus: 'started', label: 'Start Trip', icon: PlayCircle, variant: 'default', requiresConfirmation: true },
  completed: { targetStatus: 'completed', label: 'Complete Trip', icon: CheckCircle2, variant: 'default', requiresConfirmation: true },
  cancelled: { targetStatus: 'cancelled', label: 'Cancel Trip', icon: Ban, variant: 'destructive', requiresConfirmation: true },
};

export function getActionDef(target: TripStatus, currentStatus?: TripStatus): TripActionDef {
  const def = { ...TRIP_ACTIONS_MAP[target] };
  return def;
}
