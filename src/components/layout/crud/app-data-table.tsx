'use client';

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { AppEmptyState } from "./app-empty-state";

interface AppDataTableProps<T> {
  columns: {
    key: string;
    header: string;
    render?: (item: T) => ReactNode;
    className?: string;
  }[];
  data: T[];
  isLoading?: boolean;
  emptyState?: {
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
  };
  onRowClick?: (item: T) => void;
  className?: string;
}

export function AppDataTable<T>({
  columns,
  data,
  isLoading,
  emptyState,
  onRowClick,
  className
}: AppDataTableProps<T>) {
  
  if (isLoading) {
    return (
      <div className={cn("w-full", className)}>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border/50">
              {columns.map((col) => (
                <TableHead key={col.key} className={col.className}>
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i} className="border-b border-border/50">
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    <Skeleton className="h-5 w-full max-w-[80%]" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (data.length === 0 && emptyState) {
    return (
      <div className="p-8">
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
    <div className={cn("w-full overflow-auto", className)}>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/50">
            {columns.map((col) => (
              <TableHead key={col.key} className={cn("font-semibold text-foreground", col.className)}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, i) => (
            <TableRow 
              key={i}
              onClick={() => onRowClick && onRowClick(item)}
              className={cn(
                "border-b border-border/40 transition-colors",
                onRowClick && "cursor-pointer hover:bg-muted/50"
              )}
            >
              {columns.map((col) => (
                <TableCell key={col.key} className={cn("py-3 text-sm", col.className)}>
                  {col.render ? col.render(item) : (item as Record<string, unknown>)[col.key] as ReactNode}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
