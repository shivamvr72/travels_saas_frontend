import { ReactNode } from "react";
import { AppPageContainer } from "./app-page-container";
import { cn } from "@/lib/utils";
import { AppSectionHeader } from "./app-section-header";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface AppFormPageProps {
  title: string;
  description?: string;
  backUrl?: string;
  backLabel?: string;
  children: ReactNode;
  className?: string;
}

export function AppFormPage({
  title,
  description,
  backUrl,
  backLabel = "Cancel",
  children,
  className
}: AppFormPageProps) {
  return (
    <AppPageContainer maxWidth="md" className={cn("space-y-6", className)}>
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
        className="pb-4"
      />
      
      <div className="pt-2">
        {children}
      </div>
    </AppPageContainer>
  );
}
