import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Download, RefreshCw, Filter, MoreHorizontal } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export interface ActionDef {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  disabled?: boolean;
  destructive?: boolean;
  permission?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export interface AppToolbarProps {
  title: string;
  description?: string;
  
  // Actions
  primaryAction?: ActionDef;
  secondaryActions?: ActionDef[];
  
  // Bulk Actions
  selectedCount?: number;
  bulkActions?: ActionDef[];
  
  // Search & Filter
  searchValue?: string;
  onSearch?: (term: string) => void;
  onRefresh?: () => void;
  onExport?: () => void;
  
  onToggleFilter?: () => void;
  isFilterOpen?: boolean;
  activeFilterCount?: number;
  
  className?: string;
}

export function AppToolbar({
  title,
  description,
  primaryAction,
  secondaryActions = [],
  selectedCount = 0,
  bulkActions = [],
  searchValue,
  onSearch,
  onRefresh,
  onExport,
  onToggleFilter,
  isFilterOpen,
  activeFilterCount = 0,
  className
}: AppToolbarProps) {
  
  const hasBulkMode = selectedCount > 0;

  return (
    <div className={cn("flex flex-col gap-4 pb-4 border-b border-border/40 transition-all", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {!hasBulkMode ? (
            <>
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
              {secondaryActions.length > 0 && (
                <DropdownMenu>
                  {/* @ts-expect-error asChild is valid but missing in strict types */}
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9">
                      More <MoreHorizontal className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {secondaryActions.map((action, i) => (
                      <DropdownMenuItem 
                        key={i}
                        onClick={action.onClick}
                        disabled={action.disabled}
                        className={cn(action.destructive && "text-destructive focus:text-destructive")}
                      >
                        {action.icon && <span className="mr-2 h-4 w-4">{action.icon}</span>}
                        {action.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {primaryAction && (
                <Button size="sm" onClick={primaryAction.onClick} disabled={primaryAction.disabled} className="h-9">
                  {primaryAction.icon || <Plus className="h-4 w-4 mr-2" />}
                  {primaryAction.label}
                </Button>
              )}
            </>
          ) : (
            <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-md px-3 py-1.5 animate-in fade-in zoom-in-95 duration-200">
              <span className="text-sm font-medium text-primary">
                {selectedCount} selected
              </span>
              <div className="h-4 w-px bg-primary/20 mx-1" />
              {bulkActions.map((action, i) => (
                <Button
                  key={i}
                  size="sm"
                  variant={action.destructive ? "destructive" : "secondary"}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className="h-8"
                >
                  {action.icon && <span className="mr-2 h-3.5 w-3.5">{action.icon}</span>}
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      {(onSearch || onToggleFilter) && (
        <div className="flex items-center justify-between gap-4">
          {onSearch && (
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search..." 
                className="pl-9 h-9"
                value={searchValue}
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          )}
          
          {onToggleFilter && (
            <Button 
              variant={isFilterOpen || activeFilterCount > 0 ? "secondary" : "outline"} 
              size="sm" 
              onClick={onToggleFilter}
              className={cn("h-9 shrink-0 relative", (isFilterOpen || activeFilterCount > 0) && "bg-secondary/80")}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="default" className="ml-2 px-1.5 min-w-5 h-5 flex items-center justify-center rounded-full text-[10px]">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
