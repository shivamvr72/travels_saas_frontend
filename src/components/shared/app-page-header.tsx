import { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

interface AppPageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function AppPageHeader({ title, description, actions, className }: AppPageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between mb-6", className)}>
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
