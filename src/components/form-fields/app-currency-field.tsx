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

export interface AppCurrencyFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  min?: number;
  currencySymbol?: string;
  className?: string;
}

export function AppCurrencyField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder,
  disabled,
  required,
  min = 0,
  currencySymbol = '₹',
  className,
}: AppCurrencyFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className={cn(required && "after:content-['*'] after:ml-0.5 after:text-destructive")}>
            {label}
          </FormLabel>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground select-none">
              {currencySymbol}
            </span>
            <FormControl>
              <Input
                type="number"
                placeholder={placeholder}
                disabled={disabled}
                min={min}
                step="any"
                className="pl-7"
                {...field}
                value={field.value ?? ''}
                onChange={(e) => {
                  const val = e.target.value;
                  field.onChange(val === '' ? null : Number(val));
                }}
              />
            </FormControl>
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
