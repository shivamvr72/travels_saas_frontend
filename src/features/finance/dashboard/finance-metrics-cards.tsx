import { CURRENCY_CONFIG } from '../domain/finance-constants';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Wallet, Banknote, LineChart, Target } from 'lucide-react';

interface FinanceMetrics {
  todaysRevenue: number;
  monthlyRevenue: number;
  outstandingAmount: number;
  netProfit: number;
  collectionRate: number; // percentage
}

interface FinanceMetricsCardsProps {
  metrics: FinanceMetrics;
}

export function FinanceMetricsCards({ metrics }: FinanceMetricsCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(CURRENCY_CONFIG.locale, {
      style: 'currency',
      currency: CURRENCY_CONFIG.currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Today's Revenue</p>
            <Banknote className="h-4 w-4 text-primary" />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold">{formatCurrency(metrics.todaysRevenue)}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Monthly Revenue</p>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold">{formatCurrency(metrics.monthlyRevenue)}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Outstanding</p>
            <Wallet className="h-4 w-4 text-amber-500" />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-500">{formatCurrency(metrics.outstandingAmount)}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Net Profit</p>
            <LineChart className="h-4 w-4 text-green-500" />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(metrics.netProfit)}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Collection Rate</p>
            <Target className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold">{metrics.collectionRate}%</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
