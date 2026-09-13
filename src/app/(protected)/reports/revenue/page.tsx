'use client';

import React, { useState, useEffect } from 'react';
import { AnalyticsApi } from '@/features/analytics/api/analytics-api';
import { ExecutiveSummaryCards } from '@/features/analytics/components/executive-summary-cards';
import { RevenueTrendChart } from '@/features/analytics/components/revenue-trend-chart';
import { ExpenseBreakdownChart } from '@/features/analytics/components/expense-breakdown-chart';
import { TopCustomersTable } from '@/features/analytics/components/top-customers-table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { startOfMonth, endOfMonth, subMonths, format, startOfYear, subDays } from 'date-fns';

import { ExecutiveSummaryResponse, RevenueByPeriodResponse, ExpenseBreakdownResponse, TopEntityResponse } from '@/features/analytics/domain/analytics-types';

export default function RevenueAnalyticsPage() {
  const [period, setPeriod] = useState<string>('this_month');
  const [isLoading, setIsLoading] = useState(true);
  
  const [summaryData, setSummaryData] = useState<ExecutiveSummaryResponse | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueByPeriodResponse[]>([]);
  const [expenseData, setExpenseData] = useState<ExpenseBreakdownResponse[]>([]);
  const [customersData, setCustomersData] = useState<TopEntityResponse[]>([]);

  useEffect(() => {
    fetchData(period);
  }, [period]);

  async function fetchData(selectedPeriod: string) {
    try {
      setIsLoading(true);
      
      const today = new Date();
      let startDateStr = '';
      let endDateStr = format(today, 'yyyy-MM-dd');
      
      if (selectedPeriod === 'this_month') {
        startDateStr = format(startOfMonth(today), 'yyyy-MM-dd');
      } else if (selectedPeriod === 'last_month') {
        const lastMonth = subMonths(today, 1);
        startDateStr = format(startOfMonth(lastMonth), 'yyyy-MM-dd');
        endDateStr = format(endOfMonth(lastMonth), 'yyyy-MM-dd');
      } else if (selectedPeriod === 'last_7_days') {
        startDateStr = format(subDays(today, 7), 'yyyy-MM-dd');
      } else if (selectedPeriod === 'ytd') {
        startDateStr = format(startOfYear(today), 'yyyy-MM-dd');
      }
      
      const params = { startDate: startDateStr, endDate: endDateStr };

      // Depending on the period, we might want monthly buckets instead of daily
      const isLongPeriod = selectedPeriod === 'ytd';

      const [summary, revenue, expenses, customers] = await Promise.all([
        AnalyticsApi.getExecutiveSummary(params),
        isLongPeriod ? AnalyticsApi.getRevenueMonthly(params) : AnalyticsApi.getRevenueDaily(params),
        AnalyticsApi.getExpenseBreakdown(params),
        AnalyticsApi.getTopCustomers(params, 5)
      ]);

      setSummaryData(summary);
      setRevenueData(revenue);
      setExpenseData(expenses);
      setCustomersData(customers);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Revenue Analytics</h1>
          <p className="text-muted-foreground mt-1">Financial performance and operational insights</p>
        </div>
        
        <div className="w-full sm:w-auto">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px] bg-background">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last_7_days">Last 7 Days</SelectItem>
              <SelectItem value="this_month">This Month</SelectItem>
              <SelectItem value="last_month">Last Month</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ExecutiveSummaryCards data={summaryData} isLoading={isLoading} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2">
          <RevenueTrendChart 
            data={revenueData} 
            isLoading={isLoading} 
            title={period === 'ytd' ? "Monthly Revenue Trend" : "Daily Revenue Trend"} 
          />
        </div>
        <ExpenseBreakdownChart data={expenseData} isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <TopCustomersTable data={customersData} isLoading={isLoading} />
      </div>
    </div>
  );
}
