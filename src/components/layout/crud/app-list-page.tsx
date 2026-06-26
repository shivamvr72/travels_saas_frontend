import { ReactNode } from "react";
import { AppPageContainer } from "./app-page-container";
import { cn } from "@/lib/utils";

interface AppListPageProps {
  toolbar: ReactNode;
  filterBar?: ReactNode;
  dataTable: ReactNode;
  className?: string;
}

export function AppListPage({
  toolbar,
  filterBar,
  dataTable,
  className
}: AppListPageProps) {
  return (
    <AppPageContainer maxWidth="full" className={cn("space-y-6", className)}>
      {toolbar}
      {filterBar}
      <div className="bg-card border border-border/50 shadow-sm rounded-xl overflow-hidden">
        {dataTable}
      </div>
    </AppPageContainer>
  );
}
