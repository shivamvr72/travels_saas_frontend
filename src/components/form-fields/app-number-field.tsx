import { Control, FieldValues, Path } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/shared/lib/utils';

export interface AppNumberFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number | 'any';
  className?: string;
}

export function AppNumberField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder,
  disabled,
  required,
  min,
  max,
  step,
  className,
}: AppNumberFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className={cn(required && "after:content-['*'] after:ml-0.5 after:text-destructive")}>
            {label}
          </FormLabel>
          <FormControl>
            <Input
              type="number"
              placeholder={placeholder}
              disabled={disabled}
              min={min}
              max={max}
              step={step}
              {...field}
              value={field.value ?? ''}
              onChange={(e) => {
                const val = e.target.value;
                field.onChange(val === '' ? null : Number(val));
              }}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
