import { useRouter } from 'next/navigation';
import { Trip } from '../domain/trip-types';
import { TripStatusBadge } from '../components/trip-status-badge';
import { TripLifecycleActions } from '../components/trip-lifecycle-actions';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CalendarIcon, MapPinIcon, UserIcon } from 'lucide-react';
import { tripNumberService } from '../services/trip-number.service';

interface WorkspaceHeaderProps {
  trip: Trip;
}

export function WorkspaceHeader({ trip }: WorkspaceHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 bg-card border rounded-lg p-4 shadow-sm">
      <div className="flex flex-col space-y-3">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" onClick={() => router.push('/trips')} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold font-mono tracking-tight">
            {tripNumberService.format(trip.trip_number)}
          </h1>
          <TripStatusBadge status={trip.status} />
          <AppStatusBadge status={trip.priority === 'High' || trip.priority === 'Urgent' ? 'critical' : 'inactive'} fallback={trip.priority} label={trip.priority} showIcon={false} />
        </div>
        
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground ml-11">
          <div className="flex items-center">
            <UserIcon className="mr-1.5 h-4 w-4 text-muted-foreground/70" />
            <span className="font-medium text-foreground mr-1">{trip.customer?.name || 'No Customer'}</span>
          </div>
          
          <div className="flex items-center">
            <MapPinIcon className="mr-1.5 h-4 w-4 text-muted-foreground/70" />
            <span>{trip.route ? `${trip.route.from_location} → ${trip.route.to_location}` : `${trip.origin} → ${trip.destination}`}</span>
          </div>

          <div className="flex items-center">
            <CalendarIcon className="mr-1.5 h-4 w-4 text-muted-foreground/70" />
            <span>{new Date(trip.start_date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center self-end md:self-auto mt-2 md:mt-0">
        <TripLifecycleActions trip={trip} />
      </div>
    </div>
  );
}

// Temporary inline helper until AppStatusBadge allows passing label dynamically
function AppStatusBadge({ status, label, showIcon }: any) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
      status === 'critical' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
    }`}>
      {label}
    </span>
  );
}
