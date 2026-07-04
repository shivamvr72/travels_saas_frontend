import { Trip } from '../domain/trip-types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { TripStatusBadge } from './trip-status-badge';
import { AppStatusBadge } from '@/components/shared/app-status-badge';
import { MapPin, User, Car, Calendar, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { tripNumberService } from '../services/trip-number.service';
import { cn } from '@/shared/lib/utils';

interface TripCardProps {
  trip: Trip;
  isSelected?: boolean;
  onSelect?: (checked: boolean) => void;
  selectable?: boolean;
}

export function TripCard({ trip, isSelected, onSelect, selectable }: TripCardProps) {
  const router = useRouter();
  const priorityColors: Record<string, 'inactive' | 'upcoming' | 'warning' | 'critical'> = {
    'Low': 'inactive',
    'Normal': 'upcoming',
    'High': 'warning',
    'Urgent': 'critical'
  };

  return (
    <Card 
      onClick={() => router.push(`/trips/${trip.id}`)}
      className={cn(
        "group relative overflow-hidden transition-all hover:shadow-md cursor-pointer",
        isSelected && "ring-2 ring-primary border-primary"
      )}
    >
      {selectable && onSelect && (
        <div className="absolute top-3 right-3 z-10">
          <input 
            type="checkbox" 
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            checked={isSelected}
            onChange={(e) => onSelect(e.target.checked)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <CardHeader className="p-4 pb-2 border-b bg-muted/20">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link 
              href={`/trips/${trip.id}`} 
              className="text-sm font-mono font-medium text-primary hover:underline"
            >
              {tripNumberService.format(trip.trip_number)}
            </Link>
            <div className="text-xs text-muted-foreground mt-0.5">
              {trip.customer?.name || 'No Customer'}
            </div>
          </div>
          <TripStatusBadge status={trip.status} size="sm" />
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Route */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center justify-center shrink-0">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="w-0.5 h-3 bg-border" />
            <div className="w-2 h-2 rounded-full border-2 border-primary bg-background" />
          </div>
          <div className="flex flex-col gap-1 text-sm flex-1 min-w-0">
            <span className="font-medium truncate" title={trip.route?.from_location || trip.origin}>
              {trip.route?.from_location || trip.origin}
            </span>
            <span className="text-muted-foreground truncate" title={trip.route?.to_location || trip.destination}>
              {trip.route?.to_location || trip.destination}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{format(new Date(trip.start_date), 'MMM d, yyyy')}</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-muted-foreground justify-end">
            <AppStatusBadge 
              status={priorityColors[trip.priority] || 'inactive'} 
              size="sm" 
              showIcon={false}
            >
              {trip.priority} Priority
            </AppStatusBadge>
          </div>
        </div>

        <div className="pt-3 border-t grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <Car className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="truncate font-medium">{trip.vehicle?.license_plate || 'Unassigned'}</span>
          </div>
          <div className="flex items-center gap-1.5 justify-end">
            <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="truncate font-medium">{trip.driver?.name || 'Unassigned'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
