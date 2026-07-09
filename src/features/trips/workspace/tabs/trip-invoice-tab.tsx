import { useState, useEffect } from 'react';
import { Trip } from '../../domain/trip-types';
import { Invoice } from '@/features/finance/domain/finance-types';
import { BillingService } from '@/features/finance/services/billing.service';
import { InvoiceSummary } from '@/features/finance/components/invoice-summary';
import { InvoiceForm } from '@/features/finance/components/invoice-form';
import { InvoiceUpdateValues } from '@/features/finance/schemas/finance-schemas';
import { FinanceRules } from '@/features/finance/domain/finance-rules';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, FileText, CheckCircle2, RefreshCw } from 'lucide-react';
import { AppLoadingState } from '@/components/shared/app-loading-state';
import { AppConfirmDialog } from '@/components/shared/app-confirm-dialog';

interface TripInvoiceTabProps {
  trip: Trip;
}

export function TripInvoiceTab({ trip }: TripInvoiceTabProps) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isReverting, setIsReverting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isRevertConfirmOpen, setIsRevertConfirmOpen] = useState(false);

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
      setIsConfirmOpen(false);
    }
  };

  const handleRevert = async () => {
    if (!invoice) return;
    setIsReverting(true);
    try {
      const reverted = await BillingService.revertInvoice(trip.id);
      setInvoice(reverted);
    } catch (error) {
      console.error('Failed to revert invoice', error);
    } finally {
      setIsReverting(false);
      setIsRevertConfirmOpen(false);
    }
  };

  const handleSaveInvoice = async (values: InvoiceUpdateValues) => {
    if (!invoice) return;
    try {
      const updated = await BillingService.updateDraftInvoice(trip.id, invoice.id, values);
      setInvoice(updated);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update invoice', error);
    }
  };

  const handleSyncExpenses = async () => {
    if (!invoice) return;
    setIsSyncing(true);
    try {
      const updated = await BillingService.syncExpenses(trip.id);
      setInvoice(updated);
    } catch (error) {
      console.error('Failed to sync expenses', error);
    } finally {
      setIsSyncing(false);
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
          {invoice.status === 'Draft' && invoice.total_amount === 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex gap-3 text-yellow-800 dark:text-yellow-400">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm font-medium">Route has no rate card. Please click "Edit Invoice Details" to enter charges manually before finalizing.</p>
            </div>
          )}
          {isEditing ? (
            <div className="bg-card text-card-foreground p-6 rounded-lg border shadow-sm">
              <h3 className="font-semibold text-lg mb-4">Edit Draft Invoice</h3>
              <InvoiceForm 
                initialData={invoice} 
                onSubmit={handleSaveInvoice} 
                onCancel={() => setIsEditing(false)} 
              />
            </div>
          ) : (
            <>
              <InvoiceSummary invoice={invoice} />
              
              {FinanceRules.canEditInvoice(invoice.status) && invoice.status === 'Draft' && (
                <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={handleSyncExpenses} disabled={isSyncing}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} /> 
                    {isSyncing ? 'Syncing...' : 'Auto-Fill Tolls & Parking'}
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(true)}>Edit Invoice Details</Button>
                  <Button onClick={() => setIsConfirmOpen(true)} disabled={isGenerating}>
                    {isGenerating ? 'Generating...' : 'Finalize & Generate Invoice'}
                  </Button>
                </div>
              )}

              <AppConfirmDialog
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                title="Finalize Invoice"
                description={
                  <span className="flex flex-col gap-2">
                    <span>Are you sure you want to finalize this invoice?</span>
                    {invoice.total_amount === 0 && (
                      <span className="text-destructive font-medium">
                        Warning: This invoice has a total amount of ₹0.00.
                      </span>
                    )}
                    <span className="text-sm text-muted-foreground">
                      Once finalized, the invoice will be locked and you will not be able to edit it anymore.
                    </span>
                  </span>
                }
                onConfirm={handleFinalize}
                confirmLabel="Yes, Finalize Invoice"
              />

              {invoice.status !== 'Draft' && (
                <div className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex gap-3 text-green-800 dark:text-green-400">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <div className="text-sm space-y-1">
                      <p className="font-semibold">Invoice Finalized</p>
                      <p>This invoice can no longer be edited as it has been generated and locked.</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline" className="text-destructive hover:bg-destructive/10" onClick={() => setIsRevertConfirmOpen(true)} disabled={isReverting}>
                      {isReverting ? 'Reverting...' : 'Revert to Draft'}
                    </Button>
                  </div>

                  <AppConfirmDialog
                    isOpen={isRevertConfirmOpen}
                    onClose={() => setIsRevertConfirmOpen(false)}
                    title="Revert Invoice to Draft"
                    description="Are you sure you want to revert this invoice back to a draft? This will remove the invoice number and allow you to edit the details again."
                    onConfirm={handleRevert}
                    confirmLabel="Yes, Revert to Draft"
                    isDestructive={true}
                  />
                </div>
              )}
            </>
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
