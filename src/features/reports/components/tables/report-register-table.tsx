import React, { useState } from 'react';
import { AppDataTable, AppDataTableColumn } from '@/components/layout/crud/app-data-table';
import { ReportExportToolbar } from '../export/report-export-toolbar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ReportRegisterTableProps<T extends Record<string, unknown>> {
  title: string;
  description: string;
  columns: AppDataTableColumn<T>[];
  data: T[];
  isLoading: boolean;
  page: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function ReportRegisterTable<T extends Record<string, unknown>>({
  title,
  description,
  columns,
  data,
  isLoading,
  page,
  total,
  pageSize,
  onPageChange,
}: ReportRegisterTableProps<T>) {
  const totalPages = Math.ceil(total / pageSize);

  const exportColumns = columns.map(c => ({ header: c.header, key: c.key }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">{title}</h2>
          <p className="text-sm text-muted-foreground">{total} records</p>
        </div>
        <ReportExportToolbar
          data={data}
          columns={exportColumns}
          filename={`${title.replace(/\s+/g, '_')}_Export`}
          disabled={data.length === 0}
        />
      </div>

      <AppDataTable<T>
        columns={columns}
        data={data}
        isLoading={isLoading}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Page {page} of {totalPages}</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
