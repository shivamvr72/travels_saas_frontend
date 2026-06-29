import { Control, FieldValues, Path } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/shared/lib/utils';

export interface AppSwitchFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function AppSwitchField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled,
  className,
}: AppSwitchFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-row items-center justify-between rounded-lg border p-4", className)}>
          <div className="space-y-0.5">
            <FormLabel className="text-base">{label}</FormLabel>
            {description && <FormDescription>{description}</FormDescription>}
          </div>
          <FormControl>
            <Switch
              checked={!!field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
