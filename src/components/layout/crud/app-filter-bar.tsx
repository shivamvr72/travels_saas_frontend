import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { ReactNode } from "react";

interface AppFilterBarProps {
  isOpen: boolean;
  onClose: () => void;
  onClearFilters?: () => void;
  children: ReactNode;
  className?: string;
  activeFilterCount?: number;
}

export function AppFilterBar({
  isOpen,
  onClose,
  onClearFilters,
  children,
  className,
  activeFilterCount = 0
}: AppFilterBarProps) {
  if (!isOpen) return null;

  return (
    <div className={cn("bg-muted/30 border border-border/50 rounded-lg p-4 animate-in slide-in-from-top-2 duration-200", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-foreground">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center bg-primary text-primary-foreground text-[10px] font-bold h-5 w-5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close filters">
          <X className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {children}
      </div>
      
      {onClearFilters && activeFilterCount > 0 && (
        <div className="flex justify-end mt-4 pt-4 border-t border-border/50">
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}
