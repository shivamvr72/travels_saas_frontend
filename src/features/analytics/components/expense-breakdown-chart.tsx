'use client';

import { ExpenseBreakdownResponse } from '../domain/analytics-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface ExpenseBreakdownChartProps {
  data: ExpenseBreakdownResponse[];
  isLoading: boolean;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899', '#64748b'];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card/95 backdrop-blur-md border border-border/50 rounded-xl shadow-xl p-4 text-sm font-sans animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/50">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0].color }}></div>
          <p className="font-bold uppercase tracking-wider text-xs text-foreground/80">{data.expense_type.replace(/_/g, ' ')}</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between gap-6 items-end">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-black text-lg">{formatCurrency(data.total)}</span>
          </div>
          <div className="flex justify-between gap-6 items-end">
            <span className="text-muted-foreground">Share</span>
            <span className="font-semibold text-foreground/90">{data.pct_of_total.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between gap-6 items-end">
            <span className="text-muted-foreground">Transactions</span>
            <span className="font-semibold text-foreground/90">{data.count}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function ExpenseBreakdownChart({ data, isLoading }: ExpenseBreakdownChartProps) {
  if (isLoading) {
    return (
      <Card className="col-span-1 border-muted/40 shadow-sm bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Expense Breakdown</CardTitle>
          <CardDescription>Distribution of operational costs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[320px] w-full flex items-center justify-center bg-muted/10 rounded-2xl animate-pulse border border-border/40">
            <span className="text-muted-foreground/60 font-medium tracking-wide animate-pulse">Computing expenses...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="col-span-1 border-muted/40 shadow-sm bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Expense Breakdown</CardTitle>
          <CardDescription>Distribution of operational costs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[320px] w-full flex items-center justify-center border border-dashed border-muted-foreground/20 rounded-2xl bg-muted/5">
            <span className="text-muted-foreground/60">No expense data available.</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 border-muted/40 shadow-sm hover:shadow-md transition-shadow duration-300 bg-gradient-to-br from-card to-card/50 font-sans group">
      <CardHeader>
        <CardTitle className="text-xl font-bold tracking-tight">Expense Breakdown</CardTitle>
        <CardDescription>Visualizing operational cost distribution</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col h-[320px] w-full">
          <div className="flex-1 min-h-[220px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="total"
                  nameKey="expense_type"
                  stroke="transparent"
                  className="transition-all duration-300 outline-none hover:opacity-90"
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      className="transition-all duration-300 hover:brightness-110 cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Text overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Total</span>
              <span className="text-xl font-black text-foreground/90">
                {formatCurrency(data.reduce((acc, curr) => acc + curr.total, 0))}
              </span>
            </div>
          </div>
          
          {/* Custom Elegant Legend */}
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 max-h-[100px] overflow-y-auto px-2 custom-scrollbar">
            {data.map((entry, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs group/item cursor-default">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="w-2.5 h-2.5 rounded-sm shrink-0 transition-transform group-hover/item:scale-125" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                  <span className="truncate capitalize font-medium text-muted-foreground group-hover/item:text-foreground transition-colors">
                    {entry.expense_type.replace(/_/g, ' ')}
                  </span>
                </div>
                <span className="font-semibold tabular-nums ml-2">{entry.pct_of_total.toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
