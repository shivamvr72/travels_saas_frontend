import { Trip } from '../../domain/trip-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface TripOverviewTabProps {
  trip: Trip;
}

export function TripOverviewTab({ trip }: TripOverviewTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      {/* 1. Trip Classification & Client Details */}
      <Card className="col-span-1 lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">Trip Classification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Trip Type</p>
              <p className="font-medium">{trip.trip_type}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Priority</p>
              <p className="font-medium">{trip.priority}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Booking Ref</p>
              <p className="font-medium">{trip.booking_reference || '—'}</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Customer</p>
              <p className="font-medium">{trip.customer?.name || '—'}</p>
              {trip.customer?.phone && <p className="text-sm text-muted-foreground">{trip.customer.phone}</p>}
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Company</p>
              <p className="font-medium">{trip.company?.name || '—'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Route & Schedule */}
      <Card className="col-span-1 lg:col-span-1">
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

          <Separator />
          <div className="grid grid-cols-2 gap-4">
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
          </div>
        </CardContent>
      </Card>

      {/* 3. Resources (Vehicle, Drivers, External) */}
      <Card className="col-span-1 lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">Assigned Resources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {trip.external_hiring ? (
            <div className="p-3 bg-muted/50 rounded-md border border-border space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-primary">External Hiring</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Provider</p>
                <p className="font-medium">{trip.external_hiring.provider_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Vehicle Details</p>
                <p className="font-medium">{trip.external_hiring.external_vehicle_reg}</p>
                {trip.external_hiring.vehicle_description && (
                  <p className="text-xs text-muted-foreground">{trip.external_hiring.vehicle_description}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Driver</p>
                <p className="font-medium">{trip.external_hiring.external_driver_name}</p>
              </div>
            </div>
          ) : (
            <>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Vehicle</p>
                <p className="font-medium">
                  {trip.vehicle ? `${trip.vehicle.license_plate} - ${trip.vehicle.make} ${trip.vehicle.model}` : '—'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Primary Driver</p>
                <p className="font-medium">
                  {trip.driver ? trip.driver.name : '—'}
                  {trip.driver?.phone && <span className="text-muted-foreground text-sm ml-2">({trip.driver.phone})</span>}
                </p>
              </div>
              {trip.co_driver && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Co-Driver</p>
                  <p className="font-medium">{trip.co_driver.name}</p>
                </div>
              )}
            </>
          )}

          <Separator />
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">Dispatcher</p>
            <p className="font-medium">{trip.dispatcher?.full_name || '—'}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-lg">Actual Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            <div>
              <p className="text-sm text-muted-foreground mb-1">Actual Distance</p>
              <p className="font-medium">
                {trip.distance_km ? `${trip.distance_km} km` : '—'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <p className="font-medium capitalize">{trip.status}</p>
            </div>
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
