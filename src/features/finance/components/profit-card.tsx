import { ProfitabilitySummary } from '../domain/finance-types';
import { CURRENCY_CONFIG } from '../domain/finance-constants';
import { TrendingUp, TrendingDown, IndianRupee, MinusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProfitCardProps {
  summary: ProfitabilitySummary;
}

export function ProfitCard({ summary }: ProfitCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(CURRENCY_CONFIG.locale, {
      style: 'currency',
      currency: CURRENCY_CONFIG.currency,
    }).format(amount);
  };

  const isProfitable = summary.net_profit > 0;
  const isLoss = summary.net_profit < 0;

  return (
    <Card className="overflow-hidden p-0 gap-0">
      <CardHeader className="bg-muted/30 border-b p-4 sm:p-6">
        <CardTitle className="text-lg flex items-center gap-2">
          <IndianRupee className="h-5 w-5 text-primary" />
          Profitability Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
          <div className="p-6 space-y-4">
            <div>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-1">Gross Revenue</p>
              <p className="text-2xl font-semibold">{formatCurrency(summary.gross_revenue)}</p>
              <p className="text-xs text-muted-foreground mt-1">Excludes GST</p>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-1">Total Expenses</p>
              <p className="text-2xl font-semibold">{formatCurrency(summary.total_expenses)}</p>
              <p className="text-xs text-muted-foreground mt-1">Fuel, Toll, Allowance, etc.</p>
            </div>
          </div>
          
          <div className="p-6 flex flex-col justify-center bg-muted/10">
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-2">Net Profit</p>
            
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-4xl font-bold ${isProfitable ? 'text-green-600 dark:text-green-400' : isLoss ? 'text-red-600 dark:text-red-400' : ''}`}>
                {formatCurrency(summary.net_profit)}
              </span>
              
              {isProfitable && <TrendingUp className="h-8 w-8 text-green-500" />}
              {isLoss && <TrendingDown className="h-8 w-8 text-red-500" />}
              {!isProfitable && !isLoss && <MinusCircle className="h-8 w-8 text-muted-foreground" />}
            </div>
            
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm text-muted-foreground">Profit Margin:</span>
              <span className={`px-2.5 py-0.5 rounded-full text-sm font-medium ${
                isProfitable ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                isLoss ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                'bg-muted text-muted-foreground'
              }`}>
                {summary.profit_margin_percent}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
