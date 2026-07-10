import { Metadata } from 'next';
import { AppPageContainer } from '@/components/layout/crud/app-page-container';
import { ExecutiveDashboardPage } from '@/features/reports/pages/executive-dashboard-page';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Operations overview and KPIs',
};

export default function DashboardPage() {
  return (
    <AppPageContainer maxWidth="full" className="pb-8">
      <ExecutiveDashboardPage />
    </AppPageContainer>
  );
}
