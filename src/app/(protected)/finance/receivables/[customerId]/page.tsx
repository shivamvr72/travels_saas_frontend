'use client';

import React, { useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building2, CreditCard, ExternalLink, FileText, AlertCircle, CheckCircle2, Clock, ArrowLeft } from 'lucide-react';
import { CURRENCY_CONFIG } from '@/features/finance/domain/finance-constants';
import { PaymentForm } from '@/features/finance/components/payment-form';
import { mockCustomerOutstanding } from '@/features/finance/pages/receivables-page';
import { CustomerInvoiceItem } from '@/features/finance/domain/finance-types';

export default function CustomerReceivablesPage({ params }: { params: Promise<{ customerId: string }> }) {
  const { customerId } = React.use(params);
  const [activeInvoiceForPayment, setActiveInvoiceForPayment] = useState<CustomerInvoiceItem | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // In a real app, you would fetch this data from an API
  // Currently falling back to mock data
  const customer = mockCustomerOutstanding.find(c => c.id === customerId);

  if (!customer) {
    notFound();
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(CURRENCY_CONFIG.locale, {
      style: 'currency',
      currency: CURRENCY_CONFIG.currency,
    }).format(amount);
  };

  const handleRecordPayment = (data: any) => {
    setSuccessMessage(`Payment of ${formatCurrency(data.amount)} recorded successfully for ${customer.name}!`);
    setActiveInvoiceForPayment(null);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header section with back button */}
      <div className="flex items-center gap-2 mb-4">
        <Link href="/finance/receivables">
          <Button variant="ghost" size="sm" className="gap-1 px-2 h-8 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Receivables
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0">
            <Building2 className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              {customer.name}
              {customer.overdue_invoices > 0 ? (
                <Badge variant="destructive" className="text-sm">
                  {customer.overdue_invoices} Overdue
                </Badge>
              ) : (
                <Badge variant="outline" className="text-sm border-green-500/30 text-green-600 dark:text-green-400">
                  Current
                </Badge>
              )}
            </h1>
            <p className="text-muted-foreground mt-1">
              Detailed receivables & invoice ledger for this client
            </p>
          </div>
        </div>
        <Link href={`/customers`}>
          <Button variant="outline" className="gap-2 shrink-0">
            <ExternalLink className="h-4 w-4" />
            Customer Profile
          </Button>
        </Link>
      </div>

      {successMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 p-4 rounded-lg flex items-center gap-3 text-sm animate-in fade-in">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Total Outstanding</p>
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-500 mt-2">
            {formatCurrency(customer.total_outstanding)}
          </p>
        </div>
        <div className="bg-card p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Pending Invoices</p>
          <p className="text-3xl font-bold mt-2">{customer.total_invoices}</p>
        </div>
        <div className="bg-card p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Overdue Invoices</p>
          <p className={`text-3xl font-bold mt-2 ${customer.overdue_invoices > 0 ? 'text-destructive' : 'text-foreground'}`}>
            {customer.overdue_invoices}
          </p>
        </div>
      </div>

      {/* Payment Form (conditionally rendered) */}
      {activeInvoiceForPayment && (
        <div className="border rounded-xl p-6 bg-card space-y-4 shadow-sm animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-center border-b pb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Record Payment for {activeInvoiceForPayment.invoice_number}
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setActiveInvoiceForPayment(null)}>
              Cancel
            </Button>
          </div>
          <div className="pt-2">
            <PaymentForm 
              balanceDue={activeInvoiceForPayment.balance_due}
              onSubmit={handleRecordPayment}
              onCancel={() => setActiveInvoiceForPayment(null)}
            />
          </div>
        </div>
      )}

      {/* Detailed Invoices Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            Outstanding Invoices & Billing Records
          </h2>
          <Button 
            variant="default" 
            className="gap-2"
            onClick={() => setActiveInvoiceForPayment(customer.invoices?.[0] || {
              id: 'new',
              invoice_number: `INV-GEN-${customer.id}`,
              issue_date: new Date().toISOString().split('T')[0],
              due_date: new Date().toISOString().split('T')[0],
              amount: customer.total_outstanding,
              balance_due: customer.total_outstanding,
              status: 'pending'
            })}
          >
            <CreditCard className="h-4 w-4" />
            Record Payment
          </Button>
        </div>

        <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 text-sm">
                <TableHead className="py-4">Invoice #</TableHead>
                <TableHead className="py-4">Trip Reference</TableHead>
                <TableHead className="py-4">Due Date</TableHead>
                <TableHead className="text-right py-4">Total</TableHead>
                <TableHead className="text-right py-4">Balance Due</TableHead>
                <TableHead className="text-center py-4">Status</TableHead>
                <TableHead className="text-right py-4">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customer.invoices && customer.invoices.length > 0 ? (
                customer.invoices.map((inv) => (
                  <TableRow key={inv.id} className="text-sm">
                    <TableCell className="font-mono font-medium py-4">{inv.invoice_number}</TableCell>
                    <TableCell className="text-muted-foreground font-mono py-4">{inv.trip_number || 'N/A'}</TableCell>
                    <TableCell className="text-muted-foreground py-4">{inv.due_date}</TableCell>
                    <TableCell className="text-right font-medium py-4">{formatCurrency(inv.amount)}</TableCell>
                    <TableCell className="text-right font-bold text-amber-600 dark:text-amber-500 py-4">
                      {formatCurrency(inv.balance_due)}
                    </TableCell>
                    <TableCell className="text-center py-4">
                      {inv.status === 'overdue' ? (
                        <Badge variant="destructive" className="gap-1">
                          <AlertCircle className="h-3.5 w-3.5" /> Overdue
                        </Badge>
                      ) : inv.status === 'pending' ? (
                        <Badge variant="outline" className="gap-1 text-amber-600 border-amber-500/40">
                          <Clock className="h-3.5 w-3.5" /> Pending
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1 text-green-600 border-green-500/40">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Paid
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right py-4">
                      {inv.balance_due > 0 ? (
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="gap-2"
                          onClick={() => setActiveInvoiceForPayment(inv)}
                        >
                          <CreditCard className="h-3.5 w-3.5" /> Pay
                        </Button>
                      ) : (
                        <span className="text-sm text-muted-foreground font-medium px-2">Settled</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    No individual invoice records found for this customer.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
