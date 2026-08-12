import { useRouter } from 'next/navigation';
import { Trip } from '../domain/trip-types';
import { TripStatusBadge } from '../components/trip-status-badge';
import { TripLifecycleActions } from '../components/trip-lifecycle-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CalendarIcon, MapPinIcon, UserIcon, Edit2 } from 'lucide-react';
import { tripNumberService } from '../services/trip-number.service';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AppLookup } from '@/components/shared/app-lookup';
import { useUpdateTrip } from '../api';
import { useCreateCustomer } from '@/features/customers/api';
import { toast } from 'sonner';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { tripQueryKeys } from '../api';

interface WorkspaceHeaderProps {
  trip: Trip;
}

export function WorkspaceHeader({ trip }: WorkspaceHeaderProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const updateTrip = useUpdateTrip();
  const createCustomerMutation = useCreateCustomer();
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(trip.customer_id || null);
  const [newCustomerName, setNewCustomerName] = useState('');

  const handleAssignCustomer = async () => {
    if (!selectedCustomerId) return;
    try {
      await updateTrip.mutateAsync({ id: trip.id, data: { customer_id: selectedCustomerId } } as any);
      await queryClient.invalidateQueries({ queryKey: tripQueryKeys.detail(trip.id) });
      toast.success('Customer assigned successfully');
      setCustomerDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to assign customer');
    }
  };

  const handleCreateCustomer = async () => {
    if (!newCustomerName.trim()) return;
    try {
      const newCustomer = await createCustomerMutation.mutateAsync({ 
        name: newCustomerName, 
        phone: '9999999999' 
      } as any);
      setSelectedCustomerId(newCustomer.id);
      setNewCustomerName('');
      toast.success(`Customer "${newCustomerName}" created! You can now click Assign.`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create customer');
    }
  };

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
            <Dialog open={customerDialogOpen} onOpenChange={setCustomerDialogOpen}>
              <DialogTrigger className="font-medium text-foreground mr-1 hover:underline hover:text-primary transition-colors flex items-center group">
                {trip.customer?.name || 'No Customer'}
                <Edit2 className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Assign Customer</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Select Existing Customer</Label>
                    <AppLookup 
                      lookupKey="customers" 
                      value={selectedCustomerId || undefined} 
                      onChange={(val) => setSelectedCustomerId(val as string)} 
                      placeholder="Search customers..." 
                      allowCreate={true}
                      onCreate={async (name) => {
                        try {
                          const newCustomer = await createCustomerMutation.mutateAsync({ 
                            name, 
                            phone: '9999999999' 
                          } as any);
                          setSelectedCustomerId(newCustomer.id);
                          toast.success(`Customer "${name}" created successfully.`);
                        } catch (err: any) {
                          toast.error(err.message || 'Failed to create customer');
                        }
                      }}
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or Create New</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">New Customer Name</Label>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Enter name..." 
                        value={newCustomerName}
                        onChange={(e) => setNewCustomerName(e.target.value)}
                      />
                      <Button 
                        type="button" 
                        variant="secondary" 
                        onClick={handleCreateCustomer}
                        disabled={createCustomerMutation.isPending || !newCustomerName.trim()}
                      >
                        {createCustomerMutation.isPending ? 'Creating...' : 'Create'}
                      </Button>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setCustomerDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAssignCustomer} disabled={updateTrip.isPending || !selectedCustomerId}>
                    {updateTrip.isPending ? 'Assigning...' : 'Assign'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
