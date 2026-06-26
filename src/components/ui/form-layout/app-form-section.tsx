import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AppFormSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function AppFormSection({
  title,
  description,
  children,
  className
}: AppFormSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {(title || description) && (
        <div className="pb-2 border-b border-border/40">
          {title && <h3 className="text-lg font-medium tracking-tight text-foreground">{title}</h3>}
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
      )}
      <div className="pt-2">
        {children}
      </div>
    </div>
  );
}
