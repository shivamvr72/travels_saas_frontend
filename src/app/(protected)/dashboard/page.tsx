import { DashboardKpiCards } from '@/features/dashboard/components/dashboard-kpi-cards';
import { DashboardQuickActions } from '@/features/dashboard/components/dashboard-quick-actions';
import { DashboardOperationsSnapshot } from '@/features/dashboard/components/dashboard-operations-snapshot';
import { DashboardFinancialSnapshot } from '@/features/dashboard/components/dashboard-financial-snapshot';
import { DashboardAlerts } from '@/features/dashboard/components/dashboard-alerts';
import { AppPageHeader } from '@/components/shared';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Operations overview and KPIs',
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 w-full pb-8">
      <AppPageHeader 
        title="Dashboard" 
        description="Overview of your daily travel operations and financials."
      />
      
      <DashboardKpiCards />
      
      <DashboardQuickActions />
      
      <div className="grid gap-4 md:grid-cols-2">
        <DashboardOperationsSnapshot />
        <DashboardFinancialSnapshot />
      </div>
      
      <DashboardAlerts />
    </div>
  );
}
