'use client';

import { useMemo } from 'react';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { SettlementDashboard } from '@/features/trip-settlement/components/settlement-dashboard';
import { SettlementListTable } from '@/features/trip-settlement/components/settlement-list-table';
import { useSettlementTrips } from '@/features/trip-settlement/api/trip-settlement-api';
import { RequirePermission } from '@/shared/permissions/require-permission';

export default function SettlementsPage() {
  const { data: trips, isLoading, error, refetch } = useSettlementTrips();

  // Compute metrics purely based on the fetched list to avoid redundant API calls.
  // In a massive production env, these would be aggregated on backend, but here it's fine for the paginated list.
  const metrics = useMemo(() => {
    if (!trips) return { pendingCount: 0, completedCount: 0, totalBalanceDue: 0 };
    
    let pendingCount = 0;
    let completedCount = 0;
    
    trips.forEach((t: { status: string }) => {
      if (t.status === 'COMPLETED') pendingCount++;
      if (t.status === 'SETTLED') completedCount++;
    });

    return {
      pendingCount,
      completedCount,
      totalBalanceDue: 0, // This would require the actual billing record per trip, usually from a dedicated dashboard endpoint or included in trip list. 
    };
  }, [trips]);

  return (
    <RequirePermission roles={['admin', 'manager']}>
      <div className="flex flex-col gap-6 p-6">
        <AppPageHeader 
          title="Trip Settlements" 
          description="Manage financial closure for completed trips."
        />
        
        <SettlementDashboard 
          metrics={metrics} 
          isLoading={isLoading} 
        />
        
        <SettlementListTable 
          data={trips} 
          isLoading={isLoading} 
          error={error} 
          onRetry={() => { refetch(); }} 
        />
      </div>
    </RequirePermission>
  );
}
