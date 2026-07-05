import { format } from 'date-fns';
import { Trash2, Edit2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TripExpense } from '../domain/finance-types';
import { CURRENCY_CONFIG } from '../domain/finance-constants';

interface ExpenseCardProps {
  expense: TripExpense;
  onEdit?: (expense: TripExpense) => void;
  onDelete?: (expenseId: string) => void;
  readOnly?: boolean;
}

export function ExpenseCard({ expense, onEdit, onDelete, readOnly = false }: ExpenseCardProps) {
  const formattedAmount = new Intl.NumberFormat(CURRENCY_CONFIG.locale, {
    style: 'currency',
    currency: CURRENCY_CONFIG.currency,
  }).format(expense.amount);

  return (
    <div className="bg-card text-card-foreground p-4 rounded-lg border shadow-sm flex items-center justify-between group">
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-full flex items-center justify-center h-12 w-12 text-primary shrink-0">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-semibold">{expense.category}</h4>
            {expense.approval_status === 'pending' && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full dark:bg-yellow-900/30 dark:text-yellow-400">
                Pending
              </span>
            )}
          </div>
          <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
            <span>{format(new Date(expense.expense_date), 'MMM dd, yyyy')}</span>
            <span>•</span>
            <span className="capitalize">{expense.payment_mode}</span>
            {expense.paid_by && (
              <>
                <span>•</span>
                <span>Paid by: {expense.paid_by}</span>
              </>
            )}
          </div>
          {expense.remarks && (
            <p className="text-sm text-muted-foreground mt-1 italic">{expense.remarks}</p>
          )}
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-2">
        <span className="font-bold text-lg">{formattedAmount}</span>
        
        {!readOnly && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(expense)}>
                <Edit2 className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
            )}
            {onDelete && (
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => onDelete(expense.id)}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
