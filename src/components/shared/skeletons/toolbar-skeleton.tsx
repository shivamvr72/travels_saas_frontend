import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/shared/lib/utils';

interface ToolbarSkeletonProps {
  className?: string;
}

export function ToolbarSkeleton({ className }: ToolbarSkeletonProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4", className)}>
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Skeleton className="h-10 w-full sm:w-64" />
        <Skeleton className="h-10 w-24 shrink-0" />
      </div>
    </div>
  );
}
