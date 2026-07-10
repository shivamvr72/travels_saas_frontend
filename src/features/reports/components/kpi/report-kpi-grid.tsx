import React from 'react';
import { cn } from '@/lib/utils';

interface ReportKpiGridProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ReportKpiGrid({ className, children, ...props }: ReportKpiGridProps) {
  return (
    <div
      className={cn(
        'grid gap-4 sm:grid-cols-2 lg:grid-cols-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
