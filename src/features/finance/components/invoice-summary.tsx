import { Invoice } from '../domain/finance-types';
import { CURRENCY_CONFIG } from '../domain/finance-constants';

interface InvoiceSummaryProps {
  invoice: Invoice;
}

export function InvoiceSummary({ invoice }: InvoiceSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(CURRENCY_CONFIG.locale, {
      style: 'currency',
      currency: CURRENCY_CONFIG.currency,
    }).format(amount);
  };

  return (
    <div className="bg-card text-card-foreground p-6 rounded-lg border shadow-sm space-y-6">
      <div className="flex justify-between items-start border-b pb-4">
        <div>
          <h3 className="text-lg font-semibold text-muted-foreground uppercase tracking-wider">Invoice Summary</h3>
          <p className="text-sm text-muted-foreground mt-1">Status: <span className="font-medium text-foreground">{invoice.status}</span></p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{formatCurrency(invoice.total_amount)}</p>
          {invoice.invoice_number && (
            <p className="text-sm text-muted-foreground mt-1">{invoice.invoice_number}</p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Base Rate (Included: {invoice.included_km} km, {invoice.included_hrs} hrs)</span>
          <span className="font-medium">{formatCurrency(invoice.base_rate)}</span>
        </div>
        
        {invoice.extra_km > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Extra KM ({invoice.extra_km} km @ {formatCurrency(invoice.extra_km_rate)}/km)</span>
            <span className="font-medium">{formatCurrency(invoice.extra_km_amount)}</span>
          </div>
        )}
        
        {invoice.extra_hrs > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Extra Hours ({invoice.extra_hrs} hrs @ {formatCurrency(invoice.extra_hr_rate)}/hr)</span>
            <span className="font-medium">{formatCurrency(invoice.extra_hr_amount)}</span>
          </div>
        )}
        
        {invoice.night_charge > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Night Charges</span>
            <span className="font-medium">{formatCurrency(invoice.night_charge)}</span>
          </div>
        )}

        {invoice.driver_meal > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Driver Allowance / Meal</span>
            <span className="font-medium">{formatCurrency(invoice.driver_meal)}</span>
          </div>
        )}

        {invoice.toll_tax > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Toll Tax</span>
            <span className="font-medium">{formatCurrency(invoice.toll_tax)}</span>
          </div>
        )}

        {invoice.parking_charge > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Parking</span>
            <span className="font-medium">{formatCurrency(invoice.parking_charge)}</span>
          </div>
        )}

        {invoice.other_charges > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Other Charges</span>
            <span className="font-medium">{formatCurrency(invoice.other_charges)}</span>
          </div>
        )}

        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between items-center">
            <span className="font-medium text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
          </div>
        </div>

        {invoice.gst_percent > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">GST ({invoice.gst_percent}%)</span>
            <span className="font-medium">{formatCurrency(invoice.gst_amount)}</span>
          </div>
        )}
      </div>

      <div className="border-t pt-4 flex justify-between items-center bg-muted/20 -mx-6 -mb-6 p-6 rounded-b-lg">
        <span className="text-lg font-semibold">Grand Total</span>
        <span className="text-xl font-bold text-primary">{formatCurrency(invoice.total_amount)}</span>
      </div>
    </div>
  );
}
