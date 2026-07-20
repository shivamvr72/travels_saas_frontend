'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TripPaymentSchema, TripPaymentFormData } from '../schemas/settlement-schema';
import { useRecordPayment } from '../api/trip-settlement-api';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export function RecordPaymentDialog({ tripId }: { tripId: string }) {
  const [open, setOpen] = useState(false);
  const { mutateAsync: recordPayment, isPending } = useRecordPayment();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<TripPaymentFormData>({
    resolver: zodResolver(TripPaymentSchema),
    defaultValues: {
      payment_mode: 'bank_transfer',
      payment_date: new Date().toISOString().split('T')[0],
      amount: '',
    }
  });

  const onSubmit = async (data: TripPaymentFormData) => {
    try {
      await recordPayment({ tripId, data });
      toast.success('Payment recorded successfully');
      setOpen(false);
      reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to record payment');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="w-full" variant="outline" />}>
        Record Payment
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Date</label>
            <input 
              type="date" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...register('payment_date')}
            />
            {errors.payment_date && <p className="text-sm text-destructive">{errors.payment_date.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>
            <input 
              type="text" 
              placeholder="e.g. 1000.00"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...register('amount')}
            />
            {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Mode</label>
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              {...register('payment_mode')}
            >
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
              <option value="cheque">Cheque</option>
            </select>
            {errors.payment_mode && <p className="text-sm text-destructive">{errors.payment_mode.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Reference Number (Optional)</label>
            <input 
              type="text" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...register('reference_no')}
            />
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : 'Save Payment'}
            </Button>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  );
}
