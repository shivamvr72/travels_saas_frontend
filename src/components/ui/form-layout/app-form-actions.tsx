import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AppFormActionsProps {
  children?: ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  className?: string;
}

export function AppFormActions({
  children,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  onSubmit,
  onCancel,
  isSubmitting = false,
  className
}: AppFormActionsProps) {
  return (
    <div className={cn("flex items-center justify-end gap-3 pt-6 mt-6 border-t border-border/40", className)}>
      {children || (
        <>
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              {cancelLabel}
            </Button>
          )}
          <Button 
            type={onSubmit ? "button" : "submit"} 
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
        </>
      )}
    </div>
  );
}
