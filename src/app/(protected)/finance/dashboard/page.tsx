import { FinanceDashboard } from '@/features/finance/dashboard/finance-dashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Finance Dashboard | SVR Travels',
  description: 'Financial Overview and Metrics',
};

export default function FinanceDashboardPage() {
  return <FinanceDashboard />;
}
