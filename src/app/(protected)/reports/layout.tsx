import React from 'react';
import { AppPageContainer } from '@/components/layout/crud/app-page-container';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reports & Analytics',
  description: 'Business intelligence and reporting',
};

export default function ReportsLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppPageContainer maxWidth="full" className="pb-8">
      {children}
    </AppPageContainer>
  );
}
