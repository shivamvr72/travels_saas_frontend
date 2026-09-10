'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/shared/utils';
import { AppStatusBadge } from '@/components/shared/app-status-badge';
import { Loader2, TrendingDown, TrendingUp, Scale, Calendar } from 'lucide-react';

interface ReconciliationData {
  hiring_id: string;
  provider_name: string;
  status: string;
  start_date: string;
  end_date: string | null;
  rate_type: string;
  agreed_rate: number;
  total_trips_linked: number;
  total_amount_payable: number;
  amount_paid: number;
  balance_due: number;
}

export function ExternalHiringReconciliation({ hiringId }: { hiringId: string }) {
  const { data, isLoading, error } = useQuery<ReconciliationData>({
    queryKey: ['external-hiring-reconciliation', hiringId],
    queryFn: async () => {
      const res = await apiClient.get(`/api/v1/external-hirings/${hiringId}/reconciliation`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-4 text-destructive text-sm">
        Failed to load reconciliation data.
      </div>
    );
  }

  const isPaid = data.balance_due <= 0;

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Payable</p>
                <p className="text-2xl font-bold">{formatCurrency(data.total_amount_payable)}</p>
              </div>
              <Scale className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Amount Paid</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(data.amount_paid)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Balance Due</p>
                <p className={`text-2xl font-bold ${isPaid ? 'text-green-600' : 'text-destructive'}`}>
                  {isPaid ? '₹0 (Settled)' : formatCurrency(data.balance_due)}
                </p>
              </div>
              <TrendingDown className={`h-8 w-8 ${isPaid ? 'text-green-500' : 'text-destructive'}`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Linked Trips</p>
                <p className="text-2xl font-bold">{data.total_trips_linked}</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hiring Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Hiring Contract Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <dt className="text-sm font-medium text-muted-foreground mb-1">Provider</dt>
              <dd className="text-sm font-semibold">{data.provider_name || '—'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground mb-1">Status</dt>
              <dd><AppStatusBadge status={data.status} size="sm" /></dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground mb-1">Rate Type</dt>
              <dd className="text-sm font-semibold capitalize">{data.rate_type.replace('_', ' ')}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground mb-1">Agreed Rate</dt>
              <dd className="text-sm font-semibold">{formatCurrency(data.agreed_rate)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground mb-1">Start Date</dt>
              <dd className="text-sm font-semibold">{formatDate(data.start_date)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground mb-1">End Date</dt>
              <dd className="text-sm font-semibold">{data.end_date ? formatDate(data.end_date) : '—'}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Payment Progress Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payment Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Paid</span>
              <span className="font-medium">
                {data.total_amount_payable > 0
                  ? `${Math.min(100, Math.round((data.amount_paid / data.total_amount_payable) * 100))}%`
                  : '0%'}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${isPaid ? 'bg-green-500' : 'bg-primary'}`}
                style={{
                  width: data.total_amount_payable > 0
                    ? `${Math.min(100, Math.round((data.amount_paid / data.total_amount_payable) * 100))}%`
                    : '0%',
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatCurrency(data.amount_paid)} paid</span>
              <span>{formatCurrency(data.total_amount_payable)} total</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
