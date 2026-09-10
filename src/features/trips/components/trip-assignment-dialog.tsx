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
import { useTripAssign, useTripAssignExternalVehicle, useTripAssignExternalDriver } from '../api';
import { ResourceType } from '../services/resource-availability.service';
import { AlertCircle, CheckCircle2, Clock, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface TripAssignmentDialogProps {
  tripId: string;
  resourceType: ResourceType;
  currentResourceId?: string | null;
  currentIsExternal?: boolean;
  currentResourceName?: string;
  /** Pre-fill data from an existing external hiring record */
  externalDetails?: {
    reg_number?: string;
    vehicle_description?: string;
    provider_name?: string;
    provider_phone?: string;
    agreed_rate?: number;
  };
  startDate: string;
  endDate?: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TripAssignmentDialog({
  tripId,
  resourceType,
  currentResourceId,
  currentIsExternal,
  currentResourceName,
  externalDetails,
  startDate,
  endDate,
  isOpen,
  onClose,
}: TripAssignmentDialogProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // External Driver state
  const [isExternal, setIsExternal] = useState(false);
  const [externalName, setExternalName] = useState('');
  const [externalAgency, setExternalAgency] = useState('');
  const [externalPhone, setExternalPhone] = useState('');

  // External Vehicle state
  const [externalVehicleReg, setExternalVehicleReg] = useState('');
  const [externalVehicleName, setExternalVehicleName] = useState('');
  const [externalAgreedRate, setExternalAgreedRate] = useState('');

  useEffect(() => {
    if (isOpen) {
      const isExt = currentIsExternal || false;
      setIsExternal(isExt);
      setSelectedId(isExt ? null : (currentResourceId || null));

      // Use primitive values from externalDetails to avoid object reference issues
      const extReg = externalDetails?.reg_number;
      const extDesc = externalDetails?.vehicle_description;
      const extName = externalDetails?.provider_name;
      const extPhone = externalDetails?.provider_phone;
      const extRate = externalDetails?.agreed_rate;
      const hasExtDetails = isExt && (extReg != null || extName != null || extDesc != null);

      if (hasExtDetails) {
        // Pre-populate fields from existing external hiring
        setExternalVehicleReg(extReg || '');
        setExternalVehicleName(extDesc || '');
        setExternalName(extName || '');
        setExternalPhone(extPhone || '');
        setExternalAgreedRate(extRate != null ? String(extRate) : '');
      } else {
        setExternalName(isExt ? (currentResourceName || '') : '');
        setExternalPhone('');
        setExternalVehicleReg('');
        setExternalVehicleName('');
        setExternalAgreedRate('');
      }
      setExternalAgency('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isOpen,
    currentResourceId,
    currentIsExternal,
    currentResourceName,
    externalDetails?.reg_number,
    externalDetails?.vehicle_description,
    externalDetails?.provider_name,
    externalDetails?.provider_phone,
    externalDetails?.agreed_rate,
  ]);

  const assignMutation = useTripAssign();
  const assignExternalVehicleMutation = useTripAssignExternalVehicle();
  const assignExternalDriverMutation = useTripAssignExternalDriver();
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
      if (currentIsExternal && externalName === currentResourceName && !externalAgency && !externalPhone) {
        // They didn't change anything, just close the dialog to avoid creating a duplicate
        onClose();
        return;
      }
      if (externalPhone && !/^\+?[0-9\s\-()]{7,15}$/.test(externalPhone)) {
        toast.error('Please enter a valid phone number');
        return;
      }
      try {
        await assignExternalDriverMutation.mutateAsync({
          id: tripId,
          payload: {
            name: externalName,
            phone: externalPhone || undefined,
            agency_name: externalAgency || undefined,
            is_co_driver: resourceType === 'co_driver',
          }
        });
        
        onClose();
      } catch (error: any) {
        console.error("Failed to assign external driver", error);
        const detail = error?.response?.data?.detail || error?.response?.data?.message || error.message || "Failed to assign driver";
        toast.error(detail);
      }
    } else if (isExternal && resourceType === 'vehicle') {
      if (!externalVehicleReg || !externalName || !externalAgreedRate) {
        toast.error('Vehicle Reg, Provider Name, and Agreed Rate are required');
        return;
      }
      if (externalPhone && !/^\+?[0-9\s\-()]{7,15}$/.test(externalPhone)) {
        toast.error('Please enter a valid phone number');
        return;
      }
      try {
        await assignExternalVehicleMutation.mutateAsync({
          id: tripId,
          payload: {
            reg_number: externalVehicleReg,
            vehicle_description: externalVehicleName || undefined,
            provider_name: externalName,
            provider_phone: externalPhone || undefined,
            agreed_rate: parseFloat(externalAgreedRate),
            start_date: startDate,
          }
        });
        
        onClose();
      } catch (error: any) {
        console.error("Failed to assign external vehicle", error);
        const detail = error?.response?.data?.detail || error?.response?.data?.message || error.message || "Failed to assign vehicle";
        toast.error(detail);
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
          onError: (error: any) => {
            toast.error(error?.response?.data?.message || error.message || 'Failed to assign resource');
          },
        }
      );
    }
  };

  const isAssigning = assignMutation.isPending || assignExternalVehicleMutation.isPending || assignExternalDriverMutation.isPending;
  const isAssignDisabled = isExternal 
    ? (resourceType === 'vehicle' ? (!externalVehicleReg || !externalName || !externalAgreedRate || isAssigning) : (!externalName || isAssigning)) 
    : (!selectedId || isChecking || isAssigning);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {(isDriverType || resourceType === 'vehicle') && (
            <div className="flex items-center space-x-2 mb-4 bg-muted/50 p-3 rounded-lg border">
              <Switch
                id="external-resource"
                checked={isExternal}
                onCheckedChange={setIsExternal}
              />
              <Label htmlFor="external-resource" className="cursor-pointer">
                {isDriverType ? 'External Driver (Other Travels)' : 'External Vehicle (Hired from Vendor)'}
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
              {resourceType === 'vehicle' && (
                <>
                  <div className="space-y-2">
                    <Label>Vehicle Registration <span className="text-destructive">*</span></Label>
                    <Input 
                      value={externalVehicleReg}
                      onChange={(e) => setExternalVehicleReg(e.target.value)}
                      placeholder="e.g. MH 12 AB 1234" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Vehicle Name / Model</Label>
                    <Input 
                      value={externalVehicleName}
                      onChange={(e) => setExternalVehicleName(e.target.value)}
                      placeholder="e.g. Innova Crysta, Bus 40 Seater" 
                    />
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label>{resourceType === 'vehicle' ? 'Vendor Name' : 'Driver Name'} <span className="text-destructive">*</span></Label>
                <Input 
                  value={externalName}
                  onChange={(e) => setExternalName(e.target.value)}
                  placeholder={resourceType === 'vehicle' ? "e.g. Patel Travels" : "e.g. Ramesh Kumar"} 
                />
              </div>
              {isDriverType && (
                <div className="space-y-2">
                  <Label>Other Travels Company</Label>
                  <Input 
                    value={externalAgency}
                    onChange={(e) => setExternalAgency(e.target.value)}
                    placeholder="e.g. Patel Travels" 
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label>{resourceType === 'vehicle' ? 'Vendor Phone' : 'Phone Number'}</Label>
                <Input 
                  value={externalPhone}
                  onChange={(e) => setExternalPhone(e.target.value)}
                  placeholder="e.g. 9876543210" 
                />
              </div>
              {resourceType === 'vehicle' && (
                <div className="space-y-2">
                  <Label>Agreed Trip Rate <span className="text-destructive">*</span></Label>
                  <Input 
                    type="number"
                    min="0"
                    step="0.01"
                    value={externalAgreedRate}
                    onChange={(e) => setExternalAgreedRate(e.target.value)}
                    placeholder="e.g. 5000" 
                  />
                </div>
              )}
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
