
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Textarea } from '@/components/ui/textarea';
import { useCancelTrip } from '../api';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tripCancelSchema, TripCancelValues } from '../schemas/trip-schema';

interface TripCancelDialogProps {
  tripId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function TripCancelDialog({
  tripId,
  isOpen,
  onClose,
}: TripCancelDialogProps) {
  const cancelMutation = useCancelTrip();
  const form = useForm<TripCancelValues>({
    resolver: zodResolver(tripCancelSchema),
    defaultValues: { reason: '' },
  });

  const onSubmit = (values: TripCancelValues) => {
    cancelMutation.mutate(
      { id: tripId, payload: { cancellation_reason: values.reason } },
      {
        onSuccess: () => {
          onClose();
          form.reset();
        },
        onError: (err: unknown) => {
          const errorResponse = err as { response?: { data?: { detail?: string } } };
          form.setError('reason', {
            type: 'manual',
            message: errorResponse?.response?.data?.detail || 'Failed to cancel the trip. Please try again.',
          });
        }
      }
    );
  };

  const handleClose = () => {
    if (!cancelMutation.isPending) {
      onClose();
      form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-destructive">Cancel Trip</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel this trip? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            {form.formState.errors.root && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cancellation Reason <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide a detailed reason for cancellation..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Minimum 10 characters required.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose} disabled={cancelMutation.isPending}>
                Keep Trip
              </Button>
              <Button 
                type="submit" 
                disabled={cancelMutation.isPending}
                variant="destructive"
              >
                {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Trip'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
