import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createPaymentFormSchema, PaymentFormValues } from '../schemas/finance-schemas';
import { PAYMENT_MODES, CURRENCY_CONFIG } from '../domain/finance-constants';

interface PaymentFormProps {
  balanceDue: number;
  onSubmit: (data: PaymentFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function PaymentForm({ balanceDue, onSubmit, onCancel, isLoading }: PaymentFormProps) {
  const schema = createPaymentFormSchema(balanceDue > 0 ? balanceDue : undefined);
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      amount: balanceDue > 0 ? balanceDue : 0,
      payment_mode: 'cash',
      payment_date: new Date().toISOString().split('T')[0],
      reference_no: '',
      remarks: '',
    },
  });

  const formattedBalanceDue = new Intl.NumberFormat(CURRENCY_CONFIG.locale, {
    style: 'currency',
    currency: CURRENCY_CONFIG.currency,
  }).format(balanceDue);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="bg-muted/50 p-3 rounded-md mb-4 flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Current Balance Due:</span>
          <span className="font-bold">{formattedBalanceDue}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Amount</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    {...field} 
                    onWheel={(e) => e.currentTarget.blur()} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="payment_mode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Mode</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment mode" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PAYMENT_MODES.map(mode => (
                      <SelectItem key={mode} value={mode} className="capitalize">{mode}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="payment_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="reference_no"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reference Number</FormLabel>
                <FormControl>
                  <Input placeholder="UPI / Cheque / Transaction ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="remarks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Remarks</FormLabel>
              <FormControl>
                <Input placeholder="Optional notes..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Record Payment'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
