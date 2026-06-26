import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AppFormCardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function AppFormCard({
  title,
  description,
  children,
  className
}: AppFormCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      {(title || description) && (
        <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className={cn("pt-6", !title && !description && "pt-6")}>
        {children}
      </CardContent>
    </Card>
  );
}
