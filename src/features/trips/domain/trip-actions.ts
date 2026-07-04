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
  pending: { targetStatus: 'pending', label: 'Revert to Pending', icon: FileCheck, variant: 'outline', requiresConfirmation: false },
  in_progress: { targetStatus: 'in_progress', label: 'Dispatch Trip', icon: Send, variant: 'default', requiresConfirmation: false },
  completed: { targetStatus: 'completed', label: 'Complete Trip', icon: CheckCircle2, variant: 'default', requiresConfirmation: true },
  billed: { targetStatus: 'billed', label: 'Mark as Billed', icon: Edit3, variant: 'secondary', requiresConfirmation: true },
  paid: { targetStatus: 'paid', label: 'Mark as Paid', icon: CheckCircle2, variant: 'default', requiresConfirmation: true },
  cancelled: { targetStatus: 'cancelled', label: 'Cancel Trip', icon: Ban, variant: 'destructive', requiresConfirmation: true },
};

export function getActionDef(target: TripStatus, currentStatus?: TripStatus): TripActionDef {
  const def = { ...TRIP_ACTIONS_MAP[target] };
  if (currentStatus === 'paid' && target === 'billed') {
    def.label = 'Revert to Billed';
    def.variant = 'outline';
  }
  return def;
}
