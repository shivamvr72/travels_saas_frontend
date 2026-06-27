'use client';

import { useMemo, ReactNode } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  ColumnDef,
  RowSelectionState,
} from '@tanstack/react-table';
import { cn } from '@/shared/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableSkeleton } from '@/components/shared/skeletons/table-skeleton';
import { AppEmptyState } from './app-empty-state';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowDown, ArrowUp, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export interface AppDataTableColumn<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
  sortable?: boolean;
  hidden?: boolean;
}

export interface AppDataTableProps<T> {
  columns: AppDataTableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  emptyState?: {
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
  };
  onRowClick?: (item: T) => void;
  
  // Sorting
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  onSortChange?: (sortBy: string, sortDir: 'asc' | 'desc') => void;
  
  // Selection
  selectable?: boolean;
  selectedIds?: Set<string>;
  getRowId?: (item: T) => string;
  onSelectionChange?: (ids: Set<string>) => void;
  
  // Actions
  getRowActions?: (item: T) => { label: string; icon?: ReactNode; onClick: () => void; destructive?: boolean }[];
  
  stickyHeader?: boolean;
  className?: string;
}

export function AppDataTable<T>({
  columns: userColumns,
  data,
  isLoading,
  emptyState,
  onRowClick,
  sortBy,
  sortDir,
  onSortChange,
  selectable,
  selectedIds = new Set(),
  getRowId = (item: T) => (item as unknown as { id: string }).id,
  onSelectionChange,
  getRowActions,
  stickyHeader,
  className,
}: AppDataTableProps<T>) {

  const handleSortingChange = (updaterOrValue: SortingState | ((old: SortingState) => SortingState)) => {
    if (!onSortChange) return;
    const newSorting = typeof updaterOrValue === 'function' ? updaterOrValue([{ id: sortBy || '', desc: sortDir === 'desc' }]) : updaterOrValue;
    if (newSorting.length > 0) {
      onSortChange(newSorting[0].id, newSorting[0].desc ? 'desc' : 'asc');
    }
  };

  const sorting: SortingState = useMemo(() => {
    return sortBy ? [{ id: sortBy, desc: sortDir === 'desc' }] : [];
  }, [sortBy, sortDir]);

  const rowSelection: RowSelectionState = useMemo(() => {
    const selection: RowSelectionState = {};
    if (selectable) {
      data.forEach((item, index) => {
        const id = getRowId(item);
        if (selectedIds.has(id)) {
          selection[index] = true;
        }
      });
    }
    return selection;
  }, [data, getRowId, selectable, selectedIds]);

  const onRowSelectionChange = (updaterOrValue: RowSelectionState | ((old: RowSelectionState) => RowSelectionState)) => {
    if (!onSelectionChange) return;
    const newSelection = typeof updaterOrValue === 'function' ? updaterOrValue(rowSelection) : updaterOrValue;
    
    const newSelectedIds = new Set<string>();
    Object.keys(newSelection).forEach(indexStr => {
      const idx = parseInt(indexStr, 10);
      if (newSelection[idx] && data[idx]) {
        newSelectedIds.add(getRowId(data[idx]));
      }
    });
    onSelectionChange(newSelectedIds);
  };

  const columns: ColumnDef<T, unknown>[] = useMemo(() => {
    const cols: ColumnDef<T, unknown>[] = [];

    if (selectable) {
      cols.push({
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={(table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")) as boolean}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <div onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          </div>
        ),
        enableSorting: false,
      });
    }

    userColumns.filter(c => !c.hidden).forEach(col => {
      cols.push({
        id: col.key,
        accessorFn: (row: T) => (row as Record<string, unknown>)[col.key],
        header: ({ column }) => {
          if (!col.sortable || !onSortChange) {
            return <div className={cn("font-semibold text-foreground", col.className)}>{col.header}</div>;
          }
          return (
            <Button
              variant="ghost"
              size="sm"
              className={cn("-ml-3 h-8 font-semibold text-foreground", col.className)}
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              {col.header}
              {column.getIsSorted() === "desc" ? (
                <ArrowDown className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "asc" ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : null}
            </Button>
          );
        },
        cell: ({ row }) => {
          return (
            <div className={cn("py-1", col.className)}>
              {col.render ? col.render(row.original) : String((row.original as Record<string, unknown>)[col.key] ?? '')}
            </div>
          );
        },
        enableSorting: col.sortable,
      });
    });

    if (getRowActions) {
      cols.push({
        id: 'actions',
        cell: ({ row }) => {
          const actions = getRowActions(row.original);
          if (!actions.length) return null;
          return (
            <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenu>
                {/* @ts-expect-error asChild is valid but missing in strict types */}
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {actions.map((action, i) => (
                    <DropdownMenuItem 
                      key={i} 
                      onClick={action.onClick}
                      className={cn(action.destructive && "text-destructive focus:text-destructive")}
                    >
                      {action.icon && <span className="mr-2 h-4 w-4">{action.icon}</span>}
                      {action.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      });
    }

    return cols;
  }, [userColumns, selectable, getRowActions, onSortChange]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: handleSortingChange,
    onRowSelectionChange: onRowSelectionChange,
    state: {
      sorting,
      rowSelection,
    },
    manualSorting: true,
  });

  if (isLoading) {
    return <TableSkeleton columns={userColumns.length + (selectable ? 1 : 0) + (getRowActions ? 1 : 0)} className={className} />;
  }

  if (data.length === 0 && emptyState) {
    return (
      <div className={cn("p-8", className)}>
        <AppEmptyState 
          title={emptyState.title} 
          description={emptyState.description}
          actionLabel={emptyState.actionLabel}
          onAction={emptyState.onAction}
          className="border-none bg-transparent"
        />
      </div>
    );
  }

  return (
    <div className={cn("w-full overflow-auto rounded-md border", className)}>
      <Table>
        <TableHeader className={cn(stickyHeader && "sticky top-0 z-10 bg-background")}>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-muted hover:bg-muted">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="px-4">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                onClick={() => onRowClick && onRowClick(row.original)}
                className={cn(
                  "border-b border-border/40 transition-colors hover:bg-muted/50",
                  onRowClick && "cursor-pointer"
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-3 px-4 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
