import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AppLookup } from '@/components/shared/app-lookup';
import { X } from 'lucide-react';
import { TripStatus, TripType, TripPriority } from '../domain/trip-types';
import { resolveStatus } from '@/shared/status/status-config';

interface TripFilterBarProps {
  filters: Record<string, any>;
  onUpdateFilter: (key: any, value: any) => void;
  onReset: () => void;
  isOpen: boolean;
}

const TRIP_TYPES: { label: string; value: TripType }[] = [
  { label: 'One Way', value: 'One Way' },
  { label: 'Round Trip', value: 'Round Trip' },
  { label: 'Multi-Stop', value: 'Multi-Stop' },
  { label: 'Local', value: 'Local' },
  { label: 'Outstation', value: 'Outstation' },
];

const PRIORITIES: { label: string; value: TripPriority }[] = [
  { label: 'Low', value: 'Low' },
  { label: 'Normal', value: 'Normal' },
  { label: 'High', value: 'High' },
  { label: 'Urgent', value: 'Urgent' },
];

const TRIP_STATUS_LIST: TripStatus[] = [
  'draft', 'planned', 'assigned', 'dispatched', 'in_progress', 'completed', 'closed', 'cancelled'
];

export function TripFilterBar({ filters, onUpdateFilter, onReset, isOpen }: TripFilterBarProps) {
  if (!isOpen) return null;

  return (
    <div className="p-4 bg-muted/30 border-b border-border/40 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 animate-in fade-in slide-in-from-top-4 duration-200">
      
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Status</label>
        <Select 
          value={filters.status || ''} 
          onValueChange={(val) => onUpdateFilter('status', val)}
        >
          <SelectTrigger className="h-8 text-sm">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Statuses</SelectItem>
            {TRIP_STATUS_LIST.map(status => (
              <SelectItem key={status} value={status}>
                {resolveStatus(status, 'trip').label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Trip Type</label>
        <Select 
          value={filters.trip_type || ''} 
          onValueChange={(val) => onUpdateFilter('trip_type', val)}
        >
          <SelectTrigger className="h-8 text-sm">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            {TRIP_TYPES.map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Priority</label>
        <Select 
          value={filters.priority || ''} 
          onValueChange={(val) => onUpdateFilter('priority', val)}
        >
          <SelectTrigger className="h-8 text-sm">
            <SelectValue placeholder="All Priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Priorities</SelectItem>
            {PRIORITIES.map(priority => (
              <SelectItem key={priority.value} value={priority.value}>
                {priority.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Customer</label>
        <AppLookup
          lookupKey="customers"
          value={filters.customer_id || ''}
          onChange={(val) => onUpdateFilter('customer_id', val)}
          placeholder="Filter by customer..."
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Vehicle</label>
        <AppLookup
          lookupKey="vehicles"
          value={filters.vehicle_id || ''}
          onChange={(val) => onUpdateFilter('vehicle_id', val)}
          placeholder="Filter by vehicle..."
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Driver</label>
        <AppLookup
          lookupKey="drivers"
          value={filters.driver_id || ''}
          onChange={(val) => onUpdateFilter('driver_id', val)}
          placeholder="Filter by driver..."
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Company</label>
        <AppLookup
          lookupKey="companies"
          value={filters.company_id || ''}
          onChange={(val) => onUpdateFilter('company_id', val)}
          placeholder="Filter by company..."
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Route</label>
        <AppLookup
          lookupKey="routes"
          value={filters.route_id || ''}
          onChange={(val) => onUpdateFilter('route_id', val)}
          placeholder="Filter by route..."
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Dispatcher</label>
        <AppLookup
          lookupKey="dispatchers"
          value={filters.dispatcher_id || ''}
          onChange={(val) => onUpdateFilter('dispatcher_id', val)}
          placeholder="Filter by dispatcher..."
        />
      </div>

      <div className="flex items-end h-full pt-1.5 pb-0">
        <Button 
          variant="ghost" 
          onClick={onReset} 
          className="h-8 w-full text-muted-foreground hover:text-foreground"
          disabled={Object.keys(filters).length === 0}
        >
          <X className="h-4 w-4 mr-2" />
          Clear All Filters
        </Button>
      </div>
    </div>
  );
}
