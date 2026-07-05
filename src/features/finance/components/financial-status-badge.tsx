import { InvoiceStatus, PaymentStatus } from '../domain/finance-constants';

interface FinancialStatusBadgeProps {
  status: InvoiceStatus | PaymentStatus;
  type: 'invoice' | 'payment';
}

export function FinancialStatusBadge({ status, type }: FinancialStatusBadgeProps) {
  let colorClass = 'bg-muted text-muted-foreground';

  if (type === 'invoice') {
    switch (status as InvoiceStatus) {
      case 'Draft':
        colorClass = 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
        break;
      case 'Generated':
      case 'Sent':
        colorClass = 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
        break;
      case 'Partially Paid':
        colorClass = 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
        break;
      case 'Paid':
      case 'Closed':
        colorClass = 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
        break;
      case 'Cancelled':
        colorClass = 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
        break;
    }
  } else if (type === 'payment') {
    switch (status as PaymentStatus) {
      case 'Pending':
        colorClass = 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
        break;
      case 'Partial':
        colorClass = 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
        break;
      case 'Completed':
        colorClass = 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
        break;
      case 'Refunded':
        colorClass = 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
        break;
    }
  }

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${colorClass}`}>
      {status}
    </span>
  );
}
