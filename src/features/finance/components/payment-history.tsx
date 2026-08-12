import { format } from 'date-fns';
import { TripPaymentDetails } from '../domain/finance-types';
import { CURRENCY_CONFIG } from '../domain/finance-constants';
import { CheckCircle2, Clock, IndianRupee } from 'lucide-react';

interface PaymentHistoryProps {
  paymentDetails: TripPaymentDetails;
}

export function PaymentHistory({ paymentDetails }: PaymentHistoryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(CURRENCY_CONFIG.locale, {
      style: 'currency',
      currency: CURRENCY_CONFIG.currency,
    }).format(amount);
  };

  const isSettled = paymentDetails.is_settled;
  const isUnbilled = paymentDetails.total_payment === 0;
  
  return (
    <div className="bg-card text-card-foreground p-6 rounded-lg border shadow-sm space-y-6">
      <div className="flex justify-between items-start border-b pb-4">
        <div>
          <h3 className="text-lg font-semibold text-muted-foreground uppercase tracking-wider">Payment Status</h3>
          <div className="flex items-center gap-2 mt-2">
            {isSettled ? (
              <span className="flex items-center gap-1.5 text-sm font-medium text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="h-4 w-4" /> Fully Paid
              </span>
            ) : isUnbilled ? (
              <span className="flex items-center gap-1.5 text-sm font-medium text-amber-700 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 px-2.5 py-1 rounded-full">
                <Clock className="h-4 w-4" /> Unbilled / Pending Invoice
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-sm font-medium text-amber-700 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 px-2.5 py-1 rounded-full">
                <Clock className="h-4 w-4" /> Pending Balance
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total Invoice Amount</p>
          <p className="text-xl font-bold">{formatCurrency(paymentDetails.total_payment)}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Payment Breakdown</h4>
        
        {paymentDetails.advance_payment > 0 && (
          <div className="flex items-center justify-between p-3 rounded-md bg-muted/40 border">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full text-primary">
                <IndianRupee className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">Advance Payment</p>
                <p className="text-xs text-muted-foreground">Paid upfront</p>
              </div>
            </div>
            <span className="font-bold">{formatCurrency(paymentDetails.advance_payment)}</span>
          </div>
        )}

        {paymentDetails.transactions?.map((txn, index) => (
          <div key={txn.id} className="flex items-center justify-between p-3 rounded-md bg-muted/40 border">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full text-primary">
                <IndianRupee className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">Payment {index + 1}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  {txn.payment_date && <span>{format(new Date(txn.payment_date), 'MMM dd, yyyy')}</span>}
                  {txn.payment_mode && <span className="capitalize">• {txn.payment_mode}</span>}
                  {txn.reference_no && <span>• Ref: {txn.reference_no}</span>}
                </div>
              </div>
            </div>
            <span className="font-bold">{formatCurrency(txn.amount)}</span>
          </div>
        ))}

        {(paymentDetails.advance_payment === 0 && paymentDetails.other_payment === 0) && (
          <div className="text-center py-6 text-sm text-muted-foreground border border-dashed rounded-md">
            No payments have been recorded yet.
          </div>
        )}
      </div>

      <div className={`border-t pt-4 flex justify-between items-center -mx-6 -mb-6 p-6 rounded-b-lg ${isSettled ? 'bg-green-50/50 dark:bg-green-900/10' : 'bg-amber-50/50 dark:bg-amber-900/10'}`}>
        <span className="text-lg font-semibold">Balance Due</span>
        <span className={`text-2xl font-bold ${isSettled ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-500'}`}>
          {formatCurrency(paymentDetails.balance_due)}
        </span>
      </div>
    </div>
  );
}
