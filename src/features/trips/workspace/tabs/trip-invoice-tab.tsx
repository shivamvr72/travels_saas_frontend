import { useState, useEffect } from 'react';
import { Trip } from '../../domain/trip-types';
import { Invoice } from '@/features/finance/domain/finance-types';
import { BillingService } from '@/features/finance/services/billing.service';
import { InvoiceSummary } from '@/features/finance/components/invoice-summary';
import { FinanceRules } from '@/features/finance/domain/finance-rules';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { AppLoadingState } from '@/components/shared/app-loading-state';

interface TripInvoiceTabProps {
  trip: Trip;
}

export function TripInvoiceTab({ trip }: TripInvoiceTabProps) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const data = await BillingService.getOrCreateDraftInvoice(trip.id, trip.status);
        setInvoice(data);
      } catch (error) {
        console.error('Failed to fetch invoice', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvoice();
  }, [trip.id, trip.status]);

  const handleFinalize = async () => {
    if (!invoice) return;
    setIsGenerating(true);
    try {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7); // 7 days from now
      
      const finalized = await BillingService.finalizeInvoice(trip.id, invoice.id, {
        due_date: dueDate.toISOString(),
      });
      setInvoice(finalized);
    } catch (error) {
      console.error('Failed to finalize invoice', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const canGenerate = FinanceRules.canGenerateInvoice(trip.status);

  if (isLoading) return <AppLoadingState />;

  return (
    <div className="max-w-4xl mx-auto mt-6 space-y-6">
      {!canGenerate && !invoice && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex gap-3 text-yellow-800 dark:text-yellow-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm">Invoices cannot be generated until the trip is marked as Completed.</p>
        </div>
      )}

      {invoice ? (
        <div className="space-y-6">
          <InvoiceSummary invoice={invoice} />
          
          {FinanceRules.canEditInvoice(invoice.status) && invoice.status === 'Draft' && (
            <div className="flex justify-end gap-4">
              <Button variant="outline">Edit Invoice Details</Button>
              <Button onClick={handleFinalize} disabled={isGenerating}>
                {isGenerating ? 'Generating...' : 'Finalize & Generate Invoice'}
              </Button>
            </div>
          )}

          {invoice.status !== 'Draft' && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex gap-3 text-green-800 dark:text-green-400">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <div className="text-sm space-y-1">
                <p className="font-semibold">Invoice Finalized</p>
                <p>This invoice can no longer be edited as it has been generated and locked.</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        canGenerate && (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No Invoice Found</h3>
              <p className="text-muted-foreground mb-6">A draft invoice has not been created for this trip yet.</p>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}
