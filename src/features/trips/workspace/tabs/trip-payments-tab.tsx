import { useState, useEffect } from 'react';
import { Trip } from '../../domain/trip-types';
import { TripPaymentDetails, Invoice } from '@/features/finance/domain/finance-types';
import { PaymentService } from '@/features/finance/services/payment.service';
import { BillingService } from '@/features/finance/services/billing.service';
import { PaymentHistory } from '@/features/finance/components/payment-history';
import { PaymentForm } from '@/features/finance/components/payment-form';
import { PaymentFormValues } from '@/features/finance/schemas/finance-schemas';
import { FinanceRules } from '@/features/finance/domain/finance-rules';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, IndianRupee, Plus, CheckCircle2 } from 'lucide-react';
import { AppLoadingState } from '@/components/shared/app-loading-state';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface TripPaymentsTabProps {
  trip: Trip;
}

export function TripPaymentsTab({ trip }: TripPaymentsTabProps) {
  const [paymentDetails, setPaymentDetails] = useState<TripPaymentDetails | null>(null);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [payData, invData] = await Promise.all([
        PaymentService.getPaymentDetails(trip.id),
        BillingService.getOrCreateDraftInvoice(trip.id, trip.status)
      ]);
      setPaymentDetails(payData);
      setInvoice(invData);
    } catch (error) {
      console.error('Failed to fetch payment details', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [trip.id, trip.status]);

  const handleRecordPayment = async (data: PaymentFormValues) => {
    try {
      await PaymentService.recordPayment(trip.id, data);
      await fetchData();
      setIsFormOpen(false);
    } catch (error) {
      console.error('Failed to record payment', error);
      alert(error instanceof Error ? error.message : 'Failed to record payment');
    }
  };

  const handleResetPayments = async () => {
    try {
      await PaymentService.resetPayments(trip.id);
      await fetchData();
    } catch (error) {
      console.error('Failed to reset payments', error);
    }
  };

  const canReceivePayment = FinanceRules.canReceivePayment(invoice, paymentDetails);

  if (isLoading) return <AppLoadingState />;

  return (
    <div className="max-w-4xl mx-auto mt-6 space-y-6">
      {(!invoice || !['Generated', 'Sent', 'Partially Paid', 'Paid'].includes(invoice.status)) && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex gap-3 text-yellow-800 dark:text-yellow-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm">Payments cannot be recorded until a final invoice has been generated for this trip.</p>
        </div>
      )}

      {(paymentDetails && paymentDetails.total_payment > 0 && paymentDetails.balance_due <= 0) && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex gap-3 text-green-800 dark:text-green-400">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <p className="text-sm">This trip is fully paid. No further payments can be recorded.</p>
        </div>
      )}

      {paymentDetails ? (
        <div className="space-y-6">
          <PaymentHistory paymentDetails={paymentDetails} />

          {canReceivePayment && !isFormOpen && (
            <div className="flex justify-end gap-4">
              <AlertDialog>
                <AlertDialogTrigger render={<Button variant="outline" />}>
                  Clear Payments
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear All Payments?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will wipe all recorded payments for this trip and reset the balance due. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResetPayments}>Yes, Clear Payments</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Record New Payment
              </Button>
            </div>
          )}

          {isFormOpen && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4 border-b pb-2">Record Payment</h3>
                <PaymentForm 
                  balanceDue={paymentDetails.balance_due}
                  onSubmit={handleRecordPayment}
                  onCancel={() => setIsFormOpen(false)}
                />
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        canReceivePayment && (
          <Card>
            <CardContent className="py-12 text-center">
              <IndianRupee className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No Payments Recorded</h3>
              <p className="text-muted-foreground mb-6">Record the first payment for this trip.</p>
              
              {!isFormOpen ? (
                <Button onClick={() => setIsFormOpen(true)}>Record Initial Payment</Button>
              ) : (
                <div className="mt-8 text-left border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Record Payment</h3>
                  <PaymentForm 
                    balanceDue={invoice?.total_amount || 0}
                    onSubmit={handleRecordPayment}
                    onCancel={() => setIsFormOpen(false)}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}
