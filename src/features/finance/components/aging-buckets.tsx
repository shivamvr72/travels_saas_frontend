import { CURRENCY_CONFIG } from '../domain/finance-constants';

interface AgingBucketsProps {
  buckets: {
    current: number; // 0-30 days
    thirtyToSixty: number; // 31-60 days
    sixtyToNinety: number; // 61-90 days
    overNinety: number; // > 90 days
    total: number;
  };
}

export function AgingBuckets({ buckets }: AgingBucketsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(CURRENCY_CONFIG.locale, {
      style: 'currency',
      currency: CURRENCY_CONFIG.currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-card text-card-foreground rounded-lg border shadow-sm overflow-hidden">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold">Receivables Aging</h3>
        <p className="text-sm text-muted-foreground mt-1">Outstanding amounts grouped by age</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x">
        <div className="p-4 md:p-6 text-center">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">0 - 30 Days</p>
          <p className="text-xl font-bold">{formatCurrency(buckets.current)}</p>
        </div>
        
        <div className="p-4 md:p-6 text-center">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">31 - 60 Days</p>
          <p className="text-xl font-bold text-amber-600 dark:text-amber-500">{formatCurrency(buckets.thirtyToSixty)}</p>
        </div>
        
        <div className="p-4 md:p-6 text-center">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">61 - 90 Days</p>
          <p className="text-xl font-bold text-orange-600 dark:text-orange-500">{formatCurrency(buckets.sixtyToNinety)}</p>
        </div>
        
        <div className="p-4 md:p-6 text-center">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">&gt; 90 Days</p>
          <p className="text-xl font-bold text-red-600 dark:text-red-500">{formatCurrency(buckets.overNinety)}</p>
        </div>
        
        <div className="col-span-2 md:col-span-1 p-4 md:p-6 text-center bg-muted/20">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Total Due</p>
          <p className="text-2xl font-bold text-primary">{formatCurrency(buckets.total)}</p>
        </div>
      </div>
    </div>
  );
}
