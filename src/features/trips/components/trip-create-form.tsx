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
import { AppSectionCard } from '@/components/shared/app-section-card';
import { AppLookup } from '@/components/shared/app-lookup';
import { toast } from 'sonner';

export function TripCreateForm() {
  const router = useRouter();
  const createTrip = useCreateTrip();

  const form = useForm<TripFormValues>({
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
    },
  });

  const onSubmit = async (data: TripFormValues) => {
    try {
      const result = await createTrip.mutateAsync(data);
      toast.success(`Trip ${result.trip_number || 'created'} successfully`);
      router.push(`/trips/${result.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create trip');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <AppSectionCard title="1. Trip Identity">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="trip_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trip Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                <FormItem className="md:col-span-2">
                  <FormLabel>Remarks</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any special instructions..." {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </AppSectionCard>

        <AppSectionCard title="2. Schedule & Geography">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Input placeholder="e.g. Mumbai" {...field} />
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
                    <Input placeholder="e.g. Pune" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </AppSectionCard>

        <AppSectionCard title="3. Route & Parties">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      placeholder="Select route..." 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </AppSectionCard>

        <AppSectionCard title="4. Resources (Optional)">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="vehicle_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle</FormLabel>
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
                <FormItem>
                  <FormLabel>Primary Driver</FormLabel>
                  <FormControl>
                    <AppLookup 
                      lookupKey="drivers" 
                      value={field.value || undefined} 
                      onChange={field.onChange} 
                      placeholder="Select driver..." 
                    />
                  </FormControl>
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
            {/* Dispatchers uses users or staff lookup typically, we assume "dispatchers" is registered */}
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
        </AppSectionCard>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={createTrip.isPending}>
            {createTrip.isPending ? 'Creating...' : 'Create Trip'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
