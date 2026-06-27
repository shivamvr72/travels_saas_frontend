'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CrudModuleConfig } from './crud-types';
import { AppPageContainer } from './app-page-container';
import { AppToolbar } from './app-toolbar';
import { AppDataTable } from './app-data-table';
import { AppPagination } from './app-pagination';
import { useTableState, useDebounce } from '@/shared/hooks';
import { Card, CardContent } from '@/components/ui/card';
import { ColumnMetadata } from './metadata-types';
import { AppDataTableColumn } from './app-data-table';
import { formatCurrency, formatDate, formatDateTime, formatPhone, formatEmail, formatDistance, formatCapacity, formatDuration, formatPercentage } from '@/shared/utils';
import { AppStatusBadge } from '@/components/shared/app-status-badge';
import { AppTextField, AppSelectField } from '@/components/form-fields';
import { useForm } from 'react-hook-form';

interface CrudListProps {
  config: CrudModuleConfig<unknown, unknown, unknown, unknown>;
}

function normalizeColumns(columns: unknown[]): AppDataTableColumn<unknown>[] {
  return columns.map(c => {
    const col = c as Record<string, unknown>;
    if (col.type) {
      // It's a ColumnMetadata
      const meta = col as unknown as ColumnMetadata<unknown>;
      return {
        key: meta.key,
        header: meta.header,
        sortable: meta.sortable,
        className: meta.className,
        render: meta.render || ((item: unknown) => {
          const val = (item as Record<string, unknown>)[meta.key];
          switch (meta.type) {
            case 'currency': return formatCurrency(val as number);
            case 'percentage': return formatPercentage(val as number);
            case 'date': return formatDate(val as string);
            case 'datetime': return formatDateTime(val as string);
            case 'phone': return formatPhone(val as string);
            case 'email': return formatEmail(val as string);
            case 'distance': return formatDistance(val as number);
            case 'capacity': return formatCapacity(val as number);
            case 'duration': return formatDuration(val as number);
            case 'status': 
            case 'badge':
              return <AppStatusBadge status={val as string} size="sm" />;
            default: return val != null ? String(val) : '-';
          }
        })
      };
    }
    // Already AppDataTableColumn
    return col as unknown as AppDataTableColumn<unknown>;
  });
}

export function CrudList({ config }: CrudListProps) {
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const {
    state,
    setPage,
    setSearch,
    setSorting,
    activeFilterCount,
    toApiParams,
  } = useTableState({
    defaultSortBy: config.list.defaultSortBy || 'created_at',
    defaultSortDir: config.list.defaultSortDir || 'desc',
  });

  const debouncedSearch = useDebounce(state.search, 500);

  // For metadata-driven filters
  const filterForm = useForm();

  // Fetch data
  const { data, isLoading, refetch } = config.hooks.useList({
    ...toApiParams(),
    search: debouncedSearch,
  });

  // Handle creation navigation
  const handleCreate = () => {
    router.push(`${config.routeBase}/new`);
  };

  // Handle row click
  const handleRowClick = (item: unknown) => {
    router.push(`${config.routeBase}/${(item as { id: string }).id}`);
  };

  const tableConfig = config.list.table;
  const legacyColumns = config.list.columns;
  
  const columns = normalizeColumns(tableConfig?.columns || legacyColumns || []);
  const filters = tableConfig?.filters || config.list.filters;
  
  const hasBulkActions = !!tableConfig?.bulkActions || !!config.list.bulkActions;
  
  const resolvedBulkActions = tableConfig?.bulkActions 
    ? tableConfig.bulkActions.map(ba => ({
        label: ba.label,
        icon: ba.icon,
        variant: ba.variant,
        permission: ba.permission,
        onClick: () => ba.action(selectedIds, data?.items || [])
      }))
    : config.list.bulkActions 
      ? config.list.bulkActions(selectedIds) 
      : [];

  return (
    <AppPageContainer>
      <AppToolbar
        title={config.page?.title || config.entityNamePlural}
        description={config.page?.subtitle || `Manage your ${config.entityNamePlural.toLowerCase()}`}
        primaryAction={{
          label: `Add ${config.entityName}`,
          onClick: handleCreate,
        }}
        searchValue={state.search}
        onSearch={setSearch}
        onRefresh={() => refetch()}
        onToggleFilter={(config.list.filterComponent || filters?.length) ? () => setIsFilterOpen(!isFilterOpen) : undefined}
        isFilterOpen={isFilterOpen}
        activeFilterCount={activeFilterCount}
        selectedCount={selectedIds.size}
        bulkActions={resolvedBulkActions}
      />

      {isFilterOpen && (config.list.filterComponent || filters) && (
        <Card className="mb-4 bg-muted/30 border-muted">
          <CardContent className="pt-6">
            {config.list.filterComponent ? config.list.filterComponent : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filters?.map(f => (
                  <div key={f.name}>
                    {f.type === 'text' && (
                      <AppTextField control={filterForm.control} name={f.name} label={f.label} placeholder={f.placeholder} />
                    )}
                    {f.type === 'select' && (
                      <AppSelectField control={filterForm.control} name={f.name} label={f.label} options={(f.options || []).map(o => ({ label: o.label, value: String(o.value) }))} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="mt-4 flex flex-col h-full space-y-4">
        <AppDataTable
          columns={columns}
          data={data?.items || []}
          isLoading={isLoading}
          onRowClick={handleRowClick}
          sortBy={state.sortBy}
          sortDir={state.sortDir}
          onSortChange={setSorting}
          selectable={hasBulkActions}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          getRowActions={config.list.rowActions}
          emptyState={{
            title: `No ${config.entityNamePlural.toLowerCase()} found`,
            description: state.search || activeFilterCount > 0 
              ? 'Try adjusting your search or filters' 
              : `Get started by adding your first ${config.entityName.toLowerCase()}`,
            actionLabel: `Add ${config.entityName}`,
            onAction: handleCreate,
          }}
        />

        <AppPagination
          page={data?.page || 1}
          pageSize={data?.size || 10}
          total={data?.total || 0}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
             // toApiParams reads from hook state, we must update the hook state first or use router directly.
             // Our useTableState doesn't expose setPageSize directly but sets it via URL.
             // We can implement setPageSize in useTableState or just push to router.
             const params = new URLSearchParams(window.location.search);
             params.set('page_size', size.toString());
             params.set('page', '1');
             router.push(`${window.location.pathname}?${params.toString()}`);
          }}
        />
      </div>
    </AppPageContainer>
  );
}
