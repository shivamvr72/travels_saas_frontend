import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
// Removed cn import
import { AppPageContainer } from '@/components/layout/crud/app-page-container';

interface FormSkeletonProps {
  className?: string;
}

export function FormSkeleton({ className }: FormSkeletonProps) {
  return (
    <AppPageContainer maxWidth="md" className={className}>
      {/* Header */}
      <div className="mb-6">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      <Card>
        <CardHeader className="border-b bg-muted/10">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
          
          {/* Action buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t mt-6">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      </Card>
    </AppPageContainer>
  );
}
