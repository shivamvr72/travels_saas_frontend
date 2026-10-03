'use client';

import { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { 
  useGroupedTripExpenses, 
  TripExpenseGroupResponse,
  useVehicleExpenses,
  VehicleExpense 
} from '../api';
import { useTableState, useDebounce } from '@/shared/hooks';
import { AppToolbar } from '@/components/layout/crud/app-toolbar';
import { AppDataTable } from '@/components/layout/crud/app-data-table';
import { AppPagination } from '@/components/layout/crud/app-pagination';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VehicleNameCell, TripRefCell, DescriptionCell, OdometerCell } from './expense-list-cells';
import { CATEGORY_COLORS } from '../config';
import { EXPENSE_TYPES, EXPENSE_TYPE_LABELS, PAYMENT_MODES } from '../schemas';
import { formatCurrency, formatDate } from '@/shared/utils';
import { Badge } from '@/components/ui/badge';
import { Plus, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TripExpensesDetailSheet } from './trip-expenses-detail-sheet';

export function TripExpensesList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Tab state (supports URL query or local state)
  const initialTab = searchParams.get('tab') === 'all' ? 'all' : 'grouped';
  const [activeTab, setActiveTab] = useState<'grouped' | 'all'>(initialTab);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);

  // Table state for Grouped By Trip
  const {
    state: groupedState,
    setPage: setGroupedPage,
    setSearch: setGroupedSearch,
    setSorting: setGroupedSorting,
    activeFilterCount: groupedFilterCount,
    toApiParams: toGroupedApiParams,
  } = useTableState({
    defaultSortBy: 'latest_expense_date',
    defaultSortDir: 'desc',
  });

  // Table state for All Entries
  const {
    state: flatState,
    setPage: setFlatPage,
    setSearch: setFlatSearch,
    setSorting: setFlatSorting,
    setFilter: setFlatFilter,
    resetFilters: resetFlatFilters,
    toApiParams: toFlatApiParams,
  } = useTableState({
    defaultSortBy: 'expense_date',
    defaultSortDir: 'desc',
  });

  const debouncedGroupedSearch = useDebounce(groupedState.search, 400);
  const debouncedFlatSearch = useDebounce(flatState.search, 400);

  // Grouped API query
  const { 
    data: groupedData, 
    isLoading: isGroupedLoading, 
    refetch: refetchGrouped 
  } = useGroupedTripExpenses({
    ...toGroupedApiParams(),
    search: debouncedGroupedSearch,
  });

  // Flat individual expenses API query
  const { 
    data: flatData, 
    isLoading: isFlatLoading, 
    refetch: refetchFlat 
  } = useVehicleExpenses({
    ...toFlatApiParams(),
    search: debouncedFlatSearch,
  });

  // Filter count for flat view
  const categoryFilter = flatState.filters['expense_type'] || 'all';
  const paymentModeFilter = flatState.filters['payment_mode'] || 'all';
  const flatActiveFilterCount = (categoryFilter !== 'all' ? 1 : 0) + (paymentModeFilter !== 'all' ? 1 : 0);

  const handleTabChange = (val: string) => {
    const newTab = val as 'grouped' | 'all';
    setActiveTab(newTab);
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', newTab);
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  // ─── Grouped Columns ──────────────────────────────────────────────────────────
  const groupedColumns = [
    {
      key: 'trip_number',
      header: 'Trip',
      sortable: false,
      render: (item: TripExpenseGroupResponse) => {
        if (!item.trip_id) {
          return (
            <Badge variant="secondary" className="font-medium text-xs">
              <Receipt className="h-3 w-3 mr-1" /> Non-Trip Expenses
            </Badge>
          );
        }
        return <TripRefCell tripId={item.trip_id} />;
      },
    },
    {
      key: 'vehicle_id',
      header: 'Vehicle',
      sortable: false,
      render: (item: TripExpenseGroupResponse) => <VehicleNameCell vehicleId={item.vehicle_id} />,
    },
    {
      key: 'expense_count',
      header: 'Expenses',
      sortable: false,
      align: 'center' as const,
      render: (item: TripExpenseGroupResponse) => (
        <span className="text-muted-foreground">{item.expense_count} logged</span>
      ),
    },
    {
      key: 'total_km',
      header: 'Total Distance',
      sortable: false,
      align: 'right' as const,
      render: (item: TripExpenseGroupResponse) => {
        if (item.total_km == null) return <span className="text-muted-foreground text-xs">—</span>;
        return (
          <span className="tabular-nums">
            {item.total_km.toLocaleString('en-IN')} <span className="text-muted-foreground text-xs">km</span>
          </span>
        );
      },
    },
    {
      key: 'total_amount',
      header: 'Total Cost',
      sortable: false,
      align: 'right' as const,
      render: (item: TripExpenseGroupResponse) => (
        <span className="font-semibold tabular-nums">{formatCurrency(item.total_amount)}</span>
      ),
    },
    {
      key: 'latest_expense_date',
      header: 'Latest Entry',
      sortable: false,
      align: 'right' as const,
      render: (item: TripExpenseGroupResponse) => (
        <span className="text-muted-foreground tabular-nums">
          {item.latest_expense_date ? formatDate(item.latest_expense_date) : '—'}
        </span>
      ),
    },
  ];

  // ─── All Individual Entries Columns ──────────────────────────────────────────
  const flatColumns = [
    {
      key: 'expense_date',
      header: 'Date',
      sortable: true,
      render: (item: VehicleExpense) => (
        <span className="tabular-nums text-sm">
          {item.expense_date ? formatDate(item.expense_date) : '—'}
        </span>
      ),
    },
    {
      key: 'expense_type',
      header: 'Category',
      sortable: true,
      render: (item: VehicleExpense) => (
        <Badge
          variant="outline"
          className={`text-xs font-medium ${CATEGORY_COLORS[item.expense_type] ?? ''}`}
        >
          {EXPENSE_TYPE_LABELS[item.expense_type as keyof typeof EXPENSE_TYPE_LABELS] ?? item.expense_type}
        </Badge>
      ),
    },
    {
      key: 'vehicle_id',
      header: 'Vehicle',
      sortable: false,
      render: (item: VehicleExpense) => <VehicleNameCell vehicleId={item.vehicle_id} />,
    },
    {
      key: 'vendor_name',
      header: 'Vendor / Paid By',
      sortable: true,
      render: (item: VehicleExpense) => (
        <DescriptionCell vendorName={item.vendor_name} notes={item.notes} />
      ),
    },
    {
      key: 'trip_id',
      header: 'Trip',
      sortable: false,
      render: (item: VehicleExpense) => <TripRefCell tripId={item.trip_id} />,
    },
    {
      key: 'payment_mode',
      header: 'Mode',
      sortable: true,
      render: (item: VehicleExpense) => (
        <Badge variant="secondary" className="text-xs uppercase font-mono">
          {item.payment_mode || '—'}
        </Badge>
      ),
    },
    {
      key: 'km_at_expense',
      header: 'Odometer',
      sortable: true,
      render: (item: VehicleExpense) => <OdometerCell km={item.km_at_expense} />,
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      className: 'font-semibold',
      render: (item: VehicleExpense) => (
        <span className="font-semibold tabular-nums">{formatCurrency(item.amount)}</span>
      ),
    },
  ];

  const handleGroupedRowClick = (item: TripExpenseGroupResponse) => {
    if (item.trip_id) {
      setSelectedTripId(item.trip_id);
      setIsDetailSheetOpen(true);
    } else {
      handleTabChange('all');
    }
  };

  const handleFlatRowClick = (item: VehicleExpense) => {
    router.push(`/expenses/${item.id}`);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 w-full gap-2">
      {/* ─── Unified Top Toolbar (Single Source of Truth) ─── */}
      <AppToolbar 
        title="Expenses" 
        description="Manage and track vehicle and trip expenses"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Expenses' }
        ]}
        primaryAction={{
          label: "Add Expense",
          onClick: () => router.push('/expenses/new'),
          icon: <Plus className="h-4 w-4 mr-2" />
        }}
        searchValue={activeTab === 'grouped' ? groupedState.search : flatState.search}
        onSearch={activeTab === 'grouped' ? setGroupedSearch : setFlatSearch}
        onRefresh={() => {
          if (activeTab === 'grouped') refetchGrouped();
          else refetchFlat();
        }}
        onToggleFilter={() => setIsFilterOpen(prev => !prev)}
        isFilterOpen={isFilterOpen}
        activeFilterCount={activeTab === 'grouped' ? groupedFilterCount : flatActiveFilterCount}
      />

      {/* ─── Tabs Switcher ─── */}
      <div className="flex items-center justify-between shrink-0">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="grouped">By Trip</TabsTrigger>
            <TabsTrigger value="all">All Entries</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* ─── Filter Bar ─── */}
      {isFilterOpen && (
        <Card className="shrink-0 bg-muted/30 border-muted">
          <CardContent className="py-3 px-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Category:</span>
              <Select 
                value={categoryFilter} 
                onValueChange={(val) => setFlatFilter('expense_type', val === 'all' ? null : val)}
              >
                <SelectTrigger className="h-8 w-44 text-xs">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {EXPENSE_TYPES.map(t => (
                    <SelectItem key={t} value={t}>
                      {EXPENSE_TYPE_LABELS[t] || t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Payment Mode:</span>
              <Select 
                value={paymentModeFilter} 
                onValueChange={(val) => setFlatFilter('payment_mode', val === 'all' ? null : val)}
              >
                <SelectTrigger className="h-8 w-36 text-xs">
                  <SelectValue placeholder="All Modes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modes</SelectItem>
                  {PAYMENT_MODES.map(m => (
                    <SelectItem key={m} value={m}>
                      {m.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {flatActiveFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                onClick={resetFlatFilters}
              >
                Reset filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* ─── Main Content Container (strictly flex-1 min-h-0) ─── */}
      <div className="flex-1 flex flex-col min-h-0 gap-2">
        {activeTab === 'grouped' ? (
          <>
            <AppDataTable
              className="flex-1 min-h-0"
              data={(groupedData as any)?.data || (groupedData as any)?.items || []}
              columns={groupedColumns as any}
              isLoading={isGroupedLoading}
              onRowClick={handleGroupedRowClick}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              sortBy={groupedState.sortBy}
              sortDir={groupedState.sortDir}
              onSortChange={setGroupedSorting}
              emptyState={{
                title: "No trips found",
                description: "There are no expenses logged for any trips yet."
              }}
              getRowId={(item) => item.trip_id || 'non-trip'}
            />
            <div className="shrink-0">
              <AppPagination
                page={groupedData?.page || groupedState.page}
                pageSize={(groupedData as any)?.page_size || (groupedData as any)?.size || groupedState.pageSize}
                total={groupedData?.total || 0}
                onPageChange={setGroupedPage}
              />
            </div>
          </>
        ) : (
          <>
            <AppDataTable
              className="flex-1 min-h-0"
              data={(flatData as any)?.data || (flatData as any)?.items || []}
              columns={flatColumns as any}
              isLoading={isFlatLoading}
              onRowClick={handleFlatRowClick}
              sortBy={flatState.sortBy}
              sortDir={flatState.sortDir}
              onSortChange={setFlatSorting}
              emptyState={{
                title: "No expenses found",
                description: flatState.search || flatActiveFilterCount > 0
                  ? "Try adjusting your search or filters"
                  : "Get started by adding your first vehicle expense"
              }}
              getRowId={(item) => item.id}
            />
            <div className="shrink-0">
              <AppPagination
                page={flatData?.page || flatState.page}
                pageSize={(flatData as any)?.page_size || (flatData as any)?.size || flatState.pageSize}
                total={flatData?.total || 0}
                onPageChange={setFlatPage}
              />
            </div>
          </>
        )}
      </div>

      {/* ─── Slide-Over Trip Expenses Breakdown Sheet ─── */}
      <TripExpensesDetailSheet
        tripId={selectedTripId}
        open={isDetailSheetOpen}
        onOpenChange={setIsDetailSheetOpen}
      />
    </div>
  );
}
