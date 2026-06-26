import { Metadata } from 'next';
import { AppToolbar } from '@/components/layout/crud/app-toolbar';
import { AppPageContainer } from '@/components/layout/crud/app-page-container';
import { DashboardKpiCards, DashboardAlertsRow, DashboardBottomRow } from '@/features/dashboard/components/dashboard-views';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Operations overview and KPIs',
};

export default function DashboardPage() {
  return (
    <AppPageContainer maxWidth="full" className="pb-8">
      <AppToolbar 
        title="Dashboard" 
        description="Overview of your daily travel operations and financials."
      />
      
      <DashboardKpiCards />
      
      <DashboardAlertsRow />
      
      <DashboardBottomRow />
      
    </AppPageContainer>
  );
}
