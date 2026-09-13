'use client';

import { RevenueByPeriodResponse } from '../domain/analytics-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface RevenueTrendChartProps {
  data: RevenueByPeriodResponse[];
  isLoading: boolean;
  title?: string;
  description?: string;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/95 backdrop-blur-md border border-border/50 rounded-xl shadow-xl p-4 text-sm font-sans animate-in zoom-in-95 duration-200 min-w-[200px]">
        <p className="font-bold mb-3 pb-2 border-b border-border/50 text-foreground/90 uppercase tracking-wider text-xs">{label}</p>
        <div className="flex flex-col gap-2.5">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <div 
                  className="w-2.5 h-2.5 rounded-sm" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-muted-foreground font-medium">{entry.name}</span>
              </div>
              <span className="font-black tabular-nums">{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function RevenueTrendChart({ 
  data, 
  isLoading,
  title = "Revenue & Profit Trends",
  description = "Visualizing financial performance over time"
}: RevenueTrendChartProps) {
  
  if (isLoading) {
    return (
      <Card className="w-full border-muted/40 shadow-sm bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <CardTitle className="text-lg font-bold">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[320px] w-full flex items-center justify-center bg-muted/10 rounded-2xl animate-pulse border border-border/40">
            <span className="text-muted-foreground/60 font-medium tracking-wide animate-pulse">Loading chart data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="w-full border-muted/40 shadow-sm bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <CardTitle className="text-lg font-bold">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[320px] w-full flex items-center justify-center border border-dashed border-muted-foreground/20 rounded-2xl bg-muted/5">
            <span className="text-muted-foreground/60">No data available for this period.</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border-muted/40 shadow-sm hover:shadow-md transition-shadow duration-300 bg-gradient-to-br from-card to-card/50 font-sans group">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-bold tracking-tight">{title}</CardTitle>
          <CardDescription className="mt-1">{description}</CardDescription>
        </div>
        <div className="flex gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-blue-500"></div> Net Profit</div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></div> Revenue</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[320px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.2} />
              <XAxis 
                dataKey="period_label" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#878c96', fontWeight: 500 }}
                dy={15}
                minTickGap={20}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#878c96', fontWeight: 500 }}
                tickFormatter={(value) => {
                  const val = Math.abs(value);
                  const formatted = val >= 1000 ? `${(val / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k` : val.toString();
                  return value < 0 ? `-₹${formatted}` : `₹${formatted}`;
                }}
                dx={-10}
                width={65}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#878c96', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.5 }} />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }}
              />
              <Area
                type="monotone"
                dataKey="profit"
                name="Net Profit"
                stroke="#3b82f6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorProfit)"
                activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
