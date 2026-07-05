'use client';


import { useRouter, useSearchParams } from 'next/navigation';
import { useTripDetail } from '../api';
import { AppLoadingState } from '@/components/shared/app-loading-state';
import { AppErrorState } from '@/components/shared/app-error-state';
import { WorkspaceHeader } from './workspace-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TripOverviewTab } from './tabs/trip-overview-tab';
import { TripAssignmentTab } from './tabs/trip-assignment-tab';
import { TripActivityTab } from './tabs/trip-activity-tab';
import dynamic from 'next/dynamic';
import { Trip } from '../domain/trip-types';

const TripDocumentsTab = dynamic<{ trip: Trip }>(() => import('./tabs/trip-documents-tab').then(mod => ({ default: mod.TripDocumentsTab })), {
  loading: () => <AppLoadingState />
});

const TripExpensesTab = dynamic<{ trip: Trip }>(() => import('./tabs/trip-expenses-tab').then(mod => ({ default: mod.TripExpensesTab })), {
  loading: () => <AppLoadingState />
});

const TripInvoiceTab = dynamic<{ trip: Trip }>(() => import('./tabs/trip-invoice-tab').then(mod => ({ default: mod.TripInvoiceTab })), {
  loading: () => <AppLoadingState />
});

const TripPaymentsTab = dynamic<{ trip: Trip }>(() => import('./tabs/trip-payments-tab').then(mod => ({ default: mod.TripPaymentsTab })), {
  loading: () => <AppLoadingState />
});

const TripProfitabilityTab = dynamic<{ trip: Trip }>(() => import('./tabs/trip-profitability-tab').then(mod => ({ default: mod.TripProfitabilityTab })), {
  loading: () => <AppLoadingState />
});

interface TripWorkspaceProps {
  tripId: string;
}

export function TripWorkspace({ tripId }: TripWorkspaceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: trip, isLoading, error } = useTripDetail(tripId);

  const defaultTab = searchParams.get('tab') || 'overview';
  const activeTab = defaultTab;

  const handleTabChange = (value: string) => {
    router.replace(`/trips/${tripId}?tab=${value}`, { scroll: false });
  };

  if (isLoading) return <AppLoadingState />;
  if (error || !trip) return <AppErrorState message="Trip not found" retry={() => router.push('/trips')} />;

  return (
    <div className="flex flex-col h-full space-y-6">
      <WorkspaceHeader trip={trip} />

      <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col">
        <div className="overflow-x-auto overflow-y-hidden border-b hide-scrollbar">
          <TabsList className="w-full justify-start rounded-none h-auto p-0 bg-transparent min-w-max">
            <TabsTrigger 
              value="overview" 
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary px-4 py-2"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="assignment" 
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary px-4 py-2"
            >
              Assignment
            </TabsTrigger>
            <TabsTrigger 
              value="expenses" 
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary px-4 py-2"
            >
              Expenses
            </TabsTrigger>
            <TabsTrigger 
              value="invoice" 
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary px-4 py-2"
            >
              Invoice
            </TabsTrigger>
            <TabsTrigger 
              value="payments" 
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary px-4 py-2"
            >
              Payments
            </TabsTrigger>
            <TabsTrigger 
              value="profitability" 
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary px-4 py-2"
            >
              Profitability
            </TabsTrigger>
            <TabsTrigger 
              value="documents" 
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary px-4 py-2"
            >
              Documents
            </TabsTrigger>
            <TabsTrigger 
              value="activity" 
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary px-4 py-2"
            >
              Activity
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 mt-4">
          <TabsContent value="overview" className="m-0 border-0 p-0">
            <TripOverviewTab trip={trip} />
          </TabsContent>
          <TabsContent value="assignment" className="m-0 border-0 p-0">
            <TripAssignmentTab trip={trip} />
          </TabsContent>
          <TabsContent value="expenses" className="m-0 border-0 p-0">
            <TripExpensesTab trip={trip} />
          </TabsContent>
          <TabsContent value="invoice" className="m-0 border-0 p-0">
            <TripInvoiceTab trip={trip} />
          </TabsContent>
          <TabsContent value="payments" className="m-0 border-0 p-0">
            <TripPaymentsTab trip={trip} />
          </TabsContent>
          <TabsContent value="profitability" className="m-0 border-0 p-0">
            <TripProfitabilityTab trip={trip} />
          </TabsContent>
          <TabsContent value="documents" className="m-0 border-0 p-0">
            <TripDocumentsTab trip={trip} />
          </TabsContent>
          <TabsContent value="activity" className="m-0 border-0 p-0">
            <TripActivityTab trip={trip} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

