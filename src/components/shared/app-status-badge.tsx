import { cn } from '@/shared/lib/utils';
import { Badge } from '@/components/ui/badge';
import { resolveStatus, StatusVariant } from '@/shared/status/status-config';

interface AppStatusBadgeProps {
  status: string | null | undefined;
  domain?: 'driver' | 'vehicle' | 'trip' | 'payment' | 'document' | 'hiring';
  size?: 'sm' | 'md';
  showIcon?: boolean;
  className?: string;
}

const variantStyles: Record<StatusVariant, string> = {
  active: 'bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 border-emerald-500/20',
  healthy: 'bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 border-emerald-500/20',
  completed: 'bg-indigo-500/15 text-indigo-700 hover:bg-indigo-500/25 border-indigo-500/20',
  
  inactive: 'bg-slate-500/15 text-slate-700 hover:bg-slate-500/25 border-slate-500/20',
  unknown: 'bg-slate-500/15 text-slate-700 hover:bg-slate-500/25 border-slate-500/20',
  
  expired: 'bg-rose-500/15 text-rose-700 hover:bg-rose-500/25 border-rose-500/20',
  critical: 'bg-rose-500/15 text-rose-700 hover:bg-rose-500/25 border-rose-500/20',
  cancelled: 'bg-rose-500/15 text-rose-700 hover:bg-rose-500/25 border-rose-500/20',
  
  expiring_soon: 'bg-amber-500/15 text-amber-700 hover:bg-amber-500/25 border-amber-500/20',
  warning: 'bg-amber-500/15 text-amber-700 hover:bg-amber-500/25 border-amber-500/20',
  pending: 'bg-yellow-500/15 text-yellow-700 hover:bg-yellow-500/25 border-yellow-500/20',
  
  upcoming: 'bg-blue-500/15 text-blue-700 hover:bg-blue-500/25 border-blue-500/20',
};

export function AppStatusBadge({
  status,
  domain,
  size = 'md',
  showIcon = true,
  className
}: AppStatusBadgeProps) {
  const config = resolveStatus(status, domain);
  const Icon = config.icon;
  
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium transition-colors border",
        variantStyles[config.variant],
        size === 'sm' ? "px-1.5 py-0 text-[10px] h-4 leading-none" : "px-2.5 py-0.5 text-xs",
        className
      )}
    >
      {showIcon && Icon && (
        <Icon className={cn(
          "mr-1.5 shrink-0",
          size === 'sm' ? "w-3 h-3" : "w-3.5 h-3.5"
        )} />
      )}
      {config.label}
    </Badge>
  );
}
