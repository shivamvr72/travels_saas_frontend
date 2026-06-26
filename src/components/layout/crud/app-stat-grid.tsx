import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AppStatGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4 | 5;
  className?: string;
}

export function AppStatGrid({
  children,
  columns = 4,
  className
}: AppStatGridProps) {
  return (
    <div className={cn(
      "grid gap-4",
      {
        "grid-cols-1": columns === 1,
        "grid-cols-1 sm:grid-cols-2": columns === 2,
        "grid-cols-1 sm:grid-cols-2 md:grid-cols-3": columns === 3,
        "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4": columns === 4,
        "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5": columns === 5,
      },
      className
    )}>
      {children}
    </div>
  );
}
