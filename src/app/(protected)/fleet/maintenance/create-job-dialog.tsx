import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AppLookup } from '@/components/shared/app-lookup';
import { maintenanceApi } from '@/lib/api/maintenance';
import { toast } from 'sonner';

const createJobSchema = z.object({
  vehicle_id: z.string().min(1, 'Vehicle is required'),
  job_source: z.enum(['scheduled', 'preventive', 'breakdown', 'accident', 'compliance', 'inspection', 'other']),
  category: z.string()
    .min(2, 'Category must be at least 2 characters')
    .max(50, 'Category cannot exceed 50 characters'),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  scheduled_date: z.string().min(1, 'Scheduled date is required'),
  workshop_name: z.string()
    .max(100, 'Workshop name cannot exceed 100 characters')
    .optional(),
  notes: z.string()
    .max(500, 'Notes cannot exceed 500 characters')
    .optional(),
});

type CreateJobFormValues = z.infer<typeof createJobSchema>;

interface CreateJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateJobDialog({ open, onOpenChange, onSuccess }: CreateJobDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateJobFormValues>({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      vehicle_id: '',
      job_source: 'scheduled',
      category: '',
      priority: 'medium',
      scheduled_date: new Date().toISOString().split('T')[0],
      workshop_name: '',
      notes: '',
    },
  });

  const onSubmit = async (values: CreateJobFormValues) => {
    try {
      setIsSubmitting(true);
      await maintenanceApi.createJob(values);
      toast.success('Maintenance job created successfully');
      form.reset();
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create maintenance job');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-11/12 max-w-lg sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Maintenance Job</DialogTitle>
          <DialogDescription>
            Schedule a new service or maintenance record for a vehicle.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                name="job_source"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Job Source *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="preventive">Preventive</SelectItem>
                        <SelectItem value="breakdown">Breakdown</SelectItem>
                        <SelectItem value="accident">Accident</SelectItem>
                        <SelectItem value="compliance">Compliance</SelectItem>
                        <SelectItem value="inspection">Inspection</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Oil Change, Full Service..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Priority *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scheduled_date"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Scheduled Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="workshop_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workshop Name (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. In-house or Vendor name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add any specific instructions or details about the issue..." 
                      className="resize-none h-24"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Job'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
