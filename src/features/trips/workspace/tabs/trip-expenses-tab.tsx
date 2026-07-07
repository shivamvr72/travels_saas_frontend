import { useState, useEffect } from 'react';
import { Trip } from '../../domain/trip-types';
import { TripExpense } from '@/features/finance/domain/finance-types';
import { FinanceApi } from '@/features/finance/api/finance-api';
import { CalculationEngine } from '@/features/finance/domain/calculation-engine';
import { FinanceRules } from '@/features/finance/domain/finance-rules';
import { ExpenseFormValues } from '@/features/finance/schemas/finance-schemas';
import { ExpenseForm } from '@/features/finance/components/expense-form';
import { ExpenseCard } from '@/features/finance/components/expense-card';
import { CURRENCY_CONFIG } from '@/features/finance/domain/finance-constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Banknote, AlertCircle } from 'lucide-react';
import { AppLoadingState } from '@/components/shared/app-loading-state';
import { AppConfirmDialog } from '@/components/shared/app-confirm-dialog';

interface TripExpensesTabProps {
  trip: Trip;
}

export function TripExpensesTab({ trip }: TripExpensesTabProps) {
  const [expenses, setExpenses] = useState<TripExpense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<TripExpense | null>(null);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);

  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      const data = await FinanceApi.getTripExpenses(trip.id);
      setExpenses(data);
    } catch (error) {
      console.error('Failed to fetch expenses', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [trip.id]);

  const handleSaveExpense = async (data: ExpenseFormValues) => {
    try {
      if (editingExpense) {
        // Mock update: delete then add
        await FinanceApi.deleteTripExpense(editingExpense.id, trip.id);
      }
      await FinanceApi.addTripExpense(trip.id, data);
      await fetchExpenses();
      setIsFormOpen(false);
      setEditingExpense(null);
    } catch (error) {
      console.error('Failed to save expense', error);
    }
  };

  const handleDeleteExpense = (id: string) => {
    setExpenseToDelete(id);
  };

  const confirmDeleteExpense = async () => {
    if (!expenseToDelete) return;
    try {
      await FinanceApi.deleteTripExpense(expenseToDelete, trip.id);
      await fetchExpenses();
    } catch (error) {
      console.error('Failed to delete expense', error);
    } finally {
      setExpenseToDelete(null);
    }
  };

  const totalAmount = CalculationEngine.aggregateExpenses(expenses);
  const formattedTotal = new Intl.NumberFormat(CURRENCY_CONFIG.locale, {
    style: 'currency',
    currency: CURRENCY_CONFIG.currency,
  }).format(totalAmount);

  const canModify = FinanceRules.canModifyExpenses(trip.status);

  if (isLoading) return <AppLoadingState />;

  return (
    <div className="max-w-4xl mx-auto mt-6 space-y-6">
      {!canModify && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex gap-3 text-yellow-800 dark:text-yellow-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm">Expenses cannot be modified because the trip is currently {trip.status}.</p>
        </div>
      )}

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between border-b pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Banknote className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Trip Expenses</h2>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-2xl font-bold">{formattedTotal}</p>
            </div>
          </div>

          {!isFormOpen && canModify && (
            <div className="flex justify-end mb-6">
              <Button onClick={() => { setEditingExpense(null); setIsFormOpen(true); }}>
                <Plus className="mr-2 h-4 w-4" /> Add Expense
              </Button>
            </div>
          )}

          {isFormOpen && canModify ? (
            <div className="bg-muted/30 p-6 rounded-lg border mb-6">
              <h3 className="font-medium mb-4">{editingExpense ? 'Edit Expense' : 'Record New Expense'}</h3>
              <ExpenseForm 
                initialData={editingExpense || undefined}
                onSubmit={handleSaveExpense} 
                onCancel={() => { setIsFormOpen(false); setEditingExpense(null); }} 
              />
            </div>
          ) : (
            <div className="space-y-4">
              {expenses.length === 0 ? (
                <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
                  <Banknote className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">No expenses recorded for this trip yet.</p>
                </div>
              ) : (
                expenses.map(expense => (
                  <ExpenseCard 
                    key={expense.id} 
                    expense={expense} 
                    onEdit={canModify ? (exp) => { setEditingExpense(exp); setIsFormOpen(true); } : undefined}
                    onDelete={canModify ? handleDeleteExpense : undefined}
                    readOnly={!canModify}
                  />
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <AppConfirmDialog
        isOpen={!!expenseToDelete}
        onClose={() => setExpenseToDelete(null)}
        title="Delete Expense"
        description="Are you sure you want to delete this expense? This action cannot be undone."
        onConfirm={confirmDeleteExpense}
        confirmLabel="Delete"
        isDestructive={true}
      />
    </div>
  );
}
