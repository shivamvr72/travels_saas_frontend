import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { AppLookup } from '@/components/shared/app-lookup';
import { useResourceAvailability } from '../hooks/use-resource-availability';
import { useTripAssign } from '../api';
import { ResourceType } from '../services/resource-availability.service';
import { AlertCircle, CheckCircle2, Clock, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TripAssignmentDialogProps {
  tripId: string;
  resourceType: ResourceType;
  currentResourceId?: string | null;
  startDate: string;
  endDate?: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TripAssignmentDialog({
  tripId,
  resourceType,
  currentResourceId,
  startDate,
  endDate,
  isOpen,
  onClose,
}: TripAssignmentDialogProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const assignMutation = useTripAssign();
  const queryClient = useQueryClient();

  const { data: availability, isLoading: isChecking } = useResourceAvailability(
    {
      resourceId: selectedId || '',
      resourceType,
      startDate,
      endDate,
    },
    !!selectedId
  );

  // Map resourceType to lookup key
  const lookupKey = 
    resourceType === 'vehicle' ? 'vehicles' :
    resourceType === 'driver' ? 'drivers' :
    resourceType === 'co_driver' ? 'drivers' : 'dispatchers';

  const title = `Assign ${
    resourceType === 'co_driver' ? 'Co-Driver' : 
    resourceType.charAt(0).toUpperCase() + resourceType.slice(1)
  }`;

  const handleAssign = () => {
    if (!selectedId) return;

    assignMutation.mutate(
      {
        id: tripId,
        assignment: {
          [resourceType === 'driver' ? 'driver_id' : resourceType === 'co_driver' ? 'co_driver_id' : resourceType === 'vehicle' ? 'vehicle_id' : 'dispatcher_id']: selectedId,
        }
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['trips', tripId] });
          queryClient.invalidateQueries({ queryKey: ['trips'] });
          onClose();
          setSelectedId(null);
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Resource</label>
            <AppLookup
              lookupKey={lookupKey}
              value={selectedId || ''}
              onChange={(val) => setSelectedId(val as string)}
              placeholder={`Search for a ${resourceType}...`}
            />
          </div>

          {selectedId && isChecking && (
            <div className="flex items-center text-sm text-muted-foreground p-2">
              <Clock className="mr-2 h-4 w-4 animate-spin" />
              Checking availability...
            </div>
          )}

          {selectedId && availability && !isChecking && (
            <div className="mt-4">
              {availability.status === 'available' && (
                <Alert className="border-green-200 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription>
                    Resource is available for the selected dates.
                  </AlertDescription>
                </Alert>
              )}
              {availability.status === 'busy' && (
                <Alert className="border-amber-200 bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800">
                  <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <AlertDescription>
                    {availability.message || 'Resource is busy during this time.'}
                  </AlertDescription>
                </Alert>
              )}
              {availability.status === 'unavailable' && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {availability.message || 'Resource is unavailable.'}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleAssign} 
            disabled={!selectedId || isChecking || assignMutation.isPending}
            variant={availability?.status === 'unavailable' ? 'destructive' : 'default'}
          >
            {assignMutation.isPending ? 'Assigning...' : (availability?.status === 'unavailable' ? 'Assign Anyway' : 'Assign')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
