'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTripList, useDeleteTrip } from '../api';
import { AppToolbar } from '@/components/layout/crud/app-toolbar';
import { AppDataTable } from '@/components/layout/crud/app-data-table';
import { TripStatusBadge } from '../components/trip-status-badge';
import { TripFilterBar } from '../components/trip-filter-bar';
import { useTripFilters } from '../hooks/use-trip-filters';
import { AppStatusBadge } from '@/components/shared/app-status-badge';
import { Button } from '@/components/ui/button';
import { Edit, Eye, MoreHorizontal, Trash, LayoutGrid, List, Calendar, LayoutPanelLeft } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PERMISSIONS } from '@/shared/permissions';
import { RequirePermission } from '@/shared/permissions/require-permission';
import { tripNumberService } from '../services/trip-number.service';
import { Trip } from '../domain/trip-types';
import { TripCard } from '../components/trip-card';

export function TripListPage() {
  const router = useRouter();
  
  const { 
    filters, 
    searchValue, 
    setSearchValue, 
    updateFilter, 
    resetFilters, 
    activeFilterCount, 
    queryParams 
  } = useTripFilters();

  const [params, setParams] = useState({ page: 1, page_size: 10 });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'table' | 'card' | 'calendar' | 'board'>('table');

  const { data, isLoading, refetch } = useTripList({ ...params, ...queryParams });

  // In FE-4.2 this will be extracted to a separate file or hook
  const columns = [
    {
      key: 'trip_number',
      header: 'Trip #',
      render: (item: Trip) => (
        <Link href={`/trips/${item.id}`} className="font-mono text-primary hover:underline">
          {tripNumberService.format(item.trip_number)}
        </Link>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (item: Trip) => item.customer?.name || <span className="text-muted-foreground text-sm">N/A</span>,
    },
    {
      key: 'route',
      header: 'Route',
      render: (item: Trip) => {
        if (item.route?.from_location && item.route?.to_location) {
          return `${item.route.from_location} → ${item.route.to_location}`;
        }
        return `${item.origin} → ${item.destination}`;
      },
    },
    {
      key: 'vehicle',
      header: 'Vehicle',
      render: (item: Trip) => item.vehicle?.license_plate || <span className="text-muted-foreground text-sm">Unassigned</span>,
    },
    {
      key: 'driver',
      header: 'Driver',
      render: (item: Trip) => item.driver?.name || <span className="text-muted-foreground text-sm">Unassigned</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: Trip) => <TripStatusBadge status={item.status} size="sm" />,
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (item: Trip) => {
        const priorityColors: Record<string, 'inactive' | 'upcoming' | 'warning' | 'critical'> = {
          'Low': 'inactive',
          'Normal': 'upcoming',
          'High': 'warning',
          'Urgent': 'critical'
        };
        const mappedVariant = priorityColors[item.priority] || 'inactive';
        return <AppStatusBadge status={mappedVariant} size="sm" showIcon={false} />;
      },
    },
    {
      key: 'start_date',
      header: 'Start Date',
      render: (item: Trip) => new Date(item.start_date).toLocaleDateString(),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: Trip) => (
        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md hover:bg-accent text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-foreground">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => router.push(`/trips/${item.id}`)}>
              <Eye className="mr-2 h-4 w-4" /> View details
            </DropdownMenuItem>
            <RequirePermission roles={PERMISSIONS.TRIPS_EDIT as any}>
              <DropdownMenuItem onClick={() => router.push(`/trips/${item.id}/edit`)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
            </RequirePermission>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const handleBulkAction = (action: string) => {
    alert(`FE-4.2: Execute bulk action ${action} on ${selectedIds.size} items.`);
  };

  return (
    <div className="space-y-4">
      <AppToolbar
        title="Trips"
        description="Manage and dispatch your trips"
        primaryAction={{
          label: 'New Trip',
          onClick: () => router.push('/trips/new'),
          permission: PERMISSIONS.TRIPS_CREATE as any,
        }}
        onRefresh={() => refetch()}
        searchValue={searchValue}
        onSearch={setSearchValue}
        onToggleFilter={() => setIsFilterOpen(prev => !prev)}
        isFilterOpen={isFilterOpen}
        activeFilterCount={activeFilterCount}
        selectedCount={selectedIds.size}
        bulkActions={[
          { label: 'Update Status', onClick: () => handleBulkAction('status') },
          { label: 'Assign Resources', onClick: () => handleBulkAction('assign') },
          { label: 'Dispatch', onClick: () => handleBulkAction('dispatch') },
          { label: 'Cancel', onClick: () => handleBulkAction('cancel'), destructive: true },
        ]}
      />
      
      <div className="flex items-center justify-between">
        <Tabs value={viewMode} onValueChange={(val) => setViewMode(val as any)}>
          <TabsList>
            <TabsTrigger value="table"><List className="h-4 w-4 mr-2" /> Table</TabsTrigger>
            <TabsTrigger value="card"><LayoutGrid className="h-4 w-4 mr-2" /> Grid</TabsTrigger>
            <TabsTrigger value="calendar" disabled><Calendar className="h-4 w-4 mr-2" /> Calendar</TabsTrigger>
            <TabsTrigger value="board" disabled><LayoutPanelLeft className="h-4 w-4 mr-2" /> Board</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <TripFilterBar 
        filters={filters}
        onUpdateFilter={updateFilter}
        onReset={resetFilters}
        isOpen={isFilterOpen}
      />

      {viewMode === 'table' && (
        <AppDataTable
          columns={columns}
          data={data?.items || []}
          isLoading={isLoading}
          selectable={true}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
      )}

      {viewMode === 'card' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.items.map(trip => (
            <TripCard 
              key={trip.id} 
              trip={trip} 
              selectable={true}
              isSelected={selectedIds.has(trip.id)}
              onSelect={(checked) => {
                const newIds = new Set(selectedIds);
                if (checked) newIds.add(trip.id);
                else newIds.delete(trip.id);
                setSelectedIds(newIds);
              }}
            />
          ))}
          {(!data?.items || data.items.length === 0) && !isLoading && (
            <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
              No trips found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
