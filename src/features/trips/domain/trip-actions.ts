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
  draft: { targetStatus: 'draft', label: 'Revert to Draft', icon: FileCheck, variant: 'outline', requiresConfirmation: false },
  planned: { targetStatus: 'planned', label: 'Plan Trip', icon: CalendarCheck, variant: 'secondary', requiresConfirmation: false },
  assigned: { targetStatus: 'assigned', label: 'Assign', icon: Users, variant: 'secondary', requiresConfirmation: false },
  dispatched: { targetStatus: 'dispatched', label: 'Dispatch', icon: Send, variant: 'default', requiresConfirmation: true },
  in_progress: { targetStatus: 'in_progress', label: 'Start Trip', icon: PlayCircle, variant: 'default', requiresConfirmation: false },
  completed: { targetStatus: 'completed', label: 'Complete Trip', icon: CheckCircle2, variant: 'default', requiresConfirmation: true },
  closed: { targetStatus: 'closed', label: 'Close', icon: Lock, variant: 'default', requiresConfirmation: true },
  cancelled: { targetStatus: 'cancelled', label: 'Cancel Trip', icon: Ban, variant: 'destructive', requiresConfirmation: true },
};

export function getActionDef(target: TripStatus): TripActionDef {
  return TRIP_ACTIONS_MAP[target];
}
