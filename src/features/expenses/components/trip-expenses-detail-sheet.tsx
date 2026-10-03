'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/lib/axios';
import { VehicleExpense } from '../api';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/shared/utils';
import { CATEGORY_COLORS } from '../config';
import { EXPENSE_TYPE_LABELS } from '../schemas';
import { VehicleNameCell } from './expense-list-cells';
import { 
  Calendar, 
  ExternalLink, 
  Gauge, 
  Loader2, 
  Plus, 
  Receipt, 
  Wallet 
} from 'lucide-react';

interface TripExpensesDetailSheetProps {
  tripId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TripExpensesDetailSheet({
  tripId,
  open,
  onOpenChange,
}: TripExpensesDetailSheetProps) {
  const router = useRouter();

  // Fetch trip details for contextual info (route, booking ref, vehicle)
  const { data: trip } = useQuery({
    queryKey: ['trips', 'detail', tripId],
    queryFn: () => apiClient.get(`/api/v1/trips/${tripId}`).then((r) => r.data),
    enabled: !!tripId && open,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch all individual expenses linked to this trip
  const { data: expenses, isLoading } = useQuery<VehicleExpense[]>({
    queryKey: ['trips', tripId, 'expenses'],
    queryFn: () => apiClient.get(`/api/v1/trips/${tripId}/expenses`).then((r) => r.data),
    enabled: !!tripId && open,
  });

  const totalAmount = useMemo(() => {
    if (!expenses) return 0;
    return expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [expenses]);

  let routeTitle = 'Trip Details';
  if (trip) {
    if (trip.booking_reference) {
      routeTitle = trip.booking_reference;
    }
    if (trip.locations && trip.locations.length > 0) {
      const from = trip.locations[0].from_location;
      const to = trip.locations[trip.locations.length - 1].to_location;
      routeTitle = `${from} → ${to}`;
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-lg md:max-w-xl flex flex-col h-full p-0 gap-0 border-l border-border bg-background shadow-2xl"
      >
        {/* Header */}
        <SheetHeader className="p-6 border-b shrink-0 bg-muted/20">
          <div className="flex items-center justify-between gap-2 pr-6">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="font-mono text-xs">
                {trip?.booking_reference || (tripId ? tripId.slice(0, 8) + '…' : 'Trip')}
              </Badge>
              {trip?.status && (
                <Badge variant="secondary" className="text-xs capitalize">
                  {trip.status}
                </Badge>
              )}
            </div>
            {tripId && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-muted-foreground hover:text-foreground gap-1.5"
                onClick={() => router.push(`/trips/${tripId}?tab=expenses`)}
              >
                <span>Trip Workspace</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>

          <SheetTitle className="text-xl font-bold tracking-tight mt-2 text-foreground">
            {routeTitle}
          </SheetTitle>

          <SheetDescription className="text-xs text-muted-foreground mt-1">
            Breakdown of all operational expenses recorded for this trip
          </SheetDescription>

          {/* Quick Metrics Banner */}
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border/50">
            <div className="bg-card p-3 rounded-lg border">
              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                <Wallet className="h-3.5 w-3.5 text-primary" /> Total Cost
              </span>
              <span className="text-lg font-bold tabular-nums text-foreground mt-1 block">
                {formatCurrency(totalAmount)}
              </span>
            </div>

            <div className="bg-card p-3 rounded-lg border">
              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                <Receipt className="h-3.5 w-3.5 text-primary" /> Expenses Logged
              </span>
              <span className="text-lg font-bold tabular-nums text-foreground mt-1 block">
                {expenses ? expenses.length : '—'}{' '}
                <span className="text-xs font-normal text-muted-foreground">items</span>
              </span>
            </div>
          </div>

          {/* Assigned Vehicle */}
          {trip?.vehicle_id && (
            <div className="mt-3 text-xs flex items-center gap-2 text-muted-foreground">
              <span className="font-medium text-foreground">Assigned Vehicle:</span>
              <VehicleNameCell vehicleId={trip.vehicle_id} />
            </div>
          )}
        </SheetHeader>

        {/* Expenses List (Scrollable Body) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 min-h-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
              <p className="text-sm">Loading trip expenses…</p>
            </div>
          ) : !expenses || expenses.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed rounded-xl p-6">
              <Receipt className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
              <h4 className="text-sm font-semibold">No expenses recorded</h4>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                No individual expense receipts have been attached to this trip yet.
              </p>
            </div>
          ) : (
            expenses.map((expense) => {
              const categoryColor = CATEGORY_COLORS[expense.expense_type] || '';
              const categoryLabel =
                EXPENSE_TYPE_LABELS[expense.expense_type as keyof typeof EXPENSE_TYPE_LABELS] ||
                expense.expense_type;

              return (
                <div
                  key={expense.id}
                  onClick={() => router.push(`/expenses/${expense.id}`)}
                  className="group p-4 rounded-xl border bg-card hover:bg-muted/40 transition-all cursor-pointer shadow-xs hover:border-primary/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className={`text-xs font-medium ${categoryColor}`}>
                          {categoryLabel}
                        </Badge>
                        {expense.payment_mode && (
                          <Badge variant="secondary" className="text-[10px] uppercase font-mono px-1.5 py-0">
                            {expense.payment_mode}
                          </Badge>
                        )}
                      </div>

                      {expense.vendor_name && (
                        <p className="font-medium text-sm text-foreground truncate">
                          {expense.vendor_name}
                        </p>
                      )}

                      {expense.notes && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {expense.notes}
                        </p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-base font-bold tabular-nums text-foreground">
                        {formatCurrency(expense.amount)}
                      </span>
                      <div className="text-xs text-muted-foreground flex items-center justify-end gap-1 mt-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(expense.expense_date)}</span>
                      </div>
                    </div>
                  </div>

                  {expense.km_at_expense != null && (
                    <div className="mt-2.5 pt-2 border-t border-border/40 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Gauge className="h-3 w-3" />
                      <span>Odometer at expense:</span>
                      <span className="font-medium tabular-nums text-foreground">
                        {expense.km_at_expense.toLocaleString('en-IN')} km
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t bg-muted/20 shrink-0 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>

          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => {
              onOpenChange(false);
              router.push(`/expenses/new?trip_id=${tripId}`);
            }}
          >
            <Plus className="h-4 w-4" />
            <span>Add Expense</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
