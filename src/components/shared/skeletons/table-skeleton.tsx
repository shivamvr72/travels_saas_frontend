import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/shared/lib/utils';

interface TableSkeletonProps {
  columns?: number;
  rows?: number;
  className?: string;
}

export function TableSkeleton({ columns = 5, rows = 10, className }: TableSkeletonProps) {
  return (
    <div className={cn("w-full overflow-auto rounded-md border", className)}>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            {Array.from({ length: columns }).map((_, i) => (
              <TableHead key={`th-${i}`}>
                <Skeleton className="h-5 w-24" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={`tr-${rowIndex}`}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <TableCell key={`td-${rowIndex}-${colIndex}`}>
                  <Skeleton className={cn("h-5", colIndex === 0 ? "w-32" : "w-24")} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
