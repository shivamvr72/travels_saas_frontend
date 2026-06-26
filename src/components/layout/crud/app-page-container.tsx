import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AppPageContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
}

export function AppPageContainer({ 
  children, 
  className,
  maxWidth = "xl" 
}: AppPageContainerProps) {
  return (
    <div className={cn(
      "w-full mx-auto space-y-6 animate-in fade-in duration-300",
      {
        "max-w-3xl": maxWidth === "sm",
        "max-w-4xl": maxWidth === "md",
        "max-w-5xl": maxWidth === "lg",
        "max-w-7xl": maxWidth === "xl",
        "max-w-none": maxWidth === "full",
      },
      className
    )}>
      {children}
    </div>
  );
}
