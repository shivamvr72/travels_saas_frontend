import { ExecutiveSummaryResponse } from '../domain/analytics-types';
import { Card, CardContent } from '@/components/ui/card';
import { IndianRupee, TrendingUp, TrendingDown, Target, CreditCard, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExecutiveSummaryCardsProps {
  data: ExecutiveSummaryResponse | null;
  isLoading: boolean;
}

export function ExecutiveSummaryCards({ data, isLoading }: ExecutiveSummaryCardsProps) {
  if (isLoading || !data) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse bg-card/50 border-muted/30 shadow-none">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="h-4 bg-muted/50 rounded-full w-24"></div>
                <div className="h-10 w-10 bg-muted/50 rounded-2xl"></div>
              </div>
              <div className="h-8 bg-muted/50 rounded-lg w-3/4 mb-3"></div>
              <div className="h-3 bg-muted/50 rounded-full w-1/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateMargin = (profit: number, revenue: number) => {
    if (revenue === 0) return profit < 0 ? -100 : 0;
    return (profit / revenue) * 100;
  };

  const margin = calculateMargin(data.net_profit, data.monthly_revenue);

  const metrics = [
    {
      title: 'Gross Revenue',
      value: formatCurrency(data.monthly_revenue),
      subtext: 'Total earnings this period',
      icon: IndianRupee,
      trend: 'up',
      trendValue: 'Active',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      shadowColor: 'hover:shadow-emerald-500/10'
    },
    {
      title: 'Net Profit',
      value: formatCurrency(data.net_profit),
      subtext: `Expenses: ${formatCurrency(data.monthly_expenses)}`,
      icon: data.net_profit >= 0 ? TrendingUp : TrendingDown,
      trend: data.net_profit >= 0 ? 'up' : 'down',
      trendValue: `${Math.abs(margin).toFixed(1)}% margin`,
      color: data.net_profit >= 0 ? 'text-blue-500' : 'text-rose-500',
      bgColor: data.net_profit >= 0 ? 'bg-blue-500/10' : 'bg-rose-500/10',
      borderColor: data.net_profit >= 0 ? 'border-blue-500/20' : 'border-rose-500/20',
      shadowColor: data.net_profit >= 0 ? 'hover:shadow-blue-500/10' : 'hover:shadow-rose-500/10'
    },
    {
      title: 'Receivables',
      value: formatCurrency(data.outstanding_receivables),
      subtext: `Collection: ${data.collection_rate_pct.toFixed(1)}%`,
      icon: CreditCard,
      trend: data.collection_rate_pct >= 80 ? 'up' : 'down',
      trendValue: 'Pending',
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      shadowColor: 'hover:shadow-amber-500/10'
    },
    {
      title: 'Fleet & Trips',
      value: `${data.total_trips_period} Trips`,
      subtext: `${data.vehicles_running} Active · ${data.vehicles_idle} Idle`,
      icon: Target,
      trend: 'up',
      trendValue: `${data.fleet_utilization_pct.toFixed(1)}% Utilized`,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      shadowColor: 'hover:shadow-purple-500/10'
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 font-sans">
      {metrics.map((metric, index) => (
        <Card 
          key={index} 
          className={cn(
            "group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
            "bg-gradient-to-b from-card to-card/50 border-muted/40",
            metric.shadowColor
          )}
        >
          {/* Subtle top glow line */}
          <div className={cn("absolute top-0 left-0 w-full h-[2px] transition-opacity opacity-50 group-hover:opacity-100", metric.bgColor)} />
          
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className={cn("p-3 rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3", metric.bgColor, metric.color)}>
                <metric.icon className="h-6 w-6" strokeWidth={2} />
              </div>
              <div className={cn("flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full", metric.bgColor, metric.color)}>
                {metric.trend === 'up' ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                {metric.trendValue}
              </div>
            </div>
            
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{metric.title}</p>
              <h3 className="text-3xl font-black tracking-tight text-foreground/90">
                {metric.value}
              </h3>
            </div>
            
            <div className="mt-4 pt-4 border-t border-border/50">
              <p className="text-sm font-medium text-muted-foreground/80 flex items-center gap-2">
                <Activity className="h-3.5 w-3.5" />
                {metric.subtext}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
