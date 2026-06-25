import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/shared/lib/utils';

interface AppLoadingStateProps {
  rows?: number;
  className?: string;
}

export function AppLoadingState({ rows = 5, className }: AppLoadingStateProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}
