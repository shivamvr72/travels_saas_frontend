'use client';

import React from 'react';
import Link from 'next/link';
import { AppDataTable, ColumnDef } from '@/components/shared/app-data-table';
import { AppStatusBadge } from '@/components/shared/app-status-badge';
import { formatCurrency, formatDateTime } from '@/shared/utils/formatters';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText } from 'lucide-react';

export function SettlementListTable({ 
  data, 
  isLoading, 
  error,
  onRetry 
}: { 
  data?: any[], 
  isLoading?: boolean, 
  error?: any,
  onRetry?: () => void
}) {

  const columns: ColumnDef<any>[] = [
    {
      header: 'Trip Number',
      accessorKey: 'trip_number',
      cell: (item) => (
        <div className="font-medium flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          {item.trip_number || item.id?.split('-')[0].toUpperCase()}
        </div>
      ),
    },
    {
      header: 'Customer',
      accessorKey: 'customer_name',
      cell: (item) => item.customer?.name || item.customer_name || 'N/A',
    },
    {
      header: 'Driver',
      accessorKey: 'driver_name',
      cell: (item) => item.driver?.name || item.driver_name || 'N/A',
    },
    {
      header: 'Vehicle',
      accessorKey: 'vehicle_number',
      cell: (item) => item.vehicle?.registration_number || item.vehicle_number || 'N/A',
    },
    {
      header: 'Trip Status',
      accessorKey: 'status',
      cell: (item) => <AppStatusBadge status={item.status} />,
    },
    {
      header: 'Completed At',
      accessorKey: 'updated_at',
      cell: (item) => formatDateTime(item.updated_at),
    },
    {
      header: 'Action',
      cell: (item) => (
        <Link href={`/settlements/${item.id}`}>
          <Button variant="ghost" size="sm">
            Settle <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      ),
    }
  ];

  return (
    <AppDataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      error={error}
      onRetry={onRetry}
      rowKey={(item) => item.id}
      emptyState={{
        title: 'No Pending Settlements',
        description: 'All completed trips have been settled.',
      }}
    />
  );
}
