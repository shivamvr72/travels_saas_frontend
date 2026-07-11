import { Trip } from '../../domain/trip-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PERMISSION_KEYS } from '@/shared/permissions';
import { Can } from '@/shared/permissions/can';
import { Car, User, Users } from 'lucide-react';
import { TripAssignmentDialog } from '../../components/trip-assignment-dialog';
import { ResourceType } from '../../services/resource-availability.service';
import { useState } from 'react';

interface TripAssignmentTabProps {
  trip: Trip;
}

export function TripAssignmentTab({ trip }: TripAssignmentTabProps) {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    resourceType: ResourceType;
    currentId?: string | null;
  }>({
    isOpen: false,
    resourceType: 'vehicle',
  });

  const handleOpenDialog = (resourceType: ResourceType, currentId?: string | null) => {
    setDialogState({ isOpen: true, resourceType, currentId });
  };
  
  const renderAssignmentCard = (title: string, icon: React.ReactNode, value: string | undefined, type: ResourceType, currentId?: string | null) => (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <p className="font-semibold">{value || 'Unassigned'}</p>
          <Can permission={PERMISSION_KEYS.TRIPS_ASSIGN}>
            <Button variant="outline" size="sm" onClick={() => handleOpenDialog(type, currentId)}>
              {value ? 'Change' : 'Assign'}
            </Button>
          </Can>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {renderAssignmentCard('Vehicle', <Car className="h-4 w-4" />, trip.vehicle?.license_plate, 'vehicle', trip.vehicle_id)}
      {renderAssignmentCard('Primary Driver', <User className="h-4 w-4" />, trip.driver?.name, 'driver', trip.driver_id)}
      {renderAssignmentCard('Co-Driver', <Users className="h-4 w-4" />, trip.co_driver?.name, 'co_driver', trip.co_driver_id)}
      {renderAssignmentCard('Dispatcher', <User className="h-4 w-4" />, trip.dispatcher?.full_name, 'dispatcher' as any, trip.dispatcher_id)}

      <TripAssignmentDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState(prev => ({ ...prev, isOpen: false }))}
        tripId={trip.id}
        resourceType={dialogState.resourceType}
        currentResourceId={dialogState.currentId}
        startDate={trip.start_date}
        endDate={trip.expected_end_date}
      />
    </div>
  );
}
