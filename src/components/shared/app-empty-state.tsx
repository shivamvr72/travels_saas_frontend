import { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';
import { FileQuestion } from 'lucide-react';

interface AppEmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function AppEmptyState({
  title,
  description,
  icon,
  action,
  className,
}: AppEmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50",
      className
    )}>
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        {icon || <FileQuestion className="h-6 w-6 text-muted-foreground" />}
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-sm">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
