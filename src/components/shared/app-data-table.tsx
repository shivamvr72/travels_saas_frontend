import { ReactNode } from 'react';
import { AppLoadingState } from './app-loading-state';
import { AppErrorState } from './app-error-state';
import { AppEmptyState } from './app-empty-state';
import { cn } from '@/shared/lib/utils';

export interface ColumnDef<T> {
  header: string | ReactNode;
  accessorKey?: keyof T;
  cell?: (item: T) => ReactNode;
  className?: string;
}

interface AppDataTableProps<T> {
  columns: ColumnDef<T>[];
  data?: T[];
  isLoading?: boolean;
  error?: Error | string | null;
  emptyState?: {
    title?: string;
    description?: string;
    action?: ReactNode;
  };
  onRetry?: () => void;
  className?: string;
  rowKey: (item: T) => string | number;
}

export function AppDataTable<T>({
  columns,
  data,
  isLoading,
  error,
  emptyState,
  onRetry,
  className,
  rowKey,
}: AppDataTableProps<T>) {
  if (error) {
    return (
      <AppErrorState 
        error={error} 
        retry={onRetry} 
        className="my-6" 
      />
    );
  }

  if (isLoading) {
    return <AppLoadingState rows={5} className="my-6" />;
  }

  if (!data || data.length === 0) {
    return (
      <AppEmptyState
        title={emptyState?.title || "No data found"}
        description={emptyState?.description || "There is no data to display here yet."}
        action={emptyState?.action}
        className="my-6"
      />
    );
  }

  return (
    <div className={cn("rounded-md border overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b bg-muted/50">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              {columns.map((col, i) => (
                <th 
                  key={i} 
                  className={cn(
                    "h-10 px-4 text-left align-middle font-medium text-muted-foreground",
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {data.map((item, rowIndex) => (
              <tr 
                key={rowKey(item)}
                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
              >
                {columns.map((col, colIndex) => (
                  <td 
                    key={colIndex} 
                    className={cn(
                      "p-4 align-middle",
                      col.className
                    )}
                  >
                    {col.cell 
                      ? col.cell(item) 
                      : col.accessorKey 
                        ? (item[col.accessorKey] as ReactNode) 
                        : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
