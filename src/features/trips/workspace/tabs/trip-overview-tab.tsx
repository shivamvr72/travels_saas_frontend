import { Trip } from '../../domain/trip-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface TripOverviewTabProps {
  trip: Trip;
}

export function TripOverviewTab({ trip }: TripOverviewTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      <Card className="col-span-1 md:col-span-2 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Route Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Origin</p>
              <p className="font-medium">{trip.origin}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Destination</p>
              <p className="font-medium">{trip.destination}</p>
            </div>
          </div>
          
          {trip.route && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Assigned Route Profile</p>
                <p className="font-medium">{trip.route.from_location} to {trip.route.to_location}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Est. Distance: {trip.route.distance_km || trip.distance_km || '—'} km
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Planned Start</p>
            <p className="font-medium">{new Date(trip.start_date).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Expected End</p>
            <p className="font-medium">
              {trip.expected_end_date ? new Date(trip.expected_end_date).toLocaleString() : '—'}
            </p>
          </div>
          <Separator />
          <div>
            <p className="text-sm text-muted-foreground mb-1">Actual Start</p>
            <p className="font-medium">
              {trip.actual_start_date ? new Date(trip.actual_start_date).toLocaleString() : '—'}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Actual End</p>
            <p className="font-medium">
              {trip.actual_end_date ? new Date(trip.actual_end_date).toLocaleString() : '—'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-lg">Remarks & Notes</CardTitle>
        </CardHeader>
        <CardContent>
          {trip.remarks ? (
            <p className="text-sm whitespace-pre-wrap">{trip.remarks}</p>
          ) : (
            <p className="text-sm text-muted-foreground italic">No remarks added.</p>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
