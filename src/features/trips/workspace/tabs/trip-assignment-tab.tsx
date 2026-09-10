import { Trip } from '../../domain/trip-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PERMISSION_KEYS } from '@/shared/permissions';
import { Can } from '@/shared/permissions/can';
import { Car, User, Users } from 'lucide-react';
import { TripAssignmentDialog } from '../../components/trip-assignment-dialog';
import { ResourceType } from '../../services/resource-availability.service';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tripApi } from '../../api/trip-api';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface TripAssignmentTabProps {
  trip: Trip;
}

export function TripAssignmentTab({ trip }: TripAssignmentTabProps) {
  const queryClient = useQueryClient();
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    resourceType: ResourceType;
    currentId?: string | null;
    isExternal?: boolean;
    currentName?: string;
    externalDetails?: {
      reg_number?: string;
      provider_name?: string;
      provider_phone?: string;
      agreed_rate?: number;
    };
  }>({
    isOpen: false,
    resourceType: 'vehicle',
  });

  const handleOpenDialog = (
    resourceType: ResourceType, 
    currentId?: string | null, 
    isExternal?: boolean, 
    currentName?: string,
    externalDetails?: {
      reg_number?: string;
      provider_name?: string;
      provider_phone?: string;
      agreed_rate?: number;
    }
  ) => {
    setDialogState({ isOpen: true, resourceType, currentId, isExternal, currentName, externalDetails });
  };
  
  const unassignMutation = useMutation({
    mutationFn: () => tripApi.transition(trip.id, 'unassigned'),
    onSuccess: () => {
      toast.success('Trip unassigned successfully');
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['trip', trip.id] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || 'Failed to unassign trip');
    }
  });
  
  const renderAssignmentCard = (
    title: string, 
    icon: React.ReactNode, 
    value: string | undefined, 
    type: ResourceType, 
    currentId?: string | null, 
    isExternal?: boolean,
    subtitle?: string,
    externalDetails?: {
      reg_number?: string;
      provider_name?: string;
      provider_phone?: string;
      agreed_rate?: number;
    }
  ) => (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {icon}
          {title} {isExternal && <span className="text-xs font-normal bg-secondary/50 px-2 py-0.5 rounded-md ml-auto">External</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold">{value || 'Unassigned'}</p>
            {subtitle && value && (
              <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
          <Can permission={PERMISSION_KEYS.TRIPS_ASSIGN}>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleOpenDialog(type, currentId, isExternal, value, externalDetails)}
            >
              {value ? 'Change' : 'Assign'}
            </Button>
          </Can>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Can permission={PERMISSION_KEYS.TRIPS_ASSIGN}>
          {trip.status === 'assigned' && (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => unassignMutation.mutate()}
              disabled={unassignMutation.isPending}
            >
              {unassignMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Unassign Trip
            </Button>
          )}
        </Can>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Vehicle card — shows external hiring info if external hiring is assigned */}
        {(() => {
          const hasExternalHiring = Boolean(trip.external_hiring_id);
          let vehicleLabel: string | undefined;
          let vehicleSubtitle: string | undefined;

          if (hasExternalHiring) {
            // External: primary label = reg number, subtitle = vehicle description + vendor + rate
            const regNo = trip.vehicle?.license_plate || trip.external_hiring?.external_vehicle_reg;
            const vehDesc = trip.external_hiring?.vehicle_description;
            const vendor = trip.external_hiring?.provider_name || 'External Vendor';
            const rateStr = trip.external_hiring?.agreed_rate
              ? `₹${Number(trip.external_hiring.agreed_rate).toLocaleString('en-IN')}`
              : '';

            vehicleLabel = regNo || vehDesc || vendor;

            const subtitleParts = [
              regNo ? vehDesc : null,
              vendor,
              rateStr,
            ].filter(Boolean);

            vehicleSubtitle = subtitleParts.join(' • ');
          } else if (trip.vehicle) {
            // Own-fleet: primary label = reg number, subtitle = make + model
            vehicleLabel = trip.vehicle.license_plate;
            const parts = [trip.vehicle.make, trip.vehicle.model].filter(Boolean);
            vehicleSubtitle = parts.length > 0 ? parts.join(' ') : trip.vehicle.type || undefined;
          }

          const extDetails = hasExternalHiring
            ? {
                reg_number: trip.vehicle?.license_plate || trip.external_hiring?.external_vehicle_reg || '',
                vehicle_description: trip.external_hiring?.vehicle_description || '',
                provider_name: trip.external_hiring?.provider_name || '',
                provider_phone: trip.external_hiring?.provider_phone || '',
                agreed_rate: trip.external_hiring?.agreed_rate ? Number(trip.external_hiring.agreed_rate) : undefined,
              }
            : undefined;

          return renderAssignmentCard(
            'Vehicle',
            <Car className="h-4 w-4" />,
            vehicleLabel,
            'vehicle',
            trip.vehicle_id,
            hasExternalHiring,
            vehicleSubtitle,
            extDetails
          );
        })()}
      {renderAssignmentCard(
        'Primary Driver',
        <User className="h-4 w-4" />,
        trip.driver?.name,
        'driver',
        trip.driver_id,
        trip.driver?.is_external,
        trip.driver?.phone ? `📞 ${trip.driver.phone}` : undefined
      )}
      {renderAssignmentCard(
        'Co-Driver',
        <Users className="h-4 w-4" />,
        trip.co_driver?.name,
        'co_driver',
        trip.co_driver_id,
        trip.co_driver?.is_external,
        trip.co_driver?.phone ? `📞 ${trip.co_driver.phone}` : undefined
      )}
      {renderAssignmentCard('Dispatcher', <User className="h-4 w-4" />, trip.dispatcher?.full_name, 'dispatcher' as any, trip.dispatcher_id)}

      <TripAssignmentDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState(prev => ({ ...prev, isOpen: false }))}
        tripId={trip.id}
        resourceType={dialogState.resourceType}
        currentResourceId={dialogState.currentId}
        currentIsExternal={dialogState.isExternal}
        currentResourceName={dialogState.currentName}
        externalDetails={dialogState.externalDetails}
        startDate={trip.start_date}
        endDate={trip.expected_end_date}
      />
      </div>
    </div>
  );
}
