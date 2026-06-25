import { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AppErrorStateProps {
  error?: string | Error | null;
  message?: string;
  retry?: () => void;
  className?: string;
}

export function AppErrorState({
  error,
  message = "We encountered an error while loading this data.",
  retry,
  className,
}: AppErrorStateProps) {
  // Extract error string if it's an Error object
  const errorMessage = error instanceof Error ? error.message : typeof error === 'string' ? error : null;

  return (
    <div className={cn(
      "flex flex-col items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center",
      className
    )}>
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-6 w-6 text-destructive" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-destructive">Failed to load</h3>
      <p className="mb-2 mt-2 text-sm text-muted-foreground max-w-sm">
        {message}
      </p>
      {errorMessage && (
        <p className="mb-4 text-xs font-mono bg-background/50 p-2 rounded max-w-md break-all">
          {errorMessage}
        </p>
      )}
      {retry && (
        <Button variant="outline" onClick={retry} className="mt-2">
          Try again
        </Button>
      )}
    </div>
  );
}
