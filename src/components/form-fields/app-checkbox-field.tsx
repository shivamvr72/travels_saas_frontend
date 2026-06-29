import { Control, FieldValues, Path } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/shared/lib/utils';

export interface AppCheckboxFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function AppCheckboxField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled,
  className,
}: AppCheckboxFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4", className)}>
          <FormControl>
            <Checkbox
              checked={!!field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>{label}</FormLabel>
            {description && <FormDescription>{description}</FormDescription>}
          </div>
        </FormItem>
      )}
    />
  );
}
