import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Download, RefreshCw, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppToolbarProps {
  title: string;
  description?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
  onSearch?: (term: string) => void;
  onRefresh?: () => void;
  onExport?: () => void;
  onToggleFilter?: () => void;
  isFilterOpen?: boolean;
  className?: string;
}

export function AppToolbar({
  title,
  description,
  primaryAction,
  onSearch,
  onRefresh,
  onExport,
  onToggleFilter,
  isFilterOpen,
  className
}: AppToolbarProps) {
  return (
    <div className={cn("flex flex-col gap-4 pb-4 border-b border-border/40", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh} className="h-9">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          )}
          {onExport && (
            <Button variant="outline" size="sm" onClick={onExport} className="h-9">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
          {primaryAction && (
            <Button size="sm" onClick={primaryAction.onClick} className="h-9">
              {primaryAction.icon || <Plus className="h-4 w-4 mr-2" />}
              {primaryAction.label}
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        {onSearch && (
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search..." 
              className="pl-9 h-9"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        )}
        
        {onToggleFilter && (
          <Button 
            variant={isFilterOpen ? "secondary" : "outline"} 
            size="sm" 
            onClick={onToggleFilter}
            className="h-9 shrink-0"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        )}
      </div>
    </div>
  );
}
