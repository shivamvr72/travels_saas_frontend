import { ReceivablesPage } from '@/features/finance/pages/receivables-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Receivables | SVR Travels',
  description: 'Outstanding Receivables and Aging',
};

export default function ReceivablesRoutePage() {
  return <ReceivablesPage />;
}
