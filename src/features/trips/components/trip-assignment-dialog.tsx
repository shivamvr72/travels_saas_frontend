import { useState, useEffect } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useCreateDriver } from '@/features/drivers/api';
import { toast } from 'sonner';

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
  const [selectedId, setSelectedId] = useState<string | null>(currentResourceId || null);
  
  // External Driver state
  const [isExternal, setIsExternal] = useState(false);
  const [externalName, setExternalName] = useState('');
  const [externalAgency, setExternalAgency] = useState('');
  const [externalPhone, setExternalPhone] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedId(currentResourceId || null);
      setIsExternal(false);
      setExternalName('');
      setExternalAgency('');
      setExternalPhone('');
    }
  }, [isOpen, currentResourceId]);

  const assignMutation = useTripAssign();
  const createDriverMutation = useCreateDriver();
  const queryClient = useQueryClient();

  const { data: availability, isLoading: isChecking } = useResourceAvailability(
    {
      resourceId: selectedId || '',
      resourceType,
      startDate,
      endDate,
    },
    !!selectedId && !isExternal
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

  const isDriverType = resourceType === 'driver' || resourceType === 'co_driver';

  const handleAssign = async () => {
    if (isExternal && isDriverType) {
      if (!externalName) {
        toast.error('Driver name is required for external drivers');
        return;
      }
      try {
        const newDriver = await createDriverMutation.mutateAsync({
          name: externalName,
          agency_name: externalAgency || undefined,
          phone: externalPhone || undefined,
          is_external: true,
        } as any);

        await assignMutation.mutateAsync({
          id: tripId,
          assignment: {
            [resourceType === 'driver' ? 'driver_id' : 'co_driver_id']: newDriver.id,
          }
        });
        
        queryClient.invalidateQueries({ queryKey: ['trips', tripId] });
        queryClient.invalidateQueries({ queryKey: ['trips'] });
        onClose();
      } catch (error) {
        console.error("Failed to create or assign external driver", error);
      }
    } else {
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
    }
  };

  const isAssigning = assignMutation.isPending || createDriverMutation.isPending;
  const isAssignDisabled = isExternal ? (!externalName || isAssigning) : (!selectedId || isChecking || isAssigning);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {isDriverType && (
            <div className="flex items-center space-x-2 mb-4 bg-muted/50 p-3 rounded-lg border">
              <Switch
                id="external-driver"
                checked={isExternal}
                onCheckedChange={setIsExternal}
              />
              <Label htmlFor="external-driver" className="cursor-pointer">
                External Driver (Other Travels)
              </Label>
            </div>
          )}

          {!isExternal ? (
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Resource</label>
              <AppLookup
                lookupKey={lookupKey}
                value={selectedId || ''}
                onChange={(val) => setSelectedId(val as string)}
                placeholder={`Search for a ${resourceType}...`}
              />
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="space-y-2">
                <Label>Driver Name <span className="text-destructive">*</span></Label>
                <Input 
                  value={externalName}
                  onChange={(e) => setExternalName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar" 
                />
              </div>
              <div className="space-y-2">
                <Label>Other Travels Company</Label>
                <Input 
                  value={externalAgency}
                  onChange={(e) => setExternalAgency(e.target.value)}
                  placeholder="e.g. Patel Travels" 
                />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input 
                  value={externalPhone}
                  onChange={(e) => setExternalPhone(e.target.value)}
                  placeholder="e.g. 9876543210" 
                />
              </div>
            </div>
          )}

          {selectedId && !isExternal && isChecking && (
            <div className="flex items-center text-sm text-muted-foreground p-2">
              <Clock className="mr-2 h-4 w-4 animate-spin" />
              Checking availability...
            </div>
          )}

          {selectedId && !isExternal && availability && !isChecking && (
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
            disabled={isAssignDisabled}
            variant={!isExternal && availability?.status === 'unavailable' ? 'destructive' : 'default'}
          >
            {isAssigning ? 'Assigning...' : (!isExternal && availability?.status === 'unavailable' ? 'Assign Anyway' : 'Assign')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
