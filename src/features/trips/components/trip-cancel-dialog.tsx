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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCancelTrip } from '../api';
import { AlertCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  tripCancelSchema,
  TripCancelValues,
  CANCELLATION_REASONS,
} from '../schemas/trip-schema';

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
    defaultValues: { reason_code: '', additional_notes: '' },
  });

  const selectedReasonCode = form.watch('reason_code');
  const isOther = selectedReasonCode === 'Other';

  const onSubmit = (values: TripCancelValues) => {
    // Combine reason_code with any additional notes for the full cancellation_reason text
    const fullReason = isOther && values.additional_notes?.trim()
      ? `Other: ${values.additional_notes.trim()}`
      : values.reason_code;

    cancelMutation.mutate(
      {
        id: tripId,
        payload: {
          reason_code: values.reason_code,
          cancellation_reason: fullReason,
        },
      },
      {
        onSuccess: () => {
          onClose();
          form.reset();
        },
        onError: (err: unknown) => {
          const errorResponse = err as { response?: { data?: { detail?: string } } };
          form.setError('reason_code', {
            type: 'manual',
            message:
              errorResponse?.response?.data?.detail ||
              'Failed to cancel the trip. Please try again.',
          });
        },
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
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <XCircle className="w-5 h-5" />
            Cancel Trip
          </DialogTitle>
          <DialogDescription>
            Please select a reason for cancellation. This will release the
            assigned vehicle and driver back to the available pool.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            {/* Root-level API errors */}
            {form.formState.errors.root && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {form.formState.errors.root.message}
                </AlertDescription>
              </Alert>
            )}

            {/* Structured Reason Dropdown */}
            <FormField
              control={form.control}
              name="reason_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Cancellation Reason <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a reason..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CANCELLATION_REASONS.map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Additional Notes — only shown when "Other" is selected */}
            {isOther && (
              <FormField
                control={form.control}
                name="additional_notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Additional Details <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please describe the reason in detail..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Since you selected "Other", please provide more context.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={cancelMutation.isPending}
              >
                Keep Trip
              </Button>
              <Button
                type="submit"
                disabled={cancelMutation.isPending || !selectedReasonCode}
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
