import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AppFormGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3;
  className?: string;
}

export function AppFormGrid({
  children,
  columns = 2,
  className
}: AppFormGridProps) {
  return (
    <div className={cn(
      "grid gap-6",
      {
        "grid-cols-1": columns === 1,
        "grid-cols-1 md:grid-cols-2": columns === 2,
        "grid-cols-1 md:grid-cols-3": columns === 3,
      },
      className
    )}>
      {children}
    </div>
  );
}
