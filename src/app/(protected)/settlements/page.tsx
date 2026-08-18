'use client';

import { useMemo } from 'react';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { SettlementDashboard } from '@/features/trip-settlement/components/settlement-dashboard';
import { SettlementListTable } from '@/features/trip-settlement/components/settlement-list-table';
import { useSettlementTrips, useSettlementDashboardMetrics } from '@/features/trip-settlement/api/trip-settlement-api';
import { RequirePermission } from '@/shared/permissions/require-permission';

export default function SettlementsPage() {
  const { data: trips, isLoading, error, refetch } = useSettlementTrips();

  const { data: metricsData, isLoading: isLoadingMetrics } = useSettlementDashboardMetrics();

  const metrics = useMemo(() => {
    if (!metricsData) return { pendingCount: 0, completedCount: 0, totalBalanceDue: 0 };
    return {
      pendingCount: metricsData.pending_count,
      completedCount: metricsData.settled_count,
      totalBalanceDue: metricsData.total_outstanding,
    };
  }, [metricsData]);

  return (
    <RequirePermission roles={['admin', 'manager']}>
      <div className="flex flex-col gap-6 p-6">
        <AppPageHeader 
          title="Trip Settlements" 
          description="Manage financial closure for completed trips."
        />
        
        <SettlementDashboard 
          metrics={metrics} 
          isLoading={isLoadingMetrics} 
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
