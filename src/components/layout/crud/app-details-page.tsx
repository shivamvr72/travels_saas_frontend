import { ReactNode } from "react";
import { AppPageContainer } from "./app-page-container";
import { cn } from "@/lib/utils";
import { AppSectionHeader } from "./app-section-header";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface AppDetailsPageProps {
  title: string;
  description?: string;
  backUrl?: string;
  backLabel?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function AppDetailsPage({
  title,
  description,
  backUrl,
  backLabel = "Back",
  action,
  children,
  className
}: AppDetailsPageProps) {
  return (
    <AppPageContainer maxWidth="xl" className={cn("space-y-6", className)}>
      {backUrl && (
        <div className="mb-2">
          <Link href={backUrl} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-2 text-muted-foreground")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {backLabel}
          </Link>
        </div>
      )}
      
      <AppSectionHeader 
        title={title} 
        description={description} 
        action={action} 
        className="pb-4"
      />
      
      <div className="pt-2">
        {children}
      </div>
    </AppPageContainer>
  );
}
