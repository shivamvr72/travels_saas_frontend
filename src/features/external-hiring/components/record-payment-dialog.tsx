"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/lib/axios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const paymentSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
});

type PaymentForm = z.infer<typeof paymentSchema>;

interface RecordPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hiringId: string;
  balanceDue: number;
}

export function RecordPaymentDialog({ open, onOpenChange, hiringId, balanceDue }: RecordPaymentDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: balanceDue || 0,
    },
  });

  // Reset amount when dialog opens so it always reflects current balance
  useEffect(() => {
    if (open) {
      form.reset({ amount: balanceDue || 0 });
    }
  }, [open, balanceDue, form]);

  const mutation = useMutation({
    mutationFn: async (data: PaymentForm) => {
      const res = await apiClient.post(`/api/v1/external-hirings/${hiringId}/record-payment`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Payment Recorded', {
        description: 'The payment has been successfully recorded.',
      });
      queryClient.invalidateQueries({ queryKey: ['external-hiring', hiringId] });
      queryClient.invalidateQueries({ queryKey: ['external-hiring'] });
      onOpenChange(false);
    },
    onError: (err: any) => {
      toast.error('Error', {
        description: err.response?.data?.detail || err.message || 'Failed to record payment.',
      });
    },
  });

  const onSubmit = (data: PaymentForm) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Record Vendor Payment</DialogTitle>
          <DialogDescription>
            Enter the amount paid to the vendor.{' '}
            <span className="font-semibold text-foreground">Current balance due: ₹{balanceDue.toLocaleString('en-IN')}</span>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount Paid (₹)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="0.00"
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Record Payment
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
