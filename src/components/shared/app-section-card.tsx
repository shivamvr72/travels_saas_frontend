import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

interface AppSectionCardProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  noPadding?: boolean;
}

export function AppSectionCard({
  title,
  description,
  actions,
  children,
  className,
  contentClassName,
  noPadding = false,
}: AppSectionCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1.5">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {actions && (
          <div className="flex shrink-0 items-center gap-2">
            {actions}
          </div>
        )}
      </CardHeader>
      <CardContent className={cn(
        noPadding ? "p-0" : "", 
        contentClassName
      )}>
        {children}
      </CardContent>
    </Card>
  );
}
