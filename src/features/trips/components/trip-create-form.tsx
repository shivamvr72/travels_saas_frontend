'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { TripFormValues, tripSchema } from '../schemas/trip-schema';
import { useCreateTrip } from '../api';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppLookup } from '@/components/shared/app-lookup';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useCreateDriver } from '@/features/drivers/api';
import { useCreateCustomer } from '@/features/customers/api';
import { toast } from 'sonner';

export function TripCreateForm() {
  const router = useRouter();
  const createTrip = useCreateTrip();
  const createDriverMutation = useCreateDriver();
  const createCustomerMutation = useCreateCustomer();

  const form = useForm<TripFormValues>({
    mode: 'onChange',
    resolver: zodResolver(tripSchema) as any,
    defaultValues: {
      trip_type: 'One Way',
      priority: 'Normal',
      booking_reference: '',
      remarks: '',
      start_date: new Date().toISOString().split('T')[0],
      expected_end_date: '',
      origin: '',
      destination: '',
      distance_km: undefined,
      estimated_duration_mins: undefined,
      route_id: '',
      company_id: '',
      customer_id: '',
      vehicle_id: '',
      driver_id: '',
      co_driver_id: '',
      dispatcher_id: '',
      isExternalDriver: false,
      external_driver_name: '',
      external_agency_name: '',
      external_driver_phone: '',
    },
  });

  const isExternal = form.watch('isExternalDriver');

  const onSubmit = async (data: TripFormValues) => {
    try {
      let finalDriverId = data.driver_id;
      
      // If external driver is selected, create the driver record first
      if (data.isExternalDriver && data.external_driver_name) {
        const extDriver = await createDriverMutation.mutateAsync({
          name: data.external_driver_name,
          agency_name: data.external_agency_name || null,
          phone: data.external_driver_phone || '9999999999',
          is_external: true,
          license_no: `EXT-${Date.now()}` // Dummy license for external
        });
        finalDriverId = extDriver.id;
      }

      // We override the driver_id in data so the backend gets it
      const payload = { ...data, driver_id: finalDriverId };

      const result = await createTrip.mutateAsync(payload as any);
      toast.success(`Trip ${result.trip_number || 'created'} successfully`);
      router.push(`/trips/${result.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create trip');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 max-w-5xl mx-auto pb-10 pt-4">
        
        <FormSection 
          title="Trip Identity" 
          description="Basic details and classifications for this trip."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            <FormField
              control={form.control}
              name="trip_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trip Type *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ''}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="One Way">One Way</SelectItem>
                      <SelectItem value="Round Trip">Round Trip</SelectItem>
                      <SelectItem value="Multi-Stop">Multi-Stop</SelectItem>
                      <SelectItem value="Local">Local</SelectItem>
                      <SelectItem value="Outstation">Outstation</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ''}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="booking_reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Booking Reference</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. BKG-12345" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Remarks</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any special instructions..." {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        <FormSection 
          title="Schedule & Geography" 
          description="Specify when and where this trip will take place."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expected_end_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected End Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="origin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Origin *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. Mumbai" 
                      {...field} 
                      onChange={(e) => {
                        field.onChange(e);
                        form.setValue('route_id', '');
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. Pune" 
                      {...field} 
                      onChange={(e) => {
                        field.onChange(e);
                        form.setValue('route_id', '');
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        <FormSection 
          title="Route & Parties" 
          description="Select predefined routes, companies, and the customer associated with this trip."
        >
          <div className="grid grid-cols-1 gap-x-6 gap-y-5">
            <FormField
              control={form.control}
              name="route_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Route</FormLabel>
                  <FormControl>
                    <AppLookup 
                      lookupKey="routes" 
                      value={field.value || undefined} 
                      onChange={field.onChange} 
                      onSelectRecord={(route) => {
                        if (route) {
                          form.setValue('origin', (route.from_location as string) || '');
                          form.setValue('destination', (route.to_location as string) || '');
                          if (route.total_km) {
                            form.setValue('distance_km', Number(route.total_km));
                          }
                        }
                      }}
                      placeholder="Select route..." 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              <FormField
                control={form.control}
                name="company_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <AppLookup 
                        lookupKey="companies" 
                        value={field.value || undefined} 
                        onChange={field.onChange} 
                        placeholder="Select company..." 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customer_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer</FormLabel>
                    <FormControl>
                      <AppLookup 
                        lookupKey="customers" 
                        value={field.value || undefined} 
                        onChange={field.onChange} 
                        placeholder="Select customer..." 
                        allowCreate={true}
                        onCreate={async (name) => {
                          try {
                            const newCustomer = await createCustomerMutation.mutateAsync({ 
                              name, 
                              phone: '9999999999' 
                            } as any);
                            field.onChange(newCustomer.id);
                            toast.success(`Customer "${name}" created successfully.`);
                          } catch (err: any) {
                            toast.error(err.message || 'Failed to create customer');
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </FormSection>

        <FormSection 
          title="Resources" 
          description="Assign the vehicle, drivers, and dispatcher."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            <FormField
              control={form.control}
              name="vehicle_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle *</FormLabel>
                  <FormControl>
                    <AppLookup 
                      lookupKey="vehicles" 
                      value={field.value || undefined} 
                      onChange={field.onChange} 
                      placeholder="Select vehicle..." 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="driver_id"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <FormLabel>Primary Driver {isExternal ? '' : '*'}</FormLabel>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is-external"
                        checked={isExternal}
                        onCheckedChange={(checked) => {
                          form.setValue('isExternalDriver', checked);
                          if (checked) {
                            form.setValue('driver_id', '');
                          } else {
                            form.setValue('external_driver_name', '');
                            form.setValue('external_agency_name', '');
                            form.setValue('external_driver_phone', '');
                          }
                        }}
                      />
                      <Label htmlFor="is-external" className="text-xs font-normal text-muted-foreground">External Driver</Label>
                    </div>
                  </div>

                  {!isExternal ? (
                    <FormControl>
                      <AppLookup 
                        lookupKey="drivers" 
                        value={field.value || undefined} 
                        onChange={field.onChange} 
                        placeholder="Select driver..." 
                      />
                    </FormControl>
                  ) : (
                    <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border/50">
                      <FormField
                        control={form.control}
                        name="external_driver_name"
                        render={({ field: nameField }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Driver Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter driver name" {...nameField} value={nameField.value || ''} className="bg-background" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="external_agency_name"
                        render={({ field: agencyField }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Other Travels Company</FormLabel>
                            <FormControl>
                              <Input placeholder="Agency name (optional)" {...agencyField} value={agencyField.value || ''} className="bg-background" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="external_driver_phone"
                        render={({ field: phoneField }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Phone (optional)" {...phoneField} value={phoneField.value || ''} className="bg-background" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="co_driver_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Co-Driver</FormLabel>
                  <FormControl>
                    <AppLookup 
                      lookupKey="drivers" 
                      value={field.value || undefined} 
                      onChange={field.onChange} 
                      placeholder="Select co-driver..." 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dispatcher_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dispatcher</FormLabel>
                  <FormControl>
                    <AppLookup 
                      lookupKey="dispatchers" 
                      value={field.value || undefined} 
                      onChange={field.onChange} 
                      placeholder="Select dispatcher..." 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        <div className="flex justify-end gap-3 pt-6 border-t border-border mt-10">
          <Button type="button" variant="outline" onClick={() => router.back()} className="w-24">Cancel</Button>
          <Button type="submit" disabled={createTrip.isPending} className="w-32">
            {createTrip.isPending ? 'Creating...' : 'Create Trip'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

function FormSection({ title, description, children }: { title: string, description: string, children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
      <div className="md:col-span-1 space-y-2">
        <h3 className="text-lg font-semibold leading-6 text-foreground tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed pr-4">{description}</p>
      </div>
      <div className="md:col-span-2">
        {children}
      </div>
    </div>
  );
}
