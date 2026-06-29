import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Ban,
  HelpCircle,
  LucideIcon,
  PlayCircle,
  FileCheck,
  FileWarning,
  FileX,
  CreditCard,
  Banknote,
} from 'lucide-react';

export type StatusVariant =
  | 'active'
  | 'inactive'
  | 'expired'
  | 'expiring_soon'
  | 'upcoming'
  | 'healthy'
  | 'warning'
  | 'critical'
  | 'pending'
  | 'completed'
  | 'cancelled'
  | 'unknown';

export interface StatusConfig {
  variant: StatusVariant;
  label: string;
  icon?: LucideIcon;
}

export const STATUS_CONFIG_MAP: Record<string, StatusConfig> = {
  // Generic / Shared
  active: { variant: 'active', label: 'Active', icon: CheckCircle2 },
  inactive: { variant: 'inactive', label: 'Inactive', icon: XCircle },
  unknown: { variant: 'unknown', label: 'Unknown', icon: HelpCircle },
  
  // Trip Statuses
  draft: { variant: 'inactive', label: 'Draft', icon: FileCheck },
  scheduled: { variant: 'upcoming', label: 'Scheduled', icon: Clock },
  in_progress: { variant: 'active', label: 'In Progress', icon: PlayCircle },
  completed: { variant: 'completed', label: 'Completed', icon: CheckCircle2 },
  cancelled: { variant: 'cancelled', label: 'Cancelled', icon: Ban },
  billed: { variant: 'completed', label: 'Billed', icon: Banknote },
  
  // Payment Statuses
  pending: { variant: 'pending', label: 'Pending', icon: Clock },
  partial: { variant: 'warning', label: 'Partial', icon: CreditCard },
  paid: { variant: 'completed', label: 'Paid', icon: CheckCircle2 },
  overdue: { variant: 'critical', label: 'Overdue', icon: AlertTriangle },
  
  // Document Statuses
  healthy: { variant: 'healthy', label: 'Valid', icon: FileCheck },
  expiring_soon: { variant: 'expiring_soon', label: 'Expiring Soon', icon: FileWarning },
  expired: { variant: 'expired', label: 'Expired', icon: FileX },
  
  // Hiring Statuses
  settled: { variant: 'completed', label: 'Settled', icon: Banknote },
};

export function resolveStatus(
  rawStatus: string | boolean | null | undefined,
  domain?: 'driver' | 'vehicle' | 'trip' | 'payment' | 'document' | 'hiring'
): StatusConfig {
  if (rawStatus === null || rawStatus === undefined) return STATUS_CONFIG_MAP.unknown;
  
  if (typeof rawStatus === 'boolean') {
    rawStatus = rawStatus ? 'active' : 'inactive';
  } else if (typeof rawStatus !== 'string') {
    rawStatus = String(rawStatus);
  }
  
  const normalized = rawStatus.toLowerCase().trim().replace(/\s+/g, '_');
  
  // Domain specific overrides if needed
  if (domain === 'document') {
    if (normalized === 'active') return STATUS_CONFIG_MAP.healthy;
  }
  
  return STATUS_CONFIG_MAP[normalized] || {
    variant: 'unknown',
    label: rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).replace(/_/g, ' '),
    icon: HelpCircle
  };
}
